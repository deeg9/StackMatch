"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Users,
  Settings,
  Star,
  Activity,
  Briefcase,
  BarChart3,
  Package,
  Eye,
  Edit3,
  Upload,
} from "lucide-react"
import { CompanyInfoTab } from "@/components/seller-profile/company-info-tab"
import { TeamManagementTab } from "@/components/seller-profile/team-management-tab"
import { AccountSettingsTab } from "@/components/seller-profile/account-settings-tab"
import { ReviewsTab } from "@/components/seller-profile/reviews-tab"
import { ActivityLogTab } from "@/components/seller-profile/activity-log-tab"
import { ServicesPortfolioTab } from "@/components/seller-profile/services-portfolio-tab"
import { MetricsOverviewTab } from "@/components/seller-profile/metrics-overview-tab"
import { QuotePackageTab } from "@/components/seller-profile/quote-package-tab"
import { AffiliationRequestsTab } from "@/components/seller-profile/affiliation-requests-tab"

export default function SellerProfilePage() {
  const [activeTab, setActiveTab] = useState("company-info")
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Mock profile completion data
  const profileCompletion = {
    percentage: 75,
    completedItems: ["Company name and description", "Industry and location", "Team members added", "Services listed"],
    missingItems: ["Upload company logo", "Add portfolio projects", "Set availability calendar"],
  }

  // Mock company data
  const companyData = {
    name: "TechSolutions Inc.",
    logo: "/placeholder.svg?height=80&width=80",
    banner: "/placeholder.svg?height=200&width=800",
    industry: "Software Development",
    size: "11-50 employees",
    location: "San Francisco, CA",
    founded: "2018",
    description:
      "We specialize in custom software development, helping businesses transform their operations through innovative technology solutions.",
    techStack: ["React", "Node.js", "Python", "AWS", "PostgreSQL"],
    isAvailable: true,
    nextAvailability: "March 15, 2024",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Company Profile</h1>
              <p className="text-muted-foreground">Manage your company information and settings</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant={isPreviewMode ? "default" : "outline"} onClick={() => setIsPreviewMode(!isPreviewMode)}>
                <Eye className="w-4 h-4 mr-2" />
                {isPreviewMode ? "Exit Preview" : "Preview Profile"}
              </Button>
              <Button>
                <Edit3 className="w-4 h-4 mr-2" />
                Quick Edit
              </Button>
            </div>
          </div>

          {/* Profile Completion Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Profile Completion</CardTitle>
                  <CardDescription>Complete your profile to attract more clients</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{profileCompletion.percentage}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={profileCompletion.percentage} className="mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-green-600 mb-2">✓ Completed</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {profileCompletion.completedItems.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-orange-600 mb-2">⚠ Missing</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {profileCompletion.missingItems.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Header Preview */}
          <Card className="mb-6">
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg">
              <Button size="sm" variant="secondary" className="absolute top-4 right-4">
                <Upload className="w-4 h-4 mr-2" />
                Change Banner
              </Button>
            </div>
            <CardContent className="pt-0">
              <div className="flex items-start space-x-4 -mt-12">
                <div className="relative">
                  <img
                    src={companyData.logo || "/placeholder.svg"}
                    alt={companyData.name}
                    className="w-24 h-24 rounded-lg border-4 border-background bg-background"
                  />
                  <Button size="sm" variant="secondary" className="absolute -bottom-2 -right-2 h-8 w-8 p-0">
                    <Edit3 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="flex-1 pt-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{companyData.name}</h2>
                      <p className="text-muted-foreground">
                        {companyData.industry} • {companyData.location}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant={companyData.isAvailable ? "default" : "secondary"}>
                          {companyData.isAvailable ? "Available" : "Busy"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Next available: {companyData.nextAvailability}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="font-medium">4.8</span>
                          <span className="text-muted-foreground ml-1">(24 reviews)</span>
                        </div>
                        <div className="text-sm text-muted-foreground">95% completion rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="company-info" className="flex items-center space-x-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Company</span>
            </TabsTrigger>
            <TabsTrigger value="services-portfolio" className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Metrics</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Quotes</span>
            </TabsTrigger>
            <TabsTrigger value="affiliations" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Requests</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="company-info">
            <CompanyInfoTab companyData={companyData} />
          </TabsContent>

          <TabsContent value="services-portfolio">
            <ServicesPortfolioTab />
          </TabsContent>

          <TabsContent value="metrics">
            <MetricsOverviewTab />
          </TabsContent>

          <TabsContent value="quotes">
            <QuotePackageTab />
          </TabsContent>

          <TabsContent value="affiliations">
            <AffiliationRequestsTab />
          </TabsContent>

          <TabsContent value="team">
            <TeamManagementTab />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewsTab />
          </TabsContent>

          <TabsContent value="activity">
            <ActivityLogTab />
          </TabsContent>

          <TabsContent value="settings">
            <AccountSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
