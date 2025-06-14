"use client"

import { useState } from "react"
import { Grid, List, MoreHorizontal, Clock, DollarSign, Users, Eye, MessageSquare, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface FiltersState {
  status: string[]
  dateRange: { from: Date; to: Date } | null
  industry: string
  searchQuery: string
  smartTags: string[]
}

interface ListingSummaryCardsProps {
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  filters: FiltersState
}

// Mock data for listings
const mockListings = [
  {
    id: "1",
    title: "CRM System Implementation",
    status: "active",
    proposalsReceived: 12,
    targetProposals: 15,
    avgProposalValue: 45000,
    targetBudget: 50000,
    deadline: "2024-02-15",
    daysLeft: 8,
    topProposals: [
      { provider: "TechCorp Solutions", amount: 42000, logo: "/placeholder.svg?height=32&width=32" },
      { provider: "DevPro Inc", amount: 48000, logo: "/placeholder.svg?height=32&width=32" },
    ],
    smartTags: ["High Activity", "On Budget"],
    lastActivity: "2 hours ago",
  },
  {
    id: "2",
    title: "E-commerce Platform Upgrade",
    status: "active",
    proposalsReceived: 8,
    targetProposals: 12,
    avgProposalValue: 32000,
    targetBudget: 35000,
    deadline: "2024-02-20",
    daysLeft: 13,
    topProposals: [
      { provider: "WebFlow Studios", amount: 28000, logo: "/placeholder.svg?height=32&width=32" },
      { provider: "Digital Dynamics", amount: 35000, logo: "/placeholder.svg?height=32&width=32" },
    ],
    smartTags: ["Needs Follow-up"],
    lastActivity: "1 day ago",
  },
  {
    id: "3",
    title: "Financial Reporting Dashboard",
    status: "draft",
    proposalsReceived: 0,
    targetProposals: 10,
    avgProposalValue: 0,
    targetBudget: 25000,
    deadline: "2024-03-01",
    daysLeft: 22,
    topProposals: [],
    smartTags: [],
    lastActivity: "3 days ago",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-500"
    case "draft":
      return "bg-gray-500"
    case "closed":
      return "bg-blue-500"
    case "archived":
      return "bg-slate-500"
    default:
      return "bg-gray-500"
  }
}

const getStatusLabel = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

export function ListingSummaryCards({ viewMode, onViewModeChange, filters }: ListingSummaryCardsProps) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // Filter listings based on filters
  const filteredListings = mockListings.filter((listing) => {
    if (filters.status.length > 0 && !filters.status.includes(listing.status)) return false
    if (filters.searchQuery && !listing.title.toLowerCase().includes(filters.searchQuery.toLowerCase())) return false
    if (filters.smartTags.length > 0 && !filters.smartTags.some((tag) => listing.smartTags.includes(tag))) return false
    return true
  })

  const ListingCard = ({ listing }: { listing: (typeof mockListings)[0] }) => {
    const proposalProgress = (listing.proposalsReceived / listing.targetProposals) * 100
    const budgetVariance = ((listing.avgProposalValue - listing.targetBudget) / listing.targetBudget) * 100

    return (
      <Card
        className={cn(
          "bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-200 cursor-pointer group",
          hoveredCard === listing.id && "ring-2 ring-blue-500/50",
        )}
        onMouseEnter={() => setHoveredCard(listing.id)}
        onMouseLeave={() => setHoveredCard(null)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{listing.title}</h3>
              <div className="flex items-center space-x-2">
                <Badge className={cn("text-white", getStatusColor(listing.status))}>
                  {getStatusLabel(listing.status)}
                </Badge>
                <span className="text-xs text-slate-400">Listing #{listing.id}</span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700">
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Message Top Proposal
                </DropdownMenuItem>
                <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <Calendar className="mr-2 h-4 w-4" />
                  Extend Deadline
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-slate-400 text-sm">
                <Users className="h-4 w-4 mr-1" />
                Proposals
              </div>
              <div className="text-white font-semibold">
                {listing.proposalsReceived} / {listing.targetProposals}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-slate-400 text-sm">
                <DollarSign className="h-4 w-4 mr-1" />
                Avg. Value
              </div>
              <div className="text-white font-semibold">${listing.avgProposalValue.toLocaleString()}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Proposal Goal</span>
              <span className="text-slate-300">{Math.round(proposalProgress)}%</span>
            </div>
            <Progress value={proposalProgress} className="bg-slate-700" />
          </div>

          {/* Deadline */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-slate-400">
              <Clock className="h-4 w-4 mr-1" />
              Deadline
            </div>
            <div
              className={cn(
                "font-medium",
                listing.daysLeft <= 3 ? "text-red-400" : listing.daysLeft <= 7 ? "text-yellow-400" : "text-green-400",
              )}
            >
              {listing.daysLeft} days left
            </div>
          </div>

          {/* Top Proposals Preview */}
          {listing.topProposals.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-slate-400">Top Proposals</div>
              <div className="space-y-2">
                {listing.topProposals.slice(0, 2).map((proposal, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={proposal.logo || "/placeholder.svg"} />
                        <AvatarFallback className="bg-slate-600 text-xs">{proposal.provider.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-slate-300">{proposal.provider}</span>
                    </div>
                    <span className="text-sm font-medium text-white">${proposal.amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Tags */}
          {listing.smartTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {listing.smartTags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-slate-700 text-slate-300 border-slate-600">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Hover Actions */}
          {hoveredCard === listing.id && (
            <div className="flex space-x-2 pt-2 border-t border-slate-700">
              <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                View Details
              </Button>
              <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                Message
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">My Listings</h2>
          <p className="text-slate-400 text-sm">{filteredListings.length} listings found</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              viewMode === "grid"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700",
            )}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => onViewModeChange("list")}
            className={cn(
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700",
            )}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Listings Grid/List */}
      <div className={cn(viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4")}>
        {filteredListings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {/* Empty State */}
      {filteredListings.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 text-lg mb-2">No listings found</div>
          <div className="text-slate-500 text-sm">Try adjusting your filters or create a new listing</div>
          <Button className="mt-4 bg-blue-600 hover:bg-blue-700">Create New Listing</Button>
        </div>
      )}
    </div>
  )
}
