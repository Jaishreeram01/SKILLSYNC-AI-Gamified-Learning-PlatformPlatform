"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Crown, TrendingUp } from "lucide-react"

interface LeaderboardUser {
  rank: number
  id: string
  name: string
  points: number
  level: number
  streak: number
  badges: string[]
  avatar: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  unlockedDate?: string
}

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"weekly" | "monthly" | "alltime">("monthly")

  const leaderboardData: LeaderboardUser[] = [
    {
      rank: 1,
      id: "1",
      name: "Sarah Chen",
      points: 4850,
      level: 12,
      streak: 28,
      badges: ["🏆", "🚀", "💎"],
      avatar: "SC",
    },
    {
      rank: 2,
      id: "2",
      name: "Alex Johnson",
      points: 4620,
      level: 11,
      streak: 15,
      badges: ["🏆", "⭐"],
      avatar: "AJ",
    },
    {
      rank: 3,
      id: "3",
      name: "Marcus Williams",
      points: 4380,
      level: 11,
      streak: 8,
      badges: ["⭐"],
      avatar: "MW",
    },
    {
      rank: 4,
      id: "4",
      name: "Emily Rodriguez",
      points: 4100,
      level: 10,
      streak: 12,
      badges: ["🏆"],
      avatar: "ER",
    },
    {
      rank: 5,
      id: "5",
      name: "James Park",
      points: 3950,
      level: 10,
      streak: 5,
      badges: [],
      avatar: "JP",
    },
  ]

  const achievements: Achievement[] = [
    {
      id: "1",
      name: "First Steps",
      description: "Complete your first skill endorsement",
      icon: "👣",
      unlocked: true,
      unlockedDate: "2024-01-15",
    },
    {
      id: "2",
      name: "Team Player",
      description: "Join your first team",
      icon: "👥",
      unlocked: true,
      unlockedDate: "2024-01-20",
    },
    {
      id: "3",
      name: "Project Master",
      description: "Complete 5 projects",
      icon: "🎯",
      unlocked: true,
      unlockedDate: "2024-02-10",
    },
    {
      id: "4",
      name: "Social Butterfly",
      description: "Match with 10 teammates",
      icon: "🦋",
      unlocked: false,
    },
    {
      id: "5",
      name: "Skill Collector",
      description: "Add 20 unique skills",
      icon: "🎓",
      unlocked: false,
    },
    {
      id: "6",
      name: "Hall of Fame",
      description: "Reach level 20",
      icon: "🏛️",
      unlocked: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="ghost" size="sm" className="hover:bg-card">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Leaderboard & Achievements</h1>
          </div>
          <p className="text-muted-foreground">Compete with teammates and unlock badges</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="leaderboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-fit bg-card/50 border border-border">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Top Players</h2>
              <div className="flex gap-2">
                {(["weekly", "monthly", "alltime"] as const).map((tf) => (
                  <Button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    variant={timeframe === tf ? "default" : "outline"}
                    size="sm"
                    className={
                      timeframe === tf ? "bg-primary hover:bg-primary/90" : "border-border hover:bg-card bg-transparent"
                    }
                  >
                    {tf === "alltime" ? "All Time" : tf.charAt(0).toUpperCase() + tf.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {leaderboardData.slice(0, 3).map((user, idx) => (
                <Card
                  key={user.id}
                  className={`border-border bg-card/50 ${idx === 0 ? "md:col-span-1 md:row-span-2 relative" : ""}`}
                >
                  <CardContent className="p-6">
                    <div
                      className={`flex flex-col items-center text-center ${idx === 0 ? "justify-center h-full" : ""}`}
                    >
                      {idx === 0 && <Crown className="text-yellow-400 mb-2" size={32} />}
                      <div
                        className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold ${
                          idx === 0 ? "text-2xl" : ""
                        }`}
                      >
                        {user.avatar}
                      </div>
                      <p className={`font-bold mt-2 ${idx === 0 ? "text-lg" : ""}`}>{user.name}</p>
                      <div className="flex items-center gap-1 mt-2 justify-center text-sm text-muted-foreground">
                        <TrendingUp size={14} />
                        <span>Rank #{user.rank}</span>
                      </div>
                      <p className={`font-semibold mt-2 text-primary ${idx === 0 ? "text-2xl" : "text-lg"}`}>
                        {user.points.toLocaleString()} pts
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Level {user.level}</p>
                      <div className="flex gap-1 mt-3 justify-center flex-wrap">
                        {user.badges.map((badge, bidx) => (
                          <span key={bidx} className="text-lg">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Full Leaderboard Table */}
            <Card className="border-border bg-card/50">
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {leaderboardData.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-primary/5 transition flex items-center gap-4">
                      <div className="text-lg font-bold text-muted-foreground min-w-fit">#{user.rank}</div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {user.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold">{user.name}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Badge variant="secondary" className="text-xs">
                            Lvl {user.level}
                          </Badge>
                          <span>{user.streak} day streak</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-lg text-primary">{user.points.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">points</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        {user.badges.map((badge, idx) => (
                          <span key={idx} className="text-lg">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Achievements</h2>
              <p className="text-muted-foreground text-sm mb-6">
                {achievements.filter((a) => a.unlocked).length} of {achievements.length} achievements unlocked
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    className={`border-border bg-card/50 cursor-pointer hover:border-primary/50 transition ${
                      !achievement.unlocked ? "opacity-50" : ""
                    }`}
                  >
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div
                        className={`text-4xl mb-3 p-3 rounded-lg ${
                          achievement.unlocked ? "bg-primary/20" : "bg-muted/20"
                        }`}
                      >
                        {achievement.icon}
                      </div>
                      <h4 className="font-semibold text-sm">{achievement.name}</h4>
                      <p className="text-xs text-muted-foreground mt-2">{achievement.description}</p>
                      {achievement.unlocked && achievement.unlockedDate && (
                        <p className="text-xs text-primary mt-2">Unlocked {achievement.unlockedDate}</p>
                      )}
                      {!achievement.unlocked && <p className="text-xs text-muted-foreground mt-2 italic">Locked</p>}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Achievement Stats */}
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">12</p>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">4,620</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">28</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">3</p>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
