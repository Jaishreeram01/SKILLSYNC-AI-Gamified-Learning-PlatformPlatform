"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import { ImageUpload } from "@/components/image-upload"
import { PortfolioGallery } from "@/components/portfolio-gallery"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    "https://images.unsplash.com/photo-1535713566543-d7c7b9f2e1d8?w=200&h=200&fit=crop",
  )
  const [formData, setFormData] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    title: "Full Stack Developer",
    bio: "Passionate about building scalable web applications with modern technologies.",
    location: "San Francisco, CA",
    website: "www.alexjohnson.dev",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    console.log("[v0] Profile updated:", formData)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button asChild variant="ghost" size="sm" className="hover:bg-card">
            <Link href="/dashboard" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              Back
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <Card className="border-border bg-card/50">
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Manage your profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-border">
              {isEditing ? (
                <ImageUpload
                  onUpload={(url) => setAvatarUrl(url)}
                  onDelete={() => setAvatarUrl(undefined)}
                  folder="user-avatars"
                  preview={avatarUrl}
                  aspectRatio="square"
                  className="w-32 h-32"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    formData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-input border-border disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-input border-border disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Professional Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="bg-input border-border disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground disabled:opacity-50 focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-input border-border disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="bg-input border-border disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90">
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 gap-2">
                    <Save size={18} />
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-border hover:bg-card bg-transparent"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Gallery Section */}
        <PortfolioGallery />
      </main>
    </div>
  )
}
