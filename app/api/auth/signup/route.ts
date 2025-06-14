import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const formData = await request.json()
    const { email, password, fullName } = formData

    console.log("API: Processing signup request for email:", email)

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (authError) {
      console.error("API: Auth signup error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    console.log("API: Auth signup successful, creating profile")

    // Create a profile record in the profiles table
    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          full_name: fullName,
          email: email,
        },
      ])

      if (profileError) {
        console.error("API: Profile creation error:", profileError)
        return NextResponse.json({ error: "Account created but profile setup failed" }, { status: 500 })
      }
    }

    console.log("API: Signup process completed successfully")

    return NextResponse.json({ message: "Signup successful" }, { status: 200 })
  } catch (error) {
    console.error("API: Unexpected error during signup:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
