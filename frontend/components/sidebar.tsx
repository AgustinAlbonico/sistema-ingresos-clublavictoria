"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Calendar, UserCheck, LogOut, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onClose?: () => void
}

const navigation = [
  { name: "Gestión de Socios", href: "/socios", icon: Users },
  { name: "Temporadas", href: "/temporadas", icon: Calendar },
  { name: "Asociaciones", href: "/socios-temporadas", icon: UserCheck },
  { name: "Estadísticas", href: "/estadisticas", icon: BarChart3 },
]

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    // Redirect to login page
    window.location.href = "/login"
  }

  return (
    <div className="flex flex-col h-full bg-sidebar bg-black">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sidebar-accent rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-sidebar-accent-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Club La Victoria</h2>
            <p className="text-xs text-muted-foreground">Panel de Control</p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden text-sidebar-foreground">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
              )}
              onClick={onClose}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
        >
          <LogOut className="h-4 w-4 mr-3" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
