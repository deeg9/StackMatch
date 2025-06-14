export async function GET() {
  console.log("⚡ NO IMPORTS TEST: Starting test without any imports")

  const response = new Response(
    JSON.stringify({
      success: true,
      message: "No imports test working",
      timestamp: new Date().toISOString(),
      note: "This endpoint uses no imports at all",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  )

  console.log("⚡ NO IMPORTS TEST: Response created")
  return response
}
