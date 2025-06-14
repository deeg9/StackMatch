import { Shield, ShieldOff, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EncryptionIndicatorProps {
  isEnabled: boolean
  isSupported: boolean
  className?: string
}

export function EncryptionIndicator({ isEnabled, isSupported, className = "" }: EncryptionIndicatorProps) {
  if (!isSupported) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary" className={`text-xs ${className}`}>
              <ShieldOff className="h-3 w-3 mr-1" />
              Not Supported
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>End-to-end encryption is not supported in this browser</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (isEnabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="default" className={`bg-green-600 hover:bg-green-700 text-xs ${className}`}>
              <ShieldCheck className="h-3 w-3 mr-1" />
              Encrypted
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>This conversation is protected with end-to-end encryption</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className={`text-xs ${className}`}>
            <Shield className="h-3 w-3 mr-1" />
            Not Encrypted
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>This conversation is not encrypted. Enable encryption for better security.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
