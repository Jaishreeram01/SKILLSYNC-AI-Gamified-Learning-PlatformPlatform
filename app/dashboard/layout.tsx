"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Zap, Trophy, MessageSquare, LogOut, Briefcase, Mail } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/matches", label: "AI Matches", icon: Zap },
  { href: "/dashboard/teams", label: "Teams", icon: Briefcase },
  { href: "/dashboard/find-teammates", label: "Find Teammates", icon: Users },
  { href: "/dashboard/messages", label: "Messages", icon: Mail },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/profile", label: "Profile", icon: LayoutDashboard },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">SkillSync</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition",
                  isActive
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-card",
                )}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            className="w-full border-border hover:bg-card bg-transparent text-muted-foreground hover:text-foreground justify-start gap-2"
          >
            <MessageSquare size={20} />
            Support
          </Button>
          <Button
            variant="outline"
            className="w-full border-border hover:bg-card bg-transparent text-muted-foreground hover:text-foreground justify-start gap-2"
          >
            <LogOut size={20} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
