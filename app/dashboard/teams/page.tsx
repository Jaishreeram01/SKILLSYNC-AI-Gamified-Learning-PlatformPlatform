"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ArrowRight, Users } from "lucide-react"

interface Team {
  id: string
  name: string
  description: string
  members: number
  maxMembers: number
  projects: number
  status: "active" | "forming" | "completed"
  skills: string[]
  avatar?: string
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "React Dashboard Pro",
      description: "Building an advanced analytics dashboard with real-time data visualization",
      members: 3,
      maxMembers: 5,
      projects: 2,
      status: "active",
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    },
    {
      id: "2",
      name: "Mobile Commerce App",
      description: "Cross-platform e-commerce application with payment integration",
      members: 2,
      maxMembers: 4,
      projects: 1,
      status: "forming",
      skills: ["React Native", "Firebase", "Stripe"],
    },
    {
      id: "3",
      name: "AI Content Generator",
      description: "AI-powered content creation tool leveraging GPT and vector databases",
      members: 4,
      maxMembers: 6,
      projects: 3,
      status: "active",
      skills: ["Python", "Machine Learning", "React", "API Design"],
    },
  ])

  const statusColors = {
    active: "bg-green-500/20 text-green-300 border-green-500/30",
    forming: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    completed: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Your Teams</h1>
            <p className="text-muted-foreground text-sm">Collaborate on projects with matched teammates</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus size={18} />
            Create Team
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Teams List */}
          <div className="lg:col-span-2 space-y-4">
            {teams.length === 0 ? (
              <Card className="border-border bg-card/50">
                <CardContent className="p-12 text-center">
                  <Users size={32} className="mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold mb-2">No teams yet</h3>
                  <p className="text-muted-foreground mb-4">Create or join a team to start collaborating</p>
                  <Button className="bg-primary hover:bg-primary/90">Create Your First Team</Button>
                </CardContent>
              </Card>
            ) : (
              teams.map((team) => (
                <Card
                  key={team.id}
                  className="border-border bg-card/50 hover:border-primary/50 transition cursor-pointer"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{team.name}</h3>
                          <Badge variant="outline" className={statusColors[team.status]}>
                            {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3">{team.description}</p>
                      </div>
                      <ArrowRight size={20} className="text-muted-foreground flex-shrink-0" />
                    </div>

                    {/* Team Stats */}
                    <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Members</p>
                        <p className="font-semibold">
                          {team.members}/{team.maxMembers}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Projects</p>
                        <p className="font-semibold">{team.projects}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground mb-1">Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {team.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                        <Link href={`/dashboard/teams/${team.id}`}>View Team</Link>
                      </Button>
                      <Button size="sm" variant="outline" className="border-border hover:bg-card bg-transparent">
                        {team.status === "forming" ? "Join Team" : "View Projects"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-4">
            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Team Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Active Teams</p>
                  <p className="text-3xl font-bold">{teams.filter((t) => t.status === "active").length}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Total Members</p>
                  <p className="text-3xl font-bold">{teams.reduce((sum, t) => sum + t.members, 0)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Total Projects</p>
                  <p className="text-3xl font-bold">{teams.reduce((sum, t) => sum + t.projects, 0)}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Looking to Join?</CardTitle>
                <CardDescription>Browse available teams</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full border-border hover:bg-card bg-transparent">
                  <Link href="/dashboard/browse-teams">Browse Teams</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
