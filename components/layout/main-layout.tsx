"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Header } from "@/components/layout/header"
import { Toaster } from "@/components/ui/toaster"
import { useMobile } from "@/hooks/use-mobile"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  // Verificar se é uma página de autenticação
  const isAuthPage = pathname === "/login" || pathname === "/registro"

  // Fechar sidebar automaticamente em dispositivos móveis
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  // Fechar sidebar ao mudar de página em dispositivos móveis
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [pathname, isMobile])

  // Renderizar layout diferente para páginas de autenticação
  if (isAuthPage) {
    return (
      <div className="min-h-screen">
        {children}
        <Toaster />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar open={sidebarOpen} />
        <main
          className={`flex-1 overflow-y-auto p-4 transition-all duration-300 md:p-6 ${
            sidebarOpen ? "md:ml-64" : "md:ml-0"
          }`}
        >
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
