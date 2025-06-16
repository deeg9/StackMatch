"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProposalResponse } from "@/types/proposal-request-types"

interface ProposalResponsesListProps {
  requestId: string
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
              <CardTitle className="text-lg">Proposal #{response.id.slice(0, 8)}</CardTitle>
              <Badge variant={response.status === 'ACCEPTED' ? 'default' : 'secondary'}>
                {response.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{response.scope_description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Budget:</span> ${response.price.toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Timeline:</span> {response.timeline_days} days
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Submitted: {new Date(response.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}