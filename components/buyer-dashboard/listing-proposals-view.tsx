"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

interface ListingProposalsViewProps {
  listingId: string
}

const ListingProposalsView: React.FC<ListingProposalsViewProps> = ({ listingId }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenDealRoom = async (proposalId?: string) => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("🔍 CLIENT DEBUG: Creating deal room for listing:", listingId)

      const response = await fetch("/api/deal-rooms/create-simple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          proposalId: proposalId || "auto-create", // Let the API create a proposal if needed
          listingId: listingId,
        }),
      })

      console.log("🔍 CLIENT DEBUG: Response status:", response.status)
      console.log("🔍 CLIENT DEBUG: Response headers:", JSON.stringify(Object.fromEntries(response.headers)))

      const responseText = await response.text()
      console.log("🔍 CLIENT DEBUG: Raw response text:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.log("🔍 CLIENT DEBUG: Failed to parse response as JSON:", parseError)
        console.log("🔍 CLIENT DEBUG: Response text was:", responseText)
        throw new Error(`Server returned invalid JSON: ${responseText.substring(0, 100)}...`)
      }

      if (response.ok && data.success) {
        console.log("🔍 CLIENT DEBUG: Deal room created successfully:", data.dealRoomId)
        alert(`Deal room created successfully! Redirecting to deal room...`)
        // Navigate to the deal room
        router.push(`/deal-rooms/${data.dealRoomId}`)
      } else {
        throw new Error(data.error || data.details || "Failed to create deal room")
      }
    } catch (error: any) {
      console.error("🔍 CLIENT DEBUG: Error creating deal room:", error.message)
      setError(error.message)
      alert(`Error creating deal room: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestCreation = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log("🔍 CLIENT DEBUG: Running test creation")

      const response = await fetch("/api/deal-rooms/test-creation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          test: true,
          listingId: listingId,
        }),
      })

      console.log("🔍 CLIENT DEBUG: Test creation response status:", response.status)
      console.log("🔍 CLIENT DEBUG: Test creation response headers:", Object.fromEntries(response.headers.entries()))

      const responseText = await response.text()
      console.log("🔍 CLIENT DEBUG: Test creation raw response:", responseText)

      let data
      try {
        data = JSON.parse(responseText)
        console.log("🔍 CLIENT DEBUG: Test creation parsed response:", data)
      } catch (parseError) {
        console.error("🔍 CLIENT DEBUG: Test creation parse error:", parseError)
        throw new Error(`Test creation response not JSON: ${responseText}`)
      }

      if (response.ok && data.success) {
        alert(`Test Creation Successful - ${data.message}`)
      } else {
        alert(`Test Creation Failed - Step: ${data.step} - ${data.details}`)
      }
    } catch (error: any) {
      console.error("🔍 CLIENT DEBUG: Test creation error:", error)
      setError(error.message)
      alert(`Test Creation Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Listing Proposals</h2>
        <p className="mb-4">Listing ID: {listingId}</p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">{error}</div>}

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => handleOpenDealRoom()} disabled={isLoading} className="flex items-center">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Deal Room
          </Button>

          <Button onClick={handleTestCreation} variant="outline" disabled={isLoading} className="flex items-center">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Test Creation
          </Button>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Next Steps:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Click "Create Deal Room" to create a new deal room for this listing</li>
            <li>You'll be redirected to the deal room where you can manage contracts and communications</li>
            <li>Invite team members to collaborate in the deal room</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

export { ListingProposalsView }
export default ListingProposalsView
