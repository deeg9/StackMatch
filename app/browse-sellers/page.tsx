"use client"

import { useState, useEffect } from "react"
import { TickerBanner } from "@/components/ticker/ticker-banner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Grid3X3, List, Users, Star, Award, Clock, Filter, X, ChevronDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

// Sample seller data
const sampleSellers = [
  {
    id: "1",
    name: "John Smith",
    company: "TechSolutions Pro",
    location: "San Francisco, CA",
    rating: 4.9,
    specialties: ["React", "Node.js", "TypeScript", "AWS"],
    experience: "8+ years",
    hourlyRate: "$120-150/hr",
    completedProjects: 47,
    responseTime: "< 2 hours",
    description:
      "Full-stack developer specializing in modern web applications with React and Node.js. Expert in cloud architecture and scalable solutions.",
    avatar: "/placeholder.svg?width=40&height=40",
    isTopRated: true,
    isVerified: true,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    company: "DataFlow Systems",
    location: "Austin, TX",
    rating: 4.8,
    specialties: ["Python", "Machine Learning", "Data Science", "Django"],
    experience: "6+ years",
    hourlyRate: "$100-130/hr",
    completedProjects: 32,
    responseTime: "< 4 hours",
    description:
      "Data scientist and Python developer with expertise in machine learning, AI solutions, and data pipeline architecture.",
    avatar: "/placeholder.svg?width=40&height=40",
    isTopRated: false,
    isVerified: true,
  },
  {
    id: "3",
    name: "Mike Chen",
    company: "CloudNative Inc",
    location: "Seattle, WA",
    rating: 4.7,
    specialties: ["DevOps", "Kubernetes", "Docker", "CI/CD"],
    experience: "10+ years",
    hourlyRate: "$140-180/hr",
    completedProjects: 63,
    responseTime: "< 1 hour",
    description:
      "DevOps engineer and cloud architect specializing in containerization, microservices, and automated deployment pipelines.",
    avatar: "/placeholder.svg?width=40&height=40",
    isTopRated: true,
    isVerified: true,
  },
  {
    id: "4",
    name: "Emma Rodriguez",
    company: "UI Vision Studio",
    location: "Portland, OR",
    rating: 4.9,
    specialties: ["UI/UX Design", "React", "Figma", "Design Systems"],
    experience: "7+ years",
    hourlyRate: "$110-140/hr",
    completedProjects: 41,
    responseTime: "< 3 hours",
    description:
      "UI/UX designer and frontend developer creating beautiful, intuitive interfaces with a focus on accessibility and user experience.",
    avatar: "/placeholder.svg?width=40&height=40",
    isTopRated: true,
    isVerified: true,
  },
  {
    id: "5",
    name: "David Kim",
    company: "MobileTech Solutions",
    location: "Chicago, IL",
    rating: 4.6,
    specialties: ["React Native", "iOS", "Android", "Flutter"],
    experience: "5+ years",
    hourlyRate: "$90-120/hr",
    completedProjects: 28,
    responseTime: "< 5 hours",
    description:
      "Mobile app developer specializing in cross-platform solutions with React Native and Flutter. Expert in creating seamless mobile experiences.",
    avatar: "/placeholder.svg?width=40&height=40",
    isTopRated: false,
    isVerified: true,
  },
  {
    id: "6",
    name: "Lisa Wang",
    company: "BackendPro Services",
    location: "Boston, MA",
    rating: 4.8,
    specialties: ["Java", "Spring Boot", "Microservices", "AWS"],
    experience: "9+ years",
    hourlyRate: "$130-160/hr",
    completedProjects: 52,
    responseTime: "< 2 hours",
    description:
      "Backend engineer with expertise in Java and Spring Boot. Specializes in building scalable, resilient microservices architectures.",
    avatar: "/placeholder.svg?width=40&height=40",
    isTopRated: true,
    isVerified: true,
  },
]

// Sample expertise options
const expertiseOptions = [
  "All Expertise",
  "React",
  "Node.js",
  "Python",
  "TypeScript",
  "AWS",
  "DevOps",
  "Machine Learning",
  "UI/UX Design",
  "Mobile Development",
  "Java",
  "Microservices",
]

