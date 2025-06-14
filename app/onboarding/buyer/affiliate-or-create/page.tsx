"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Building2 } from "lucide-react"

export default function BuyerAffiliateOrCreatePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleFindCompany = () => {
    setIsLoading(true)
    router.push("/onboarding/buyer/find-company")
  }

  const handleCreateCompany = () => {
    setIsLoading(true)
    router.push("/onboarding/buyer/company-details")
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Company Affiliation</h1>
          <p className="text-slate-400 text-lg">Let's set up your buyer profile and company association</p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold text-white">
                Are you affiliated with a company that's already registered on StackMatch?
              </h2>
              <p className="text-slate-400">
                This helps us connect you with the right company profile and avoid duplicate information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-500/20 transition-colors">
                    <Search className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">Yes, find my company</h3>
                    <p className="text-sm text-slate-400">Search for your company and request to join their profile</p>
                  </div>
                  <Button
                    onClick={handleFindCompany}
                    disabled={isLoading}
                    className="w-full bg-transparent border border-slate-600 text-white hover:bg-slate-700"
                  >
                    Find Company
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors cursor-pointer group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-500/20 transition-colors">
                    <Building2 className="w-8 h-8 text-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">No, create a new company profile</h3>
                    <p className="text-sm text-slate-400">Set up a new company profile on StackMatch</p>
                  </div>
                  <Button
                    onClick={handleCreateCompany}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create Company Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
