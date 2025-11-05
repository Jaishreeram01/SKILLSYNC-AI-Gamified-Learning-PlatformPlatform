"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Zap, Trophy, TrendingUp } from "lucide-react"

const stats = [
  {
    label: "Skills",
    value: "4",
    icon: Zap,
    color: "from-blue-500 to-blue-600",
  },
  {
    label: "Potential Matches",
    value: "12",
    icon: Users,
    color: "from-purple-500 to-purple-600",
  },
  {
    label: "Endorsements",
    value: "65",
    icon: Trophy,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    label: "Profile Strength",
    value: "78%",
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
  },
]

export function UserStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <Card key={index} className="border-border bg-card/50 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
