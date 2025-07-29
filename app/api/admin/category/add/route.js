import Category from "@/models/Category";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  await connectMongo();
  const { name } = await req.json();

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const exists = await Category.findOne({ name });
  if (exists) return NextResponse.json({ error: "Category already exists" }, { status: 400 });

  const category = await Category.create({ name, subcategories: [] });
  return NextResponse.json({ success: true, category });
}
