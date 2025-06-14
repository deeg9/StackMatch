"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

interface ExperiencePortfolioStepProps {
  formData: {
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
    client_testimonials: Array<{
      client_name: string
      company: string
      testimonial: string
      rating: number
    }>
  }
  updateFormData: (data: Partial<ExperiencePortfolioStepProps["formData"]>) => void
}

const experienceRanges = [
  "Less than 1 year",
  "1-2 years",
  "3-5 years",
  "6-10 years",
  "11-15 years",
  "16-20 years",
  "20+ years",
]

export default function ExperiencePortfolioStep({ formData, updateFormData }: ExperiencePortfolioStepProps) {
  const addPortfolioProject = () => {
    updateFormData({
      portfolio_projects: [...formData.portfolio_projects, { title: "", description: "", technologies: "", url: "" }],
    })
  }

  const updatePortfolioProject = (index: number, field: string, value: string) => {
    const updated = formData.portfolio_projects.map((project, i) =>
      i === index ? { ...project, [field]: value } : project,
    )
    updateFormData({ portfolio_projects: updated })
  }

  const removePortfolioProject = (index: number) => {
    updateFormData({
      portfolio_projects: formData.portfolio_projects.filter((_, i) => i !== index),
    })
  }

  const addCaseStudy = () => {
    updateFormData({
      case_studies: [...formData.case_studies, { title: "", challenge: "", solution: "", results: "" }],
    })
  }

  const updateCaseStudy = (index: number, field: string, value: string) => {
    const updated = formData.case_studies.map((study, i) => (i === index ? { ...study, [field]: value } : study))
    updateFormData({ case_studies: updated })
  }

  const removeCaseStudy = (index: number) => {
    updateFormData({
      case_studies: formData.case_studies.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">Experience & Portfolio</h2>
        <p className="text-slate-400">Showcase your experience and previous work.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="years_experience">Years of Experience</Label>
          <Select
            value={formData.years_experience}
            onValueChange={(value) => updateFormData({ years_experience: value })}
          >
            <SelectTrigger id="years_experience" className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              {experienceRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Portfolio Projects</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addPortfolioProject}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </div>

          {formData.portfolio_projects.map((project, index) => (
            <Card key={index} className="bg-[#0f172a] border-slate-700">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium text-slate-300">Project {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removePortfolioProject(index)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <Input
                    placeholder="Project title"
                    value={project.title}
                    onChange={(e) => updatePortfolioProject(index, "title", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Textarea
                    placeholder="Project description"
                    value={project.description}
                    onChange={(e) => updatePortfolioProject(index, "description", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Input
                    placeholder="Technologies used"
                    value={project.technologies}
                    onChange={(e) => updatePortfolioProject(index, "technologies", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Input
                    placeholder="Project URL (optional)"
                    value={project.url || ""}
                    onChange={(e) => updatePortfolioProject(index, "url", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Case Studies</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addCaseStudy}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Case Study
            </Button>
          </div>

          {formData.case_studies.map((study, index) => (
            <Card key={index} className="bg-[#0f172a] border-slate-700">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-sm font-medium text-slate-300">Case Study {index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCaseStudy(index)}
                    className="text-slate-400 hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <Input
                    placeholder="Case study title"
                    value={study.title}
                    onChange={(e) => updateCaseStudy(index, "title", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Textarea
                    placeholder="Challenge/Problem"
                    value={study.challenge}
                    onChange={(e) => updateCaseStudy(index, "challenge", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Textarea
                    placeholder="Solution/Approach"
                    value={study.solution}
                    onChange={(e) => updateCaseStudy(index, "solution", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <Textarea
                    placeholder="Results/Outcomes"
                    value={study.results}
                    onChange={(e) => updateCaseStudy(index, "results", e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
