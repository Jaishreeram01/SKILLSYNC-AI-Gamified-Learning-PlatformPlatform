"use client"

import { useEffect, useState } from "react"
import { getCurrentSession } from "@/lib/auth-service"

interface AuthUser {
  userId: string
  email: string
  name: string
}

export function useAuthContext() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = getCurrentSession()
    if (session) {
      setUser(session as AuthUser)
    }
    setLoading(false)
  }, [])

  return { user, loading }
}
