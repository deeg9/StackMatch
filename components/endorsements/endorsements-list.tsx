"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EndorsementBadge } from "./endorsement-badge"
import { Search, Filter, Award, Eye, EyeOff, Settings } from "lucide-react"
import type { Endorsement } from "@/store/slices/endorsementsSlice"

interface EndorsementsListProps {
  endorsements: Endorsement[]
}

export function EndorsementsList({ endorsements }: EndorsementsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")

  const filteredEndorsements = endorsements.filter((endorsement) => {
    const matchesSearch =
      endorsement.platformName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      endorsement.title.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && endorsement.isActive) ||
      (statusFilter === "expired" && !endorsement.isActive)

    const matchesLevel = levelFilter === "all" || endorsement.badgeLevel === levelFilter

    return matchesSearch && matchesStatus && matchesLevel
  })

  const toggleEndorsementVisibility = (endorsementId: string) => {
    // This would dispatch an action to update the endorsement's display settings
    console.log("Toggle visibility for endorsement:", endorsementId)
  }

  if (endorsements.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Endorsements Yet</h3>
            <p className="text-muted-foreground mb-4">
              Apply for partner endorsements to build credibility and trust with potential clients
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search endorsements..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Endorsements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEndorsements.map((endorsement) => (
          <Card key={endorsement.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <EndorsementBadge endorsement={endorsement} showDetails />
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleEndorsementVisibility(endorsement.id)}>
                    {endorsement.displaySettings.showOnProfile ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">{endorsement.title}</h3>
                  <p className="text-sm text-muted-foreground">{endorsement.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="capitalize">
                    {endorsement.badgeLevel}
                  </Badge>
                  <Badge variant="secondary">{endorsement.badgeType.replace("_", " ")}</Badge>
                  {endorsement.isVerified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Projects:</span>
                    <span className="ml-1 font-medium">{endorsement.endorsementDetails.projectsCompleted}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="ml-1 font-medium">
                      {endorsement.endorsementDetails.clientSatisfactionScore}/5.0
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Issued: {new Date(endorsement.issuedDate).toLocaleDateString()}
                    {endorsement.expiryDate && (
                      <span> • Expires: {new Date(endorsement.expiryDate).toLocaleDateString()}</span>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {endorsement.endorsementDetails.specializations.slice(0, 3).map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {endorsement.endorsementDetails.specializations.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{endorsement.endorsementDetails.specializations.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEndorsements.length === 0 && endorsements.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Matching Endorsements</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or filters</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
