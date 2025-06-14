"use client"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Building2,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Clock,
  Target,
  CheckCircle2,
  Languages,
  Briefcase,
} from "lucide-react"

interface ReviewSubmitStepProps {
  formData: {
    // Company Information
    company_name: string
    company_description: string
    industry: string
    company_size: string
    founded_year: string
    headquarters_location: string
    website_url: string
    annual_revenue_range: string
    company_logo_url: string
    contact_person_name: string
    contact_person_title: string
    contact_person_email: string
    contact_person_phone: string

    // Project Preferences
    project_types: string[]
    typical_budget_range: string
    decision_timeline: string
    annual_project_budget: string
    average_project_duration: string
    project_management_methodology: string[]
    typical_team_size: number
    primary_business_objectives: string[]

    // Communication Preferences
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

    // Goals & Expectations
    business_challenges: string
    success_metrics: string[]
    previous_experience: string
    preferred_provider_size: string
    preferred_provider_location: string[]
    required_certifications: string[]
    partnership_goals: string
  }
}

export default function ReviewSubmitStep({ formData }: ReviewSubmitStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Review Your Profile</h2>
        <p className="text-slate-400">Please review your information before completing your profile.</p>
      </div>

      <div className="space-y-8">
        {/* Company Information Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Building2 className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium text-white">Company Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg bg-slate-800/50 p-4 border border-slate-700">
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Company Name</p>
              <p className="text-slate-200 font-medium">{formData.company_name || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Industry</p>
              <p className="text-slate-200">{formData.industry || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Company Size</p>
              <p className="text-slate-200">{formData.company_size || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Founded</p>
              <p className="text-slate-200">{formData.founded_year || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Location</p>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-slate-400" />
                <p className="text-slate-200">{formData.headquarters_location || "Not provided"}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Website</p>
              <div className="flex items-center space-x-1">
                <Globe className="h-4 w-4 text-slate-400" />
                <p className="text-slate-200">{formData.website_url || "Not provided"}</p>
              </div>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-sm text-slate-400">Company Description</p>
              <p className="text-slate-200">{formData.company_description || "Not provided"}</p>
            </div>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
            <h4 className="text-md font-medium text-white mb-3">Primary Contact</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Name</p>
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4 text-slate-400" />
                  <p className="text-slate-200">{formData.contact_person_name || "Not provided"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Title</p>
                <p className="text-slate-200">{formData.contact_person_title || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Email</p>
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <p className="text-slate-200">{formData.contact_person_email || "Not provided"}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Phone</p>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <p className="text-slate-200">{formData.contact_person_phone || "Not provided"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Project & Budget Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium text-white">Project & Budget Information</h3>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Project Types</p>
                {formData.project_types.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.project_types.map((type) => (
                      <Badge key={type} className="bg-blue-900/30 text-blue-300 hover:bg-blue-900/40">
                        {type}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-200">Not provided</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Typical Project Budget</p>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <p className="text-slate-200">{formData.typical_budget_range || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Annual Technology Budget</p>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4 text-slate-400" />
                    <p className="text-slate-200">{formData.annual_project_budget || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Average Project Duration</p>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <p className="text-slate-200">{formData.average_project_duration || "Not provided"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Decision Timeline</p>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <p className="text-slate-200">{formData.decision_timeline || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-400">Project Management Methodologies</p>
                {formData.project_management_methodology.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.project_management_methodology.map((method) => (
                      <Badge key={method} className="bg-purple-900/30 text-purple-300 hover:bg-purple-900/40">
                        {method}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-200">Not provided</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm text-slate-400">Typical Team Size</p>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-slate-400" />
                  <p className="text-slate-200">{formData.typical_team_size || "Not provided"} people</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-400">Primary Business Objectives</p>
                {formData.primary_business_objectives.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.primary_business_objectives.map((objective) => (
                      <Badge key={objective} className="bg-green-900/30 text-green-300 hover:bg-green-900/40">
                        {objective}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-200">Not provided</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Communication Preferences */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium text-white">Communication Preferences</h3>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-slate-400">Preferred Communication Methods</p>
                {formData.preferred_communication.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.preferred_communication.map((method) => (
                      <Badge key={method} className="bg-blue-900/30 text-blue-300 hover:bg-blue-900/40">
                        {method}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-200">Not provided</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-400">Notification Preferences</p>
                <div className="flex flex-wrap gap-2">
                  {formData.notification_preferences.email && (
                    <Badge className="bg-green-900/30 text-green-300 hover:bg-green-900/40">Email Notifications</Badge>
                  )}
                  {formData.notification_preferences.in_app && (
                    <Badge className="bg-green-900/30 text-green-300 hover:bg-green-900/40">In-App Notifications</Badge>
                  )}
                  {formData.notification_preferences.proposal_updates && (
                    <Badge className="bg-green-900/30 text-green-300 hover:bg-green-900/40">Proposal Updates</Badge>
                  )}
                  {formData.notification_preferences.marketing && (
                    <Badge className="bg-green-900/30 text-green-300 hover:bg-green-900/40">
                      Marketing Communications
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">LinkedIn</p>
                  <p className="text-slate-200 text-sm truncate">{formData.social_media.linkedin || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Twitter/X</p>
                  <p className="text-slate-200 text-sm truncate">{formData.social_media.twitter || "Not provided"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-400">Preferred Meeting Times</p>
                {formData.preferred_meeting_times.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.preferred_meeting_times.map((time) => (
                      <Badge key={time} className="bg-purple-900/30 text-purple-300 hover:bg-purple-900/40">
                        {time}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-200">Not provided</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-400">Preferred Languages</p>
                {formData.preferred_languages.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.preferred_languages.map((language) => (
                      <div key={language} className="flex items-center">
                        <Badge className="bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/40">
                          <Languages className="h-3 w-3 mr-1" />
                          {language}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-200">Not provided</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm text-slate-400">Timezone</p>
                <p className="text-slate-200">{formData.timezone || "Not provided"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-slate-400">Business Verification</p>
                <p className="text-slate-200">
                  {formData.verification_document_url ? "Document uploaded" : "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-700" />

        {/* Goals & Expectations */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-medium text-white">Goals & Expectations</h3>
          </div>

          <div className="rounded-lg bg-slate-800/50 p-4 border border-slate-700">
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Primary Business Challenges</p>
                <p className="text-slate-200">{formData.business_challenges || "Not provided"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-400">Success Metrics</p>
                {formData.success_metrics.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.success_metrics.map((metric) => (
                      <Badge key={metric} className="bg-green-900/30 text-green-300 hover:bg-green-900/40">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {metric}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-200">Not provided</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm text-slate-400">Previous Experience</p>
                <p className="text-slate-200">{formData.previous_experience || "Not provided"}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-slate-400">Preferred Provider Size</p>
                <p className="text-slate-200">{formData.preferred_provider_size || "Not provided"}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-400">Preferred Provider Locations</p>
                {formData.preferred_provider_location.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.preferred_provider_location.map((location) => (
                      <Badge key={location} className="bg-blue-900/30 text-blue-300 hover:bg-blue-900/40">
                        <MapPin className="h-3 w-3 mr-1" />
                        {location}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-200">Not provided</p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm text-slate-400">Required Certifications</p>
                {formData.required_certifications.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.required_certifications.map((cert) => (
                      <Badge key={cert} className="bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/40">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-200">Not provided</p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm text-slate-400">Long-term Partnership Goals</p>
                <p className="text-slate-200">{formData.partnership_goals || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
