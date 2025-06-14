import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Calendar } from "lucide-react"

export default function DealRoomAnalyticsLoading() {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Deal Room Analytics</h1>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[140px]" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Skeleton className="h-4 w-24 mx-auto" />
                  <Skeleton className="h-8 w-16 mx-auto mt-2" />
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="charts">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="charts" className="flex items-center gap-2" disabled>
            <BarChart3 className="h-4 w-4" />
            <span>Charts</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2" disabled>
            <Calendar className="h-4 w-4" />
            <span>Raw Data</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="charts">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-80 w-full" />
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
