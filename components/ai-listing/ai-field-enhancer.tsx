"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2 } from "lucide-react"

interface AIFieldEnhancerProps {
  fieldName: string
  currentValue: string
  onEnhance: (fieldName: string, currentValue: string, context?: string) => void
  isProcessing: boolean
  className?: string
}

export function AIFieldEnhancer({ fieldName, currentValue, onEnhance, isProcessing, className }: AIFieldEnhancerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [context, setContext] = useState("")

  const handleEnhance = () => {
    onEnhance(fieldName, currentValue, context)
    setIsOpen(false)
    setContext("")
  }

  const enhancementPrompts = {
    title: "Make this title more compelling and professional",
    aboutBusiness: "Expand this description with more detail and clarity",
    aboutCompany: "Make this company description more engaging",
    tags: "Suggest additional relevant technologies and skills",
    detailedNeeds: "Break down these requirements into more specific items",
    successMetrics: "Add measurable KPIs and success criteria",
    currentChallenges: "Elaborate on these challenges with more context",
    timelinePhases: "Create a more detailed project timeline",
  }

  const getDefaultPrompt = () => {
    return enhancementPrompts[fieldName as keyof typeof enhancementPrompts] || "Improve this field"
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isProcessing || !currentValue}
          className={`h-8 w-8 p-0 ${className}`}
          title="Enhance with AI"
        >
          {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-slate-800 border-slate-700" align="end">
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-2">Enhance Field</h4>
            <p className="text-xs text-slate-400">Tell the AI how you'd like to improve this field:</p>
          </div>

          <Textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder={getDefaultPrompt()}
            rows={3}
            className="text-sm bg-slate-700 border-slate-600"
          />

          <div className="flex gap-2">
            <Button size="sm" onClick={handleEnhance} disabled={isProcessing} className="flex-1">
              <Sparkles className="h-3 w-3 mr-1" />
              Enhance
            </Button>
            <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
