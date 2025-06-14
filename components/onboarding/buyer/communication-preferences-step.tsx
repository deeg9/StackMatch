"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Upload, Globe, Clock, Languages } from "lucide-react"

interface CommunicationPreferencesStepProps {
  formData: {
    preferred_communication: string[]
    notification_preferences: {
      email: boolean
      in_app: boolean
      proposal_updates: boolean
      marketing: boolean
    }
    social_media: {
      linkedin: string
      twitter: string
      facebook: string
    }
    verification_document_url: string
    preferred_meeting_times: string[]
    preferred_languages: string[]
    timezone: string
  }
  updateFormData: (data: Partial<CommunicationPreferencesStepProps["formData"]>) => void
}

const communicationMethods = ["Email", "Phone", "Video Call", "In-App Messaging", "Text/SMS"]
const meetingTimes = ["Early Morning", "Morning", "Afternoon", "Evening", "Late Night"]
const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Portuguese", "Russian", "Arabic"]
const timezones = [
  "GMT-12:00",
  "GMT-11:00",
  "GMT-10:00",
  "GMT-09:00",
  "GMT-08:00",
  "GMT-07:00",
  "GMT-06:00",
  "GMT-05:00",
  "GMT-04:00",
  "GMT-03:00",
  "GMT-02:00",
  "GMT-01:00",
  "GMT+00:00",
  "GMT+01:00",
  "GMT+02:00",
  "GMT+03:00",
  "GMT+04:00",
  "GMT+05:00",
  "GMT+06:00",
  "GMT+07:00",
  "GMT+08:00",
  "GMT+09:00",
  "GMT+10:00",
  "GMT+11:00",
  "GMT+12:00",
]

export default function CommunicationPreferencesStep({ formData, updateFormData }: CommunicationPreferencesStepProps) {
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

  const handleSocialMediaChange = (platform: keyof typeof formData.social_media, value: string) => {
    updateFormData({
      social_media: {
        ...formData.social_media,
        [platform]: value,
      },
    })
  }

  const handleMeetingTimeChange = (time: string, checked: boolean) => {
    if (checked) {
      updateFormData({ preferred_meeting_times: [...formData.preferred_meeting_times, time] })
    } else {
      updateFormData({ preferred_meeting_times: formData.preferred_meeting_times.filter((t) => t !== time) })
    }
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    if (checked) {
      updateFormData({ preferred_languages: [...formData.preferred_languages, language] })
    } else {
      updateFormData({ preferred_languages: formData.preferred_languages.filter((l) => l !== language) })
    }
  }

  const handleVerificationUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real implementation, you would upload to storage and get a URL
      // For now, we'll just store the file name
      updateFormData({ verification_document_url: file.name })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Communication & Verification</h2>
        <p className="text-slate-400">Tell us how you prefer to communicate and verify your business.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Preferred Communication Methods (Select all that apply)</Label>
          <div className="space-y-2">
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

        <Separator className="bg-slate-700" />

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
                <Label htmlFor="proposal-updates" className="text-slate-300">
                  Proposal Updates
                </Label>
                <p className="text-xs text-slate-400">Get notified about new proposals and updates</p>
              </div>
              <Switch
                id="proposal-updates"
                checked={formData.notification_preferences.proposal_updates}
                onCheckedChange={(checked) => handleNotificationChange("proposal_updates", checked)}
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

        <Separator className="bg-slate-700" />

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-500" />
            <Label className="text-lg font-medium text-white">Company Social Media</Label>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/company/yourcompany"
                value={formData.social_media.linkedin}
                onChange={(e) => handleSocialMediaChange("linkedin", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter/X Profile URL</Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/yourcompany"
                value={formData.social_media.twitter}
                onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook Page URL</Label>
              <Input
                id="facebook"
                placeholder="https://facebook.com/yourcompany"
                value={formData.social_media.facebook}
                onChange={(e) => handleSocialMediaChange("facebook", e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-500" />
            <Label className="text-lg font-medium text-white">Business Verification (Optional)</Label>
          </div>
          <p className="text-sm text-slate-400">
            Upload business registration documents to get verified status. This helps build trust with service
            providers.
          </p>
          <div className="flex items-center space-x-4">
            <input
              type="file"
              id="verification-document"
              onChange={handleVerificationUpload}
              className="hidden"
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById("verification-document")?.click()}
              className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
            <span className="text-sm text-slate-400">
              {formData.verification_document_url
                ? `Selected: ${formData.verification_document_url}`
                : "No file selected"}
            </span>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <Label>Preferred Meeting Times</Label>
            </div>
            <div className="space-y-2">
              {meetingTimes.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox
                    id={`meeting-time-${time}`}
                    checked={formData.preferred_meeting_times.includes(time)}
                    onCheckedChange={(checked) => handleMeetingTimeChange(time, checked === true)}
                    className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor={`meeting-time-${time}`} className="text-slate-300">
                    {time}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Languages className="h-5 w-5 text-blue-500" />
              <Label>Preferred Languages</Label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {languages.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={`language-${language}`}
                    checked={formData.preferred_languages.includes(language)}
                    onCheckedChange={(checked) => handleLanguageChange(language, checked === true)}
                    className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor={`language-${language}`} className="text-slate-300">
                    {language}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="timezone">Your Timezone</Label>
          <Select value={formData.timezone} onValueChange={(value) => updateFormData({ timezone: value })}>
            <SelectTrigger id="timezone" className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[300px]">
              {timezones.map((timezone) => (
                <SelectItem key={timezone} value={timezone}>
                  {timezone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
