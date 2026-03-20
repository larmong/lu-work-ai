import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig: NextAuthConfig = {
  basePath: "/api/auth",
  providers: [
    Credentials({
      credentials: {
        id: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      authorize: async (credentials) => {
        const adminId = process.env.ADMIN_ID
        const adminPw = process.env.ADMIN_PW

        if (!adminId || !adminPw) {
          return null
        }

        const id = credentials?.id as string | undefined
        const password = credentials?.password as string | undefined

        if (!id || !password) {
          return null
        }

        if (id === adminId && password === adminPw) {
          return { id: adminId, name: "Admin" }
        }

        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ auth, request }) => {
      const isLoggedIn = !!auth?.user
      const isLoginPage = request.nextUrl.pathname === "/login"

      if (isLoginPage) {
        return true
      }

      return isLoggedIn
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id
      }
      return token
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },
}
