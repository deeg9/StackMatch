"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Award, Shield, Star, CheckCircle, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Endorsement } from "@/store/slices/endorsementsSlice"

interface EndorsementBadgeProps {
  endorsement: Endorsement
  size?: "sm" | "md" | "lg"
  showDetails?: boolean
  className?: string
}

export function EndorsementBadge({
  endorsement,
  size = "md",
  showDetails = false,
  className = "",
}: EndorsementBadgeProps) {
  const getBadgeIcon = () => {
    switch (endorsement.badgeType) {
      case "certified_partner":
        return <Shield className="h-4 w-4" />
      case "premier_partner":
        return <Award className="h-4 w-4" />
      case "elite_partner":
        return <Star className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getBadgeColor = () => {
    switch (endorsement.badgeLevel) {
      case "platinum":
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white"
      case "gold":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
      case "silver":
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
      case "bronze":
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
      default:
        return "bg-primary text-primary-foreground"
    }
  }

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-8 w-8 text-sm",
    lg: "h-12 w-12 text-base",
  }

  if (!showDetails) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`inline-flex items-center justify-center rounded-full ${getBadgeColor()} ${sizeClasses[size]} ${className}`}
            >
              <img
                src={endorsement.platformLogo || "/placeholder.svg"}
                alt={endorsement.platformName}
                className="h-full w-full rounded-full object-contain p-1"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <p className="font-medium">{endorsement.title}</p>
              <p className="text-xs text-muted-foreground">{endorsement.platformName}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {endorsement.badgeLevel} {endorsement.badgeType.replace("_", " ")}
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className={`cursor-pointer hover:shadow-lg transition-shadow ${className}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center rounded-full ${getBadgeColor()} h-12 w-12`}>
                <img
                  src={endorsement.platformLogo || "/placeholder.svg"}
                  alt={endorsement.platformName}
                  className="h-10 w-10 rounded-full object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold text-sm">{endorsement.platformName}</h3>
                  {endorsement.isVerified && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{endorsement.title}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {endorsement.badgeLevel}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {endorsement.badgeType.replace("_", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center space-x-4 mb-4">
            <div className={`flex items-center justify-center rounded-full ${getBadgeColor()} h-16 w-16`}>
              <img
                src={endorsement.platformLogo || "/placeholder.svg"}
                alt={endorsement.platformName}
                className="h-12 w-12 rounded-full object-contain"
              />
            </div>
            <div>
              <DialogTitle className="text-xl">{endorsement.title}</DialogTitle>
              <DialogDescription className="text-base">
                {endorsement.platformName} • {endorsement.badgeLevel} {endorsement.badgeType.replace("_", " ")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <h4 className="font-semibold mb-2">About This Endorsement</h4>
            <p className="text-muted-foreground">{endorsement.description}</p>
          </div>

          {/* Endorsement Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Performance Metrics</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Projects Completed:</span>
                  <span className="font-medium">{endorsement.endorsementDetails.projectsCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Client Satisfaction:</span>
                  <span className="font-medium">{endorsement.endorsementDetails.clientSatisfactionScore}/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Certification Level:</span>
                  <span className="font-medium">{endorsement.endorsementDetails.certificationLevel}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-1">
                {endorsement.endorsementDetails.specializations.map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Endorsement Quote */}
          {endorsement.endorsementDetails.endorsementQuote && (
            <div className="bg-muted p-4 rounded-lg border-l-4 border-primary">
              <p className="text-sm italic mb-2">"{endorsement.endorsementDetails.endorsementQuote}"</p>
              <div className="flex items-center space-x-2">
                {endorsement.endorsementDetails.endorsedBy.avatar && (
                  <img
                    src={endorsement.endorsementDetails.endorsedBy.avatar || "/placeholder.svg"}
                    alt={endorsement.endorsementDetails.endorsedBy.name}
                    className="h-6 w-6 rounded-full"
                  />
                )}
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">{endorsement.endorsementDetails.endorsedBy.name}</span>
                  <span>, {endorsement.endorsementDetails.endorsedBy.title}</span>
                  <span> at {endorsement.endorsementDetails.endorsedBy.company}</span>
                </div>
              </div>
            </div>
          )}

          {/* Verification Info */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Issued {formatDistanceToNow(new Date(endorsement.issuedDate), { addSuffix: true })}</span>
              {endorsement.expiryDate && <span>• Expires {new Date(endorsement.expiryDate).toLocaleDateString()}</span>}
            </div>

            {endorsement.isVerified && (
              <div className="flex items-center space-x-1 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Verified</span>
              </div>
            )}
          </div>

          {/* Testimonials */}
          {endorsement.evidence.testimonials.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Client Testimonials</h4>
              <div className="space-y-3">
                {endorsement.evidence.testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{testimonial.clientName}</span>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">"{testimonial.quote}"</p>
                    <p className="text-xs text-muted-foreground">Project: {testimonial.projectTitle}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
