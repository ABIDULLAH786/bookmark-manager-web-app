import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import path from "path";

export default withAuth(
  // This 'middleware' function runs ONLY if 'authorized' returns true.
  // We can use it to redirect logged-in users away from public pages.
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is logged-in and tries to access login/register, redirect to home
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Otherwise, continue to the requested page
    return NextResponse.next();
  },
  {
    callbacks: {
      // This 'authorized' callback runs FIRST.
      // It decides if the user is allowed to proceed.
      authorized({ req, token }) {
        console.log("TOKEN IS: ", token)
        const { pathname } = req.nextUrl;

        // 1. Add for debugging: Check your terminal
        console.log("MIDDLEWARE PATH:", pathname);
        console.log("HAS TOKEN:", !!token);
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname.startsWith("/api")
        )
          return true;

        if (pathname === "/") {
          return true;
        }

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",

  ],
};
