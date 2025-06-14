import { ListingCard } from "./listing-card"
import type { Listing } from "@/types"

interface ListingsGridProps {
  listings: Listing[]
}

export function ListingsGrid({ listings }: ListingsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  )
}
