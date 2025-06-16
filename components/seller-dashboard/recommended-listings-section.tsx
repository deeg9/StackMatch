import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Bookmark, Search, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Listing } from "@/types" // Assuming a base Listing type

// Extend or use a specific type for dashboard display
interface DashboardListing extends Listing {
  company_name?: string
  budget_min?: number
  budget_max?: number
  tags?: string[] | null // Allow null to match base Listing interface
}

interface RecommendedListingsSectionProps {
  listings: DashboardListing[]
}

export function RecommendedListingsSection({ listings }: RecommendedListingsSectionProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recommended Listings for You</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/browse-listings">
            Browse All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {listings.length === 0 ? (
          <p className="text-muted-foreground">
            No specific recommendations at this time.{" "}
            <Link href="/browse-listings" className="text-primary hover:underline">
              Browse all listings
            </Link>
            .
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listings.map((listing) => (
              <div key={listing.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-1">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground">By: {listing.company_name || "Confidential"}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary"
                    title="Save Listing"
                  >
                    <Bookmark className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{listing.description}</p>
                <div className="text-sm text-card-foreground font-medium mb-2">
                  Budget: ${listing.budget_min?.toLocaleString() || "N/A"} - $
                  {listing.budget_max?.toLocaleString() || "N/A"}
                </div>
                {listing.tags && listing.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {listing.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/listings/${listing.id}`}>
                      <Briefcase className="mr-2 h-4 w-4" /> View Details
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    <Search className="mr-2 h-4 w-4" /> Find Similar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
