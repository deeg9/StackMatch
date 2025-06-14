"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from "@supabase/supabase-js"

export function useClientAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      console.log("useClientAuth: Fetching user session...")
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth session error:", error)
          setUser(null)
        } else {
          console.log("Session data:", session ? "Session exists" : "No session")
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("Auth getSession error:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    console.log("useClientAuth: Setting up auth state change listener")
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      console.log("useClientAuth: Cleaning up auth state change listener")
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signIn = async (email: string, password: string) => {
    console.log("useClientAuth: Attempting sign in...")
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        throw error
      }

      console.log("Sign in successful")
      return data
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  const signOut = async () => {
    console.log("useClientAuth: Attempting sign out...")
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Sign out error:", error)
        throw error
      }
      console.log("Sign out successful")
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
  }
}
