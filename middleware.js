import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const AFFILATOR_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyJWT(token, secret) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Admin
  if ((pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) && !pathname.startsWith("/api/admin/login") && !pathname.startsWith("/admin/login")) {
    console.log("Admin middleware triggered for path:", pathname);
    const token = request.cookies.get("adminToken")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const payload = await verifyJWT(token, ADMIN_SECRET);

    if (!payload?.isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-email", payload.email || "");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }

  // Affilator
  if (
    (pathname.startsWith("/affilator") || pathname.startsWith("/api/affilator")) &&
    !pathname.startsWith("/api/affilator/login") &&
    !pathname.startsWith("/api/affilator/login/verify")
  ) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyJWT(token, AFFILATOR_SECRET);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-email", payload.email || "");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }
  
  // User
  if (
    (pathname.startsWith("/user") || pathname.startsWith("/api/user")) &&
    !pathname.startsWith("/api/user/login") &&
    !pathname.startsWith("/api/user/login/verify")
  ) {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Missing or invalid token" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const payload = await verifyJWT(token, AFFILATOR_SECRET);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-email", payload.email || "");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/affilator/:path*", "/api/affilator/:path*"],
};
