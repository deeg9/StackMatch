"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BusinessPreferencesStepProps {
  formData: {
    project_size_preference: string
    budget_range_preference: string
    availability: string
    preferred_communication: string[]
    notification_preferences: {
      email: boolean
      in_app: boolean
      project_updates: boolean
      marketing: boolean
    }
  }
  updateFormData: (data: Partial<BusinessPreferencesStepProps["formData"]>) => void
}

const projectSizes = [
  "Small projects (< $5K)",
  "Medium projects ($5K - $25K)",
  "Large projects ($25K - $100K)",
  "Enterprise projects ($100K+)",
  "Any size",
]

const budgetRanges = ["$1K - $5K", "$5K - $15K", "$15K - $50K", "$50K - $100K", "$100K - $250K", "$250K+"]

const availabilityOptions = [
  "Available immediately",
  "Available within 2 weeks",
  "Available within 1 month",
  "Available within 3 months",
  "Not currently available",
]

const communicationMethods = ["Email", "Phone", "Video Call", "In-App Messaging", "Text/SMS", "Slack"]

export default function BusinessPreferencesStep({ formData, updateFormData }: BusinessPreferencesStepProps) {
  const handleCommunicationMethodChange = (method: string, checked: boolean) => {
    if (checked) {
      updateFormData({ preferred_communication: [...formData.preferred_communication, method] })
    } else {
      updateFormData({ preferred_communication: formData.preferred_communication.filter((m) => m !== method) })
    }
  }

  const handleNotificationChange = (key: keyof typeof formData.notification_preferences, value: boolean) => {
    updateFormData({
      notification_preferences: {
        ...formData.notification_preferences,
        [key]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Business Preferences</h2>
        <p className="text-slate-400">Set your preferences for project types and communication.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Preferred Project Size</Label>
          <RadioGroup
            value={formData.project_size_preference}
            onValueChange={(value) => updateFormData({ project_size_preference: value })}
            className="space-y-2"
          >
            {projectSizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size} id={`size-${size}`} className="border-slate-700 text-blue-600" />
                <Label htmlFor={`size-${size}`} className="text-slate-300">
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label htmlFor="budget_range_preference">Preferred Budget Range</Label>
          <Select
            value={formData.budget_range_preference}
            onValueChange={(value) => updateFormData({ budget_range_preference: value })}
          >
            <SelectTrigger id="budget_range_preference" className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select preferred budget range" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {budgetRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label htmlFor="availability">Current Availability</Label>
          <Select value={formData.availability} onValueChange={(value) => updateFormData({ availability: value })}>
            <SelectTrigger id="availability" className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select your availability" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {availabilityOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Preferred Communication Methods (Select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {communicationMethods.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox
                  id={`comm-method-${method}`}
                  checked={formData.preferred_communication.includes(method)}
                  onCheckedChange={(checked) => handleCommunicationMethodChange(method, checked === true)}
                  className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor={`comm-method-${method}`} className="text-slate-300">
                  {method}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Notification Preferences</Label>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-slate-300">
                  Email Notifications
                </Label>
                <p className="text-xs text-slate-400">Receive updates via email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={formData.notification_preferences.email}
                onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="in-app-notifications" className="text-slate-300">
                  In-App Notifications
                </Label>
                <p className="text-xs text-slate-400">Receive notifications within the platform</p>
              </div>
              <Switch
                id="in-app-notifications"
                checked={formData.notification_preferences.in_app}
                onCheckedChange={(checked) => handleNotificationChange("in_app", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="project-updates" className="text-slate-300">
                  Project Updates
                </Label>
                <p className="text-xs text-slate-400">Get notified about new projects and opportunities</p>
              </div>
              <Switch
                id="project-updates"
                checked={formData.notification_preferences.project_updates}
                onCheckedChange={(checked) => handleNotificationChange("project_updates", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails" className="text-slate-300">
                  Marketing Communications
                </Label>
                <p className="text-xs text-slate-400">Receive tips, news, and promotional content</p>
              </div>
              <Switch
                id="marketing-emails"
                checked={formData.notification_preferences.marketing}
                onCheckedChange={(checked) => handleNotificationChange("marketing", checked)}
                className="data-[state=checked]:bg-blue-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
