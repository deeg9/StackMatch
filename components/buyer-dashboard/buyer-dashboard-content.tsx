"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Users, MessageSquare, Plus } from "lucide-react"

interface BuyerDashboardContentProps {
  user: any
}

export function BuyerDashboardContent({ user }: BuyerDashboardContentProps) {
  const [activeListings, setActiveListings] = useState(0)
  const [totalProposals, setTotalProposals] = useState(0)
  const [completedProjects, setCompletedProjects] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll just simulate a delay and set some placeholder values
        await new Promise((resolve) => setTimeout(resolve, 500))

        setActiveListings(0)
        setTotalProposals(0)
        setCompletedProjects(0)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.full_name || "User"}</h1>
        <p className="text-muted-foreground mt-2">Manage your listings and connect with top sellers</p>
        {user?.company_name && <p className="text-sm text-muted-foreground">Company: {user.company_name}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Create Listing Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-full bg-primary/10">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create Listing</h3>
              <Button asChild className="w-full mt-2">
                <Link href="/create-listing">Post New Project</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Listings Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">My Listings</h3>
              <Button variant="outline" asChild className="w-full mt-2">
                <Link href="/my-listings">View All</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Browse Sellers Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Browse Sellers</h3>
              <Button variant="outline" asChild className="w-full mt-2">
                <Link href="/browse-sellers">Find Talent</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-3 rounded-full bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Messages</h3>
              <Button variant="outline" asChild className="w-full mt-2">
                <Link href="/messages">View Messages</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Listings */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-1">Active Listings</h3>
            <p className="text-sm text-muted-foreground mb-4">Projects currently accepting proposals</p>
            <p className="text-4xl font-bold">{activeListings}</p>
          </CardContent>
        </Card>

        {/* Total Proposals */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-1">Total Proposals</h3>
            <p className="text-sm text-muted-foreground mb-4">Proposals received across all projects</p>
            <p className="text-4xl font-bold">{totalProposals}</p>
          </CardContent>
        </Card>

        {/* Completed Projects */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-1">Completed Projects</h3>
            <p className="text-sm text-muted-foreground mb-4">Successfully finished collaborations</p>
            <p className="text-4xl font-bold">{completedProjects}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
