"use server"

import { createClient } from "@/lib/supabase/server"

export async function generateAIResponseServer(prompt: string, sessionId: string, userId?: string) {
  console.log("[SERVER] 🤖 AI UTILS: Starting AI response generation...")
  console.log("[SERVER] 🤖 AI UTILS: Session ID:", sessionId)
  console.log("[SERVER] 🤖 AI UTILS: User ID:", userId || "Not provided")

  try {
    // Dynamically import AI SDK to prevent client-side bundling
    const { generateText } = await import("ai")
    const { deepinfra } = await // import("@ai-sdk/deepinfra")

    if (!process.env.DEEPINFRA_API_KEY) {
      console.error("[SERVER] ❌ AI UTILS: Missing DEEPINFRA_API_KEY")
      throw new Error("Missing API key for AI service")
    }

    console.log("[SERVER] 🤖 AI UTILS: Generating response with DeepInfra...")

    const response = await generateText({
      model: deepinfra("mistralai/Mixtral-8x7B-Instruct-v0.1"),
      prompt: `You are an AI assistant helping users create project listings. 
        Respond to the following request in a helpful, professional manner:
        
        ${prompt}`,
      maxTokens: 1000,
    })

    console.log("[SERVER] ✅ AI UTILS: Response generated successfully")

    // Save conversation to database if userId is provided
    if (userId) {
      await saveConversationToDatabase(sessionId, userId, prompt, response.text)
    }

    return {
      success: true,
      text: response.text,
      sessionId,
    }
  } catch (error) {
    console.error("[SERVER] ❌ AI UTILS: Error generating response:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate AI response",
      sessionId,
    }
  }
}

async function saveConversationToDatabase(sessionId: string, userId: string, userMessage: string, aiResponse: string) {
  try {
    console.log("[SERVER] 🤖 AI UTILS: Saving conversation to database...")
    const supabase = createClient()

    // Check if conversation exists
    const { data: existingConversation, error: fetchError } = await supabase
      .from("listing_conversations")
      .select("conversation_data")
      .eq("session_id", sessionId)
      .eq("user_id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error, which is expected for new conversations
      console.error("[SERVER] ❌ AI UTILS: Error fetching conversation:", fetchError)
      throw fetchError
    }

    const newMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    }

    const newResponse = {
      role: "assistant",
      content: aiResponse,
      timestamp: new Date().toISOString(),
    }

    if (existingConversation) {
      // Update existing conversation
      const updatedConversation = [...existingConversation.conversation_data, newMessage, newResponse]

      const { error: updateError } = await supabase
        .from("listing_conversations")
        .update({
          conversation_data: updatedConversation,
          updated_at: new Date().toISOString(),
        })
        .eq("session_id", sessionId)
        .eq("user_id", userId)

      if (updateError) {
        console.error("[SERVER] ❌ AI UTILS: Error updating conversation:", updateError)
        throw updateError
      }
    } else {
      // Create new conversation
      const { error: insertError } = await supabase.from("listing_conversations").insert({
        session_id: sessionId,
        user_id: userId,
        conversation_data: [newMessage, newResponse],
        form_state: {},
      })

      if (insertError) {
        console.error("[SERVER] ❌ AI UTILS: Error inserting conversation:", insertError)
        throw insertError
      }
    }

    console.log("[SERVER] ✅ AI UTILS: Conversation saved successfully")
  } catch (error) {
    console.error("[SERVER] ❌ AI UTILS: Error saving conversation:", error)
    // Don't throw here, just log the error to prevent breaking the response flow
  }
}

export async function enhanceFieldServer(field: string, content: string) {
  console.log("[SERVER] 🤖 AI UTILS: Starting field enhancement...")
  console.log("[SERVER] 🤖 AI UTILS: Field:", field)
  console.log("[SERVER] 🤖 AI UTILS: Content length:", content.length)

  try {
    // Dynamically import AI SDK to prevent client-side bundling
    const { generateText } = await import("ai")
    const { deepinfra } = await // import("@ai-sdk/deepinfra")

    if (!process.env.DEEPINFRA_API_KEY) {
      console.error("[SERVER] ❌ AI UTILS: Missing DEEPINFRA_API_KEY")
      throw new Error("Missing API key for AI service")
    }

    console.log("[SERVER] 🤖 AI UTILS: Enhancing field with DeepInfra...")

    const response = await generateText({
      model: deepinfra("mistralai/Mixtral-8x7B-Instruct-v0.1"),
      prompt: `You are an AI assistant helping users improve their project listings.
        Enhance the following ${field} to make it more professional, detailed, and appealing:
        
        ${content}
        
        Provide only the enhanced content without any explanations or additional text.`,
      maxTokens: 1000,
    })

    console.log("[SERVER] ✅ AI UTILS: Field enhanced successfully")

    return {
      success: true,
      enhancedContent: response.text,
      field,
    }
  } catch (error) {
    console.error("[SERVER] ❌ AI UTILS: Error enhancing field:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to enhance field",
      field,
    }
  }
}
