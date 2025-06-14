"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SellerDashboardHeaderProps {
  sellerName?: string
  totalListings?: number
  activeProposals?: number
  completedProjects?: number
  rating?: number
}

export function SellerDashboardHeader({
  sellerName = "Seller Dashboard",
  totalListings = 0,
  activeProposals = 0,
  completedProjects = 0,
  rating = 0
}: SellerDashboardHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{sellerName}</h1>
        {rating > 0 && (
          <Badge variant="outline" className="text-lg px-3 py-1">
            ⭐ {rating.toFixed(1)}
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProposals}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Completed Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}