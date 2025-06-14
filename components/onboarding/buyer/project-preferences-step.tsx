"use client"

import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

interface ProjectPreferencesStepProps {
  formData: {
    project_types: string[]
    typical_budget_range: string
    decision_timeline: string
    annual_project_budget: string
    average_project_duration: string
    project_management_methodology: string[]
    typical_team_size: number
    primary_business_objectives: string[]
  }
  updateFormData: (data: Partial<ProjectPreferencesStepProps["formData"]>) => void
}

const projectTypes = [
  "Website Development",
  "Mobile App Development",
  "Custom Software Development",
  "E-commerce Solutions",
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
]

const budgetRanges = [
  "Under $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $250,000",
  "$250,000 - $500,000",
  "$500,000+",
]

const annualBudgetRanges = [
  "Under $50,000",
  "$50,000 - $100,000",
  "$100,000 - $250,000",
  "$250,000 - $500,000",
  "$500,000 - $1,000,000",
  "$1,000,000 - $5,000,000",
  "$5,000,000+",
]

const projectDurations = ["Less than 1 month", "1-3 months", "3-6 months", "6-12 months", "Over 12 months"]

const methodologies = ["Agile", "Scrum", "Waterfall", "Kanban", "Lean", "DevOps", "Hybrid", "Other"]

const businessObjectives = [
  "Growth & Expansion",
  "Cost Reduction",
  "Efficiency Improvement",
  "Digital Transformation",
  "Innovation",
  "Customer Experience Enhancement",
  "Market Competitiveness",
  "Regulatory Compliance",
]

const decisionTimelines = [
  "Immediate (within days)",
  "Short-term (within weeks)",
  "Medium-term (1-3 months)",
  "Long-term (3-6 months)",
  "Strategic (6+ months)",
]

export default function ProjectPreferencesStep({ formData, updateFormData }: ProjectPreferencesStepProps) {
  const handleProjectTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      updateFormData({ project_types: [...formData.project_types, type] })
    } else {
      updateFormData({ project_types: formData.project_types.filter((t) => t !== type) })
    }
  }

  const handleMethodologyChange = (methodology: string, checked: boolean) => {
    if (checked) {
      updateFormData({ project_management_methodology: [...formData.project_management_methodology, methodology] })
    } else {
      updateFormData({
        project_management_methodology: formData.project_management_methodology.filter((m) => m !== methodology),
      })
    }
  }

  const handleObjectiveChange = (objective: string, checked: boolean) => {
    if (checked) {
      updateFormData({ primary_business_objectives: [...formData.primary_business_objectives, objective] })
    } else {
      updateFormData({
        primary_business_objectives: formData.primary_business_objectives.filter((o) => o !== objective),
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Project & Budget Information</h2>
        <p className="text-slate-400">Tell us about your project preferences and budget expectations.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Project Types (Select all that apply)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {projectTypes.map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`project-type-${type}`}
                  checked={formData.project_types.includes(type)}
                  onCheckedChange={(checked) => handleProjectTypeChange(type, checked === true)}
                  className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor={`project-type-${type}`} className="text-slate-300">
                  {type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="typical_budget_range">Typical Project Budget Range</Label>
            <Select
              value={formData.typical_budget_range}
              onValueChange={(value) => updateFormData({ typical_budget_range: value })}
            >
              <SelectTrigger id="typical_budget_range" className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select budget range" />
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
            <Label htmlFor="annual_project_budget">Annual Technology Budget</Label>
            <Select
              value={formData.annual_project_budget}
              onValueChange={(value) => updateFormData({ annual_project_budget: value })}
            >
              <SelectTrigger id="annual_project_budget" className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select annual budget" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {annualBudgetRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="average_project_duration">Average Project Duration</Label>
            <Select
              value={formData.average_project_duration}
              onValueChange={(value) => updateFormData({ average_project_duration: value })}
            >
              <SelectTrigger id="average_project_duration" className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Select typical duration" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {projectDurations.map((duration) => (
                  <SelectItem key={duration} value={duration}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Decision Timeline</Label>
            <RadioGroup
              value={formData.decision_timeline}
              onValueChange={(value) => updateFormData({ decision_timeline: value })}
              className="space-y-2"
            >
              {decisionTimelines.map((timeline) => (
                <div key={timeline} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={timeline}
                    id={`timeline-${timeline}`}
                    className="border-slate-700 text-blue-600"
                  />
                  <Label htmlFor={`timeline-${timeline}`} className="text-slate-300">
                    {timeline}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Preferred Project Management Methodologies</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {methodologies.map((methodology) => (
              <div key={methodology} className="flex items-center space-x-2">
                <Checkbox
                  id={`methodology-${methodology}`}
                  checked={formData.project_management_methodology.includes(methodology)}
                  onCheckedChange={(checked) => handleMethodologyChange(methodology, checked === true)}
                  className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor={`methodology-${methodology}`} className="text-slate-300">
                  {methodology}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="typical_team_size">Typical Team Size for Projects</Label>
          <div className="space-y-6">
            <Slider
              id="typical_team_size"
              min={1}
              max={20}
              step={1}
              value={[formData.typical_team_size]}
              onValueChange={(value) => updateFormData({ typical_team_size: value[0] })}
              className="py-4"
            />
            <div className="flex justify-between">
              <span className="text-sm text-slate-400">1 person</span>
              <span className="text-sm font-medium text-white">{formData.typical_team_size} people</span>
              <span className="text-sm text-slate-400">20+ people</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Primary Business Objectives</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {businessObjectives.map((objective) => (
              <div key={objective} className="flex items-center space-x-2">
                <Checkbox
                  id={`objective-${objective}`}
                  checked={formData.primary_business_objectives.includes(objective)}
                  onCheckedChange={(checked) => handleObjectiveChange(objective, checked === true)}
                  className="border-slate-700 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <Label htmlFor={`objective-${objective}`} className="text-slate-300">
                  {objective}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
