"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { saveSeller, removeSavedSeller, loadSavedSellers } from "@/store/slices/savedSellersSlice"
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch"
import { toast } from "sonner"

interface SaveSellerButtonProps {
  seller: {
    id: string
    name: string
    company: string
    location: string
    rating: number
    specialties: string[]
    experience: string
    hourlyRate: string
    completedProjects: number
    responseTime: string
    avatar?: string
  }
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function SaveSellerButton({ seller, variant = "outline", size = "default", className }: SaveSellerButtonProps) {
  const dispatch = useAppDispatch()
  const { savedSellers = [], isLoading = false } = useAppSelector(
    (state) => state.savedSellers || { savedSellers: [], isLoading: false },
  )
  const [isSaved, setIsSaved] = useState(false)

  // Check if seller is saved
  useEffect(() => {
    if (savedSellers) {
      const isSellerSaved = savedSellers.some((saved) => saved.id === seller.id)
      setIsSaved(isSellerSaved)
    }
  }, [savedSellers, seller.id])

  // Load saved sellers on component mount
  useEffect(() => {
    dispatch(loadSavedSellers())
  }, [dispatch])

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await dispatch(removeSavedSeller(seller.id)).unwrap()
        toast.success("Seller removed from saved")
      } else {
        await dispatch(saveSeller(seller)).unwrap()
        toast.success("Seller saved successfully")
      }
    } catch (error) {
      toast.error(isSaved ? "Failed to remove seller" : "Failed to save seller")
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSaveToggle}
      disabled={isLoading}
      className={`${className} ${isSaved ? "text-red-400 border-red-400 hover:bg-red-400/10" : "border-slate-600 text-white hover:bg-slate-700"}`}
    >
      <Heart className={`w-4 h-4 mr-2 ${isSaved ? "fill-current" : ""}`} />
      {isSaved ? "Saved" : "Save"}
    </Button>
  )
}
