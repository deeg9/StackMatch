"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Award, TrendingUp, Star, Shield, Trophy } from "lucide-react"

export function ReputationCard() {
  const { reputation, reputationLevels } = useSelector((state: RootState) => state.forum)
  const currentLevel = reputationLevels.find((level) => level.level === reputation.level)
  const nextLevel = reputationLevels.find((level) => level.level === reputation.nextLevel)

  const levelIcons = {
    1: Shield,
    2: Star,
    3: Award,
    4: TrendingUp,
    5: Trophy,
  }

  const LevelIcon = levelIcons[reputation.level as keyof typeof levelIcons] || Shield

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <LevelIcon className="h-5 w-5 mr-2 text-primary" />
          Community Reputation
        </CardTitle>
        <CardDescription>Your standing in the StackTalk community</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{currentLevel?.name}</p>
              <p className="text-sm text-muted-foreground">Level {reputation.level}</p>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              {reputation.points} XP
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress to {nextLevel?.name}</span>
              <span>{reputation.progress}%</span>
            </div>
            <Progress value={reputation.progress} className="h-2" />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Level Benefits:</p>
            <ul className="text-sm space-y-1">
              {currentLevel?.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {nextLevel && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium">Next Level ({nextLevel.name}):</p>
              <p className="text-xs text-muted-foreground">
                Earn {nextLevel.minPoints - reputation.points} more XP to reach level {nextLevel.level}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
