"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  onRatingChange: (rating: number) => void
  maxRating?: number
  size?: "sm" | "md" | "lg"
  readOnly?: boolean
  className?: string
}

export function StarRating({
  rating,
  onRatingChange,
  maxRating = 5,
  size = "md",
  readOnly = false,
  className,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)

  const handleMouseEnter = (index: number) => {
    if (readOnly) return
    setHoverRating(index)
  }

  const handleMouseLeave = () => {
    if (readOnly) return
    setHoverRating(0)
  }

  const handleClick = (index: number) => {
    if (readOnly) return
    // Toggle off if clicking the same star
    onRatingChange(rating === index ? 0 : index)
  }

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const starSize = sizeClasses[size]

  return (
    <div className={cn("flex items-center", className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starIndex = index + 1
        const isActive = (hoverRating || rating) >= starIndex

        return (
          <button
            key={starIndex}
            type="button"
            className={cn(
              "focus:outline-none transition-colors",
              readOnly ? "cursor-default" : "cursor-pointer",
              isActive ? "text-yellow-400" : "text-gray-300 hover:text-gray-400",
            )}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starIndex)}
            disabled={readOnly}
            aria-label={`Rate ${starIndex} out of ${maxRating} stars`}
          >
            <Star className={cn(starSize, "fill-current")} />
          </button>
        )
      })}
    </div>
  )
}
