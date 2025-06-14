import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { BarChartIcon as ChartIcon, BarChart3 } from "lucide-react"

interface ClosureAnalyticsProps {
  dealRoomId: string
}

export function ClosureAnalytics({ dealRoomId }: ClosureAnalyticsProps) {
  // Mock data for the charts
  const reasonData = [
    { name: "Project Completed", value: 42 },
    { name: "Project Cancelled", value: 18 },
    { name: "Moved Elsewhere", value: 15 },
    { name: "No Longer Needed", value: 12 },
    { name: "Dispute", value: 8 },
    { name: "Other", value: 5 },
  ]

  const timelineData = [
    { name: "< 1 week", successful: 5, unsuccessful: 2 },
    { name: "1-2 weeks", successful: 12, unsuccessful: 4 },
    { name: "2-4 weeks", successful: 18, unsuccessful: 7 },
    { name: "1-2 months", successful: 25, unsuccessful: 10 },
    { name: "2-3 months", successful: 15, unsuccessful: 8 },
    { name: "> 3 months", successful: 10, unsuccessful: 5 },
  ]

  const feedbackData = [
    { name: "5 Stars", value: 35 },
    { name: "4 Stars", value: 25 },
    { name: "3 Stars", value: 15 },
    { name: "2 Stars", value: 10 },
    { name: "1 Star", value: 5 },
  ]

  // Colors for the pie chart
  const COLORS = ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800"]

  // Colors for the bar chart
  const successColor = "#4CAF50"
  const unsuccessColor = "#F44336"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ChartIcon className="h-5 w-5" />
          <span>Closure Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reasons">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reasons" className="flex items-center gap-2">
              <ChartIcon className="h-4 w-4" />
              <span>Closure Reasons</span>
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Timeline Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <ChartIcon className="h-4 w-4" />
              <span>Feedback Analysis</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="reasons">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reasonData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {reasonData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} deal rooms`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">
                Distribution of reasons for deal room closures across the platform
              </p>
            </TabsContent>

            <TabsContent value="timeline">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="successful" name="Successful Closures" fill={successColor} />
                    <Bar dataKey="unsuccessful" name="Unsuccessful Closures" fill={unsuccessColor} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">
                Duration of deal rooms before closure, comparing successful vs unsuccessful outcomes
              </p>
            </TabsContent>

            <TabsContent value="feedback">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={feedbackData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {feedbackData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === 0
                              ? "#4CAF50"
                              : index === 1
                                ? "#8BC34A"
                                : index === 2
                                  ? "#FFC107"
                                  : index === 3
                                    ? "#FF9800"
                                    : "#F44336"
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} ratings`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-500 text-center mt-4">
                Distribution of feedback ratings for closed deal rooms
              </p>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
