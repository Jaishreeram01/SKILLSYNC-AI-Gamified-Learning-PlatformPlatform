"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Settings, Share2 } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface TeamMember {
  id: string
  name: string
  role: string
  skills: string[]
  joinedAt: string
  avatar: string
}

interface Project {
  id: string
  name: string
  description: string
  status: "planning" | "in-progress" | "completed"
  progress: number
  tasks: number
  completedTasks: number
}

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const [members] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Alex Johnson",
      role: "Team Lead",
      skills: ["React", "TypeScript", "Node.js"],
      joinedAt: "2024-01-15",
      avatar: "AJ",
    },
    {
      id: "2",
      name: "Sarah Chen",
      role: "Backend Engineer",
      skills: ["Node.js", "PostgreSQL", "Python"],
      joinedAt: "2024-02-01",
      avatar: "SC",
    },
    {
      id: "3",
      name: "Marcus Williams",
      role: "UI Designer",
      skills: ["Figma", "CSS", "React"],
      joinedAt: "2024-02-10",
      avatar: "MW",
    },
  ])

  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Analytics Dashboard",
      description: "Real-time analytics dashboard with custom visualizations",
      status: "in-progress",
      progress: 65,
      tasks: 24,
      completedTasks: 16,
    },
    {
      id: "2",
      name: "API Documentation",
      description: "Comprehensive API documentation and integration guide",
      status: "in-progress",
      progress: 40,
      tasks: 15,
      completedTasks: 6,
    },
  ])

  const [isEditingBanner, setIsEditingBanner] = useState(false)
  const [bannerUrl, setBannerUrl] = useState<string | undefined>(
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=400&fit=crop",
  )

  const statusColors = {
    planning: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "in-progress": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    completed: "bg-green-500/20 text-green-300 border-green-500/30",
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative h-64 bg-gradient-to-r from-primary to-accent overflow-hidden">
        {bannerUrl ? (
          <img src={bannerUrl || "/placeholder.svg"} alt="Team Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/50 to-accent/50" />
        )}
        {isEditingBanner && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-card/95 p-4 rounded-lg max-w-xs w-full mx-4">
              <ImageUpload
                onUpload={(url) => {
                  setBannerUrl(url)
                  setIsEditingBanner(false)
                }}
                folder="team-banners"
                preview={bannerUrl}
                aspectRatio="video"
              />
            </div>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button asChild variant="ghost" size="sm" className="hover:bg-card">
              <Link href="/dashboard/teams" className="flex items-center gap-2">
                <ArrowLeft size={18} />
                Back
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditingBanner(!isEditingBanner)}
                size="sm"
                variant="outline"
                className="border-border hover:bg-card bg-transparent gap-2"
              >
                Edit Banner
              </Button>
              <Button size="sm" variant="outline" className="border-border hover:bg-card bg-transparent gap-2">
                <Share2 size={16} />
                Share
              </Button>
              <Button size="sm" variant="outline" className="border-border hover:bg-card bg-transparent gap-2">
                <Settings size={16} />
                Settings
              </Button>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-1">React Dashboard Pro</h1>
            <p className="text-muted-foreground">
              Building an advanced analytics dashboard with real-time data visualization
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit bg-card/50 border border-border">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Team Projects</h2>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus size={18} />
                New Project
              </Button>
            </div>

            {projects.map((project) => (
              <Card key={project.id} className="border-border bg-card/50">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <Badge variant="outline" className={statusColors[project.status]}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{project.description}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <p className="text-sm font-medium">{project.progress}%</p>
                    </div>
                    <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {project.completedTasks}/{project.tasks} tasks completed
                    </p>
                    <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
                      <Link href={`/dashboard/teams/${params.id}/projects/${project.id}`}>View Project</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus size={18} />
                Invite Member
              </Button>
            </div>

            <div className="space-y-3">
              {members.map((member) => (
                <Card key={member.id} className="border-border bg-card/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold">{member.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {member.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">Joined {member.joinedAt}</p>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-border hover:bg-card bg-transparent flex-shrink-0"
                      >
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <h2 className="text-xl font-semibold">Recent Activity</h2>
            <Card className="border-border bg-card/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { user: "Sarah Chen", action: "completed task", item: "API Integration", time: "2 hours ago" },
                    { user: "Marcus Williams", action: "updated", item: "Dashboard UI", time: "4 hours ago" },
                    { user: "Alex Johnson", action: "created project", item: "Analytics Dashboard", time: "1 day ago" },
                  ].map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary flex-shrink-0">
                        {activity.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                          <span className="text-primary">{activity.item}</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
