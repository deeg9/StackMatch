"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Rocket, PlayCircle, Target, CheckCircle2 } from "lucide-react"
import { useClientAuth } from "@/hooks/useClientAuth"

interface AuthEnhancedCTAProps {
  variant?: "primary" | "secondary"
  className?: string
}

export function AuthEnhancedCTA({ variant = "primary", className = "" }: AuthEnhancedCTAProps) {
  const { user, loading } = useClientAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show static version until mounted and auth is resolved
  if (!mounted || loading) {
    if (variant === "primary") {
      return (
        <Link href="/signup">
          <Button size="lg" className={`group relative w-full sm:w-auto px-12 py-8 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 ${className}`}>
            <span className="relative z-10 flex items-center">
              Get Started Free
              <Rocket className="ml-4 h-7 w-7 group-hover:translate-y-[-4px] transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
          </Button>
        </Link>
      )
    } else {
      return (
        <Link href="/login">
          <Button variant="outline" size="lg" className={`group w-full sm:w-auto px-12 py-8 text-xl font-bold bg-white/10 hover:bg-white/20 text-white border-3 border-white/40 hover:border-white/60 rounded-3xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 ${className}`}>
            <span className="flex items-center">
              Watch Demo
              <PlayCircle className="ml-4 h-7 w-7 group-hover:scale-125 transition-transform" />
            </span>
          </Button>
        </Link>
      )
    }
  }

  // Show authenticated version after auth resolves
  if (user) {
    if (variant === "primary") {
      return (
        <Link href="/browse-listings">
          <Button size="lg" className={`group relative w-full sm:w-auto px-12 py-8 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 ${className}`}>
            <span className="relative z-10 flex items-center">
              Browse Listings
              <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
          </Button>
        </Link>
      )
    } else {
      return (
        <Link href="/create-listing">
          <Button variant="outline" size="lg" className={`group w-full sm:w-auto px-12 py-8 text-xl font-bold bg-white/10 hover:bg-white/20 text-white border-3 border-white/40 hover:border-white/60 rounded-3xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 ${className}`}>
            <span className="flex items-center">
              Post a Project
              <Target className="ml-4 h-7 w-7 group-hover:rotate-12 transition-transform" />
            </span>
          </Button>
        </Link>
      )
    }
  }

  // Show unauthenticated version (same as static)
  if (variant === "primary") {
    return (
      <Link href="/signup">
        <Button size="lg" className={`group relative w-full sm:w-auto px-12 py-8 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 ${className}`}>
          <span className="relative z-10 flex items-center">
            Get Started Free
            <Rocket className="ml-4 h-7 w-7 group-hover:translate-y-[-4px] transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
        </Button>
      </Link>
    )
  } else {
    return (
      <Link href="/login">
        <Button variant="outline" size="lg" className={`group w-full sm:w-auto px-12 py-8 text-xl font-bold bg-white/10 hover:bg-white/20 text-white border-3 border-white/40 hover:border-white/60 rounded-3xl backdrop-blur-sm transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 ${className}`}>
          <span className="flex items-center">
            Watch Demo
            <PlayCircle className="ml-4 h-7 w-7 group-hover:scale-125 transition-transform" />
          </span>
        </Button>
      </Link>
    )
  }
}