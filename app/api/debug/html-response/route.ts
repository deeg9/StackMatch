import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🔍 HTML RESPONSE: Starting...")

    // Create a simple HTML response
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Debug Page</title>
        </head>
        <body>
          <h1>Debug Information</h1>
          <p>This is a test HTML response</p>
          <p>Time: ${new Date().toISOString()}</p>
        </body>
      </html>
    `

    console.log("🔍 HTML RESPONSE: HTML created, about to return")
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error: any) {
    console.error("🔍 HTML RESPONSE: Error:", error)

    // Return error as HTML
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Error</title>
        </head>
        <body>
          <h1>Error</h1>
          <p>${error.message || "Unknown error"}</p>
        </body>
      </html>
    `,
      {
        status: 500,
        headers: {
          "Content-Type": "text/html",
        },
      },
    )
  }
}
