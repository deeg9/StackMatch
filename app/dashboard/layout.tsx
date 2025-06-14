"use client"

import type React from "react"
import { useAppSelector } from "@/hooks/useAppSelector"
import { redirect } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login")
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
