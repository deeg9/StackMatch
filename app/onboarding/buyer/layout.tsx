import type React from "react"
import { Navigation } from "@/components/navigation"

export default function BuyerOnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Navigation />
      <div className="container max-w-6xl py-8 px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  )
}
