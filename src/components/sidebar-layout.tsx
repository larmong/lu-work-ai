"use client"

import { usePathname } from "next/navigation"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/src/components/ui/sidebar"
import { AppSidebar } from "@/src/components/app-sidebar"
import { signOut } from "next-auth/react"

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  if (isLoginPage) {
    return <>{children}</>
  }

  const logoutAction = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex h-100vh overflow-hidden ml-[224px]">
        <SidebarProvider>
          <AppSidebar logoutAction={logoutAction} />
          <SidebarInset className="rounded-none shadow-none">
            <main className="flex flex-1 flex-col p-4">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}
