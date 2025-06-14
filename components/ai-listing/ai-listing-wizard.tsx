"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, FileText, Sparkles, Save, X, AlertCircle } from "lucide-react"
import { AIConversationPanel } from "./ai-conversation-panel"
import { EnhancedListingForm } from "./enhanced-listing-form"
import { useToast } from "@/hooks/use-toast"
import {
  initializeSession,
  saveDraft,
  toggleConversationPanel,
  clearSession,
  loadExistingData,
} from "@/store/slices/aiListingSlice"
import type { RootState } from "@/store"
import type { ListingFormData } from "@/types/listing-types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AIListingWizardProps {
  onSubmit: (data: ListingFormData, isDraft: boolean) => Promise<void>
  onCancel?: () => void
  existingListingId?: string
}

export function AIListingWizard({ onSubmit, onCancel, existingListingId }: AIListingWizardProps) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [integrationError, setIntegrationError] = useState<string | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  const {
    sessionId,
    formData,
    conversationCollapsed,
    formCompletionPercentage,
    isLoading,
    error,
    messages,
    lastSavedAt,
  } = useSelector((state: RootState) => state.aiListing)

  // Initialize session on mount
  useEffect(() => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    dispatch(initializeSession(newSessionId))

    // If we have an existing listing ID, load that data
    if (existingListingId) {
      dispatch(loadExistingData(existingListingId))
    }

    return () => {
      // Cleanup on unmount
      dispatch(clearSession())
    }
  }, [dispatch, existingListingId])

  // Auto-save every 30 seconds (only if enabled and we have content)
  useEffect(() => {
    if (!sessionId || messages.length === 0 || !autoSaveEnabled) return

    const autoSaveInterval = setInterval(() => {
      handleSaveDraft(true) // Silent auto-save
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [sessionId, messages, formData, autoSaveEnabled])

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleSaveDraft = async (silent = false) => {
    if (!sessionId) return

    try {
      await dispatch(
        saveDraft({
          sessionId,
          formState: formData,
          conversationData: messages,
        }),
      ).unwrap()

      if (!silent) {
        toast({
          title: "Draft Saved",
          description: "Your progress has been saved.",
        })
      }
    } catch (error) {
      console.error("Save draft failed:", error)
      if (!silent) {
        toast({
          title: "Save Failed",
          description: "Failed to save draft. Your progress may be lost.",
          variant: "destructive",
        })
      }
      // Disable auto-save if it's failing
      setAutoSaveEnabled(false)
    }
  }

  const handleSubmitListing = async (isDraft: boolean) => {
    if (!sessionId) {
      toast({
        title: "Error",
        description: "Session not initialized. Please refresh and try again.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    setIntegrationError(null)

    try {
      // Convert form data to the expected format
      const listingData: ListingFormData = {
        title: formData.title || "",
        description: formData.aboutBusiness || "",
        categoryId: formData.categoryId,
        budgetMin: formData.budgetMin,
        budgetMax: formData.budgetMax,
        bidDeadline: formData.bidDeadline,
        aboutBusiness: formData.aboutBusiness,
        aboutCompany: formData.aboutCompany,
        tags: formData.tags || [],
        detailedNeeds: formData.detailedNeeds || [],
        successMetrics: formData.successMetrics || [],
        currentChallenges: formData.currentChallenges || [],
        timelinePhases: formData.timelinePhases || [],
        attachments: formData.attachments || [],
      }

      await onSubmit(listingData, isDraft)

      toast({
        title: isDraft ? "Draft Saved" : "Listing Published",
        description: isDraft
          ? "Your listing has been saved as a draft."
          : "Your listing has been published successfully!",
      })

      // Redirect to the appropriate page
      if (isDraft) {
        router.push("/buyer-dashboard")
      } else {
        router.push("/buyer-dashboard")
      }
    } catch (error) {
      console.error("Failed to submit listing:", error)
      setIntegrationError(error instanceof Error ? error.message : "Failed to create listing")

      toast({
        title: "Error",
        description: "Failed to submit listing. Please check the form for errors.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    dispatch(clearSession())
    onCancel?.()
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-blue-400" />
                <h1 className="text-xl font-semibold">AI-Assisted Listing Creation</h1>
              </div>

              {formCompletionPercentage > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${formCompletionPercentage}%` }}
                    />
                  </div>
                  <span>{formCompletionPercentage}% complete</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {lastSavedAt && (
                <span className="text-xs text-slate-400">Last saved: {new Date(lastSavedAt).toLocaleTimeString()}</span>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(toggleConversationPanel())}
                className="lg:hidden"
              >
                <MessageSquare className="h-4 w-4" />
                {conversationCollapsed ? "Show" : "Hide"} Chat
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveDraft(false)}
                disabled={isLoading || !sessionId || isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>

              <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSubmitting}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {integrationError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{integrationError}</AlertDescription>
          </Alert>
        )}

        {!autoSaveEnabled && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Auto-save Disabled</AlertTitle>
            <AlertDescription>
              Auto-save has been disabled due to errors. Please save manually to avoid losing your progress.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Left Panel - AI Conversation */}
          <div className={`${conversationCollapsed ? "hidden lg:block" : "block"}`}>
            <Card className="h-full bg-slate-900 border-slate-800">
              <CardContent className="p-0 h-full">
                <AIConversationPanel />
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Enhanced Form */}
          <div className={`${conversationCollapsed ? "lg:col-span-2" : ""}`}>
            <Card className="h-full bg-slate-900 border-slate-800">
              <CardContent className="p-6 h-full overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <h2 className="text-lg font-semibold">Project Listing</h2>
                </div>

                <EnhancedListingForm onSubmit={handleSubmitListing} isLoading={isLoading || isSubmitting} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
