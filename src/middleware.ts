import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // 1. Enforce rigorous multi-tenant route guards
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (path.startsWith("/seller")) {
      if (token?.role !== "seller" && token?.role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      // If user is a registered vendor but has not cleared the administrative verification queue
      if (token?.role === "seller" && !token?.isApprovedSeller) {
        return NextResponse.redirect(
          new URL("/seller/pending-approval", req.url),
        );
      }
    }
  },
  {
    callbacks: {
      // Returns true if a valid identity token exists within the client cookies
      authorized: ({ token }) => !!token,
    },
  },
);

// Apply edge route pattern matcher conditions across all dashboards and secure actions
export const config = {
  matcher: [
    "/admin/:path*",
    "/seller/:path*",
    "/checkout/:path*",
    "/orders/:path*",
  ],
};
