import { streamText } from "ai"
import { deepinfra } from "@ai-sdk/deepinfra"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(req: Request) {
  try {
    const { messages, context, conversationId, userId } = await req.json()

    // Build system prompt based on context
    const systemPrompt = `You are StackMatch Copilot, an AI assistant for the StackMatch platform - a marketplace connecting businesses with software development providers.

PLATFORM CONTEXT:
- StackMatch helps businesses find and hire software development teams
- Providers can create profiles, showcase portfolios, and bid on projects
- Businesses can post project listings and review provider proposals

USER CONTEXT:
${context?.userType ? `- User Type: ${context.userType}` : ""}
${context?.currentPage ? `- Current Page: ${context.currentPage}` : ""}
${context?.projectId ? `- Viewing Project: ${context.projectId}` : ""}
${context?.bidId ? `- Viewing Bid: ${context.bidId}` : ""}

CAPABILITIES:
- Answer questions about platform features and navigation
- Explain form fields and requirements
- Provide guidance on creating effective project listings
- Help with writing compelling proposals
- Suggest best practices for businesses and providers
- Clarify platform policies and processes

TONE: Friendly, helpful, and professional. Keep responses concise but informative.

IMPORTANT: 
- If asked about specific providers or businesses, suggest using the platform's search and filter features
- For technical issues, direct users to contact support
- Always encourage users to use platform features rather than external solutions
- If you don't know something specific about the platform, be honest and suggest contacting support`

    const result = await streamText({
      model: deepinfra("meta-llama/Meta-Llama-3-8B-Instruct"),
      system: systemPrompt,
      messages,
      maxTokens: 500,
      temperature: 0.7,
      onFinish: async (result) => {
        // Save messages to database after completion
        if (conversationId && userId) {
          try {
            // Save user message
            const userMessage = messages[messages.length - 1]
            if (userMessage) {
              await supabase.from("chat_messages").insert({
                conversation_id: conversationId,
                role: userMessage.role,
                content: userMessage.content,
                metadata: { context },
              })
            }

            // Save assistant response
            await supabase.from("chat_messages").insert({
              conversation_id: conversationId,
              role: "assistant",
              content: result.text,
              metadata: {
                model: "meta-llama/Meta-Llama-3-8B-Instruct",
                tokens: result.usage?.totalTokens,
                context,
              },
            })

            // Update conversation title if it's the first exchange
            if (messages.length === 1) {
              const title = userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? "..." : "")
              await supabase.from("chat_conversations").update({ title }).eq("id", conversationId)
            }
          } catch (dbError) {
            console.error("Error saving messages to database:", dbError)
          }
        }
      },
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
