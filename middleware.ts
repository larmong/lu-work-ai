import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isLoginPage = req.nextUrl.pathname === "/login"

  if (isLoginPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", req.url))
    }
    return
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
