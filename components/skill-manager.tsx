"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"

interface Skill {
  id: string
  name: string
  level: "beginner" | "intermediate" | "advanced" | "expert"
  endorsements: number
}

const SKILL_LEVELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
}

const LEVEL_COLORS = {
  beginner: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  intermediate: "bg-green-500/20 text-green-300 border-green-500/30",
  advanced: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  expert: "bg-purple-500/20 text-purple-300 border-purple-500/30",
}

export function SkillManager() {
  const [skills, setSkills] = useState<Skill[]>([
    { id: "1", name: "React", level: "expert", endorsements: 24 },
    { id: "2", name: "TypeScript", level: "advanced", endorsements: 18 },
    { id: "3", name: "Node.js", level: "advanced", endorsements: 15 },
    { id: "4", name: "Python", level: "intermediate", endorsements: 8 },
  ])

  const [newSkill, setNewSkill] = useState("")
  const [selectedLevel, setSelectedLevel] = useState<Skill["level"]>("intermediate")
  const [isAdding, setIsAdding] = useState(false)

  const handleAddSkill = () => {
    if (!newSkill.trim()) return

    const skill: Skill = {
      id: Date.now().toString(),
      name: newSkill,
      level: selectedLevel,
      endorsements: 0,
    }

    setSkills([...skills, skill])
    setNewSkill("")
    setSelectedLevel("intermediate")
    setIsAdding(false)
  }

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id))
  }

  return (
    <Card className="border-border bg-card/50">
      <CardHeader>
        <CardTitle>Your Skills</CardTitle>
        <CardDescription>Showcase your expertise and get matched with teammates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Skills List */}
        <div className="space-y-3">
          {skills.length === 0 ? (
            <p className="text-muted-foreground text-sm">No skills added yet. Add your first skill to get started!</p>
          ) : (
            skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${LEVEL_COLORS[skill.level]}`}>
                        {SKILL_LEVELS[skill.level]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{skill.endorsements} endorsements</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSkill(skill.id)}
                  className="hover:bg-destructive/20 hover:text-destructive"
                >
                  <X size={16} />
                </Button>
              </div>
            ))
          )}
        </div>

        {/* Add Skill Form */}
        <div className="pt-4 border-t border-border">
          {!isAdding ? (
            <Button
              onClick={() => setIsAdding(true)}
              className="w-full bg-primary hover:bg-primary/90 justify-start gap-2"
            >
              <Plus size={18} />
              Add New Skill
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="skill-name">Skill Name</Label>
                <Input
                  id="skill-name"
                  placeholder="e.g., Next.js, Figma, Project Management"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="bg-input border-border focus:border-primary"
                  onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skill-level">Proficiency Level</Label>
                <select
                  id="skill-level"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as Skill["level"])}
                  className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:outline-none"
                >
                  {Object.entries(SKILL_LEVELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddSkill} className="flex-1 bg-primary hover:bg-primary/90">
                  Add Skill
                </Button>
                <Button
                  onClick={() => setIsAdding(false)}
                  variant="outline"
                  className="flex-1 border-border hover:bg-card bg-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
