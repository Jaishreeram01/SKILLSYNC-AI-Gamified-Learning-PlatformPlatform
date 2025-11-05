"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Settings, LogOut } from "lucide-react"
import { SkillManager } from "@/components/skill-manager"
import { UserStats } from "@/components/user-stats"
import { UserStatsGamified } from "@/components/user-stats-gamified"
import { NotificationCenter } from "@/components/notification-center"
import { getCurrentSession, signOut } from "@/lib/auth-service"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getCurrentSession()
    if (!session) {
      router.push("/auth/login")
      return
    }
    setUser(session)
    setLoading(false)
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg mx-auto mb-4 animate-pulse"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">SkillSync</span>
          </Link>

          <nav className="flex items-center gap-4">
            <NotificationCenter />
            <Link
              href="/dashboard/profile"
              className="text-muted-foreground hover:text-foreground transition flex items-center gap-2"
            >
              <Settings size={20} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-border hover:bg-card bg-transparent text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome, {user.name.split(" ")[0]}</h1>
              <p className="text-muted-foreground">Manage your skills and find the perfect teammates</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <UserStats />

        <div className="mt-8">
          <UserStatsGamified
            level={12}
            currentPoints={4620}
            nextLevelPoints={5000}
            streak={28}
            badges={["🏆", "🚀", "💎"]}
            rank={2}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Skill Manager - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2">
            <SkillManager />
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
                <CardDescription>Get started with SkillSync</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 justify-start gap-2">
                  <Link href="/dashboard/find-teammates">
                    <Plus size={18} />
                    Find Teammates
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-border hover:bg-card bg-transparent justify-start gap-2"
                >
                  <Link href="/dashboard/matches">
                    <span>🎯</span>
                    View Matches
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-border hover:bg-card bg-transparent justify-start gap-2"
                >
                  <Link href="/dashboard/leaderboard">
                    <span>🏆</span>
                    Leaderboard
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Profile Preview */}
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xl font-bold">
                  {user.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <Button asChild variant="outline" className="w-full border-border hover:bg-card bg-transparent">
                  <Link href="/dashboard/profile">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
