export async function GET(request: Request) {
  console.log("🔍 AUTH SIMPLE: Starting...")

  try {
    // Get cookies from the request headers directly
    const cookieHeader = request.headers.get("cookie") || ""
    console.log("🔍 AUTH SIMPLE: Cookie header length:", cookieHeader.length)

    // Look for the Supabase auth token
    const authTokenMatch = cookieHeader.match(/sb-[^=]+-auth-token=([^;]+)/)

    if (!authTokenMatch) {
      return new Response("No auth token found in cookies", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      })
    }

    const authToken = decodeURIComponent(authTokenMatch[1])
    console.log("🔍 AUTH SIMPLE: Auth token length:", authToken.length)

    // Try to parse as JSON
    let parsedToken
    try {
      parsedToken = JSON.parse(authToken)
      console.log("🔍 AUTH SIMPLE: Token parsed successfully")
    } catch (e) {
      return new Response("Failed to parse auth token as JSON", {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      })
    }

    // Extract basic info
    const hasSession = !!parsedToken?.session
    const hasAccessToken = !!parsedToken?.session?.access_token
    const hasUser = !!parsedToken?.session?.user

    const result = `Auth Token Analysis:
- Has session: ${hasSession}
- Has access token: ${hasAccessToken}
- Has user: ${hasUser}
- Access token length: ${parsedToken?.session?.access_token?.length || 0}
- User email: ${parsedToken?.session?.user?.email || "none"}
- Expires at: ${parsedToken?.session?.expires_at || "none"}`

    console.log("🔍 AUTH SIMPLE: Analysis complete")

    return new Response(result, {
      headers: { "Content-Type": "text/plain" },
    })
  } catch (error: any) {
    console.error("🔍 AUTH SIMPLE: Error:", error)
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    })
  }
}
