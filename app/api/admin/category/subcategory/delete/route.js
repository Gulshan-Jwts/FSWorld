import Category from "@/models/Category";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import connectMongo from "@/lib/connectMongo";

export async function DELETE(req) {
  await connectMongo();
  const { categoryName, subcategoryName } = await req.json();

  const productInUse = await Product.findOne({
    category: categoryName,
    subcategory: subcategoryName,
  });

  if (productInUse) {
    return NextResponse.json({ error: "Cannot delete: Subcategory in use" }, { status: 400 });
  }

  const category = await Category.findOne({ name: categoryName });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  category.subcategories = category.subcategories.filter(sub => sub !== subcategoryName);
  await category.save();

  return NextResponse.json({ success: true, category });
}
