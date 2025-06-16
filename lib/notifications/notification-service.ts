import { createClient } from "@/lib/supabase/client-wrapper"

export type NotificationType =
  | "deal_room_message"
  | "deal_room_created"
  | "deal_room_file_uploaded"
  | "deal_room_milestone_updated"
  | "proposal_accepted"
  | "proposal_rejected"
  | "proposal_submitted"
  | "listing_updated"
  | "payment_milestone_completed"

export interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  dealRoomId?: string
  proposalId?: string
  listingId?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export class NotificationService {
  private supabase: any = null

  private async getSupabase() {
    if (!this.supabase) {
      this.supabase = await createClient()
    }
    return this.supabase
  }

  async createNotification(params: CreateNotificationParams) {
    try {
      const supabase = await this.getSupabase()
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          user_id: params.userId,
          type: params.type,
          title: params.title,
          message: params.message,
          deal_room_id: params.dealRoomId,
          proposal_id: params.proposalId,
          listing_id: params.listingId,
          action_url: params.actionUrl,
          metadata: params.metadata,
        })
        .select()
        .single()

      if (error) {
        console.error("Error creating notification:", error)
        return null
      }

      return data
    } catch (error) {
      console.error("Notification service error:", error)
      return null
    }
  }

  async createDealRoomMessageNotification(
    recipientId: string,
    senderName: string,
    dealRoomId: string,
    dealRoomName: string,
    messagePreview: string,
  ) {
    return this.createNotification({
      userId: recipientId,
      type: "deal_room_message",
      title: `New message in ${dealRoomName}`,
      message: `${senderName}: ${messagePreview.substring(0, 100)}${messagePreview.length > 100 ? "..." : ""}`,
      dealRoomId,
      actionUrl: `/deal-rooms/${dealRoomId}`,
    })
  }

  async createDealRoomCreatedNotification(
    recipientId: string,
    dealRoomName: string,
    dealRoomId: string,
    creatorName: string,
  ) {
    return this.createNotification({
      userId: recipientId,
      type: "deal_room_created",
      title: "New Deal Room Created",
      message: `${creatorName} created a new deal room: ${dealRoomName}`,
      dealRoomId,
      actionUrl: `/deal-rooms/${dealRoomId}`,
    })
  }

  async createProposalAcceptedNotification(
    sellerId: string,
    listingTitle: string,
    dealRoomId: string,
    buyerName: string,
  ) {
    return this.createNotification({
      userId: sellerId,
      type: "proposal_accepted",
      title: "Proposal Accepted! 🎉",
      message: `${buyerName} accepted your proposal for "${listingTitle}". A deal room has been created.`,
      dealRoomId,
      actionUrl: `/deal-rooms/${dealRoomId}`,
    })
  }

  async createFileUploadedNotification(
    recipientId: string,
    uploaderName: string,
    fileName: string,
    dealRoomId: string,
    dealRoomName: string,
  ) {
    return this.createNotification({
      userId: recipientId,
      type: "deal_room_file_uploaded",
      title: `New file in ${dealRoomName}`,
      message: `${uploaderName} uploaded "${fileName}"`,
      dealRoomId,
      actionUrl: `/deal-rooms/${dealRoomId}`,
    })
  }

  async createMilestoneUpdatedNotification(
    recipientId: string,
    milestoneTitle: string,
    status: string,
    dealRoomId: string,
    dealRoomName: string,
    updaterName: string,
  ) {
    return this.createNotification({
      userId: recipientId,
      type: "deal_room_milestone_updated",
      title: `Milestone Updated in ${dealRoomName}`,
      message: `${updaterName} marked "${milestoneTitle}" as ${status}`,
      dealRoomId,
      actionUrl: `/deal-rooms/${dealRoomId}`,
    })
  }
}

export const notificationService = new NotificationService()
