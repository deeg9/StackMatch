import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "Simple test works" })
}

export async function POST() {
  return NextResponse.json({ message: "Simple POST test works" })
}
