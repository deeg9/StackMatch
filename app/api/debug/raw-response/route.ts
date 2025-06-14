export async function GET(request: Request) {
  console.log("🔍 RAW RESPONSE: Starting...")

  try {
    console.log("🔍 RAW RESPONSE: Creating basic Response...")

    // Use the basic Web API Response instead of NextResponse
    const response = new Response("Hello from raw response!", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    })

    console.log("🔍 RAW RESPONSE: Response created successfully")
    return response
  } catch (error: any) {
    console.error("🔍 RAW RESPONSE: Error:", error)
    return new Response(`Error: ${error.message}`, { status: 500 })
  }
}
