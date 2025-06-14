"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { BarChart2, CheckCircle } from "lucide-react"

interface PollOption {
  id: string
  text: string
  votes: number
}

interface PollComponentProps {
  pollId: string
  options: PollOption[]
  totalVotes: number
  userVote?: string
  onVote: (optionId: string) => void
  showResults?: boolean
}

export function PollComponent({
  pollId,
  options,
  totalVotes,
  userVote,
  onVote,
  showResults = false,
}: PollComponentProps) {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userVote)
  const [viewingResults, setViewingResults] = useState(showResults || !!userVote)

  const handleVote = () => {
    if (selectedOption) {
      onVote(selectedOption)
      setViewingResults(true)
    }
  }

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  if (viewingResults) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-primary" />
              <h3 className="font-medium">Poll Results</h3>
            </div>
            <div className="text-sm text-muted-foreground">{totalVotes} votes</div>
          </div>

          <div className="space-y-4">
            {options
              .sort((a, b) => b.votes - a.votes)
              .map((option) => {
                const percentage = getPercentage(option.votes)
                const isUserVote = option.id === userVote

                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{option.text}</span>
                        {isUserVote && <CheckCircle className="h-4 w-4 ml-2 text-green-500" />}
                      </div>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                    <Progress value={percentage} className={`h-2 ${isUserVote ? "bg-primary/20" : "bg-muted"}`} />
                    <div className="text-xs text-muted-foreground">
                      {option.votes} {option.votes === 1 ? "vote" : "votes"}
                    </div>
                  </div>
                )
              })}
          </div>

          <Button variant="outline" className="mt-4 w-full" onClick={() => setViewingResults(false)}>
            Back to Voting
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center mb-4">
          <BarChart2 className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-medium">Poll</h3>
        </div>

        <RadioGroup value={selectedOption} onValueChange={setSelectedOption}>
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="flex justify-between mt-6">
          <Button variant="outline" size="sm" onClick={() => setViewingResults(true)}>
            View Results
          </Button>
          <Button size="sm" onClick={handleVote} disabled={!selectedOption}>
            Vote
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
