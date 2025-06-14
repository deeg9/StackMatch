import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 NEXTJS COOKIES TEST: Starting...")

    // Try to import cookies function
    console.log("🔍 NEXTJS COOKIES TEST: Importing cookies...")
    const { cookies } = await import("next/headers")
    console.log("🔍 NEXTJS COOKIES TEST: Cookies imported successfully")

    // Try to call cookies function
    console.log("🔍 NEXTJS COOKIES TEST: Calling cookies()...")
    const cookieStore = cookies()
    console.log("🔍 NEXTJS COOKIES TEST: Cookies() called successfully")

    // Try to get all cookies
    console.log("🔍 NEXTJS COOKIES TEST: Getting all cookies...")
    const allCookies = cookieStore.getAll()
    console.log("🔍 NEXTJS COOKIES TEST: Got all cookies:", allCookies.length)

    return NextResponse.json({
      success: true,
      totalCookies: allCookies.length,
      cookieNames: allCookies.map((c) => c.name),
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("🔍 NEXTJS COOKIES TEST: Error:", error)
    return NextResponse.json(
      {
        error: error.message || "Unknown error",
        errorType: error.constructor.name,
        errorStack: error.stack,
        success: false,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
