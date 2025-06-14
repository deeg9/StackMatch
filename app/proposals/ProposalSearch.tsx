"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, DollarSign, Calendar, MapPin, User } from "lucide-react"

interface Listing {
  id: string
  title: string
  description: string
  budget_min: number
  budget_max: number
  timeline: string
  category: string
  location?: string
  remote_ok: boolean
  required_skills: string[]
  created_at: string
  buyer: {
    company_name?: string
    rating?: number
  }
}

interface ProposalSearchProps {
  onSelectListing?: (listing: Listing) => void
}

function ProposalSearch({ onSelectListing }: ProposalSearchProps) {
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [budgetRange, setBudgetRange] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

  useEffect(() => {
    fetchListings()
  }, [])

  useEffect(() => {
    filterListings()
  }, [searchTerm, selectedCategory, budgetRange, locationFilter, listings])

  const fetchListings = async () => {
    try {
      setIsLoading(true)
      // Mock data for now
      const mockListings: Listing[] = [
        {
          id: "1",
          title: "E-commerce Website Development",
          description: "We need a modern e-commerce website built with React and Node.js. The site should include user authentication, product catalog, shopping cart, and payment integration.",
          budget_min: 3000,
          budget_max: 8000,
          timeline: "6-8 weeks",
          category: "Web Development",
          location: "New York, NY",
          remote_ok: true,
          required_skills: ["React", "Node.js", "MongoDB", "Stripe"],
          created_at: new Date().toISOString(),
          buyer: {
            company_name: "TechStart Inc.",
            rating: 4.8
          }
        },
        {
          id: "2",
          title: "Mobile App UI/UX Design",
          description: "Looking for a talented designer to create wireframes and high-fidelity designs for our mobile application. Experience with fintech apps preferred.",
          budget_min: 2000,
          budget_max: 4000,
          timeline: "4 weeks",
          category: "UI/UX Design",
          remote_ok: true,
          required_skills: ["Figma", "UI Design", "UX Research", "Mobile Design"],
          created_at: new Date(Date.now() - 86400000).toISOString(),
          buyer: {
            company_name: "FinanceApp Co.",
            rating: 4.5
          }
        },
        {
          id: "3",
          title: "Data Analytics Dashboard",
          description: "Need a comprehensive dashboard for business analytics. Should include data visualization, real-time updates, and export functionality.",
          budget_min: 4000,
          budget_max: 10000,
          timeline: "8-10 weeks",
          category: "Data Science",
          location: "San Francisco, CA",
          remote_ok: false,
          required_skills: ["Python", "React", "D3.js", "PostgreSQL"],
          created_at: new Date(Date.now() - 172800000).toISOString(),
          buyer: {
            company_name: "DataCorp",
            rating: 4.9
          }
        }
      ]
      setListings(mockListings)
    } catch (error) {
      console.error("Failed to fetch listings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterListings = () => {
    let filtered = listings

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.required_skills.some(skill => 
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(listing => listing.category === selectedCategory)
    }

    // Budget filter
    if (budgetRange !== "all") {
      const [min, max] = budgetRange.split("-").map(Number)
      filtered = filtered.filter(listing => 
        listing.budget_min >= min && listing.budget_max <= max
      )
    }

    // Location filter
    if (locationFilter === "remote") {
      filtered = filtered.filter(listing => listing.remote_ok)
    } else if (locationFilter === "onsite") {
      filtered = filtered.filter(listing => !listing.remote_ok)
    }

    setFilteredListings(filtered)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const categories = ["Web Development", "Mobile Development", "UI/UX Design", "Data Science", "DevOps"]
  const budgetRanges = [
    { label: "Under $1k", value: "0-1000" },
    { label: "$1k - $5k", value: "1000-5000" },
    { label: "$5k - $10k", value: "5000-10000" },
    { label: "Over $10k", value: "10000-999999" }
  ]

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Find Projects to Bid On
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={budgetRange} onValueChange={setBudgetRange}>
              <SelectTrigger>
                <SelectValue placeholder="Budget Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Budget</SelectItem>
                {budgetRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Location</SelectItem>
                <SelectItem value="remote">Remote Only</SelectItem>
                <SelectItem value="onsite">On-site Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {filteredListings.length} Projects Found
          </h2>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        {filteredListings.map((listing) => (
          <Card key={listing.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-3">
                    {listing.description}
                  </p>
                </div>
                <Badge variant="outline">{listing.category}</Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ${listing.budget_min.toLocaleString()} - ${listing.budget_max.toLocaleString()}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {listing.timeline}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {listing.remote_ok ? "Remote OK" : listing.location || "On-site"}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {listing.buyer.company_name} ⭐ {listing.buyer.rating}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {listing.required_skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Posted {formatDate(listing.created_at)}
                </span>
                <Button onClick={() => onSelectListing?.(listing)}>
                  Submit Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredListings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p>Try adjusting your search criteria or filters.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export { ProposalSearch }
export default ProposalSearch