import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  // Auth Protection: Allow auth internals, socket.io, health check, and ingestion
  const isAuthInternal = req.nextUrl.pathname.startsWith("/api/auth");
  const isIngest = req.nextUrl.pathname.startsWith("/api/logs/ingest");
  const isHealth = req.nextUrl.pathname.startsWith("/api/health");
  const isSocket = req.nextUrl.pathname.startsWith("/socket.io");

  if (!isLoggedIn && !isLoginPage && !isAuthInternal && !isIngest && !isHealth && !isSocket) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    return Response.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    const dashboardUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(dashboardUrl);
  }

  // Basic API Rate Limiting (Conceptual for Demo)
  // In a real Edge environment, we'd use Upstash or a similar REST Redis client.
  // For now, we'll allow all requests but structure it for future integration.
  if (isApiRoute && !req.nextUrl.pathname.startsWith("/api/auth") && !req.nextUrl.pathname.startsWith("/api/health")) {
    // Add rate limiting header for demonstration
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');
    return response;
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
