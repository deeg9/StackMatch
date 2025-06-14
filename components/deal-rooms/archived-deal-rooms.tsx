"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Calendar, CheckCircle2, XCircle } from "lucide-react"
import { DealRoomStatus, ClosureOutcomeType } from "@/types/deal-room-types"
import { format } from "date-fns"

interface ArchivedDealRoom {
  id: string
  name: string
  status: DealRoomStatus
  closedAt: string
  outcomeType?: ClosureOutcomeType
  buyerName: string
  sellerName: string
}

interface ArchivedDealRoomsProps {
  dealRooms: ArchivedDealRoom[]
  onViewDealRoom: (id: string) => void
  onExportData: (id: string) => void
}

export function ArchivedDealRooms({ dealRooms, onViewDealRoom, onExportData }: ArchivedDealRoomsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [outcomeFilter, setOutcomeFilter] = useState<string>("all")

  // Apply filters
  const filteredDealRooms = dealRooms.filter((room) => {
    // Search filter
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch =
      searchTerm === "" ||
      room.name.toLowerCase().includes(searchLower) ||
      room.buyerName.toLowerCase().includes(searchLower) ||
      room.sellerName.toLowerCase().includes(searchLower)

    // Status filter
    const matchesStatus = statusFilter === "all" || room.status === statusFilter

    // Outcome filter
    const matchesOutcome = outcomeFilter === "all" || room.outcomeType === outcomeFilter

    return matchesSearch && matchesStatus && matchesOutcome
  })

  // Get status badge
  const getStatusBadge = (status: DealRoomStatus, outcomeType?: ClosureOutcomeType) => {
    switch (status) {
      case DealRoomStatus.CLOSED_SUCCESSFULLY:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Successful</span>
          </Badge>
        )
      case DealRoomStatus.CLOSED_UNSUCCESSFULLY:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Unsuccessful</span>
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {status}
          </Badge>
        )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Archived Deal Rooms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search deal rooms..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={DealRoomStatus.CLOSED_SUCCESSFULLY}>Successful</SelectItem>
                  <SelectItem value={DealRoomStatus.CLOSED_UNSUCCESSFULLY}>Unsuccessful</SelectItem>
                </SelectContent>
              </Select>

              <Select value={outcomeFilter} onValueChange={setOutcomeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Outcome" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Outcomes</SelectItem>
                  <SelectItem value={ClosureOutcomeType.SUCCESSFUL}>Successful</SelectItem>
                  <SelectItem value={ClosureOutcomeType.UNSUCCESSFUL}>Unsuccessful</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results */}
          <div className="border rounded-md">
            {filteredDealRooms.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No archived deal rooms found</div>
            ) : (
              <div className="divide-y">
                {filteredDealRooms.map((room) => (
                  <div key={room.id} className="p-4 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="font-medium">{room.name}</h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-500">
                          <span>Buyer: {room.buyerName}</span>
                          <span>•</span>
                          <span>Seller: {room.sellerName}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Closed {format(new Date(room.closedAt), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(room.status, room.outcomeType)}

                        <Button size="sm" variant="outline" onClick={() => onViewDealRoom(room.id)}>
                          View
                        </Button>

                        <Button size="sm" variant="ghost" onClick={() => onExportData(room.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
