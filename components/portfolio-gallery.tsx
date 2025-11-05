"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ImageUpload } from "@/components/image-upload"
import { Plus, Trash2 } from "lucide-react"

interface PortfolioItem {
  id: string
  title: string
  description: string
  imageUrl: string
  tags: string[]
  link?: string
}

export function PortfolioGallery() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    {
      id: "1",
      title: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration",
      imageUrl: "https://images.unsplash.com/photo-1661956600684-40bfde1c61c9?w=300&h=200&fit=crop",
      tags: ["React", "Node.js", "MongoDB"],
      link: "https://example.com",
    },
    {
      id: "2",
      title: "Analytics Dashboard",
      description: "Real-time analytics dashboard with data visualization",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      tags: ["Next.js", "TypeScript", "Recharts"],
    },
  ])

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    tags: [],
  })

  const handleAddPortfolioItem = (imageUrl: string) => {
    if (!newItem.title?.trim()) return

    const item: PortfolioItem = {
      id: Date.now().toString(),
      title: newItem.title!,
      description: newItem.description || "",
      imageUrl,
      tags: newItem.tags || [],
      link: newItem.link,
    }

    setPortfolio([...portfolio, item])
    setNewItem({ tags: [] })
    setIsAddingNew(false)
  }

  const handleDeleteItem = (id: string) => {
    setPortfolio(portfolio.filter((item) => item.id !== id))
  }

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle>Portfolio & Showcase</CardTitle>
        <CardDescription>Display your best work and projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {portfolio.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-border overflow-hidden hover:border-primary/50 transition group"
            >
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    className="hover:bg-destructive/20 hover:text-destructive flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {item.link && (
                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => window.open(item.link, "_blank")}
                  >
                    View Project
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {isAddingNew ? (
          <div className="p-4 border border-border rounded-lg space-y-4 bg-card/50">
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Image</label>
              <ImageUpload onUpload={handleAddPortfolioItem} folder="portfolio" aspectRatio="video" />
            </div>
            <input
              type="text"
              placeholder="Project Title"
              value={newItem.title || ""}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:outline-none"
            />
            <textarea
              placeholder="Project Description"
              value={newItem.description || ""}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:outline-none resize-none"
              rows={3}
            />
            <input
              type="text"
              placeholder="Project Link (optional)"
              value={newItem.link || ""}
              onChange={(e) => setNewItem({ ...newItem, link: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:outline-none"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => setIsAddingNew(false)}
                variant="outline"
                className="flex-1 border-border hover:bg-card bg-transparent"
              >
                Cancel
              </Button>
              <Button onClick={() => setIsAddingNew(false)} className="flex-1 bg-primary hover:bg-primary/90">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <Button
            onClick={() => setIsAddingNew(true)}
            variant="outline"
            className="w-full border-dashed border-border hover:bg-card bg-transparent gap-2"
          >
            <Plus size={18} />
            Add Portfolio Item
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
