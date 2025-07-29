
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  await connectMongo();
  const { categoryName, subcategoryName } = await req.json();

  const category = await Category.findOne({ name: categoryName });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  if (category.subcategories.includes(subcategoryName)) {
    return NextResponse.json({ error: "Subcategory already exists" }, { status: 400 });
  }

  category.subcategories.push(subcategoryName);
  await category.save();

  return NextResponse.json({ success: true, category });
}
