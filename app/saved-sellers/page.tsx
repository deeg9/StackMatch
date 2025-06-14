"use client"
import { BuyerDashboardHeader } from "@/components/buyer-dashboard/buyer-dashboard-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, MapPin, Star, Eye, MessageSquare, Trash2, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

// Mock data for saved sellers
const mockSavedSellers = [
  {
    id: "1",
    name: "TechSolutions Inc.",
    location: "San Francisco, CA",
    rating: 4.9,
    reviewCount: 127,
    specialties: ["Web Development", "Mobile Apps", "Cloud Solutions"],
    completedProjects: 45,
    responseTime: "2 hours",
    hourlyRate: "$75-150",
    description: "Full-stack development team specializing in modern web and mobile applications.",
    savedAt: new Date().toISOString(),
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
  },
  {
    id: "2",
    name: "DevCorp Solutions",
    location: "Austin, TX",
    rating: 4.8,
    reviewCount: 89,
    specialties: ["Enterprise Software", "DevOps", "Consulting"],
    completedProjects: 32,
    responseTime: "4 hours",
    hourlyRate: "$100-200",
    description: "Enterprise-focused development team with expertise in scalable solutions.",
    savedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
  },
]

export default function SavedSellersPage() {
  const savedSellers = mockSavedSellers // In real app, this would come from Redux state

  const handleRemoveSeller = async (sellerId: string) => {
    try {
      // In real app, dispatch remove action
      toast.success("Seller removed from saved")
    } catch (error) {
      toast.error("Failed to remove seller")
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <BuyerDashboardHeader />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Saved Sellers</h1>
          <p className="text-slate-400">
            {savedSellers.length} saved seller{savedSellers.length !== 1 ? "s" : ""}
          </p>
        </div>

        {savedSellers.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No saved sellers yet</h3>
            <p className="text-slate-400 mb-6">
              Start browsing sellers and save the ones you're interested in for easy access later.
            </p>
            <Link href="/browse-sellers">
              <Button className="bg-blue-600 hover:bg-blue-700">Browse Sellers</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedSellers.map((seller) => (
              <Card key={seller.id} className="bg-[#1e293b] border-slate-700 hover:border-slate-600 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-lg">{seller.name.charAt(0)}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white mb-1 flex items-center gap-2">
                          {seller.name}
                          {seller.verified && (
                            <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                              Verified
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-slate-400 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {seller.location}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSeller(seller.id)}
                      className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center text-yellow-400">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="text-white">{seller.rating}</span>
                      <span className="text-slate-400 ml-1">({seller.reviewCount})</span>
                    </div>
                    <div className="flex items-center text-slate-400">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{seller.completedProjects} projects</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-300 line-clamp-2">{seller.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {seller.specialties.slice(0, 3).map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Response time:</span>
                      <span className="text-white">{seller.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Hourly rate:</span>
                      <span className="text-white">{seller.hourlyRate}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    Saved {new Date(seller.savedAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-600 text-white hover:bg-slate-700"
                    >
                      <MessageSquare className="w-4 h-4 mr-1" />
                      Contact
                    </Button>
                    <Link href={`/sellers/${seller.id}`} className="flex-1">
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
