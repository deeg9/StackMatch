"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

interface ConfettiProps {
  duration?: number
}

export function Confetti({ duration = 5000 }: ConfettiProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    // Set dimensions
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    // Set timeout to stop confetti
    const timer = setTimeout(() => {
      setIsActive(false)
    }, duration)

    return () => {
      window.removeEventListener("resize", updateDimensions)
      clearTimeout(timer)
    }
  }, [duration])

  if (!isActive) return null

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.15}
    />
  )
}
