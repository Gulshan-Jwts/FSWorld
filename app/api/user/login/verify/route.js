import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    const authHeader = req.headers.get("Authorization");

    const token = authHeader.split(" ")[1];
    const payload = await verifyJWT(token, process.env.JWT_SECRET);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success:true }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
