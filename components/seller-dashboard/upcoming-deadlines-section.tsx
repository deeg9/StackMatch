import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"

interface Deadline {
  id: string
  title: string
  due_date: string
  type: "proposal_submission" | "project_milestone" | string // Allow other string types
}

interface UpcomingDeadlinesSectionProps {
  deadlines: Deadline[]
}

export function UpcomingDeadlinesSection({ deadlines }: UpcomingDeadlinesSectionProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Deadlines</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/calendar">
            {" "}
            {/* Or relevant page */}
            View Calendar <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {deadlines.length === 0 ? (
          <p className="text-muted-foreground">No upcoming deadlines.</p>
        ) : (
          <ul className="space-y-3">
            {deadlines.map((deadline) => (
              <li
                key={deadline.id}
                className="flex items-start space-x-3 p-3 border rounded-lg bg-card hover:shadow-sm"
              >
                <div className="flex-shrink-0 pt-0.5">
                  {deadline.type === "proposal_submission" ? (
                    <CalendarDays className="h-5 w-5 text-primary" />
                  ) : (
                    <Clock className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{deadline.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(deadline.due_date).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
