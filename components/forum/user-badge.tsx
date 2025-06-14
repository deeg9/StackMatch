import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Building, Briefcase, CheckCircle, Shield, Award } from "lucide-react"

type UserRole = "BUSINESS" | "PROVIDER" | "ADMIN" | "MODERATOR"
type VerificationStatus = "VERIFIED" | "TRUSTED" | "EXPERT" | "NONE"

interface UserBadgeProps {
  role: UserRole
  verificationStatus?: VerificationStatus
  isAnonymous?: boolean
  contributionLevel?: number // 1-5 scale for contribution level
}

export function UserBadge({
  role,
  verificationStatus = "NONE",
  isAnonymous = false,
  contributionLevel = 0,
}: UserBadgeProps) {
  if (isAnonymous) {
    return (
      <Badge variant="outline" className="text-muted-foreground">
        Anonymous
      </Badge>
    )
  }

  const getRoleBadge = () => {
    switch (role) {
      case "BUSINESS":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Building className="h-3 w-3 mr-1" />
                  Business
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Business user</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "PROVIDER":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Briefcase className="h-3 w-3 mr-1" />
                  Provider
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Service provider</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "ADMIN":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </Badge>
              </TooltipTrigger>
              <TooltipContent>StackMatch administrator</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "MODERATOR":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Moderator
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Forum moderator</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      default:
        return null
    }
  }

  const getVerificationBadge = () => {
    switch (verificationStatus) {
      case "VERIFIED":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Identity verified</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "TRUSTED":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Trusted Experience
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Verified purchase or implementation experience</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      case "EXPERT":
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  <Award className="h-3 w-3 mr-1" />
                  Expert
                </Badge>
              </TooltipTrigger>
              <TooltipContent>Recognized domain expert</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      default:
        return null
    }
  }

  const getContributionBadge = () => {
    if (contributionLevel <= 0) return null

    const levels = [
      { label: "Newcomer", color: "bg-slate-50 text-slate-700 border-slate-200" },
      { label: "Contributor", color: "bg-green-50 text-green-700 border-green-200" },
      { label: "Active", color: "bg-blue-50 text-blue-700 border-blue-200" },
      { label: "Trusted", color: "bg-purple-50 text-purple-700 border-purple-200" },
      { label: "Top Contributor", color: "bg-amber-50 text-amber-700 border-amber-200" },
    ]

    const level = Math.min(Math.max(contributionLevel, 1), 5) - 1
    const { label, color } = levels[level]

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className={color}>
              {label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>Level {contributionLevel} contributor</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {getRoleBadge()}
      {getVerificationBadge()}
      {getContributionBadge()}
    </div>
  )
}
