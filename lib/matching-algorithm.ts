/**
 * AI Skill Matching Algorithm
 * Implements intelligent matching between users based on complementary skills
 */

interface UserSkill {
  name: string
  level: string
}

interface MatchResult {
  userId: string
  name: string
  title: string
  matchScore: number
  compatibilityReasons: string[]
  skills: UserSkill[]
  avatar: string
}

interface CandidateProfile {
  id: string
  name: string
  title: string
  skills: UserSkill[]
  endorsements: number
}

// Mock candidate database
const CANDIDATES: CandidateProfile[] = [
  {
    id: "1",
    name: "Sarah Chen",
    title: "Backend Engineer",
    skills: [
      { name: "Node.js", level: "expert" },
      { name: "PostgreSQL", level: "advanced" },
      { name: "Python", level: "advanced" },
      { name: "GraphQL", level: "intermediate" },
    ],
    endorsements: 45,
  },
  {
    id: "2",
    name: "Marcus Williams",
    title: "UI/UX Designer",
    skills: [
      { name: "Figma", level: "expert" },
      { name: "CSS", level: "advanced" },
      { name: "React", level: "intermediate" },
      { name: "Design Systems", level: "advanced" },
    ],
    endorsements: 32,
  },
  {
    id: "3",
    name: "Priya Patel",
    title: "DevOps Engineer",
    skills: [
      { name: "Kubernetes", level: "expert" },
      { name: "AWS", level: "expert" },
      { name: "Docker", level: "advanced" },
      { name: "Python", level: "advanced" },
    ],
    endorsements: 38,
  },
  {
    id: "4",
    name: "James Rodriguez",
    title: "Full Stack Developer",
    skills: [
      { name: "Vue.js", level: "expert" },
      { name: "Firebase", level: "advanced" },
      { name: "JavaScript", level: "expert" },
      { name: "Tailwind CSS", level: "advanced" },
    ],
    endorsements: 28,
  },
  {
    id: "5",
    name: "Emma Johnson",
    title: "Data Scientist",
    skills: [
      { name: "Python", level: "expert" },
      { name: "Machine Learning", level: "advanced" },
      { name: "TensorFlow", level: "intermediate" },
      { name: "Data Analysis", level: "expert" },
    ],
    endorsements: 41,
  },
]

