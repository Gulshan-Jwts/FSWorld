import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Orders from "@/models/Orders";

export async function POST(req) {
  try {
    await connectMongo();

    const body = await req.json();
    const { order_id } = body;

    if (!order_id) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const order = await Orders.findOne({OrderId:order_id});
    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // Agar already cancelled hai
    
    console.log(order);
    if (order.cancelled.status) {
      return NextResponse.json(
        { success: false, message: "Order already cancelled" },
        { status: 400 }
      );
    }

    // Update cancel status
    order.cancelled.status = true;
    order.cancelled.time = Date.now();
    order.status = "Cancelled";

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
