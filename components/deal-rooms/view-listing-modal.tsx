"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, AlertCircle, FileText, User, Calendar, DollarSign } from "lucide-react"
import { getCurrentToken } from "@/lib/auth/token-utils"
import { formatDistanceToNow } from "date-fns"

interface ViewListingModalProps {
  isOpen: boolean
  onClose: () => void
  listingId: string
  dealRoomId: string
}

export function ViewListingModal({ isOpen, onClose, listingId, dealRoomId }: ViewListingModalProps) {
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && listingId) {
      fetchListing()
    }
  }, [isOpen, listingId])

  const fetchListing = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("🔍 LISTING MODAL: Starting fetch for listing ID:", listingId)

      const { token, success } = await getCurrentToken()

      if (!success || !token) {
        console.log("🔍 LISTING MODAL: Token retrieved:", success)
        setError("Authentication token not found")
        setLoading(false)
        return
      }

      console.log("🔍 LISTING MODAL: Token retrieved successfully")
      const response = await fetch(`/api/listings/${listingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("🔍 LISTING MODAL: Error response:", errorText)
        setError(`Failed to fetch listing: ${errorText || response.statusText}`)
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log("🔍 LISTING MODAL: Listing data received:", data)
      setListing(data)
    } catch (error) {
      console.error("🔍 LISTING MODAL: Error fetching listing:", error)
      setError(`Error fetching listing: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "Unknown date"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-slate-800 text-slate-200 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-100">Listing Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-slate-400">Loading listing details...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
            <p className="text-slate-300 font-medium mb-2">Failed to load listing</p>
            <p className="text-slate-400 text-sm text-center">{error}</p>
          </div>
        ) : listing ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100">{listing.title}</h2>
              <Badge className="bg-green-600">{listing.status || "Active"}</Badge>
            </div>

            <Card className="bg-slate-700 border-slate-600">
              <CardContent className="pt-6">
                <p className="text-slate-300">{listing.description}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-slate-400">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-slate-100">
                    {listing.budget_min && listing.budget_max
                      ? `$${listing.budget_min.toLocaleString()} - $${listing.budget_max.toLocaleString()}`
                      : listing.budget_min
                        ? `From $${listing.budget_min.toLocaleString()}`
                        : listing.budget_max
                          ? `Up to $${listing.budget_max.toLocaleString()}`
                          : "Not specified"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center text-slate-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-slate-100">
                    {listing.timeline || listing.project_duration || "Not specified"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-slate-700 border-slate-600">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center text-slate-400">
                  <User className="h-4 w-4 mr-2" />
                  Posted By
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center text-slate-300"
                  style={{
                    backgroundImage: listing.buyer_profile?.avatar_url
                      ? `url(${listing.buyer_profile.avatar_url})`
                      : "none",
                    backgroundSize: "cover",
                  }}
                >
                  {!listing.buyer_profile?.avatar_url && (listing.buyer_profile?.company_name?.[0] || "B")}
                </div>
                <div>
                  <p className="font-medium text-slate-200">
                    {listing.buyer_profile?.company_name || "Unknown Company"}
                  </p>
                  <p className="text-xs text-slate-400">
                    Posted {listing.created_at ? formatDate(listing.created_at) : "recently"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {listing.skills && listing.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {listing.skills.map((skill: string, index: number) => (
                    <Badge key={index} variant="outline" className="border-slate-600 text-slate-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="h-8 w-8 text-slate-500 mb-4" />
            <p className="text-slate-400">No listing data available</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
