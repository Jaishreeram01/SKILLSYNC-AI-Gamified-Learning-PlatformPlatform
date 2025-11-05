// This ensures the app works immediately without external configuration

"use client"

import { db } from "./db"

export interface UserProfile {
  id: string
  name: string
  email: string
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

// Sign up with email and password
export async function signUp(email: string, password: string, name: string) {
  try {
    // Validate inputs
    if (!email || !password || !name) {
      throw new Error("All fields are required")
    }

    // Check if user already exists
    const existingUser = db.getUserByEmail(email)
    if (existingUser) {
      throw new Error("Email already in use")
    }

    // Create user
    const user = db.createUser(email, password, name)
    console.log("[v0] User created successfully:", user.id)

    // Create session
    db.createSession(user.id)
    console.log("[v0] Session created for user:", user.id)

    return user
  } catch (error) {
    console.error("[v0] Signup error:", error)
    throw error
  }
}

// Sign in with email and password
export async function signIn(email: string, password: string) {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    // Find user
    const user = db.getUserByEmail(email)
    if (!user) {
      throw new Error("User not found")
    }

    // Verify password
    if (user.password !== password) {
      throw new Error("Invalid password")
    }

    // Create session
    db.createSession(user.id)
    console.log("[v0] User signed in successfully:", user.id)

    return user
  } catch (error) {
    console.error("[v0] Login error:", error)
    throw error
  }
}

// Sign out
export async function signOut() {
  try {
    db.clearSession()
    console.log("[v0] User signed out")
  } catch (error) {
    console.error("[v0] Sign out error:", error)
    throw error
  }
}

// Get current session
export function getCurrentSession() {
  return db.getSession()
}

// Get user profile
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const user = db.getUserById(uid)
    return user || null
  } catch (error) {
    console.error("[v0] Error getting user profile:", error)
    throw error
  }
}

// Update user profile
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>) {
  try {
    const user = db.updateUser(uid, updates)
    console.log("[v0] User profile updated")
    return user
  } catch (error) {
    console.error("[v0] Error updating profile:", error)
    throw error
  }
}

// Get all users (for matching)
export async function getAllUsers(): Promise<UserProfile[]> {
  try {
    return db.getAllUsers()
  } catch (error) {
    console.error("[v0] Error getting users:", error)
    throw error
  }
}
