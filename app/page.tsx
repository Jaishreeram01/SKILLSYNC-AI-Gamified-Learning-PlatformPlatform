"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold">SkillSync</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition">
              How it Works
            </Link>
            <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition">
              Sign In
            </Link>
            <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Connect. Learn. Grow.
        </h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          AI-powered skill matching connects you with teammates who complement your abilities. Build better projects
          together.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/auth/signup">Start for Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-border hover:bg-card bg-transparent">
            <Link href="#how-it-works">Learn More</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold mb-16 text-center">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Skill Matching",
              description: "Intelligent algorithms match you with teammates who have complementary skills.",
              icon: "🤖",
            },
            {
              title: "Real-time Collaboration",
              description: "Chat, share code, and collaborate seamlessly with your matched team.",
              icon: "💬",
            },
            {
              title: "Gamified Learning",
              description: "Earn badges, climb leaderboards, and compete with other developers.",
              icon: "🏆",
            },
          ].map((feature, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6 hover:border-primary transition">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-muted-foreground">
          <p>&copy; 2025 SkillSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
