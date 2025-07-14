'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Eye, 
  MessageCircle, 
  Users, 
  Calendar, 
  Clock, 
  MoreVertical,
  ExternalLink,
  Edit,
  Copy,
  X
} from 'lucide-react'
import Link from 'next/link'

interface ListingCardProps {
  listing: {
    id: string
    title: string
    status: 'active' | 'draft' | 'in-review' | 'closed'
    category: string
    datePosted: string
    proposalDeadline: string
    views: number
    proposalsReceived: number
    dealRoomsCreated: number
    budgetRange?: string
    description?: string
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-trust-green text-white'
      case 'draft':
        return 'bg-medium-gray text-white'
      case 'in-review':
        return 'bg-attention-orange text-white'
      case 'closed':
        return 'bg-charcoal text-white'
      default:
        return 'bg-light-gray text-charcoal'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'draft':
        return 'Draft'
      case 'in-review':
        return 'In Review'
      case 'closed':
        return 'Closed'
      default:
        return 'Unknown'
    }
  }

  const handleClone = () => {
    // TODO: Implement clone functionality
    console.log('Clone listing:', listing.id)
  }

  const handleClose = () => {
    // TODO: Implement close functionality
    console.log('Close listing:', listing.id)
  }

  return (
    <Card 
      className="border-2 hover:border-stackmatch-blue transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-6">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-stackmatch-navy hover:text-stackmatch-blue transition-colors cursor-pointer">
                {listing.title}
              </h3>
              <Badge className={getStatusColor(listing.status)}>
                {getStatusLabel(listing.status)}
              </Badge>
            </div>
            <p className="text-sm text-medium-gray">{listing.category}</p>
            {listing.budgetRange && (
              <p className="text-sm text-charcoal font-medium mt-1">
                Budget: {listing.budgetRange}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleClone}>
                <Copy className="h-4 w-4 mr-2" />
                Clone Listing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleClose} className="text-red-600">
                <X className="h-4 w-4 mr-2" />
                Close Listing
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Key Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-stackmatch-blue" />
            <div>
              <p className="text-xs text-medium-gray">Date Posted</p>
              <p className="text-sm font-medium text-charcoal">{listing.datePosted}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-attention-orange" />
            <div>
              <p className="text-xs text-medium-gray">Proposal Deadline</p>
              <p className="text-sm font-medium text-charcoal">{listing.proposalDeadline}</p>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Eye className="h-4 w-4 text-information-blue" />
            <div>
              <p className="text-sm font-semibold text-charcoal">{listing.views}</p>
              <p className="text-xs text-medium-gray">Views</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <MessageCircle className="h-4 w-4 text-trust-green" />
            <div>
              <p className="text-sm font-semibold text-charcoal">{listing.proposalsReceived}</p>
              <p className="text-xs text-medium-gray">Proposals</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Users className="h-4 w-4 text-stackmatch-blue" />
            <div>
              <p className="text-sm font-semibold text-charcoal">{listing.dealRoomsCreated}</p>
              <p className="text-xs text-medium-gray">Deal Rooms</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/listings/${listing.id}`} className="flex-1">
            <Button className="w-full bg-stackmatch-blue hover:bg-stackmatch-navy text-white">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Listing
            </Button>
          </Link>
          <Link href={`/listings/${listing.id}/edit`}>
            <Button variant="outline" className="hover:bg-slate-50">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
        </div>

        {/* Hover Effect - Additional Info */}
        {isHovered && listing.description && (
          <div className="mt-4 p-3 bg-stackmatch-blue/5 rounded-lg border border-stackmatch-blue/20 animate-fade-in">
            <p className="text-sm text-charcoal line-clamp-2">
              {listing.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}