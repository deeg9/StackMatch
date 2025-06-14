"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function BuyerPersonalDetailsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic-info")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    professionalBio: "",
    profileImageUrl: "",
    linkedinProfile: "",
    githubProfile: "",
    personalWebsite: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleComplete = async () => {
    setIsLoading(true)
    // TODO: Save personal details and complete onboarding
    setTimeout(() => {
      setIsLoading(false)
      router.push("/buyer-dashboard")
    }, 1000)
  }

  const isFormValid = formData.firstName && formData.lastName && formData.jobTitle

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white">Complete Your Personal Profile</h1>
          <p className="text-slate-400">
            Tell potential clients about your individual skills, experience, and what makes you unique.
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-xl text-white">Personal Details</CardTitle>
            <p className="text-slate-400">
              This information will be displayed on your individual profile and helps clients understand your specific
              expertise.
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                <TabsTrigger value="basic-info" className="data-[state=active]:bg-slate-700">
                  Basic Info
                </TabsTrigger>
                <TabsTrigger value="skills" className="data-[state=active]:bg-slate-700">
                  Skills & Experience
                </TabsTrigger>
                <TabsTrigger value="portfolio" className="data-[state=active]:bg-slate-700">
                  Portfolio
                </TabsTrigger>
                <TabsTrigger value="preferences" className="data-[state=active]:bg-slate-700">
                  Preferences
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic-info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Your last name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-white">
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g., Senior Full Stack Developer"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalBio" className="text-white">
                    Professional Bio
                  </Label>
                  <Textarea
                    id="professionalBio"
                    placeholder="Tell clients about yourself, your background, and what makes you unique..."
                    value={formData.professionalBio}
                    onChange={(e) => handleInputChange("professionalBio", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profileImageUrl" className="text-white">
                    Profile Image URL
                  </Label>
                  <Input
                    id="profileImageUrl"
                    placeholder="https://example.com/your-image.jpg"
                    value={formData.profileImageUrl}
                    onChange={(e) => handleInputChange("profileImageUrl", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                  <p className="text-sm text-slate-400">Enter a URL to your professional headshot or avatar</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinProfile" className="text-white">
                      LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedinProfile"
                      placeholder="https://linkedin.com/in/yourprofile"
                      value={formData.linkedinProfile}
                      onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubProfile" className="text-white">
                      GitHub Profile
                    </Label>
                    <Input
                      id="githubProfile"
                      placeholder="https://github.com/yourusername"
                      value={formData.githubProfile}
                      onChange={(e) => handleInputChange("githubProfile", e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personalWebsite" className="text-white">
                      Personal Website
                    </Label>
                    <Input
                      id="personalWebsite"
                      placeholder="https://yourwebsite.com"
                      value={formData.personalWebsite}
                      onChange={(e) => handleInputChange("personalWebsite", e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <div className="text-center py-8">
                  <p className="text-slate-400">Skills & Experience section coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <div className="text-center py-8">
                  <p className="text-slate-400">Portfolio section coming soon...</p>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-6">
                <div className="text-center py-8">
                  <p className="text-slate-400">Preferences section coming soon...</p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-6">
              <Link href="/onboarding/buyer/company-details">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              </Link>

              <Button
                onClick={handleComplete}
                disabled={!isFormValid || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
