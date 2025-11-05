"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Sparkles, Filter } from "lucide-react"
import { MatchingAlgorithm } from "@/lib/matching-algorithm"

interface MatchResult {
  userId: string
  name: string
  title: string
  matchScore: number
  compatibilityReasons: string[]
  skills: { name: string; level: string }[]
  avatar: string
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [filterLevel, setFilterLevel] = useState<string>("all")

  // Current user's skills
  const userSkills = [
    { name: "React", level: "expert" },
    { name: "TypeScript", level: "advanced" },
    { name: "Node.js", level: "advanced" },
    { name: "Python", level: "intermediate" },
  ]

  const handleFindMatches = async () => {
    setIsLoading(true)
    // Simulate AI matching algorithm
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const matchingAlgo = new MatchingAlgorithm()
    const results = matchingAlgo.findBestMatches(userSkills)
    setMatches(results)
    setIsLoading(false)
  }

  const filteredMatches =
    filterLevel === "all" ? matches : matches.filter((m) => m.matchScore >= Number.parseInt(filterLevel))

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
          <h1 className="text-2xl font-bold">AI-Powered Matches</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-2">Find Your Perfect Team</h2>
            <p className="text-muted-foreground">Get AI-powered recommendations based on skill compatibility</p>
          </div>
          <Button
            onClick={handleFindMatches}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 gap-2 whitespace-nowrap"
          >
            <Sparkles size={18} />
            {isLoading ? "Finding Matches..." : "Find Matches"}
          </Button>
        </div>

        {/* Filter Bar */}
        {matches.length > 0 && (
          <div className="mb-6 flex gap-2 items-center flex-wrap">
            <Filter size={18} className="text-muted-foreground" />
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 rounded-lg bg-input border border-border text-foreground focus:border-primary focus:outline-none text-sm"
            >
              <option value="all">All Matches</option>
              <option value="90">90% and Above</option>
              <option value="80">80% and Above</option>
              <option value="70">70% and Above</option>
            </select>
            <span className="text-sm text-muted-foreground ml-auto">{filteredMatches.length} matches found</span>
          </div>
        )}

        {/* Matches Grid */}
        <div className="space-y-4">
          {isLoading && (
            <Card className="border-border bg-card/50">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <div className="animate-spin">
                    <Sparkles size={20} />
                  </div>
                  <span>Analyzing skill compatibility...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {!isLoading && matches.length === 0 ? (
            <Card className="border-border bg-card/50">
              <CardContent className="p-12 text-center">
                <Sparkles size={32} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold mb-2">No matches yet</h3>
                <p className="text-muted-foreground mb-4">Click "Find Matches" to get AI-powered recommendations</p>
              </CardContent>
            </Card>
          ) : (
            filteredMatches.map((match) => (
              <Card
                key={match.userId}
                className="border-border bg-card/50 hover:border-primary/50 transition overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                        {match.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{match.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{match.title}</p>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {match.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill.name}
                            </Badge>
                          ))}
                        </div>

                        {/* Compatibility Reasons */}
                        <div className="text-xs text-muted-foreground">
                          <p className="font-medium mb-1">Why compatible:</p>
                          <ul className="space-y-0.5">
                            {match.compatibilityReasons.map((reason, idx) => (
                              <li key={idx}>• {reason}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="flex flex-col items-center gap-4 md:border-l md:border-border md:pl-6 w-full md:w-auto">
                      <div className="text-center">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-border"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeDasharray={`${(match.matchScore / 100) * 283} 283`}
                              className="text-primary transition-all"
                            />
                          </svg>
                          <div className="absolute text-center">
                            <div className="text-2xl font-bold">{match.matchScore}%</div>
                            <p className="text-xs text-muted-foreground">Match</p>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 w-full md:w-auto">
                        <Button size="sm" className="flex-1 md:flex-none bg-primary hover:bg-primary/90">
                          Connect
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 md:flex-none border-border hover:bg-card bg-transparent"
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Card */}
        {matches.length > 0 && (
          <Card className="border-border bg-card/50 mt-8">
            <CardHeader>
              <CardTitle className="text-base">How Matching Works</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Our AI algorithm analyzes your skills and finds team members with complementary abilities. It considers:
              </p>
              <ul className="space-y-1 ml-4">
                <li>• Skill level compatibility and overlap</li>
                <li>• Complementary skill sets that fill team gaps</li>
                <li>• Experience level alignment</li>
                <li>• Growth potential and learning opportunities</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
