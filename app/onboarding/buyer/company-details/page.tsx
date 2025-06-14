"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

const steps = [
  { id: 1, name: "Basic Info", current: true },
  { id: 2, name: "Services & Expertise", current: false },
  { id: 3, name: "Experience & Portfolio", current: false },
  { id: 4, name: "Business Preferences", current: false },
  { id: 5, name: "Review & Submit", current: false },
]

export default function BuyerCompanyDetailsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: "",
    businessDescription: "",
    websiteUrl: "",
    location: "",
    businessType: "",
    foundedYear: "",
    teamSize: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleContinue = async () => {
    setIsLoading(true)
    // TODO: Save company details to backend
    setTimeout(() => {
      setIsLoading(false)
      router.push("/onboarding/buyer/personal-details")
    }, 1000)
  }

  const isFormValid = formData.businessName && formData.businessDescription && formData.location

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Complete Your Company Profile</h1>
          <p className="text-slate-400">
            Set up your company's presence on StackMatch to connect with potential clients.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-400">
            <span>Progress</span>
            <span>0%</span>
          </div>
          <Progress value={0} className="h-2" />
        </div>

        {/* Step indicators */}
        <div className="hidden md:block">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${step.current ? "text-blue-500" : "text-slate-500"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step.current ? "border-blue-500 text-blue-500" : "border-slate-700 text-slate-500"
                  }`}
                >
                  {step.id}
                </div>
                <span className="mt-2 text-xs">{step.name}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Basic Information</CardTitle>
            <p className="text-slate-400">Tell us about your business or freelance practice.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-white">
                Business/Professional Name
              </Label>
              <Input
                id="businessName"
                placeholder="Enter your business or professional name"
                value={formData.businessName}
                onChange={(e) => handleInputChange("businessName", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessDescription" className="text-white">
                Business Description
              </Label>
              <Textarea
                id="businessDescription"
                placeholder="Describe your business, services, and what makes you unique"
                value={formData.businessDescription}
                onChange={(e) => handleInputChange("businessDescription", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="websiteUrl" className="text-white">
                  Website URL
                </Label>
                <Input
                  id="websiteUrl"
                  placeholder="https://yourwebsite.com"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="City, Country"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessType" className="text-white">
                  Business Type
                </Label>
                <Select
                  value={formData.businessType}
                  onValueChange={(value) => handleInputChange("businessType", value)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="small-business">Small Business</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="non-profit">Non-Profit</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="foundedYear" className="text-white">
                  Founded Year
                </Label>
                <Select value={formData.foundedYear} onValueChange={(value) => handleInputChange("foundedYear", value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {Array.from({ length: 30 }, (_, i) => {
                      const year = new Date().getFullYear() - i
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize" className="text-white">
                  Team Size
                </Label>
                <Select value={formData.teamSize} onValueChange={(value) => handleInputChange("teamSize", value)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="1">Just me</SelectItem>
                    <SelectItem value="2-10">2-10 employees</SelectItem>
                    <SelectItem value="11-50">11-50 employees</SelectItem>
                    <SelectItem value="51-200">51-200 employees</SelectItem>
                    <SelectItem value="201-500">201-500 employees</SelectItem>
                    <SelectItem value="500+">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Link href="/onboarding/buyer/affiliate-or-create">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </Link>

              <Button
                onClick={handleContinue}
                disabled={!isFormValid || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
