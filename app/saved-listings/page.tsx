"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch"
import { loadSavedListings, removeSavedListing } from "@/store/slices/savedListingsSlice"
import { SellerDashboardHeader } from "@/components/seller-dashboard/seller-dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MapPin, Calendar, DollarSign, Eye, MessageSquare, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function SavedListingsPage() {
  const dispatch = useAppDispatch()
  const { savedListings, isLoading } = useAppSelector((state) => state.savedListings)

  useEffect(() => {
    dispatch(loadSavedListings())
  }, [dispatch])

  const handleRemoveListing = async (listingId: string) => {
    try {
      await dispatch(removeSavedListing(listingId)).unwrap()
      toast.success("Listing removed from saved")
    } catch (error) {
      toast.error("Failed to remove listing")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a]">
        <SellerDashboardHeader />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading saved listings...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <SellerDashboardHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Saved Listings</h1>
          <p className="text-slate-400">
            {savedListings.length} saved listing{savedListings.length !== 1 ? "s" : ""}
          </p>
        </div>

        {savedListings.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No saved listings yet</h3>
            <p className="text-slate-400 mb-6">
              Start browsing listings and save the ones you're interested in for easy access later.
            </p>
            <Link href="/browse-listings">
              <Button className="bg-blue-600 hover:bg-blue-700">Browse Listings</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedListings.map((listing) => (
              <Card key={listing.id} className="bg-[#1e293b] border-slate-700 hover:border-slate-600 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-white mb-1">{listing.companyName}</CardTitle>
                      <p className="text-sm text-slate-400 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {listing.location}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveListing(listing.id)}
                      className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <h4 className="font-semibold text-white line-clamp-2">{listing.title}</h4>

                  <div className="flex flex-wrap gap-1">
                    {listing.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {listing.tags.length > 3 && (
                      <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        +{listing.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-400">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{listing.budget}</span>
                    </div>
                    <div className="flex items-center text-slate-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(listing.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">Saved {new Date(listing.savedAt).toLocaleDateString()}</div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                    <Link href={`/listings/${listing.id}`} className="flex-1">
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
