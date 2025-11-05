"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Zap, Trophy } from "lucide-react"

interface UserStatsGamifiedProps {
  level: number
  currentPoints: number
  nextLevelPoints: number
  streak: number
  badges: string[]
  rank: number
}

export function UserStatsGamified({
  level,
  currentPoints,
  nextLevelPoints,
  streak,
  badges,
  rank,
}: UserStatsGamifiedProps) {
  const progressToNextLevel = (currentPoints / nextLevelPoints) * 100

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle>Your Gamification Stats</CardTitle>
        <CardDescription>Track your progress and achievements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Level Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                {level}
              </div>
              <div>
                <p className="font-semibold">Level {level}</p>
                <p className="text-xs text-muted-foreground">Experience Progress</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">{currentPoints.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">/ {nextLevelPoints.toLocaleString()} XP</p>
            </div>
          </div>
          <Progress value={progressToNextLevel} className="h-2" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex items-center justify-center mb-2 text-primary">
              <Trophy size={20} />
            </div>
            <p className="font-bold text-lg">{rank}</p>
            <p className="text-xs text-muted-foreground">Global Rank</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex items-center justify-center mb-2 text-accent">
              <Zap size={20} />
            </div>
            <p className="font-bold text-lg">{streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>

          <div className="text-center p-3 rounded-lg bg-background/50 border border-border">
            <div className="flex items-center justify-center mb-2 text-yellow-400">
              <TrendingUp size={20} />
            </div>
            <p className="font-bold text-lg">{currentPoints}</p>
            <p className="text-xs text-muted-foreground">Total Points</p>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold">Achievements</p>
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, idx) => (
                <Badge key={idx} variant="secondary" className="text-lg p-2">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
