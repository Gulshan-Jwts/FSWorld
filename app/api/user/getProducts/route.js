import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectMongo();

    let products = await Product.find();

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
