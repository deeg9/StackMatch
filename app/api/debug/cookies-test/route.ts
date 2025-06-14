import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 COOKIES TEST: Starting...")

    // Try to get cookies from the request headers
    const cookieHeader = request.headers.get("cookie")
    console.log("🔍 COOKIES TEST: Cookie header exists:", !!cookieHeader)
    console.log("🔍 COOKIES TEST: Cookie header length:", cookieHeader?.length || 0)

    if (cookieHeader) {
      // Parse cookies manually
      const cookies = cookieHeader.split(";").map((cookie) => {
        const [name, ...valueParts] = cookie.trim().split("=")
        return {
          name: name.trim(),
          hasValue: valueParts.length > 0,
          valueLength: valueParts.join("=").length,
        }
      })

      console.log("🔍 COOKIES TEST: Parsed cookies:", cookies.length)

      const supabaseCookies = cookies.filter((c) => c.name.includes("supabase") || c.name.includes("sb-"))

      console.log("🔍 COOKIES TEST: Supabase cookies found:", supabaseCookies.length)

      return NextResponse.json({
        success: true,
        hasCookieHeader: !!cookieHeader,
        cookieHeaderLength: cookieHeader?.length || 0,
        totalCookies: cookies.length,
        supabaseCookies: supabaseCookies,
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json({
        success: true,
        hasCookieHeader: false,
        message: "No cookie header found",
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error: any) {
    console.error("🔍 COOKIES TEST: Error:", error)
    return NextResponse.json(
      {
        error: getErrorMessage(error) || "Unknown error",
        errorType: error.constructor.name,
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
