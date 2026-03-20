import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const runtime = "nodejs"

const SESSION_COOKIE_PREFIXES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
]

async function clearSessionCookies(
  request: Request,
  redirectResponse: NextResponse
) {
  const cookieStore = await cookies()
  for (const cookie of cookieStore.getAll()) {
    const name = cookie.name
    const shouldDelete = SESSION_COOKIE_PREFIXES.some(
      (prefix) => name === prefix || name.startsWith(prefix + ".")
    )
    if (shouldDelete) {
      const url = new URL(request.url)
      const secure = url.protocol === "https:"
      redirectResponse.cookies.set(name, "", {
        path: "/",
        maxAge: 0,
        httpOnly: true,
        sameSite: "lax",
        secure,
      })
    }
  }
}

async function loginRedirect(request: Request) {
  const url = new URL(request.url)
  const loginUrl = `${url.origin}/login`
  // 303: POST 이후 GET으로 이동 (브라우저 호환)
  const res = NextResponse.redirect(loginUrl, 303)
  await clearSessionCookies(request, res)
  return res
}

export async function GET(request: Request) {
  return loginRedirect(request)
}

export async function POST(request: Request) {
  return loginRedirect(request)
}
