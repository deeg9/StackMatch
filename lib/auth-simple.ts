import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function getSimpleCurrentUser() {
  try {
    console.log("🔍 AUTH SIMPLE: Starting getSimpleCurrentUser...")

    const cookieStore = await cookies()

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("🔍 AUTH SIMPLE: Missing Supabase environment variables")
      return null
    }

    const supabase = createServerClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            console.error("🔍 AUTH SIMPLE: Error setting cookie:", error)
          }
        },
        remove: (name, options) => {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            console.error("🔍 AUTH SIMPLE: Error removing cookie:", error)
          }
        },
      },
    })

    console.log("🔍 AUTH SIMPLE: Supabase client created")

    const { data, error } = await supabase.auth.getUser()

    if (error || !data?.user) {
      console.log("🔍 AUTH SIMPLE: No authenticated user found:", error?.message)
      return null
    }

    console.log("🔍 AUTH SIMPLE: User found:", data.user.id)

    // Get basic profile info
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, user_type, full_name, company_name")
      .eq("id", data.user.id)
      .single()

    if (profileError) {
      console.error("🔍 AUTH SIMPLE: Error fetching profile:", profileError.message)
      // Return minimal user info even if profile fetch fails
      return {
        id: data.user.id,
        email: data.user.email,
        user_type: "UNKNOWN",
      }
    }

    console.log("🔍 AUTH SIMPLE: Profile found:", profile.user_type)

    return {
      id: profile.id,
      email: profile.email,
      user_type: profile.user_type,
      full_name: profile.full_name,
      company_name: profile.company_name,
    }
  } catch (error) {
    console.error("🔍 AUTH SIMPLE: Unexpected error:", error)
    return null
  }
}