export default function BrowseSellersPage() {
  const [sellers, setSellers] = useState(sampleSellers)
  const [filteredSellers, setFilteredSellers] = useState(sampleSellers)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExpertise, setSelectedExpertise] = useState("All Expertise")
  const [selectedRating, setSelectedRating] = useState("All Ratings")
  const [viewMode, setViewMode] = useState("grid")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = sellers

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (seller) =>
          seller.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          seller.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Filter by expertise
    if (selectedExpertise !== "All Expertise") {
      filtered = filtered.filter((seller) => seller.specialties.includes(selectedExpertise))
      if (!activeFilters.includes(selectedExpertise)) {
        setActiveFilters([...activeFilters, selectedExpertise])
      }
    }

    // Filter by rating
    if (selectedRating !== "All Ratings") {
      const minRating = Number.parseFloat(selectedRating.replace("+", ""))
      filtered = filtered.filter((seller) => seller.rating >= minRating)
      if (!activeFilters.includes(selectedRating)) {
        setActiveFilters([...activeFilters, selectedRating])
      }
    }

    setFilteredSellers(filtered)
  }, [sellers, searchQuery, selectedExpertise, selectedRating])

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
    if (filter === selectedExpertise) {
      setSelectedExpertise("All Expertise")
    }
    if (filter === selectedRating) {
      setSelectedRating("All Ratings")
    }
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setSelectedExpertise("All Expertise")
    setSelectedRating("All Ratings")
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <TickerBanner />

      <div className="container mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Available Sellers</p>
                <h3 className="text-2xl font-bold text-white">{sellers.length}</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mr-4">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Top Rated Sellers</p>
                <h3 className="text-2xl font-bold text-white">
                  {sellers.filter((seller) => seller.isTopRated).length}
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4 flex items-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center mr-4">
                <Award className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">Verified Sellers</p>
                <h3 className="text-2xl font-bold text-white">
                  {sellers.filter((seller) => seller.isVerified).length}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header and Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Browse Sellers</h1>
            <p className="text-slate-400">Find and connect with top software development talent</p>
          </div>

          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 w-full focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="relative group">
              <Button
                variant="outline"
                className="w-full md:w-auto bg-slate-800 border-slate-700 text-white hover:bg-slate-700 flex items-center justify-between"
                onClick={() => {
                  toast({
                    title: "Filter options",
                    description: "Filter dropdown would open here",
                  })
                }}
              >
                <span className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Expertise
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>

              {/* This would be a dropdown in a real implementation */}
              <div className="hidden absolute top-full left-0 mt-1 w-full bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10 p-2">
                {expertiseOptions.map((option) => (
                  <div key={option} className="p-2 hover:bg-slate-700 rounded cursor-pointer">
                    {option}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <Button
                variant="outline"
                className="w-full md:w-auto bg-slate-800 border-slate-700 text-white hover:bg-slate-700 flex items-center justify-between"
                onClick={() => {
                  toast({
                    title: "Rating filter",
                    description: "Rating dropdown would open here",
                  })
                }}
              >
                <span className="flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  Rating
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="relative group">
              <Button
                variant="outline"
                className="w-full md:w-auto bg-slate-800 border-slate-700 text-white hover:bg-slate-700 flex items-center justify-between"
                onClick={() => {
                  toast({
                    title: "Location filter",
                    description: "Location dropdown would open here",
                  })
                }}
              >
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Response Time
                </span>
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tabs defaultValue="grid" value={viewMode} onValueChange={setViewMode} className="w-full md:w-auto">
              <TabsList className="bg-slate-800 border border-slate-700">
                <TabsTrigger value="grid" className="data-[state=active]:bg-blue-600">
                  <Grid3X3 className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="data-[state=active]:bg-blue-600">
                  <List className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-slate-400">Active filters:</span>
            {activeFilters.map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="bg-slate-700 text-slate-200 hover:bg-slate-600 px-3 py-1"
              >
                {filter}
                <X className="h-3 w-3 ml-2 cursor-pointer" onClick={() => removeFilter(filter)} />
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-transparent"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          </div>
        )}

        {/* Sellers Grid with Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm h-[300px] animate-pulse">
                <div className="h-2 bg-slate-700 rounded w-3/4 mx-auto mt-8"></div>
                <div className="h-2 bg-slate-700 rounded w-1/2 mx-auto mt-4"></div>
                <div className="h-2 bg-slate-700 rounded w-5/6 mx-auto mt-8"></div>
                <div className="h-2 bg-slate-700 rounded w-2/3 mx-auto mt-4"></div>
                <div className="flex justify-center gap-2 mt-8">
                  <div className="h-8 bg-slate-700 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-700 rounded w-1/4"></div>
                  <div className="h-8 bg-slate-700 rounded w-1/4"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredSellers.length > 0 ? (
          <div
            className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
          >
            {filteredSellers.map((seller) => (
              <Card
                key={seller.id}
                className={`bg-slate-800/50 border-slate-700 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 hover:border-slate-600 group ${
                  seller.isTopRated
                    ? "border-t-2 border-t-amber-500"
                    : seller.isVerified
                      ? "border-t-2 border-t-sky-500"
                      : ""
                }`}
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden border border-slate-600">
                            {seller.avatar ? (
                              <img
                                src={seller.avatar || "/placeholder.svg"}
                                alt={`${seller.company} logo`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              seller.company.charAt(0)
                            )}
                          </div>
                          {seller.isVerified && (
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-sky-500 rounded-full border-2 border-slate-800 flex items-center justify-center">
                              <Award className="h-2 w-2 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {seller.company}
                          </h3>
                          <p className="text-xs text-slate-400 flex items-center">{seller.location}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {seller.isTopRated && (
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                            <Award className="w-3 h-3 mr-1" /> TOP RATED
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(seller.rating) ? "text-amber-400 fill-amber-400" : "text-slate-600"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-white font-medium">{seller.rating.toFixed(1)}</span>
                      <span className="text-slate-400 text-sm ml-1">({seller.completedProjects} projects)</span>
                    </div>

                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{seller.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {seller.specialties.slice(0, 3).map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="secondary"
                          className="bg-slate-700 text-slate-300 hover:bg-slate-600"
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {seller.specialties.length > 3 && (
                        <Badge variant="secondary" className="bg-slate-700 text-slate-300 hover:bg-slate-600">
                          +{seller.specialties.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-400 mb-4">
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="text-white">{seller.experience}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-slate-500" />
                        <span className="text-white">{seller.responseTime}</span>
                      </div>
                      <div className="flex items-center col-span-2">
                        <span className="text-slate-500 mr-2">Rate:</span>
                        <span className="text-white">{seller.hourlyRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-slate-800 to-slate-800/80 border-t border-slate-700">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-slate-700 hover:bg-slate-600 border-slate-600 text-white"
                      >
                        Request Quote
                      </Button>
                      <Link href={`/sellers/${seller.id}`}>
                        <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No sellers found</h3>
            <p className="text-slate-400 mb-4">Try adjusting your search or filters to find what you're looking for.</p>
            <Button onClick={clearAllFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
              Clear all filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
