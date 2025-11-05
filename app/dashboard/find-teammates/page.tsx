"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MessageCircle } from "lucide-react"

interface Teammate {
  id: string
  name: string
  title: string
  skills: { name: string; level: string }[]
  match: number
  bio: string
}

const teammates: Teammate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Backend Engineer",
    skills: [
      { name: "Node.js", level: "Expert" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "Python", level: "Advanced" },
    ],
    match: 92,
    bio: "Building scalable backend systems for 5+ years.",
  },
  {
    id: "2",
    name: "Marcus Williams",
    title: "UI/UX Designer",
    skills: [
      { name: "Figma", level: "Expert" },
      { name: "Design Systems", level: "Advanced" },
      { name: "React", level: "Intermediate" },
    ],
    match: 88,
    bio: "Passionate about creating beautiful user experiences.",
  },
  {
    id: "3",
    name: "Priya Patel",
    title: "DevOps Engineer",
    skills: [
      { name: "Kubernetes", level: "Expert" },
      { name: "AWS", level: "Expert" },
      { name: "Docker", level: "Advanced" },
    ],
    match: 85,
    bio: "Specializing in cloud infrastructure and CI/CD pipelines.",
  },
]

export default function FindTeammatesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="hover:bg-card">
              <Link href="/dashboard" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Back
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Find Teammates</h1>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/dashboard/matches">Try AI Matching</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {teammates.map((teammate) => (
            <Card key={teammate.id} className="border-border bg-card/50 hover:border-primary/50 transition">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  {/* User Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0">
                      {teammate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{teammate.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{teammate.title}</p>
                      <p className="text-sm mb-3">{teammate.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {teammate.skills.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="flex flex-col items-center gap-4 md:border-l md:border-border md:pl-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{teammate.match}%</div>
                      <p className="text-xs text-muted-foreground">Match Score</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 gap-2">
                        <Heart size={16} />
                        <span className="hidden sm:inline">Connect</span>
                      </Button>
                      <Button size="sm" variant="outline" className="border-border hover:bg-card bg-transparent gap-2">
                        <MessageCircle size={16} />
                        <span className="hidden sm:inline">Message</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
