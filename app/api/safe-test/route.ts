import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
export async function GET() {
  console.log("🟢 SAFE TEST: Starting safe test")

  try {
    const data = {
      success: true,
      message: "Safe test working",
      timestamp: new Date().toISOString(),
      environment: "v0-runtime",
    }

    console.log("🟢 SAFE TEST: Data prepared:", JSON.stringify(data))

    // Try different response methods
    const response = new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("🟢 SAFE TEST: Response created successfully")
    return response
  } catch (error: any) {
    console.error("🟢 SAFE TEST: Error occurred:", error)

    return new Response(
      JSON.stringify({
        success: false,
        error: getErrorMessage(error),
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}
