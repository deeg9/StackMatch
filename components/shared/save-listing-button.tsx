"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { saveListing, removeSavedListing, loadSavedListings } from "@/store/slices/savedListingsSlice"
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch"
import { toast } from "sonner"

interface SaveListingButtonProps {
  listing: {
    id: string
    companyName: string
    title: string
    budget: string
    deadline: string
    location: string
    tags: string[]
  }
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function SaveListingButton({
  listing,
  variant = "outline",
  size = "default",
  className,
}: SaveListingButtonProps) {
  const dispatch = useAppDispatch()
  const { savedListings, isLoading } = useAppSelector((state) => state.savedListings)
  const [isSaved, setIsSaved] = useState(false)

  // Check if listing is saved
  useEffect(() => {
    const isListingSaved = savedListings.some((saved) => saved.id === listing.id)
    setIsSaved(isListingSaved)
  }, [savedListings, listing.id])

  // Load saved listings on component mount
  useEffect(() => {
    dispatch(loadSavedListings())
  }, [dispatch])

  const handleSaveToggle = async () => {
    try {
      if (isSaved) {
        await dispatch(removeSavedListing(listing.id)).unwrap()
        toast.success("Listing removed from saved")
      } else {
        await dispatch(saveListing(listing)).unwrap()
        toast.success("Listing saved successfully")
      }
    } catch (error) {
      toast.error(isSaved ? "Failed to remove listing" : "Failed to save listing")
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
