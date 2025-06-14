"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArchivedDealRooms } from "@/components/deal-rooms/archived-deal-rooms"
import { ExportDealRoomData } from "@/components/deal-rooms/export-deal-room-data"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import { DealRoomStatus, ClosureOutcomeType } from "@/types/deal-room-types"

interface ArchivedDealRoom {
  id: string
  name: string
  status: DealRoomStatus
  closedAt: string
  outcomeType?: ClosureOutcomeType
  buyerName: string
  sellerName: string
}

export default function DealRoomsArchivePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [archivedDealRooms, setArchivedDealRooms] = useState<ArchivedDealRoom[]>([])
  const [exportingDealRoom, setExportingDealRoom] = useState<ArchivedDealRoom | null>(null)

  useEffect(() => {
    // In a real implementation, this would fetch archived deal rooms from the API
    const fetchArchivedDealRooms = async () => {
      setLoading(true)

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        setArchivedDealRooms([
          {
            id: "1",
            name: "Website Redesign Project",
            status: DealRoomStatus.CLOSED_SUCCESSFULLY,
            closedAt: "2023-05-15T10:30:00Z",
            outcomeType: ClosureOutcomeType.SUCCESSFUL,
            buyerName: "Acme Corp",
            sellerName: "WebDesign Pro",
          },
          {
            id: "2",
            name: "Mobile App Development",
            status: DealRoomStatus.CLOSED_UNSUCCESSFULLY,
            closedAt: "2023-06-22T14:45:00Z",
            outcomeType: ClosureOutcomeType.UNSUCCESSFUL,
            buyerName: "TechStart Inc",
            sellerName: "AppDevs LLC",
          },
          {
            id: "3",
            name: "E-commerce Integration",
            status: DealRoomStatus.CLOSED_SUCCESSFULLY,
            closedAt: "2023-07-10T09:15:00Z",
            outcomeType: ClosureOutcomeType.SUCCESSFUL,
            buyerName: "RetailGiant",
            sellerName: "E-Commerce Solutions",
          },
          {
            id: "4",
            name: "CRM Implementation",
            status: DealRoomStatus.CLOSED_UNSUCCESSFULLY,
            closedAt: "2023-08-05T16:20:00Z",
            outcomeType: ClosureOutcomeType.UNSUCCESSFUL,
            buyerName: "Sales Masters",
            sellerName: "CRM Experts",
          },
          {
            id: "5",
            name: "SEO Optimization Project",
            status: DealRoomStatus.CLOSED_SUCCESSFULLY,
            closedAt: "2023-09-18T11:00:00Z",
            outcomeType: ClosureOutcomeType.SUCCESSFUL,
            buyerName: "GrowthHackers",
            sellerName: "SEO Wizards",
          },
        ])
      } catch (error) {
        console.error("Error fetching archived deal rooms:", error)
        setArchivedDealRooms([])
      } finally {
        setLoading(false)
      }
    }

    fetchArchivedDealRooms()
  }, [])

  // Handle view deal room
  const handleViewDealRoom = (id: string) => {
    router.push(`/deal-rooms/${id}`)
  }

  // Handle export data
  const handleExportData = (id: string) => {
    const dealRoom = archivedDealRooms.find((room) => room.id === id)
    if (dealRoom) {
      setExportingDealRoom(dealRoom)
    }
  }

  // Handle export
  const handleExport = async (options: string[]) => {
    if (!exportingDealRoom) return

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, this would call an API to generate and download the export
      console.log(`Exporting deal room ${exportingDealRoom.id} with options:`, options)

      // Create a mock download
      const blob = new Blob([`Mock export data for ${exportingDealRoom.name} (${options.join(", ")})`], {
        type: "text/plain",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `dealroom-${exportingDealRoom.id}-export.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Close export dialog
      setExportingDealRoom(null)
    } catch (error) {
      console.error("Error exporting deal room data:", error)
      // Handle error (show toast, etc.)
    }
  }

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deal Room Archive</h1>
        <Button variant="outline" onClick={() => router.push("/deal-rooms")} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Deal Rooms
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : exportingDealRoom ? (
        <ExportDealRoomData
          dealRoomId={exportingDealRoom.id}
          dealRoomName={exportingDealRoom.name}
          closedAt={exportingDealRoom.closedAt}
          onExport={handleExport}
          onCancel={() => setExportingDealRoom(null)}
        />
      ) : (
        <ArchivedDealRooms
          dealRooms={archivedDealRooms}
          onViewDealRoom={handleViewDealRoom}
          onExportData={handleExportData}
        />
      )}
    </div>
  )
}
