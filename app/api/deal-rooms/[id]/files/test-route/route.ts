import { type NextRequest, NextResponse } from "next/server"

console.log("🚨 FILES TEST ROUTE: File loaded at", new Date().toISOString())

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  console.log("🚨🚨🚨 FILES TEST ROUTE: GET FUNCTION CALLED AT", new Date().toISOString())
  console.log("🚨🚨🚨 FILES TEST ROUTE: Request URL:", request.url)
  console.log("🚨🚨🚨 FILES TEST ROUTE: Params:", params)

  return NextResponse.json({
    success: true,
    message: "Test route is working",
    dealRoomId: params.id,
    timestamp: new Date().toISOString(),
    endpoint: "/api/deal-rooms/[id]/files/test-route",
    url: request.url,
  })
}
