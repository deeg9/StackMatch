"use client"

import { useState, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch"
import {
  requestDealRoomClosure,
  confirmDealRoomClosure,
  cancelDealRoomClosure,
  submitDealRoomFeedback,
} from "@/store/slices/dealRoomsSlice"
import type { ClosureReasonCategory, ClosureOutcomeType } from "@/types/deal-room-types"

export function useDealRoomClosure(dealRoomId: string) {
  const dispatch = useAppDispatch()
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false)

  const dealRoom = useAppSelector((state) => state.dealRooms.dealRooms[dealRoomId])
  const closure = useAppSelector((state) => state.dealRooms.closures[dealRoomId])
  const loading = useAppSelector((state) => state.dealRooms.closureLoading)
  const error = useAppSelector((state) => state.dealRooms.closureError)

  const openRequestModal = useCallback(() => {
    setIsRequestModalOpen(true)
  }, [])

  const closeRequestModal = useCallback(() => {
    setIsRequestModalOpen(false)
  }, [])

  const openConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(true)
  }, [])

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false)
  }, [])

  const openFeedbackModal = useCallback(() => {
    setIsFeedbackModalOpen(true)
  }, [])

  const closeFeedbackModal = useCallback(() => {
    setIsFeedbackModalOpen(false)
  }, [])

  const requestClosure = useCallback(
    async (reasonCategory: ClosureReasonCategory, reasonDescription?: string) => {
      const result = await dispatch(
        requestDealRoomClosure({
          dealRoomId,
          reasonCategory,
          reasonDescription,
        }),
      )

      if (requestDealRoomClosure.fulfilled.match(result)) {
        closeRequestModal()
        return true
      }

      return false
    },
    [dealRoomId, dispatch, closeRequestModal],
  )

  const confirmClosure = useCallback(
    async (outcomeType: ClosureOutcomeType) => {
      const result = await dispatch(
        confirmDealRoomClosure({
          dealRoomId,
          outcomeType,
        }),
      )

      if (confirmDealRoomClosure.fulfilled.match(result)) {
        closeConfirmModal()
        return true
      }

      return false
    },
    [dealRoomId, dispatch, closeConfirmModal],
  )

  const cancelClosure = useCallback(async () => {
    const result = await dispatch(
      cancelDealRoomClosure({
        dealRoomId,
      }),
    )

    if (cancelDealRoomClosure.fulfilled.match(result)) {
      return true
    }

    return false
  }, [dealRoomId, dispatch])

  const submitFeedback = useCallback(
    async (rating: number, comment?: string) => {
      const result = await dispatch(
        submitDealRoomFeedback({
          dealRoomId,
          rating,
          comment,
        }),
      )

      if (submitDealRoomFeedback.fulfilled.match(result)) {
        closeFeedbackModal()
        return true
      }

      return false
    },
    [dealRoomId, dispatch, closeFeedbackModal],
  )

  return {
    dealRoom,
    closure,
    loading,
    error,
    isRequestModalOpen,
    isConfirmModalOpen,
    isFeedbackModalOpen,
    openRequestModal,
    closeRequestModal,
    openConfirmModal,
    closeConfirmModal,
    openFeedbackModal,
    closeFeedbackModal,
    requestClosure,
    confirmClosure,
    cancelClosure,
    submitFeedback,
  }
}
