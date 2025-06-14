"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Building2 } from "lucide-react"

export default function AffiliateOrCreatePage() {
  const router = useRouter()

  const handleFindCompany = () => {
    router.push("/onboarding/seller/find-company")
  }

  const handleCreateCompany = () => {
    router.push("/onboarding/seller/company-details")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white">Company Affiliation</h1>
          <p className="text-lg text-muted-foreground">Let's set up your seller profile and company association</p>
        </div>

        {/* Main Content Card */}
        <Card className="bg-card/50 border-border">
          <CardContent className="p-8 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">
                Are you affiliated with a company that's already registered on StackMatch?
              </h2>
              <p className="text-muted-foreground">
                This helps us connect you with the right company profile and avoid duplicate information.
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Find Company Option */}
              <Card className="bg-card border-border hover:border-border/80 transition-colors">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Yes, find my company</h3>
                  <p className="text-sm text-muted-foreground">
                    Search for your company and request to join their profile
                  </p>
                  <Button onClick={handleFindCompany} variant="outline" className="w-full mt-4">
                    Find Company
                  </Button>
                </CardContent>
              </Card>

              {/* Create Company Option */}
              <Card className="bg-card border-border hover:border-border/80 transition-colors">
                <CardContent className="p-6 space-y-4 text-center">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">No, create a new company profile</h3>
                  <p className="text-sm text-muted-foreground">Set up a new company profile on StackMatch</p>
                  <Button onClick={handleCreateCompany} className="w-full mt-4">
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
