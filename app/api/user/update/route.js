import { NextResponse } from "next/server";
import User from "@/models/User";
import connectMongo from "@/lib/connectMongo";

export async function POST(req) {
  try {
    await connectMongo();

    const email = req.headers.get("x-user-email");
    if (!email) {
      return NextResponse.json(
        { error: "Missing x-user-email header" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      phone,
      streetAddress,
      city,
      state,
      pincode,
      country,
      landmark,
      houseNo,
    } = body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        phone,
        address: {
          houseNumber: houseNo,
          street: streetAddress,
          landmark,
          city,
          state,
          country,
          pincode,
        },
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update address error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
