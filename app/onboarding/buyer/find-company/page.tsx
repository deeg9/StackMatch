"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function BuyerFindCompanyPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // TODO: Implement actual company search
    setTimeout(() => {
      setIsSearching(false)
      // For now, redirect to create company if no results
      router.push("/onboarding/buyer/company-details")
    }, 1000)
  }

  const handleCreateInstead = () => {
    router.push("/onboarding/buyer/company-details")
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Company Affiliation</h1>
          <p className="text-slate-400">Let's set up your buyer profile and company association</p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-white text-center">Find Your Company</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Enter your company name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 pr-12"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="absolute right-1 top-1 h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-slate-400 text-sm">Can't find your company?</p>
              <Button onClick={handleCreateInstead} variant="link" className="text-blue-400 hover:text-blue-300 p-0">
                Create a new company profile instead
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <Link href="/onboarding/buyer/affiliate-or-create">
                <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
