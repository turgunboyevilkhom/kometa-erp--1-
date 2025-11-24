"use client"

import type React from "react"

import { useState } from "react"
import { Analytics } from "@vercel/analytics/next"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { usePathname } from "next/navigation"

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  // <CHANGE> Different layout for login page vs authenticated pages
  if (isLoginPage) {
    return (
      <>
        {children}
        <Analytics />
      </>
    )
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-slate-50">{children}</main>
        </div>
      </div>
      <Analytics />
    </>
  )
}
