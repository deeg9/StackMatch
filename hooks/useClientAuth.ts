"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

export function useClientAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  
  console.log("🔐 AUTH HOOK DEBUG: useClientAuth called, current user:", !!user, "loading:", loading)

  useEffect(() => {
    console.log("🔐 AUTH HOOK DEBUG: useEffect triggered, getting user session")
    
    const getUser = async () => {
      try {
        console.log("🔐 AUTH HOOK DEBUG: Calling supabase.auth.getSession()")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("🔐 AUTH HOOK DEBUG: Auth session error:", error)
          setUser(null)
        } else {
          console.log("🔐 AUTH HOOK DEBUG: Session retrieved, user:", !!session?.user)
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("🔐 AUTH HOOK DEBUG: Auth getSession error:", error)
        setUser(null)
      } finally {
        console.log("🔐 AUTH HOOK DEBUG: Setting loading to false")
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }
}
