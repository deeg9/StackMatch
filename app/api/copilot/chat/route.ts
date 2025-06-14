import { NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { generateText } from "ai"
import { deepinfra } from "@ai-sdk/deepinfra"

// IMPORTANT: Set the DEEPINFRA_API_KEY environment variable

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json()

    if (!process.env.DEEPINFRA_API_KEY) {
      return NextResponse.json({ error: "DeepInfra API key not configured" }, { status: 500 })
    }

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Construct a prompt for the AI
    // You can customize this prompt to give StackJack more personality or context
    const systemPrompt = `You are StackJack, a friendly and helpful AI copilot for the StackMatch platform. StackMatch connects buyers with software service sellers. 
    Your role is to assist users (both buyers and sellers) by answering their questions about using the platform, finding information, or general queries related to software projects and services.
    Be concise and helpful. Current platform context: The user is on the StackMatch website.`

    const messagesForAI = [
      { role: "system", content: systemPrompt },
      ...(history || []).map((msg: { sender: string; text: string }) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      })),
      { role: "user", content: message },
    ]

    const { text } = await generateText({
      model: deepinfra("meta-llama/Meta-Llama-3-8B-Instruct"), // You can choose other models
      messages: messagesForAI,
      maxTokens: 500,
      temperature: 0.7, // Adjust for creativity vs. factuality
    })

    return NextResponse.json({ reply: text })
  } catch (error) {
    console.error("Error in /api/copilot/chat:", error)
    let errorMessage = "Failed to process your request."
    if (error instanceof Error) {
      errorMessage = getErrorMessage(error)
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
