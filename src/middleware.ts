import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);
const protectedAdminRoutes = ["/dashboard", "/categories", "/exams", "/questions", "/users"];
const protectedUserRoutes = ["/exam", "/results", "/my-exams"];
const authRoutes = ["/login", "/register", "/admin-login"];

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const { nextUrl } = req;
  const path = nextUrl.pathname;

  const isAuthRoute = authRoutes.some(route => path.startsWith(route));
  const isAdminRoute = protectedAdminRoutes.some(route => path.startsWith(route));
  const isUserRoute = protectedUserRoutes.some(route => path.startsWith(route));

  if (isAuthRoute) {
    if (isLoggedIn) {
      if (userRole === "ADMIN") {
         return NextResponse.redirect(new URL("/dashboard", nextUrl));
      }
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && (isAdminRoute || isUserRoute)) {
    let from = path;
    if (nextUrl.search) {
      from += nextUrl.search;
    }
    const loginPath = isAdminRoute ? "/admin-login" : "/login";
    return NextResponse.redirect(
      new URL(`${loginPath}?from=${encodeURIComponent(from)}`, nextUrl)
    );
  }

  // Nếu là Route của Admin, mà user lại có role USER thì cấm truy cập
  if (isAdminRoute && userRole !== "ADMIN") {
     return NextResponse.redirect(new URL("/", nextUrl));
  }

  return null;
});

// Define paths to apply the middleware
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
