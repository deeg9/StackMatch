import { createClient } from "@/lib/supabase/client-wrapper"
import { ClosureReasonCategory, type ClosureOutcomeType } from "@/types/deal-room-types"

// Types for notification templates
type NotificationType =
  | "CLOSURE_REQUESTED"
  | "CLOSURE_CONFIRMED"
  | "CLOSURE_CANCELLED"
  | "CLOSURE_FEEDBACK_SUBMITTED"
  | "CLOSURE_COOLING_PERIOD_ENDING"

interface NotificationData {
  dealRoomId: string
  dealRoomName: string
  initiatorId?: string
  initiatorName?: string
  initiatorType?: "BUYER" | "SELLER"
  reasonCategory?: ClosureReasonCategory
  outcomeType?: ClosureOutcomeType
  coolingPeriodEndsAt?: string
  feedbackRating?: number
}

// Function to create a notification
async function createNotification(userId: string, type: NotificationType, data: NotificationData) {
  try {
    const supabase = await createClient()

    // Generate notification content based on type
    const { title, message } = generateNotificationContent(type, data)

    // Insert notification into the database
    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      type,
      title,
      message,
      data: JSON.stringify(data),
      is_read: false,
      created_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error creating notification:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in createNotification:", error)
    return false
  }
}

// Function to generate notification content
function generateNotificationContent(
  type: NotificationType,
  data: NotificationData,
): { title: string; message: string } {
  const { dealRoomName, initiatorName, initiatorType, reasonCategory, outcomeType } = data

  switch (type) {
    case "CLOSURE_REQUESTED":
      return {
        title: "Deal Room Closure Requested",
        message: `${initiatorName} (${initiatorType}) has requested to close deal room "${dealRoomName}" due to ${formatReasonCategory(reasonCategory)}.`,
      }

    case "CLOSURE_CONFIRMED":
      return {
        title: "Deal Room Closed",
        message: `Deal room "${dealRoomName}" has been ${outcomeType === "SUCCESSFUL" ? "successfully closed" : "closed unsuccessfully"}.`,
      }

    case "CLOSURE_CANCELLED":
      return {
        title: "Closure Request Cancelled",
        message: `${initiatorName} has cancelled the request to close deal room "${dealRoomName}".`,
      }

    case "CLOSURE_FEEDBACK_SUBMITTED":
      return {
        title: "Feedback Submitted",
        message: `${initiatorName} has submitted feedback for deal room "${dealRoomName}".`,
      }

    case "CLOSURE_COOLING_PERIOD_ENDING":
      return {
        title: "Cooling Period Ending Soon",
        message: `The cooling period for deal room "${dealRoomName}" is ending soon. Please confirm or cancel the closure request.`,
      }

    default:
      return {
        title: "Deal Room Update",
        message: `There has been an update to deal room "${dealRoomName}".`,
      }
  }
}

// Helper function to format reason category for display
function formatReasonCategory(category?: ClosureReasonCategory): string {
  if (!category) return "unspecified reasons"

  switch (category) {
    case ClosureReasonCategory.PROJECT_COMPLETED:
      return "project completion"
    case ClosureReasonCategory.PROJECT_CANCELLED:
      return "project cancellation"
    case ClosureReasonCategory.MOVED_ELSEWHERE:
      return "moving the project elsewhere"
    case ClosureReasonCategory.NO_LONGER_NEEDED:
      return "the project no longer being needed"
    case ClosureReasonCategory.DISPUTE:
      return "a dispute"
    case ClosureReasonCategory.OTHER:
      return "other reasons"
    default:
      return "unspecified reasons"
  }
}

// Function to notify all participants about a closure request
export async function notifyClosureRequested(
  dealRoomId: string,
  dealRoomName: string,
  initiatorId: string,
  initiatorName: string,
  initiatorType: "BUYER" | "SELLER",
  reasonCategory: ClosureReasonCategory,
  participantIds: string[],
) {
  try {
    const notificationData: NotificationData = {
      dealRoomId,
      dealRoomName,
      initiatorId,
      initiatorName,
      initiatorType,
      reasonCategory,
    }

    // Notify all participants except the initiator
    const otherParticipantIds = participantIds.filter((id: any) => id !== initiatorId)

    const promises = otherParticipantIds.map((userId: any) =>
      createNotification(userId, "CLOSURE_REQUESTED", notificationData),
    )

    await Promise.all(promises)
    return true
  } catch (error) {
    console.error("Error in notifyClosureRequested:", error)
    return false
  }
}

// Function to notify all participants about a closure confirmation
export async function notifyClosureConfirmed(
  dealRoomId: string,
  dealRoomName: string,
  outcomeType: ClosureOutcomeType,
  participantIds: string[],
) {
  try {
    const notificationData: NotificationData = {
      dealRoomId,
      dealRoomName,
      outcomeType,
    }

    const promises = participantIds.map((userId: any) => createNotification(userId, "CLOSURE_CONFIRMED", notificationData))

    await Promise.all(promises)
    return true
  } catch (error) {
    console.error("Error in notifyClosureConfirmed:", error)
    return false
  }
}

// Function to notify all participants about a closure cancellation
export async function notifyClosureCancelled(
  dealRoomId: string,
  dealRoomName: string,
  initiatorId: string,
  initiatorName: string,
  participantIds: string[],
) {
  try {
    const notificationData: NotificationData = {
      dealRoomId,
      dealRoomName,
      initiatorId,
      initiatorName,
    }

    // Notify all participants except the initiator
    const otherParticipantIds = participantIds.filter((id: any) => id !== initiatorId)

    const promises = otherParticipantIds.map((userId: any) =>
      createNotification(userId, "CLOSURE_CANCELLED", notificationData),
    )

    await Promise.all(promises)
    return true
  } catch (error) {
    console.error("Error in notifyClosureCancelled:", error)
    return false
  }
}

// Function to notify about feedback submission
export async function notifyFeedbackSubmitted(
  dealRoomId: string,
  dealRoomName: string,
  submitterId: string,
  submitterName: string,
  recipientId: string,
  rating: number,
) {
  try {
    const notificationData: NotificationData = {
      dealRoomId,
      dealRoomName,
      initiatorId: submitterId,
      initiatorName: submitterName,
      feedbackRating: rating,
    }

    await createNotification(recipientId, "CLOSURE_FEEDBACK_SUBMITTED", notificationData)
    return true
  } catch (error) {
    console.error("Error in notifyFeedbackSubmitted:", error)
    return false
  }
}

// Function to notify about cooling period ending soon
export async function notifyCoolingPeriodEnding(
  dealRoomId: string,
  dealRoomName: string,
  initiatorId: string,
  coolingPeriodEndsAt: string,
) {
  try {
    const notificationData: NotificationData = {
      dealRoomId,
      dealRoomName,
      coolingPeriodEndsAt,
    }

    await createNotification(initiatorId, "CLOSURE_COOLING_PERIOD_ENDING", notificationData)
    return true
  } catch (error) {
    console.error("Error in notifyCoolingPeriodEnding:", error)
    return false
  }
}
