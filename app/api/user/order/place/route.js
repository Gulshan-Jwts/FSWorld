import { NextResponse } from "next/server";
import User from "@/models/User";
import Product from "@/models/Product";
import Order from "@/models/Orders"; 
import connectMongo from "@/lib/connectMongo";

function generateOrderId() {
  return `ORD-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

export async function POST(request) {
  try {
    await connectMongo();

    const body = await request.json();
    const { productId, quantity, address, affilatorId } = body;
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (!productId || !quantity) {
      return NextResponse.json({ error: "productId and quantity are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    user.address = address || user.address;
    await user.save();

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const order = await Order.create({
      user: user._id,
      items: [
        {
          product: product._id,
          quantity,
          priceAtPurchase: product.currentPrice,
        },
      ],
      totalAmount: product.currentPrice * quantity,
      OrderId: generateOrderId(),
      affilator: affilatorId || undefined,
    });

    return NextResponse.json(
      { success: true, message: "Order placed", order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order placing error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
