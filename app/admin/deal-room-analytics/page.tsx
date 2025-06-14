"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ClosureAnalytics } from "@/components/deal-rooms/closure-analytics"
import { ArchivedDealRooms } from "@/components/deal-rooms/archived-deal-rooms"
import { DealRoomStatus, ClosureOutcomeType } from "@/types/deal-room-types"
import { BarChart3, Calendar, Download } from "lucide-react"

export default function DealRoomAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("last-30-days")

  // Mock data for archived deal rooms
  const archivedDealRooms = [
    {
      id: "1",
      name: "Website Redesign Project",
      status: DealRoomStatus.CLOSED_SUCCESSFULLY,
      closedAt: "2023-05-15T10:30:00Z",
      outcomeType: ClosureOutcomeType.SUCCESSFUL,
      buyerName: "Acme Corp",
      sellerName: "WebDesign Pro",
    },
    {
      id: "2",
      name: "Mobile App Development",
      status: DealRoomStatus.CLOSED_UNSUCCESSFULLY,
      closedAt: "2023-06-22T14:45:00Z",
      outcomeType: ClosureOutcomeType.UNSUCCESSFUL,
      buyerName: "TechStart Inc",
      sellerName: "AppDevs LLC",
    },
    {
      id: "3",
      name: "E-commerce Integration",
      status: DealRoomStatus.CLOSED_SUCCESSFULLY,
      closedAt: "2023-07-10T09:15:00Z",
      outcomeType: ClosureOutcomeType.SUCCESSFUL,
      buyerName: "RetailGiant",
      sellerName: "E-Commerce Solutions",
    },
  ]

  // Mock stats data
  const statsData = {
    totalClosures: 125,
    successfulClosures: 87,
    unsuccessfulClosures: 38,
    averageClosureTime: "32 days",
    averageFeedbackRating: 4.2,
  }

  // Handle view deal room
  const handleViewDealRoom = (id: string) => {
    window.location.href = `/deal-rooms/${id}`
  }

  // Handle export data
  const handleExportData = (id: string) => {
    console.log(`Export data for deal room ${id}`)
    // In a real implementation, this would open an export dialog
  }

  // Handle export report
  const handleExportReport = () => {
    console.log(`Export analytics report for time range: ${timeRange}`)
    // In a real implementation, this would generate and download a report
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deal Room Analytics</h1>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="last-year">Last year</SelectItem>
              <SelectItem value="all-time">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExportReport} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Closures</p>
              <h3 className="text-3xl font-bold mt-1">{statsData.totalClosures}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Successful</p>
              <h3 className="text-3xl font-bold mt-1 text-green-600">{statsData.successfulClosures}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Unsuccessful</p>
              <h3 className="text-3xl font-bold mt-1 text-red-600">{statsData.unsuccessfulClosures}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg. Closure Time</p>
              <h3 className="text-3xl font-bold mt-1">{statsData.averageClosureTime}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg. Feedback</p>
              <h3 className="text-3xl font-bold mt-1 text-yellow-600">{statsData.averageFeedbackRating}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="charts">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Charts</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Raw Data</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="charts">
            <ClosureAnalytics dealRoomId="admin-overview" />
          </TabsContent>

          <TabsContent value="data">
            <ArchivedDealRooms
              dealRooms={archivedDealRooms}
              onViewDealRoom={handleViewDealRoom}
              onExportData={handleExportData}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
