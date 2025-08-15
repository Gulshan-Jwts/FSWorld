import { NextResponse } from "next/server";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Orders";
import connectMongo from "@/lib/connectMongo";

function generateOrderId() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

async function getShiprocketToken() {
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });
  const data = await res.json();
  return data.token;
}

async function createShiprocketOrder(token, orderData) {
  const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });
  const data = await res.json();
  console.log(data);
  return data;
}

export async function POST(request) {
  try {
    await connectMongo();

    const body = await request.json();
    const {
      productId,
      size,
      color,
      address,
      affilatorId,
      wasExchanged,
    } = body;
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (!productId || !size || !color) {
      return NextResponse.json({ error: "Product details are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Step 1: Save order in MongoDB
    const orderId = generateOrderId();
    const order = await Order.create({
      user: user._id,
      items: [
        {
          product: product._id,
          color,
          size,
          priceAtPurchase: product.currentPrice,
        },
      ],
      vendorPrice: product.vendorPrice,
      address: {
        houseNumber: address.houseNumber,
        street: address.street,
        landmark: address.landmark,
        city: address.city,
        state: address.state,
        country: address.country || "India",
        pincode: address.pincode,
      },
      totalAmount: product.currentPrice,
      OrderId: orderId,
      affilator: affilatorId || undefined,
      wasExchanged: {
        status: wasExchanged ? true : false,
        forProduct: wasExchanged ? wasExchanged : undefined,
      },
    });

    // Step 2: Create order in Shiprocket
    const token = await getShiprocketToken();

    const shiprocketOrderData = {
      order_id: orderId,
      order_date: new Date().toISOString(),
      pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION,
      billing_customer_name: user.username,
      billing_last_name: "",
      billing_address: `${address.houseNumber}, ${address.street}, ${address.landmark || ""}`,
      billing_city: address.city,
      billing_pincode: address.pincode,
      billing_state: address.state,
      billing_country: address.country || "India",
      billing_email: user.email,
      billing_phone: user.phone || "9999999999",
      shipping_is_billing: true,
      order_items: [
        {
          name: product.title,
          sku: product._id.toString(),
          units: 1,
          selling_price: product.currentPrice,
        },
      ],
      payment_method: "Prepaid", // or "COD"
      sub_total: product.currentPrice,
      length: product.dimensions?.length || 10,
      breadth: product.dimensions?.breadth || 10,
      height: product.dimensions?.height || 10,
      weight: product.weight || 0.5,
    };

    const shiprocketRes = await createShiprocketOrder(token, shiprocketOrderData);

    // Step 3: Save Shiprocket details in MongoDB
    order.shipmentId = shiprocketRes.shipment_id || null;
    order.awb = shiprocketRes.awb_code || null;
    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order placed & synced with Shiprocket",
      order,
      shiprocket: shiprocketRes,
    }, { status: 201 });

  } catch (error) {
    console.error("Order placing error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
