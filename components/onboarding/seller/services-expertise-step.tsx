"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface ServicesExpertiseStepProps {
  formData: {
    primary_services: string[]
    secondary_services: string[]
    industries_served: string[]
    technologies: string[]
    certifications: string[]
  }
  updateFormData: (data: Partial<ServicesExpertiseStepProps["formData"]>) => void
}

const primaryServices = [
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Digital Marketing",
  "SEO Optimization",
  "Content Creation",
  "Cloud Services",
  "IT Consulting",
  "Cybersecurity",
  "Data Analytics",
  "AI/ML Solutions",
  "Blockchain Development",
  "DevOps Services",
  "E-commerce Solutions",
  "Custom Software Development",
]

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Retail",
  "Manufacturing",
  "Media & Entertainment",
  "Real Estate",
  "Transportation",
  "Energy",
  "Hospitality",
  "Agriculture",
  "Government",
  "Non-profit",
  "Other",
]

export default function ServicesExpertiseStep({ formData, updateFormData }: ServicesExpertiseStepProps) {
  const handleServiceChange = (service: string, checked: boolean, type: "primary_services" | "secondary_services") => {
    if (checked) {
      updateFormData({ [type]: [...formData[type], service] })
    } else {
      updateFormData({ [type]: formData[type].filter((s) => s !== service) })
    }
  }

  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      updateFormData({ industries_served: [...formData.industries_served, industry] })
    } else {
      updateFormData({ industries_served: formData.industries_served.filter((i) => i !== industry) })
    }
  }

  const addTechnology = (tech: string) => {
    if (tech.trim() && !formData.technologies.includes(tech.trim())) {
      updateFormData({ technologies: [...formData.technologies, tech.trim()] })
    }
  }

  const removeTechnology = (tech: string) => {
    updateFormData({ technologies: formData.technologies.filter((t) => t !== tech) })
  }

  const addCertification = (cert: string) => {
    if (cert.trim() && !formData.certifications.includes(cert.trim())) {
      updateFormData({ certifications: [...formData.certifications, cert.trim()] })
    }
  }

  const removeCertification = (cert: string) => {
    updateFormData({ certifications: formData.certifications.filter((c) => c !== cert) })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Services & Expertise</h2>
        <p className="text-slate-400">Define your core services and areas of expertise.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Primary Services (Select your main offerings)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {primaryServices.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={`primary-${service}`}
                  checked={formData.primary_services.includes(service)}
                  onCheckedChange={(checked) => handleServiceChange(service, checked === true, "primary_services")}
                  className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor={`primary-${service}`} className="text-slate-300">
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Secondary Services (Optional additional services)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {primaryServices.map((service) => (
              <div key={service} className="flex items-center space-x-2">
                <Checkbox
                  id={`secondary-${service}`}
                  checked={formData.secondary_services.includes(service)}
                  onCheckedChange={(checked) => handleServiceChange(service, checked === true, "secondary_services")}
                  className="border-slate-700 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                />
                <Label htmlFor={`secondary-${service}`} className="text-slate-300">
                  {service}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Industries Served</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {industries.map((industry) => (
              <div key={industry} className="flex items-center space-x-2">
                <Checkbox
                  id={`industry-${industry}`}
                  checked={formData.industries_served.includes(industry)}
                  onCheckedChange={(checked) => handleIndustryChange(industry, checked === true)}
                  className="border-slate-700 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <Label htmlFor={`industry-${industry}`} className="text-slate-300">
                  {industry}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Technologies & Tools</Label>
          <Input
            placeholder="Add technologies (press Enter to add)"
            className="bg-slate-800 border-slate-700 text-white"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addTechnology(e.currentTarget.value)
                e.currentTarget.value = ""
              }
            }}
          />
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-blue-900/30 text-blue-300">
                {tech}
                <button onClick={() => removeTechnology(tech)} className="ml-1 hover:text-blue-100">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Certifications</Label>
          <Input
            placeholder="Add certifications (press Enter to add)"
            className="bg-slate-800 border-slate-700 text-white"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addCertification(e.currentTarget.value)
                e.currentTarget.value = ""
              }
            }}
          />
          <div className="flex flex-wrap gap-2">
            {formData.certifications.map((cert) => (
              <Badge key={cert} variant="secondary" className="bg-yellow-900/30 text-yellow-300">
                {cert}
                <button onClick={() => removeCertification(cert)} className="ml-1 hover:text-yellow-100">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
