import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { getAuthenticatedClient } from "@/lib/auth/api-utils"
import type { NextRequest } from "next/server"

// Search for users by email or name
export async function GET(request: NextRequest) {
  try {
    const { supabase, user, error: authError, status } = await getAuthenticatedClient(request)

    if (authError || !supabase || !user) {
      return NextResponse.json({ error: "Authentication failed" }, { status: status || 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query || query.length < 2) {
      return NextResponse.json({ error: "Query must be at least 2 characters" }, { status: 400 })
    }

    console.log("[SERVER] 🔍 USER SEARCH API: Searching for:", query)

    // Search users by email or full name
    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, avatar_url")
      .or(`email.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10)

    if (error) {
      console.error("Error searching users:", error)
      return NextResponse.json({ error: getErrorMessage(error) }, { status: 500 })
    }

    // Filter out the current user from results
    const filteredUsers = users?.filter((u) => u.id !== user.id) || []

    return NextResponse.json({ users: filteredUsers })
  } catch (error: any) {
    console.error("User search endpoint error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
