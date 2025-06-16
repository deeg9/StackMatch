import { type NextRequest, NextResponse } from "next/server"
import { getErrorMessage, getErrorStack } from "@/lib/utils/error-handler"
import { createClient } from "@/lib/supabase/client-wrapper"
import { getAuthUser } from "@/lib/auth/api-utils"
import { ListingIntegrationService } from "@/lib/ai-listing/integration-service"

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { sessionId, isDraft = true } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Get conversation data
    const { data: conversation, error } = await supabase
      .from("listing_conversations")
      .select("*")
      .eq("session_id", sessionId)
      .eq("user_id", user.id)
      .single()

    if (error || !conversation) {
      return NextResponse.json({ error: error?.message || "Conversation not found" }, { status: error ? 500 : 404 })
    }

    // Convert conversation to listing form
    const session = {
      id: conversation.id,
      sessionId: conversation.session_id,
      userId: conversation.user_id,
      messages: conversation.conversation_data,
      formState: conversation.form_state,
      createdAt: new Date(conversation.created_at),
      updatedAt: new Date(conversation.updated_at),
    }

    const { listingData, validationErrors, completionPercentage } =
      ListingIntegrationService.convertToListingForm(session)

    // Check if listing is complete enough to save
    const minCompletionRequired = isDraft ? 30 : 70
    if (completionPercentage < minCompletionRequired) {
      return NextResponse.json(
        {
          success: false,
          error: `Listing is only ${completionPercentage}% complete. ${isDraft ? "Drafts" : "Published listings"} require at least ${minCompletionRequired}% completion.`,
          validationErrors,
          completionPercentage,
        },
        { status: 400 },
      )
    }

    // Save to database
    const result = await ListingIntegrationService.saveToDatabase(user.id, listingData, isDraft, conversation.id)

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          validationErrors,
          completionPercentage,
        },
        { status: 500 },
      )
    }

    // Track AI usage metrics
    await ListingIntegrationService.trackAIUsage(user.id, sessionId, {
      messagesCount: conversation.conversation_data.length,
      tokensUsed: estimateTokensUsed(conversation.conversation_data),
      fieldsPopulated: countPopulatedFields(conversation.form_state),
      completionPercentage,
      durationSeconds: Math.round(
        (new Date(conversation.updated_at).getTime() - new Date(conversation.created_at).getTime()) / 1000,
      ),
    })

    return NextResponse.json({
      success: true,
      listingId: result.listingId,
      completionPercentage,
      validationErrors: validationErrors.length > 0 ? validationErrors : undefined,
    })
  } catch (error) {
    console.error("Error in integration test:", error)
    return NextResponse.json({ error: error instanceof Error ? getErrorMessage(error) : "Unknown error" }, { status: 500 })
  }
}

// Helper functions
function estimateTokensUsed(messages: any[]): number {
  // Rough estimate: 1 token ≈ 4 characters
  return messages.reduce((total: any, msg: any) => {
    return total + (msg.content?.length || 0) / 4
  }, 0)
}

function countPopulatedFields(formState: any): number {
  return Object.values(formState || {}).filter((value: any) => {
    if (Array.isArray(value)) return value.length > 0
    return value !== null && value !== undefined && value !== ""
  }).length
}
