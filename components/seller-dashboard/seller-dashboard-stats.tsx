import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Award, TrendingUp, DollarSign, Star } from "lucide-react"

interface SellerDashboardStatsProps {
  activeProposalsCount: number
  wonListingsCount: number
  successRate: number // Percentage
  totalEarned: number
  profileRating: string // e.g., "4.7" or "N/A"
  profileViews: number // Placeholder for now
}

export function SellerDashboardStats({
  activeProposalsCount,
  wonListingsCount,
  successRate,
  totalEarned,
  profileRating,
  profileViews,
}: SellerDashboardStatsProps) {
  const stats = [
    {
      title: "Active Proposals",
      value: activeProposalsCount.toString(),
      icon: FileText,
      description: "Currently under review or submitted.",
    },
    {
      title: "Won Listings",
      value: wonListingsCount.toString(),
      icon: Award,
      description: "Successfully secured projects.",
    },
    {
      title: "Success Rate",
      value: `${successRate}%`,
      icon: TrendingUp,
      description: "Based on submitted vs. won proposals.",
      hasProgressBar: true,
      progressValue: successRate,
    },
    {
      title: "Total Earned",
      value: `$${totalEarned.toLocaleString()}`, // Format as currency
      icon: DollarSign,
      description: "From completed listings.",
    },
    {
      title: "Profile Rating",
      value: profileRating,
      icon: Star,
      description: `${profileViews} profile views`, // Placeholder for views
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground pt-1">{stat.description}</p>
            {stat.hasProgressBar && <Progress value={stat.progressValue} className="mt-2 h-2" />}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
