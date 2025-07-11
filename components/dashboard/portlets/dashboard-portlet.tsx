'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface DashboardPortletProps {
  title: string
  children: ReactNode
  viewAllLink?: string
  viewAllText?: string
  headerAction?: ReactNode
  className?: string
  hoverBorderColor?: string
}

export function DashboardPortlet({
  title,
  children,
  viewAllLink,
  viewAllText = "View All",
  headerAction,
  className,
  hoverBorderColor = "hover:border-[#4A73CC]"
}: DashboardPortletProps) {
  return (
    <Card className={cn(
      "border-2 transition-all duration-300",
      hoverBorderColor,
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-[#1A2B4C]">{title}</CardTitle>
        {headerAction || (viewAllLink && (
          <Link href={viewAllLink}>
            <Button variant="ghost" size="sm" className="text-[#4A73CC] hover:text-[#1A2B4C]">
              {viewAllText}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        ))}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}