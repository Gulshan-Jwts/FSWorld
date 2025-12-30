import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";
import Product from "@/models/Product";

export async function PUT(request) {
  try {
    await connectMongo();

    const { productId, size, color, quantity } = await request.json();
    const userEmail = request.headers.get("x-user-email");

    if (!userEmail) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!productId || quantity < 1) {
      return NextResponse.json(
        { error: "Invalid product ID or quantity" },
        { status: 400 }
      );
    }

    // Optional product validation
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Invalid product" }, { status: 404 });
    }

    // 1️⃣ Try to update quantity if item exists
    const updatedUser = await User.findOneAndUpdate(
      {
        email: userEmail,
        "cart.productId": productId,
        "cart.size": size,
        "cart.color": color,
      },
      {
        $set: { "cart.$.quantity": quantity },
      },
      { new: true }
    );

    // 2️⃣ If item wasn't found, add it
    if (!updatedUser) {
      console.log("Adding new item to cart");
      const user = await User.findOneAndUpdate(
        { email: userEmail },
        {
          $push: {
            cart: {
              productId,
              size: size || null,
              color: color || null,
              quantity,
            },
          },
        },
        { new: true }
      );

      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
