import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Proposal } from "@/types" // Assuming a base Proposal type

// Extend or use a specific type for dashboard display
interface DashboardProposal extends Proposal {
  company_name?: string // Or client_name, fetched via join or available on proposal
}

interface RecentProposalsSectionProps {
  proposals: DashboardProposal[]
}

export function RecentProposalsSection({ proposals }: RecentProposalsSectionProps) {
  const getStatusVariant = (
    status?: string,
  ): "default" | "secondary" | "destructive" | "outline" | "success" | "warning" => {
    switch (status?.toUpperCase()) {
      case "ACCEPTED":
      case "WON":
        return "success"
      case "SUBMITTED":
      case "UNDER_REVIEW":
        return "default"
      case "SHORTLISTED":
        return "warning"
      case "REJECTED":
      case "LOST":
        return "destructive"
      default:
        return "secondary"
    }
  }

  // Add custom variants to Badge if not already present in globals.css or badge.tsx
  // For example: .badge-success { background-color: green; color: white; }
  // .badge-warning { background-color: orange; color: black; }

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>My Recent Proposals</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/proposals">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {proposals.length === 0 ? (
          <p className="text-muted-foreground">No recent proposals found.</p>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                  <div className="flex-1 mb-2 sm:mb-0">
                    <h3 className="font-semibold text-card-foreground mb-1">{proposal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-1">For: {proposal.company_name || "N/A"}</p>
                    <div className="flex items-center gap-x-4 gap-y-1 text-xs text-muted-foreground flex-wrap">
                      <span>Amount: ${proposal.amount?.toLocaleString() || "N/A"}</span>
                      {proposal.due_date && <span>Due: {new Date(proposal.due_date).toLocaleDateString()}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <Badge variant={getStatusVariant(proposal.status)}>
                      {proposal.status?.replace("_", " ") || "UNKNOWN"}
                    </Badge>
                    <Button variant="outline" size="icon" asChild title="View Proposal">
                      <Link href={`/proposals/${proposal.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
