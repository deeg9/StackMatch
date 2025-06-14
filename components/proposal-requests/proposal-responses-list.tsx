"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProposalResponse {
  id: string
  proposalText: string
  budget: number
  timeline: string
  status: string
  seller: {
    name: string
    rating: number
  }
  createdAt: string
}

interface ProposalResponsesListProps {
  responses: ProposalResponse[]
}

export function ProposalResponsesList({ responses }: ProposalResponsesListProps) {
  if (responses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No proposal responses yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <Card key={response.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{response.seller.name}</CardTitle>
              <Badge variant={response.status === 'accepted' ? 'default' : 'secondary'}>
                {response.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{response.proposalText}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Budget:</span> ${response.budget.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Timeline:</span> {response.timeline}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Submitted: {new Date(response.createdAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}