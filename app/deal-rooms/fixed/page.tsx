"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function FixedDealRoomsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dealRooms, setDealRooms] = useState<any[]>([])
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const fetchDealRooms = async () => {
      try {
        console.log("🔍 FIXED PAGE: Starting fetch...")
        const response = await fetch("/api/deal-rooms/fixed")
        console.log("🔍 FIXED PAGE: Response status:", response.status)
        console.log("🔍 FIXED PAGE: Response ok:", response.ok)

        const contentType = response.headers.get("content-type")
        console.log("🔍 FIXED PAGE: Content type:", contentType)

        if (contentType?.includes("application/json")) {
          const data = await response.json()
          console.log("🔍 FIXED PAGE: Data received:", data)

          if (data.error) {
            setError(data.error)
          } else {
            setDealRooms(data.dealRooms || [])
            setDebugInfo(data.debug || null)
          }
        } else {
          const text = await response.text()
          console.log("🔍 FIXED PAGE: Non-JSON response:", text)
          setError(`Server returned non-JSON response: ${text}`)
        }
      } catch (err) {
        console.error("🔍 FIXED PAGE: Error:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchDealRooms()
  }, [])

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Deal Rooms (Fixed Version)</h1>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : dealRooms.length === 0 ? (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Deal Rooms Found</AlertTitle>
          <AlertDescription>
            You don't have any deal rooms yet. This could be because:
            <ul className="list-disc pl-5 mt-2">
              <li>You haven't created any deal rooms</li>
              <li>Your user ID doesn't match any buyer_id or seller_id in the deal_rooms table</li>
              <li>There might be an issue with the database structure</li>
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dealRooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <CardTitle>{room.room_name}</CardTitle>
                <CardDescription>Status: {room.status}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Created: {new Date(room.created_at).toLocaleString()}</p>
                <p className="text-sm mt-2">Listing: {room.listing?.title || "N/A"}</p>
                <p className="text-sm mt-2">Buyer: {room.listing?.buyer_profile?.company_name || "N/A"}</p>
                <p className="text-sm mt-2">Seller: {room.proposal?.seller_profile?.company_name || "N/A"}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {debugInfo && (
        <div className="mt-8 border p-4 rounded-md">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2">
            <p>
              <strong>Total Deal Rooms in Database:</strong> {debugInfo.allDealRooms}
            </p>
            <p>
              <strong>Deal Rooms Matching Your User ID:</strong> {debugInfo.userDealRooms}
            </p>

            {debugInfo.userMatches && debugInfo.userMatches.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium mt-4 mb-2">User Matches:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">Room ID</th>
                        <th className="border border-gray-300 px-4 py-2">Room Name</th>
                        <th className="border border-gray-300 px-4 py-2">Buyer ID</th>
                        <th className="border border-gray-300 px-4 py-2">Seller ID</th>
                        <th className="border border-gray-300 px-4 py-2">Is Buyer</th>
                        <th className="border border-gray-300 px-4 py-2">Is Seller</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debugInfo.userMatches.map((match: any, index: number) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2">{match.roomId.substring(0, 8)}...</td>
                          <td className="border border-gray-300 px-4 py-2">{match.roomName || "N/A"}</td>
                          <td className="border border-gray-300 px-4 py-2">{match.buyerId?.substring(0, 8)}...</td>
                          <td className="border border-gray-300 px-4 py-2">{match.sellerId?.substring(0, 8)}...</td>
                          <td className="border border-gray-300 px-4 py-2">{match.userIsBuyer ? "✅" : "❌"}</td>
                          <td className="border border-gray-300 px-4 py-2">{match.userIsSeller ? "✅" : "❌"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-amber-600">No deal rooms match your user ID.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
