import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, User, Calendar } from "lucide-react"

interface ReviewsTabProps {
  isViewOnly?: boolean
}

export function ReviewsTab({ isViewOnly = false }: ReviewsTabProps) {
  // Sample reviews data
  const reviews = [
    {
      id: 1,
      author: "Sarah Johnson",
      company: "TechCorp Inc.",
      rating: 5,
      comment:
        "Outstanding work on our e-commerce platform. The team delivered exactly what we needed on time and within budget. Highly recommend!",
      date: "2024-01-15",
      project: "E-commerce Platform Development",
    },
    {
      id: 2,
      author: "Michael Chen",
      company: "StartupXYZ",
      rating: 5,
      comment:
        "Great communication throughout the project. TechSolutions understood our requirements perfectly and delivered a high-quality solution.",
      date: "2024-01-08",
      project: "Mobile App Development",
    },
    {
      id: 3,
      author: "Emily Rodriguez",
      company: "DataFlow Systems",
      rating: 4,
      comment:
        "Solid development work with good project management. The final product met all our requirements and the team was professional throughout.",
      date: "2023-12-22",
      project: "Data Analytics Dashboard",
    },
    {
      id: 4,
      author: "David Thompson",
      company: "CloudTech Solutions",
      rating: 4,
      comment: "Good technical skills and met all our requirements. Would work with them again for future projects.",
      date: "2023-12-10",
      project: "API Integration",
    },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`w-4 h-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span>Reviews Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center space-x-1 mb-2">{renderStars(Math.round(averageRating))}</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">{reviews.length}</div>
              <div className="text-sm text-muted-foreground">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground">100%</div>
              <div className="text-sm text-muted-foreground">Recommend Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual Reviews */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Client Reviews</h3>
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium">{review.author}</div>
                    <div className="text-sm text-muted-foreground">{review.company}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex space-x-1 mb-1">{renderStars(review.rating)}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <Badge variant="outline" className="text-xs">
                  {review.project}
                </Badge>
              </div>

              <p className="text-foreground leading-relaxed">{review.comment}</p>

              {!isViewOnly && (
                <div className="flex space-x-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    Flag
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isViewOnly && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">Want to see what it's like to work with TechSolutions Inc.?</p>
            <Button>
              <Star className="w-4 h-4 mr-2" />
              Contact for Your Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
