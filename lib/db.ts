// This allows the app to work fully without needing external Firebase setup
// In production, replace with actual Firebase or backend API calls

interface User {
  id: string
  name: string
  email: string
  password: string
  bio?: string
  location?: string
  website?: string
  avatar?: string
  skills: Array<{
    id: string
    name: string
    category: string
    proficiency: number
    endorsements: number
  }>
  createdAt: Date
  level: number
  xp: number
  streak: number
}

interface UserSession {
  userId: string
  email: string
  name: string
  createdAt: Date
}

// In-memory database (persists to localStorage)
class LocalDatabase {
  private users: Map<string, User> = new Map()
  private sessions: Map<string, UserSession> = new Map()

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      const usersData = localStorage.getItem("skillsync_users")
      if (usersData) {
        try {
          const users = JSON.parse(usersData)
          users.forEach((user: User) => {
            this.users.set(user.id, user)
          })
        } catch (e) {
          console.error("[v0] Error loading users from storage:", e)
        }
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      const usersArray = Array.from(this.users.values())
      localStorage.setItem("skillsync_users", JSON.stringify(usersArray))
    }
  }

  createUser(email: string, password: string, name: string): User {
    const id = "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)

    const user: User = {
      id,
      name,
      email,
      password, // In production, never store plain text passwords
      skills: [],
      createdAt: new Date(),
      level: 1,
      xp: 0,
      streak: 0,
    }

    this.users.set(id, user)
    this.saveToStorage()
    return user
  }

  getUserByEmail(email: string): User | undefined {
    return Array.from(this.users.values()).find((user) => user.email === email)
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id)
  }

  updateUser(id: string, updates: Partial<User>): User {
    const user = this.users.get(id)
    if (!user) throw new Error("User not found")

    const updated = { ...user, ...updates, id: user.id } // Prevent ID changes
    this.users.set(id, updated)
    this.saveToStorage()
    return updated
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values())
  }

  createSession(userId: string): UserSession {
    const user = this.users.get(userId)
    if (!user) throw new Error("User not found")

    const session: UserSession = {
      userId,
      email: user.email,
      name: user.name,
      createdAt: new Date(),
    }

    localStorage.setItem("skillsync_session", JSON.stringify(session))
    return session
  }

  getSession(): UserSession | null {
    if (typeof window !== "undefined") {
      const session = localStorage.getItem("skillsync_session")
      return session ? JSON.parse(session) : null
    }
    return null
  }

  clearSession() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("skillsync_session")
    }
  }
}

export const db = new LocalDatabase()
