"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Home,
  Package,
  PlusCircle,
  Settings,
  FileDown,
  LogOut,
  UserCircle,
  ArrowRightLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  open: boolean
}

export function Sidebar({ open }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Registrar",
      icon: PlusCircle,
      href: "/registrar",
      active: pathname === "/registrar",
    },
    {
      label: "Estoque",
      icon: Package,
      href: "/estoque",
      active: pathname === "/estoque",
    },
    {
      label: "Entrada/Saída",
      icon: ArrowRightLeft,
      href: "/entrada-saida",
      active: pathname === "/entrada-saida",
    },
    {
      label: "Relatórios",
      icon: BarChart3,
      href: "/relatorios",
      active: pathname === "/relatorios",
    },
    {
      label: "Exportações",
      icon: FileDown,
      href: "/exportacoes",
      active: pathname === "/exportacoes",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/configuracoes",
      active: pathname === "/configuracoes",
    },
    {
      label: "Meu Perfil",
      icon: UserCircle,
      href: "/perfil",
      active: pathname === "/perfil",
    },
  ]

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "-translate-x-full",
        "top-16 md:top-16",
      )}
    >
      <div className="flex h-full flex-col justify-between py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", route.active ? "font-medium" : "font-normal")}
                >
                  <route.icon className={cn("mr-2 h-5 w-5")} />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <form action="/api/auth/logout" method="POST">
            <Button type="submit" variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="mr-2 h-5 w-5" />
              Sair
            </Button>
          </form>
        </div>
      </div>
    </aside>
  )
}
