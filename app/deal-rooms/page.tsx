"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TickerBanner } from "@/components/ticker/ticker-banner"
import { useToast } from "@/components/ui/use-toast"
import {
  Search,
  Clock,
  Briefcase,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  Key,
  MessageSquare,
  Users,
  FileText,
  Activity,
  Grid3X3,
  List,
  Star,
  TrendingUp,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { refreshToken, getValidToken } from "@/lib/auth/token-utils"

interface DealRoomListing {
  id: string
  room_name: string
  status: string
  created_at: string
  listing_id: string
  proposal_id: string
  buyer_id: string
  seller_id: string
  completed_at?: string
}

const statusConfig = {
  active: {
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    icon: Activity,
  },
  completed: {
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    icon: Star,
  },
  closed: {
    color: "from-gray-500 to-slate-600",
    bg: "bg-gray-500/10",
    border: "border-gray-500/20",
    text: "text-gray-400",
    icon: Clock,
  },
  archived: {
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    text: "text-amber-400",
    icon: FileText,
  },
}

export default function DealRoomsPage() {
  const auth = useSelector((state: RootState) => state.auth)
  const user = auth?.user
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [dealRooms, setDealRooms] = useState<DealRoomListing[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created_at")
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [debugInfo, setDebugInfo] = useState<any>({
    componentLoaded: true,
    timestamp: new Date().toISOString(),
    userAvailable: !!user,
  })

  const fetchDealRooms = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = await getValidToken()
      if (!token) {
        const errorMsg = "Authentication token missing. Please try refreshing your session."
        setError(errorMsg)
        return
      }

      const params = new URLSearchParams({
        status: statusFilter,
        sortBy,
        sortOrder: "desc",
      })

      const response = await fetch(`/api/deal-rooms?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
        },
      })

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        throw new Error(`Server returned non-JSON response: ${textResponse.substring(0, 100)}`)
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      if (Array.isArray(data)) {
        setDealRooms(data)
      } else if (data.dealRooms && Array.isArray(data.dealRooms)) {
        setDealRooms(data.dealRooms)
      } else {
        setDealRooms([])
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load deal rooms"
      setError(errorMessage)
      toast({
        title: "Error",
        description: `Failed to load deal rooms: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchDealRooms()
    } else {
      setLoading(false)
    }
  }, [user, statusFilter, sortBy])

  const handleRefreshToken = async () => {
    try {
      setLoading(true)
      const result = await refreshToken()
      if (!result) {
        toast({
          title: "Session Refresh Failed",
          description: "Could not refresh session",
          variant: "destructive",
        })
        return
      }
      toast({
        title: "Session Refreshed",
        description: "Fetching deal rooms with new token",
      })
      await fetchDealRooms()
    } catch (e) {
      toast({
        title: "Refresh Error",
        description: e instanceof Error ? e.message : "Unknown error",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredDealRooms = dealRooms.filter((item) => {
    return item.room_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  })

  const getStatusConfig = (status: string) => {
    return statusConfig[status?.toLowerCase() as keyof typeof statusConfig] || statusConfig.closed
  }

  const filterOptions = [
    { value: "all", label: "All Rooms", count: dealRooms.length },
    { value: "active", label: "Active", count: dealRooms.filter((r) => r.status === "active").length },
    { value: "completed", label: "Completed", count: dealRooms.filter((r) => r.status === "completed").length },
    { value: "closed", label: "Closed", count: dealRooms.filter((r) => r.status === "closed").length },
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <TickerBanner />
        <div className="container mx-auto py-8 px-4">
          {/* Skeleton Hero */}
          <div className="mb-8">
            <div className="h-8 bg-slate-700/50 rounded-lg w-64 mb-2 animate-pulse"></div>
            <div className="h-4 bg-slate-700/30 rounded w-96 animate-pulse"></div>
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-slate-700/50 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-slate-700/30 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-slate-700/30 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <TickerBanner />
        <div className="container mx-auto py-8 px-4 text-center">
          <div className="max-w-md mx-auto">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 backdrop-blur-sm">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
              <h1 className="text-2xl font-bold mb-4 text-slate-200">Error Loading Deal Rooms</h1>
              <p className="text-slate-400 mb-8">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => fetchDealRooms()} className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={handleRefreshToken}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Key className="mr-2 h-4 w-4" />
                  Refresh Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <TickerBanner />

      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {filterOptions.map((option) => (
            <Card
              key={option.value}
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300"
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">{option.count}</div>
                <div className="text-sm text-slate-400">{option.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-400 transition-colors" />
                <Input
                  placeholder="Search deal rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20 h-12 rounded-xl"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2 flex-wrap">
                {filterOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    variant={statusFilter === option.value ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full transition-all duration-300 ${
                      statusFilter === option.value
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border-slate-600 text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    {option.label}
                    <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-300">
                      {option.count}
                    </Badge>
                  </Button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex gap-1 bg-slate-700/50 rounded-lg p-1">
                <Button
                  onClick={() => setViewMode("grid")}
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-md"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => setViewMode("list")}
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-md"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deal Rooms Grid/List */}
        {filteredDealRooms.length === 0 ? (
          <Card className="bg-slate-800/30 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="py-16 text-center">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
                <Briefcase className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-200 mb-4">No Deal Rooms Found</h3>
              <p className="text-slate-400 mb-8 max-w-md mx-auto">
                {searchTerm || statusFilter !== "all"
                  ? "No deal rooms match your current filters. Try adjusting your search criteria."
                  : "You don't have any deal rooms yet. They'll appear here when proposals are accepted."}
              </p>
              {(searchTerm || statusFilter !== "all") && (
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredDealRooms.map((dealRoom) => {
              const config = getStatusConfig(dealRoom.status)
              const StatusIcon = config.icon

              return (
                <Link key={dealRoom.id} href={`/deal-rooms/${dealRoom.id}`}>
                  <Card
                    className={`group bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 ${config.border} relative overflow-hidden`}
                  >
                    {/* Status Gradient Border */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${config.color}`}></div>

                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${config.bg}`}>
                              <StatusIcon className={`h-5 w-5 ${config.text}`} />
                            </div>
                            <Badge className={`${config.bg} ${config.text} border-0`}>
                              {dealRoom.status || "Unknown"}
                            </Badge>
                          </div>
                          <h3 className="text-lg font-semibold text-slate-100 group-hover:text-white transition-colors mb-2">
                            {dealRoom.room_name || "Untitled Deal Room"}
                          </h3>
                        </div>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <Clock className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(dealRoom.created_at), { addSuffix: true })}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <MessageSquare className="h-4 w-4" />
                          <span>Room #{dealRoom.id.substring(0, 8)}</span>
                        </div>

                        {/* Mock activity indicators */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-400">2 participants</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-400" />
                            <span className="text-sm text-green-400">Active</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
