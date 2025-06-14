import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function DealRoomsArchiveLoading() {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deal Room Archive</h1>
        <Button variant="outline" disabled className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Deal Rooms
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Archived Deal Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Filters skeleton */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-10 flex-1" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-[140px]" />
                <Skeleton className="h-10 w-[140px]" />
              </div>
            </div>

            {/* Results skeleton */}
            <div className="border rounded-md">
              <div className="divide-y">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-48" />
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <Skeleton className="h-4 w-32" />
                            <span>•</span>
                            <Skeleton className="h-4 w-32" />
                            <span>•</span>
                            <Skeleton className="h-4 w-40" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-24" />
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