export class MatchingAlgorithm {
  /**
   * Find best matches for a user based on their skills
   */
  findBestMatches(userSkills: UserSkill[]): MatchResult[] {
    const matches = CANDIDATES.map((candidate) => {
      const score = this.calculateMatchScore(userSkills, candidate.skills)
      const reasons = this.generateCompatibilityReasons(userSkills, candidate.skills)

      return {
        userId: candidate.id,
        name: candidate.name,
        title: candidate.title,
        matchScore: score,
        compatibilityReasons: reasons,
        skills: candidate.skills,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`,
      }
    })

    // Sort by match score (descending) and endorsements
    return matches.sort((a, b) => {
      if (b.matchScore !== a.matchScore) {
        return b.matchScore - a.matchScore
      }
      // Secondary sort by endorsements
      const aEndorsements = CANDIDATES.find((c) => c.id === a.userId)?.endorsements || 0
      const bEndorsements = CANDIDATES.find((c) => c.id === b.userId)?.endorsements || 0
      return bEndorsements - aEndorsements
    })
  }

  /**
   * Calculate compatibility score between user and candidate
   * Considers skill overlap, complementary skills, and level alignment
   */
  private calculateMatchScore(userSkills: UserSkill[], candidateSkills: UserSkill[]): number {
    const userSkillNames = userSkills.map((s) => s.name.toLowerCase())
    const candidateSkillNames = candidateSkills.map((s) => s.name.toLowerCase())

    // Calculate overlap
    const commonSkills = userSkillNames.filter((skill) => candidateSkillNames.includes(skill))
    const overlapScore = (commonSkills.length / Math.max(userSkillNames.length, candidateSkillNames.length)) * 30

    // Calculate complementary skills (skills candidate has that user doesn't)
    const complementarySkills = candidateSkillNames.filter(
      (skill) => !userSkillNames.includes(skill) && this.isComplementarySkill(skill, userSkillNames),
    )
    const complementaryScore = (complementarySkills.length / candidateSkillNames.length) * 40

    // Level alignment bonus
    const levelBonus = this.calculateLevelAlignment(userSkills, candidateSkills)

    // Total score
    const totalScore = overlapScore + complementaryScore + levelBonus
    return Math.min(Math.round(totalScore), 100)
  }

  /**
   * Check if a skill is complementary to the user's tech stack
   */
  private isComplementarySkill(skill: string, userSkills: string[]): boolean {
    // Define skill categories and complementary relationships
    const skillCategories: Record<string, string[]> = {
      frontend: ["react", "vue.js", "angular", "svelte", "nextjs", "css", "html", "tailwind css"],
      backend: ["node.js", "python", "java", "go", "ruby", "rust", "graphql"],
      database: ["postgresql", "mongodb", "redis", "firebase", "dynamodb"],
      devops: ["kubernetes", "docker", "aws", "gcp", "azure", "jenkins"],
      design: ["figma", "design systems", "ui/ux", "framer"],
      data: ["machine learning", "tensorflow", "data analysis", "big data"],
    }

    const userCategory = Object.keys(skillCategories).find((category) =>
      userSkills.some((us) => skillCategories[category].includes(us.toLowerCase())),
    )

    const skillCategory = Object.keys(skillCategories).find((category) =>
      skillCategories[category].includes(skill.toLowerCase()),
    )

    // Different categories = complementary
    return userCategory !== skillCategory
  }

  /**
   * Calculate bonus for level alignment
   */
  private calculateLevelAlignment(userSkills: UserSkill[], candidateSkills: UserSkill[]): number {
    const levelMap = { beginner: 1, intermediate: 2, advanced: 3, expert: 4 }

    const userAvgLevel =
      userSkills.reduce((sum, s) => sum + (levelMap[s.level as keyof typeof levelMap] || 2), 0) / userSkills.length

    const candidateAvgLevel =
      candidateSkills.reduce((sum, s) => sum + (levelMap[s.level as keyof typeof levelMap] || 2), 0) /
      candidateSkills.length

    // Prefer candidates with similar or slightly higher experience
    const levelDiff = Math.abs(userAvgLevel - candidateAvgLevel)
    return Math.max(30 - levelDiff * 5, 0)
  }

  /**
   * Generate human-readable compatibility reasons
   */
  private generateCompatibilityReasons(userSkills: UserSkill[], candidateSkills: UserSkill[]): string[] {
    const reasons: string[] = []
    const userSkillNames = userSkills.map((s) => s.name.toLowerCase())
    const candidateSkillNames = candidateSkills.map((s) => s.name.toLowerCase())

    // Common skills
    const commonSkills = userSkillNames.filter((skill) => candidateSkillNames.includes(skill))
    if (commonSkills.length > 0) {
      reasons.push(`Shares expertise in ${commonSkills.slice(0, 2).join(" and ")}`)
    }

    // Complementary skills
    const complementary = candidateSkillNames.filter((skill) => !userSkillNames.includes(skill)).slice(0, 2)
    if (complementary.length > 0) {
      reasons.push(`Brings complementary skills: ${this.toTitleCase(complementary.join(" and "))}`)
    }

    // Experience boost
    const expertsInCandidateSkills = candidateSkills.filter((s) => s.level === "expert").length
    if (expertsInCandidateSkills > 2) {
      reasons.push("High expertise level across core skills")
    }

    return reasons.slice(0, 3) // Limit to 3 reasons
  }

  private toTitleCase(str: string): string {
    return str.replace(/\b\w/g, (char) => char.toUpperCase())
  }
}
