import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import User from "@/models/User";
import Product from "@/models/Product";

export async function POST(request) {
  await connectMongo();

  const { productId, size, color } = await request.json();
  const userEmail = request.headers.get("x-user-email");

  if (!userEmail) {
    return NextResponse.json(
      { error: "User not authenticated" },
      { status: 401 }
    );
  }

  const product = await Product.findById(productId);
  if (!product) {
    return NextResponse.json(
      { error: "Invalid product" },
      { status: 404 }
    );
  }

  const user = await User.findOneAndUpdate(
    { email: userEmail },
    {
      $pull: {
        cart: {
          productId: product._id,
          size,
          color,
        },
      },
    },
    { new: true }
  );

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, user });
}
