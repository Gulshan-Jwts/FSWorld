// /app/api/user/order/track/route.js

import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Order from "@/models/Orders";
// import { createOrder } from "@/lib/createOrder"; // tum banaoge

const SHIPROCKET_BASE = "https://apiv2.shiprocket.in/v1/external";
const TOKEN = process.env.SHIPROCKET_TOKEN; // apna auth token rakho

// fetch tracking details from Shiprocket
async function fetchTracking(order, token, isReturn = false) {
  const id = isReturn ? order.returnInfo?.shipmentId : order.chanelOrderId;

  const res = await fetch(`${SHIPROCKET_BASE}/courier/track/shipment/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch tracking details:", res.statusText);
    throw new Error("Failed to fetch tracking details");
  }
  return res.json();
}

async function fetchOrder(order, token) {
  const res = await fetch(
    `${SHIPROCKET_BASE}/orders/show/${order.chanelOrderId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    console.error("Failed to fetch tracking details:", data, order);
    throw new Error("Failed to fetch tracking details");
  }
  return data;
}

async function getShiprocketToken() {
  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }),
    }
  );
  const data = await res.json();
  return data.token;
}

async function assignCourierAndAWB(token, shipmentId) {
  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/courier/assign/awb",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_return: true, shipment_id: shipmentId }),
    }
  );
  const data = await res.json();
  console.log(
    "Assigning courier and AWB:",
    JSON.stringify(data),
    res.statusText
  );
  return data;
}

function normalizeShiprocketStatus(status) {
  const s = status?.toLowerCase() || "";
  if (s.includes("pickup") || s.includes("picked")) return "picked_up";
  if (s.includes("delivered")) return "delivered";
  if (s.includes("rto")) return "rto";
  if (s.includes("cancel")) return "cancelled";
  return "in_transit"; // fallback
}

export async function POST(request) {
  try {
    await connectMongo();
    const { orderId, testPicks } = await request.json();

    const order = await Order.findOne({ OrderId: orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Shiprocket se latest status fetch karo
    const token = await getShiprocketToken();
    if (!token) {
      return NextResponse.json(
        { error: "Failed to authenticate with Shiprocket" },
        { status: 500 }
      );
    }
    let data;
    if (
      order.exchanged.status === "initiated" &&
      order.returnInfo?.shipmentId
    ) {
      data = await fetchTracking(order, token, true);
    } else {
      data = await fetchTracking(order, token, false);
    }

    const cancelledData = await fetchOrder(order, token);
    const status = normalizeShiprocketStatus(data?.order_status);
    console.log("tracking status:", JSON.stringify(data));
    const cancelledStatus = cancelledData?.data?.status?.toLowerCase();
    console.log("cancelled status:", cancelledStatus);

    // --- HANDLE STATUSES ---
    if (cancelledStatus.includes("canceled") || testPicks === "cancelled") {
      order.cancelled.status = true;
      order.status = "Cancelled";
      await order.save();
    }

    if (
      status.includes("PICKED UP".toLocaleLowerCase()) ||
      testPicks === "picked up"
    ) {
      if (order.exchanged.status === "initiated") {
        order.exchanged.status = "returned";
        await order.save();
      }
    }

    if (status.includes("delivered") || testPicks === "delivered") {
      if (
        order.exchanged.status === "initiated" ||
        order.exchanged.status === "returned"
      ) {
        console.log("order exchange places");
        order.exchanged.status = "created";
        await order.save();

        // call createOrder for exchange
        console.log("Exchange initiated, creating new order...");
        const exchangedOrder = await Order.findOne({
          "wasExchanged.forProduct": order._id,
        });

        if (exchangedOrder) {
          const shipmentExg = await assignCourierAndAWB(
            token,
            exchangedOrder.shipmentId
          );
          console.log(exchangedOrder, "shipmentExg");

          exchangedOrder.courierBy =
            shipmentExg.response.data.courier_name || null;
          exchangedOrder.trackingCode =
            shipmentExg.response.data.awb_code || null;
          order.exchanged.status = "created";
          await exchangedOrder.save();
        }

        // const created = await createOrder(order);
        // if (created?.success) {
        //   order.exchanged.status = "created";
        //   await order.save();
        // }
      } else {
        order.status = "Completed";
        await order.save();
      }
    }

    if (status.includes("rto") || testPicks === "rto") {
      if (order.exchanged.status === "none") {
        order.status = "RTO";
        await order.save();
      }
    }

    return NextResponse.json({
      success: true,
      order,
      cancelledData,
      data: data[cancelledData.data.id],
    });
  } catch (err) {
    console.error("Tracking API error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
