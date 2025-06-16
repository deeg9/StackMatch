"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Zap, Shield } from "lucide-react"
import { useClientAuth } from "@/hooks/useClientAuth"

export default function HomePage() {
  const { user, loading } = useClientAuth()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
          Welcome to StackMatch
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          The platform to connect with buyers and sellers for your project needs.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Link href="/browse-listings">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  Browse Listings
                </Button>
              </Link>
              <Link href="/create-listing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-800">
                  Post a Project
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-800">
                  Browse Listings
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
