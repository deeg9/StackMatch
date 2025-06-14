"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Target, TrendingUp, History, Users, Handshake } from "lucide-react"

interface GoalsExpectationsStepProps {
  formData: {
    business_challenges: string
    success_metrics: string[]
    previous_experience: string
    preferred_provider_size: string
    preferred_provider_location: string[]
    required_certifications: string[]
    partnership_goals: string
  }
  updateFormData: (data: Partial<GoalsExpectationsStepProps["formData"]>) => void
}

const successMetrics = [
  "Cost Reduction",
  "Time Savings",
  "Revenue Growth",
  "User Satisfaction",
  "Market Share",
  "Operational Efficiency",
  "Innovation Index",
  "Quality Metrics",
  "Compliance",
  "ROI",
]

const providerSizes = [
  "Freelancer/Individual",
  "Small Agency (2-10 people)",
  "Mid-size Company (11-50 people)",
  "Large Company (51-200 people)",
  "Enterprise (200+ people)",
  "No Preference",
]

const providerLocations = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Australia/Oceania",
  "Same Country Only",
  "Same City/Region",
  "No Geographic Preference",
]

const certifications = [
  "ISO 9001",
  "ISO 27001",
  "CMMI",
  "PMP",
  "Agile/Scrum",
  "AWS Certified",
  "Microsoft Certified",
  "Google Certified",
  "HIPAA Compliance",
  "SOC 2",
  "GDPR Compliance",
]

const experienceLevels = [
  "No previous experience with external providers",
  "Limited experience (1-2 projects)",
  "Moderate experience (3-5 projects)",
  "Extensive experience (6+ projects)",
  "We work with providers regularly",
]

export default function GoalsExpectationsStep({ formData, updateFormData }: GoalsExpectationsStepProps) {
  const handleSuccessMetricChange = (metric: string, checked: boolean) => {
    if (checked) {
      updateFormData({ success_metrics: [...formData.success_metrics, metric] })
    } else {
      updateFormData({ success_metrics: formData.success_metrics.filter((m) => m !== metric) })
    }
  }

  const handleLocationChange = (location: string, checked: boolean) => {
    if (checked) {
      updateFormData({ preferred_provider_location: [...formData.preferred_provider_location, location] })
    } else {
      updateFormData({
        preferred_provider_location: formData.preferred_provider_location.filter((l) => l !== location),
      })
    }
  }

  const handleCertificationChange = (cert: string, checked: boolean) => {
    if (checked) {
      updateFormData({ required_certifications: [...formData.required_certifications, cert] })
    } else {
      updateFormData({ required_certifications: formData.required_certifications.filter((c) => c !== cert) })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Goals & Expectations</h2>
        <p className="text-slate-400">
          Help us understand your business goals and what you expect from service providers.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <Label htmlFor="business_challenges" className="text-lg font-medium text-white">
              Primary Business Challenges
            </Label>
          </div>
          <Textarea
            id="business_challenges"
            placeholder="Describe the key business challenges or problems you're looking to solve with external service providers..."
            value={formData.business_challenges}
            onChange={(e) => updateFormData({ business_challenges: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
          />
        </div>

        <Separator className="bg-slate-700" />

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <Label className="text-lg font-medium text-white">Success Metrics</Label>
          </div>
          <p className="text-sm text-slate-400">
            Which metrics are most important to you when measuring the success of a project?
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {successMetrics.map((metric) => (
              <div key={metric} className="flex items-center space-x-2">
                <Checkbox
                  id={`metric-${metric}`}
                  checked={formData.success_metrics.includes(metric)}
                  onCheckedChange={(checked) => handleSuccessMetricChange(metric, checked === true)}
                  className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor={`metric-${metric}`} className="text-slate-300">
                  {metric}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator className="bg-slate-700" />

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-blue-500" />
            <Label className="text-lg font-medium text-white">Previous Experience with Service Providers</Label>
          </div>
          <RadioGroup
            value={formData.previous_experience}
            onValueChange={(value) => updateFormData({ previous_experience: value })}
            className="space-y-2"
          >
            {experienceLevels.map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <RadioGroupItem value={level} id={`experience-${level}`} className="border-slate-700 text-blue-600" />
                <Label htmlFor={`experience-${level}`} className="text-slate-300">
                  {level}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <Separator className="bg-slate-700" />

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <Label className="text-lg font-medium text-white">Provider Preferences</Label>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_provider_size">Preferred Provider Size</Label>
              <Select
                value={formData.preferred_provider_size}
                onValueChange={(value) => updateFormData({ preferred_provider_size: value })}
              >
                <SelectTrigger id="preferred_provider_size" className="bg-slate-800 border-slate-700 text-white">
                  <SelectValue placeholder="Select preferred size" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {providerSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Preferred Provider Location(s)</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {providerLocations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={formData.preferred_provider_location.includes(location)}
                      onCheckedChange={(checked) => handleLocationChange(location, checked === true)}
                      className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor={`location-${location}`} className="text-slate-300">
                      {location}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Required Certifications & Compliance</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {certifications.map((cert) => (
                  <div key={cert} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cert-${cert}`}
                      checked={formData.required_certifications.includes(cert)}
                      onCheckedChange={(checked) => handleCertificationChange(cert, checked === true)}
                      className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor={`cert-${cert}`} className="text-slate-300">
                      {cert}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Handshake className="h-5 w-5 text-blue-500" />
            <Label htmlFor="partnership_goals" className="text-lg font-medium text-white">
              Long-term Partnership Goals
            </Label>
          </div>
          <Textarea
            id="partnership_goals"
            placeholder="Describe your long-term goals for working with service providers. Are you looking for one-time projects or ongoing relationships?"
            value={formData.partnership_goals}
            onChange={(e) => updateFormData({ partnership_goals: e.target.value })}
            className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
          />
        </div>
      </div>
    </div>
  )
}
