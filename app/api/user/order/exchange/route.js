import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Order from "@/models/Orders";
import Product from "@/models/Product";
import User from "@/models/User";

function generateOrderId() {
  return `EXCH-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
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

async function createReturnShipment(token, returnData) {
  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/orders/create/return",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(returnData),
    }
  );

  const data = await res.json();
  console.log("Return shipment:", data);
  return data;
}

async function createShiprocketOrder(token, orderData) {
  const res = await fetch(
    "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    }
  );
  const data = await res.json();
  console.log("Order cretion exchange: ", data);
  return data;
}

export async function POST(request) {
  try {
    await connectMongo();
    const body = await request.json();
    const { oldOrderId, newColor, newSize } = body;
    const userEmail = request.headers.get("x-user-email");

    if (!oldOrderId || !newColor || !newSize) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const token = await getShiprocketToken();

    // 1. Find the old order
    const oldOrder = await Order.findById(oldOrderId);
    if (!oldOrder) {
      return NextResponse.json(
        { error: "Old order not found" },
        { status: 404 }
      );
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not exists" }, { status: 401 });
    }

    const productId = oldOrder.items[0]?.product;
    if (!productId) {
      return NextResponse.json(
        { error: "No product found in old order" },
        { status: 400 }
      );
    }
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const address = oldOrder.address;

    const returnRes = await createReturnShipment(token, {
      pickup_customer_name: user.username,
      pickup_last_name: user.lastName,
      pickup_address: `${address.houseNumber}, ${address.street}, ${
        address.landmark || ""
      }`,
      pickup_address_2: "",
      pickup_city: address.city,
      pickup_state: address.state,
      pickup_country: address.country || "India",
      pickup_pincode: address.pincode,
      pickup_email: user.email,
      pickup_phone: user.phone,

      billing_customer_name: process.env.SHIPROCKET_NAME,
      billing_address: process.env.SHIPROCKET_ADDRESS,
      billing_city: process.env.SHIPROCKET_CITY,
      billing_pincode: process.env.SHIPROCKET_PINCODE,
      billing_state: process.env.SHIPROCKET_STATE,
      billing_country: "India",
      billing_email: process.env.SHIPROCKET_EMAIL,
      billing_phone: process.env.SHIPROCKET_PHONE,

      shipping_customer_name: process.env.SHIPROCKET_NAME,
      shipping_address: process.env.SHIPROCKET_ADDRESS,
      shipping_city: process.env.SHIPROCKET_CITY,
      shipping_pincode: process.env.SHIPROCKET_PINCODE,
      shipping_state: process.env.SHIPROCKET_STATE,
      shipping_country: "India",
      shipping_email: process.env.SHIPROCKET_EMAIL,
      shipping_phone: process.env.SHIPROCKET_PHONE,

      shipping_is_billing: true,

      order_items: [
        {
          name: product.title,
          sku: product._id.toString(),
          units: 1,
          selling_price: oldOrder.items[0].priceAtPurchase,
        },
      ],
      order_id: `RET-${oldOrder.OrderId}`,
      order_date: new Date().toISOString(),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,

      payment_method: "Prepaid",
      sub_total: oldOrder.totalAmount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.25,
    });

    let newOrder = {};

    if (returnRes && returnRes.shipment_id) {
      oldOrder.status = "Exchanged";
      oldOrder.returnInfo = {
        shipmentId: returnRes.shipment_id,
        orderId: returnRes.order_id,
        status: returnRes.status,
      };

      await oldOrder.save();

      // 3. Create new exchange order (MongoDB only, no Shiprocket)
      const newOrderId = generateOrderId();
      const srOrder = await createShiprocketOrder(token, {
        order_id: newOrderId,
        order_date: new Date().toISOString(),
        pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION, // tumhare shiprocket me set kiya hua
        channel_id: "",

        billing_customer_name: user.username,
        billing_last_name: user.lastName || "",
        billing_address: `${address.houseNumber}, ${address.street}, ${
          address.landmark || ""
        }`,
        billing_city: address.city,
        billing_pincode: address.pincode,
        billing_state: address.state,
        billing_country: address.country || "India",
        billing_email: user.email,
        billing_phone: user.phone,

        shipping_is_billing: true,
        order_items: [
          {
            name: product.title,
            sku: product.skuId?.toString() || product._id.toString(),
            units: 1,
            selling_price: oldOrder.items[0].priceAtPurchase,
          },
        ],
        payment_method: "Prepaid",
        sub_total: oldOrder.totalAmount,
        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.25,
      });

      // ✅ ab DB me save karo
      newOrder = await Order.create({
        user: oldOrder.user._id,
        items: [
          {
            product: product._id,
            color: newColor,
            size: newSize,
            priceAtPurchase: oldOrder.currentPrice,
          },
        ],
        vendorPrice: oldOrder.vendorPrice,
        address: oldOrder.address,
        totalAmount: oldOrder.currentPrice,
        OrderId: newOrderId,
        chanelOrderId: srOrder.order_id,
        shipmentId: srOrder.shipment_id,
        wasExchanged: {
          status: true,
          forProduct: oldOrder._id,
        },
      });

      // ✅ old order ko update kar dena
      oldOrder.exchanged = {
        status: "initiated",
        forProduct: newOrder._id,
      };
      await oldOrder.save();

      user.Orders.push({
        productId: newOrder._id,
        size: newSize,
        color: newColor,
        amount: oldOrder.currentPrice,
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Exchange order created successfully",
        oldOrder,
        newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Exchange order error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
