"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Eye, MapPin, CalendarDays, TrendingUp, Briefcase, CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { SaveListingButton } from "@/components/shared/save-listing-button"
import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Listing } from "@/types"

interface ListingCardProps {
  listing: Listing
}

export function ListingCard({ listing }: ListingCardProps) {
  const [hasSubmittedProposal, setHasSubmittedProposal] = useState(false)
  const [checkingProposal, setCheckingProposal] = useState(true)
  const supabase = createClient()

  // Check if current seller has already submitted a proposal
  useEffect(() => {
    const checkProposalStatus = async () => {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setCheckingProposal(false)
          return
        }

        // Get seller profile
        const { data: sellerProfile } = await supabase
          .from("seller_profiles")
          .select("id")
          .eq("user_id", user.id)
          .single()

        if (!sellerProfile) {
          setCheckingProposal(false)
          return
        }

        // Check if proposal exists for this listing and seller
        const { data: proposal } = await supabase
          .from("proposals")
          .select("id")
          .eq("listing_id", listing.id)
          .eq("seller_id", sellerProfile.id)
          .single()

        setHasSubmittedProposal(!!proposal)
      } catch (error) {
        console.error("Error checking proposal status:", error)
      } finally {
        setCheckingProposal(false)
      }
    }

    checkProposalStatus()
  }, [listing.id, supabase])

  return (
    <div className="bg-[#1e293b] rounded-lg shadow-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-all duration-300 flex flex-col h-full">
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3">
            <Image
              src={listing.companyLogo || "/placeholder.svg?width=40&height=40&query=Company+Logo"}
              alt={`${listing.companyName} logo`}
              width={40}
              height={40}
              className="rounded-full border border-slate-600"
            />
            <div>
              <h3 className="text-lg font-semibold text-white">{listing.companyName}</h3>
              <p className="text-xs text-slate-400 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {listing.location}
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {listing.isNew && (
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                NEW
              </Badge>
            )}
            {listing.isActive && (
              <Badge variant="outline" className="bg-sky-500/10 text-sky-400 border-sky-500/30">
                ACTIVE
              </Badge>
            )}
            {hasSubmittedProposal && (
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                APPLIED
              </Badge>
            )}
          </div>
        </div>

        <h4 className="text-xl font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
          <Link href={`/listings/${listing.id}`}>{listing.title}</Link>
        </h4>
        <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-grow-0">{listing.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {listing.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-slate-700 text-slate-300 hover:bg-slate-600">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-400 mb-4">
          <div className="flex items-center">
            <Briefcase className="w-4 h-4 mr-2 text-slate-500" />
            Budget: <span className="text-white ml-1">{listing.budget}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2 text-slate-500" />
            Deadline:{" "}
            <span className="text-white ml-1">
              {listing.deadline ? new Date(listing.deadline).toLocaleDateString() : "TBD"}
            </span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-slate-500" />
            Growth: <span className="text-white ml-1">{listing.growth || "N/A"}</span>
          </div>
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2 text-slate-500" />
            Views: <span className="text-white ml-1">{listing.views || 0}</span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-800/50 border-t border-slate-700 mt-auto">
        <div className="flex gap-2">
          <SaveListingButton
            listing={{
              id: listing.id,
              companyName: listing.companyName,
              title: listing.title,
              budget: listing.budget,
              deadline: listing.deadline,
              location: listing.location,
              tags: listing.tags,
            }}
            size="sm"
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" /> Contact
          </Button>
          <Link href={`/listings/${listing.id}`} passHref legacyBehavior>
            <Button
              size="sm"
              className={`flex-1 text-white ${
                hasSubmittedProposal ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <Eye className="w-4 h-4 mr-2" />
              {hasSubmittedProposal ? "View Applied" : "View"}
            </Button>
          </Link>
        </div>

        {checkingProposal && <div className="mt-2 text-xs text-slate-500 text-center">Checking proposal status...</div>}
      </div>
    </div>
  )
}
