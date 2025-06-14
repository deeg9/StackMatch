import { notificationService } from "./notification-service"
import type { ProposalRequest, ProposalResponse } from "@/types/proposal-request-types"

export class ProposalNotificationService {
  static async notifySellerOfNewRequest(request: ProposalRequest, buyerName: string) {
    return notificationService.createNotification({
      userId: request.seller_id,
      type: "proposal_request_received",
      title: "New Proposal Request",
      message: `${buyerName} sent you a proposal request: "${request.title}"`,
      actionUrl: `/proposal-requests/${request.id}`,
      metadata: {
        request_id: request.id,
        buyer_id: request.buyer_id,
        urgency_level: request.urgency_level,
      },
    })
  }

  static async notifyBuyerOfResponse(request: ProposalRequest, response: ProposalResponse, sellerName: string) {
    return notificationService.createNotification({
      userId: request.buyer_id,
      type: "proposal_response_received",
      title: "New Proposal Response",
      message: `${sellerName} responded to your request: "${request.title}" with a quote of $${response.price.toLocaleString()}`,
      actionUrl: `/proposal-requests/${request.id}`,
      metadata: {
        request_id: request.id,
        response_id: response.id,
        price: response.price,
        timeline_days: response.timeline_days,
      },
    })
  }

  static async notifySellerOfAcceptance(
    request: ProposalRequest,
    response: ProposalResponse,
    buyerName: string,
    dealRoomId?: string,
  ) {
    return notificationService.createNotification({
      userId: request.seller_id,
      type: "proposal_accepted",
      title: "Proposal Accepted! 🎉",
      message: `${buyerName} accepted your proposal for "${request.title}". ${dealRoomId ? "A deal room has been created." : ""}`,
      actionUrl: dealRoomId ? `/deal-rooms/${dealRoomId}` : `/proposal-requests/${request.id}`,
      dealRoomId,
      metadata: {
        request_id: request.id,
        response_id: response.id,
        deal_room_id: dealRoomId,
      },
    })
  }

  static async notifyOfDealRoomCreation(
    recipientId: string,
    dealRoomName: string,
    dealRoomId: string,
    creatorName: string,
    requestTitle: string,
  ) {
    return notificationService.createNotification({
      userId: recipientId,
      type: "deal_room_created_from_proposal",
      title: "Deal Room Created",
      message: `${creatorName} created a deal room for "${requestTitle}". Your collaboration space is ready!`,
      actionUrl: `/deal-rooms/${dealRoomId}`,
      dealRoomId,
      metadata: {
        deal_room_id: dealRoomId,
        project_title: requestTitle,
      },
    })
  }

  static async notifyOfRequestExpiration(request: ProposalRequest, recipientId: string) {
    return notificationService.createNotification({
      userId: recipientId,
      type: "proposal_request_expired",
      title: "Proposal Request Expired",
      message: `Your proposal request "${request.title}" has expired without responses.`,
      actionUrl: `/proposal-requests/${request.id}`,
      metadata: {
        request_id: request.id,
      },
    })
  }

  static async notifyOfResponseExpiration(request: ProposalRequest, response: ProposalResponse, recipientId: string) {
    return notificationService.createNotification({
      userId: recipientId,
      type: "proposal_response_expired",
      title: "Proposal Response Expired",
      message: `Your response to "${request.title}" has expired. The quote is no longer valid.`,
      actionUrl: `/proposal-requests/${request.id}`,
      metadata: {
        request_id: request.id,
        response_id: response.id,
      },
    })
  }
}
