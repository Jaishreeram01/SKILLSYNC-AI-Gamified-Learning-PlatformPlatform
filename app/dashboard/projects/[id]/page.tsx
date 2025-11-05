"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Plus, MessageSquare, ImageIcon } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"

interface Task {
  id: string
  title: string
  description: string
  assignee: string
  status: "todo" | "in-progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Set up API endpoints",
      description: "Create REST API endpoints for data fetching",
      assignee: "Sarah Chen",
      status: "completed",
      priority: "high",
      dueDate: "2024-02-15",
    },
    {
      id: "2",
      title: "Design dashboard layout",
      description: "Create Figma mockups for main dashboard",
      assignee: "Marcus Williams",
      status: "completed",
      priority: "high",
      dueDate: "2024-02-10",
    },
    {
      id: "3",
      title: "Implement data visualization",
      description: "Build chart components with Recharts",
      assignee: "Alex Johnson",
      status: "in-progress",
      priority: "high",
      dueDate: "2024-02-25",
    },
    {
      id: "4",
      title: "Add export functionality",
      description: "Export dashboard data as PDF/CSV",
      assignee: "Sarah Chen",
      status: "todo",
      priority: "medium",
      dueDate: "2024-03-05",
    },
  ])

  const priorityColors = {
    low: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    medium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    high: "bg-red-500/20 text-red-300 border-red-500/30",
  }

  const statusColors = {
    todo: "bg-gray-500/20 text-gray-300 border-gray-500/30",
    "in-progress": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    completed: "bg-green-500/20 text-green-300 border-green-500/30",
  }

  const toggleTaskStatus = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "completed" ? "todo" : "completed",
            }
          : task,
      ),
    )
  }

  const completedCount = tasks.filter((t) => t.status === "completed").length
  const progress = Math.round((completedCount / tasks.length) * 100)

  const [projectImage, setProjectImage] = useState<string | undefined>(
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop",
  )
  const [gallery, setGallery] = useState<string[]>([
    "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
  ])
  const [showImageUpload, setShowImageUpload] = useState(false)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative h-80 bg-gradient-to-r from-primary to-accent overflow-hidden group">
        {projectImage ? (
          <img src={projectImage || "/placeholder.svg"} alt="Project Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/50 to-accent/50" />
        )}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <Button onClick={() => setShowImageUpload(true)} className="bg-primary hover:bg-primary/90 gap-2">
            <ImageIcon size={18} />
            Change Cover
          </Button>
        </div>
      </div>

      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="border-border bg-card w-full max-w-md">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Project Cover</h3>
              <ImageUpload
                onUpload={(url) => {
                  setProjectImage(url)
                  setShowImageUpload(false)
                }}
                folder="project-covers"
                preview={projectImage}
                aspectRatio="video"
              />
              <Button
                onClick={() => setShowImageUpload(false)}
                variant="outline"
                className="w-full mt-4 border-border hover:bg-card bg-transparent"
              >
                Close
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button asChild variant="ghost" size="sm" className="hover:bg-card">
              <Link href="/dashboard/teams" className="flex items-center gap-2">
                <ArrowLeft size={18} />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 max-w-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Project Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/50 transition group"
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Gallery ${idx}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
            ))}
            <div
              className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition flex items-center justify-center cursor-pointer group"
              onClick={() => setShowImageUpload(true)}
            >
              <div className="flex flex-col items-center gap-2 group-hover:text-primary transition">
                <Plus size={24} />
                <span className="text-sm">Add Image</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Task */}
        <div className="mb-8">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus size={18} />
            Add Task
          </Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={`border-border transition ${
                task.status === "completed" ? "bg-card/30 opacity-60" : "bg-card/50 hover:border-primary/50"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.status === "completed"}
                    onChange={() => toggleTaskStatus(task.id)}
                    className="mt-1 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3
                        className={`font-semibold ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </h3>
                      <Badge variant="outline" className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" className={statusColors[task.status]}>
                        {task.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Assigned to {task.assignee}</span>
                      <span>Due {task.dueDate}</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border hover:bg-card bg-transparent flex-shrink-0 gap-2"
                  >
                    <MessageSquare size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
