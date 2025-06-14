interface ReviewSubmitStepProps {
  formData: {
    business_name: string
    business_description: string
    website_url: string
    location: string
    business_type: string
    founded_year: string
    team_size: string
    primary_services: string[]
    secondary_services: string[]
    industries_served: string[]
    technologies: string[]
    certifications: string[]
    years_experience: string
    portfolio_projects: Array<{
      title: string
      description: string
      technologies: string
      url?: string
    }>
    case_studies: Array<{
      title: string
      challenge: string
      solution: string
      results: string
    }>
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
}

export default function ReviewSubmitStep({ formData }: ReviewSubmitStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Review Your Profile</h2>
        <p className="text-slate-400">Please review your information before completing your seller profile.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Business Name</p>
              <p className="text-slate-200">{formData.business_name || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Location</p>
              <p className="text-slate-200">{formData.location || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Business Type</p>
              <p className="text-slate-200">{formData.business_type || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Team Size</p>
              <p className="text-slate-200">{formData.team_size || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Founded</p>
              <p className="text-slate-200">{formData.founded_year || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Website</p>
              <p className="text-slate-200">{formData.website_url || "Not provided"}</p>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-slate-400">Business Description</p>
            <p className="text-slate-200">{formData.business_description || "Not provided"}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Services & Expertise</h3>
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Primary Services</p>
              {formData.primary_services.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.primary_services.map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-300"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-200">Not provided</p>
              )}
            </div>

            {formData.secondary_services.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Secondary Services</p>
                <div className="flex flex-wrap gap-2">
                  {formData.secondary_services.map((service) => (
                    <span
                      key={service}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-900/30 text-purple-300"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.industries_served.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Industries Served</p>
                <div className="flex flex-wrap gap-2">
                  {formData.industries_served.map((industry) => (
                    <span
                      key={industry}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {formData.technologies.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Experience</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Years of Experience</p>
              <p className="text-slate-200">{formData.years_experience || "Not provided"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-slate-400">Portfolio Projects</p>
              <p className="text-slate-200">{formData.portfolio_projects.length} projects</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white">Business Preferences</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Project Size Preference</p>
                <p className="text-slate-200">{formData.project_size_preference || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Budget Range Preference</p>
                <p className="text-slate-200">{formData.budget_range_preference || "Not provided"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-400">Availability</p>
                <p className="text-slate-200">{formData.availability || "Not provided"}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-slate-400">Preferred Communication Methods</p>
              {formData.preferred_communication.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.preferred_communication.map((method) => (
                    <span
                      key={method}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900/30 text-indigo-300"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-200">Not provided</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
