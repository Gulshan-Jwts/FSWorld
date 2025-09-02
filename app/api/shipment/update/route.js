import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/models/order";
import { createOrder } from "@/lib/createOrder"; // you'll implement this

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // Extract order ID & status from Shiprocket payload
    const { order_id, current_status } = body; // Shiprocket calls it "order_id" and "current_status"

    if (!order_id || !current_status) {
      return NextResponse.json({ success: false, message: "Invalid payload" }, { status: 400 });
    }

    const order = await Order.findOne({ OrderId: order_id });
    if (!order) {
      return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
    }

    const statusLower = current_status.toLowerCase();

    // 1. Cancelled
    if (statusLower.includes("cancelled")) {
      order.cancelled.status = true;
      order.status = "Cancelled";
      await order.save();
      return NextResponse.json({ success: true, message: "Order cancelled" });
    }

    // 2. Delivered
    if (statusLower.includes("delivered") && !statusLower.includes("rto")) {
      order.status = "Completed";
      await order.save();
      return NextResponse.json({ success: true, message: "Order completed" });
    }

    // 3. RTO (Return To Origin)
    if (statusLower.includes("rto")) {
      // Case 1: exchanged was initiated → mark returned, call createOrder
      if (order.exchanged.status === "initiated") {
        order.exchanged.status = "returned";
        await order.save();

        const newOrderStatus = await createOrder(order); // Your function returns true/false

        if (newOrderStatus === true) {
          order.exchanged.status = "created";
          await order.save();
        }

        return NextResponse.json({ success: true, message: "Exchange return handled" });
      }

      // Case 2: no exchange → mark main status as RTO
      if (order.exchanged.status === "none") {
        order.status = "RTO";
        await order.save();
        return NextResponse.json({ success: true, message: "Order marked as RTO" });
      }
    }

    return NextResponse.json({ success: true, message: "No relevant status change" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
