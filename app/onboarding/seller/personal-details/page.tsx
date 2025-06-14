"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, AlertCircle, X, Plus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PersonalDetailsPage() {
  const router = useRouter()
  const auth = useSelector((state: RootState) => state.auth)
  const [activeTab, setActiveTab] = useState("basic")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<null | "success" | "error">(null)

  const [formData, setFormData] = useState({
    // Basic Information
    first_name: "",
    last_name: "",
    job_title: "",
    bio: "",
    profile_image_url: "",
    linkedin_url: "",
    github_url: "",
    personal_website: "",

    // Skills & Experience
    years_of_experience: "",
    skills: [] as string[],
    skill_input: "",
    education: [] as {
      degree: string
      institution: string
      year: string
    }[],
    certifications: [] as string[],
    certification_input: "",

    // Portfolio & Projects
    personal_projects: [] as {
      title: string
      description: string
      technologies: string
      url?: string
      image_url?: string
    }[],

    // Preferences
    hourly_rate: "",
    availability_status: "",
    preferred_project_types: [] as string[],
    preferred_industries: [] as string[],
    remote_preference: "",
  })

  // Update form data
  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle adding a skill
  const handleAddSkill = () => {
    if (formData.skill_input.trim() && !formData.skills.includes(formData.skill_input.trim())) {
      updateFormData("skills", [...formData.skills, formData.skill_input.trim()])
      updateFormData("skill_input", "")
    }
  }

  // Handle removing a skill
  const handleRemoveSkill = (skill: string) => {
    updateFormData(
      "skills",
      formData.skills.filter((s) => s !== skill),
    )
  }

  // Handle adding a certification
  const handleAddCertification = () => {
    if (formData.certification_input.trim() && !formData.certifications.includes(formData.certification_input.trim())) {
      updateFormData("certifications", [...formData.certifications, formData.certification_input.trim()])
      updateFormData("certification_input", "")
    }
  }

  // Handle removing a certification
  const handleRemoveCertification = (cert: string) => {
    updateFormData(
      "certifications",
      formData.certifications.filter((c) => c !== cert),
    )
  }

  // Handle adding education
  const handleAddEducation = () => {
    updateFormData("education", [...formData.education, { degree: "", institution: "", year: "" }])
  }

  // Handle updating education
  const handleUpdateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...formData.education]
    updatedEducation[index] = { ...updatedEducation[index], [field]: value }
    updateFormData("education", updatedEducation)
  }

  // Handle removing education
  const handleRemoveEducation = (index: number) => {
    updateFormData(
      "education",
      formData.education.filter((_, i) => i !== index),
    )
  }

  // Handle adding a project
  const handleAddProject = () => {
    updateFormData("personal_projects", [
      ...formData.personal_projects,
      { title: "", description: "", technologies: "", url: "", image_url: "" },
    ])
  }

  // Handle updating a project
  const handleUpdateProject = (index: number, field: string, value: string) => {
    const updatedProjects = [...formData.personal_projects]
    updatedProjects[index] = { ...updatedProjects[index], [field]: value }
    updateFormData("personal_projects", updatedProjects)
  }

  // Handle removing a project
  const handleRemoveProject = (index: number) => {
    updateFormData(
      "personal_projects",
      formData.personal_projects.filter((_, i) => i !== index),
    )
  }

  // Save progress
  const saveProgress = async () => {
    setSaveStatus(null)
    setIsSubmitting(true)

    try {
      // Mock API call - in a real app, this would save to your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Replace with actual API call
      // await fetch('/api/sellers/me/individual-profile', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      setSaveStatus("success")
    } catch (error) {
      console.error("Failed to save profile:", error)
      setSaveStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle tab change
  const handleTabChange = async (value: string) => {
    await saveProgress()
    setActiveTab(value)
  }

  // Handle final submission
  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      await saveProgress()

      // Mark personal onboarding as complete
      // In a real app, this would update a status in your backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // TODO: Replace with actual API call
      // await fetch('/api/onboarding/complete-personal', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: auth?.user?.id })
      // })

      // Redirect to seller dashboard
      router.push("/seller-dashboard")
    } catch (error) {
      console.error("Failed to complete personal profile:", error)
      setSaveStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Complete Your Personal Profile</h1>
        <p className="text-muted-foreground">
          Tell potential clients about your individual skills, experience, and what makes you unique.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>
            This information will be displayed on your individual profile and helps clients understand your specific
            expertise.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {saveStatus === "success" && (
            <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>Progress saved successfully!</AlertDescription>
            </Alert>
          )}

          {saveStatus === "error" && (
            <Alert className="mb-6 bg-red-50 text-red-800 border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Failed to save progress. Please try again.</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="skills">Skills & Experience</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => updateFormData("first_name", e.target.value)}
                    placeholder="Your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => updateFormData("last_name", e.target.value)}
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={(e) => updateFormData("job_title", e.target.value)}
                  placeholder="e.g., Senior Full Stack Developer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => updateFormData("bio", e.target.value)}
                  placeholder="Tell clients about yourself, your background, and what makes you unique..."
                  className="min-h-[120px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile_image">Profile Image URL</Label>
                <Input
                  id="profile_image"
                  value={formData.profile_image_url}
                  onChange={(e) => updateFormData("profile_image_url", e.target.value)}
                  placeholder="https://example.com/your-image.jpg"
                />
                <p className="text-sm text-muted-foreground">Enter a URL to your professional headshot or avatar</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn Profile</Label>
                  <Input
                    id="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={(e) => updateFormData("linkedin_url", e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github_url">GitHub Profile</Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => updateFormData("github_url", e.target.value)}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personal_website">Personal Website</Label>
                  <Input
                    id="personal_website"
                    value={formData.personal_website}
                    onChange={(e) => updateFormData("personal_website", e.target.value)}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="years_of_experience">Years of Experience</Label>
                <Select
                  value={formData.years_of_experience}
                  onValueChange={(value) => updateFormData("years_of_experience", value)}
                >
                  <SelectTrigger id="years_of_experience">
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills</Label>
                <div className="flex space-x-2">
                  <Input
                    id="skills"
                    value={formData.skill_input}
                    onChange={(e) => updateFormData("skill_input", e.target.value)}
                    placeholder="Add a skill (e.g., React, Node.js, UI Design)"
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                  <Button type="button" onClick={handleAddSkill} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Education</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddEducation}>
                    <Plus className="h-4 w-4 mr-1" /> Add Education
                  </Button>
                </div>
                <div className="space-y-4">
                  {formData.education.map((edu, index) => (
                    <div key={index} className="border rounded-md p-4 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => handleRemoveEducation(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`degree-${index}`}>Degree/Certificate</Label>
                          <Input
                            id={`degree-${index}`}
                            value={edu.degree}
                            onChange={(e) => handleUpdateEducation(index, "degree", e.target.value)}
                            placeholder="e.g., Bachelor of Science in Computer Science"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`institution-${index}`}>Institution</Label>
                          <Input
                            id={`institution-${index}`}
                            value={edu.institution}
                            onChange={(e) => handleUpdateEducation(index, "institution", e.target.value)}
                            placeholder="e.g., University of Technology"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`year-${index}`}>Year</Label>
                          <Input
                            id={`year-${index}`}
                            value={edu.year}
                            onChange={(e) => handleUpdateEducation(index, "year", e.target.value)}
                            placeholder="e.g., 2018"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications</Label>
                <div className="flex space-x-2">
                  <Input
                    id="certifications"
                    value={formData.certification_input}
                    onChange={(e) => updateFormData("certification_input", e.target.value)}
                    placeholder="Add a certification (e.g., AWS Certified Developer)"
                    onKeyPress={(e) => e.key === "Enter" && handleAddCertification()}
                  />
                  <Button type="button" onClick={handleAddCertification} size="sm">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.certifications.map((cert) => (
                    <Badge key={cert} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                      {cert}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveCertification(cert)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Personal Projects</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddProject}>
                  <Plus className="h-4 w-4 mr-1" /> Add Project
                </Button>
              </div>

              <div className="space-y-4">
                {formData.personal_projects.map((project, index) => (
                  <div key={index} className="border rounded-md p-4 relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0"
                      onClick={() => handleRemoveProject(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`project-title-${index}`}>Project Title</Label>
                        <Input
                          id={`project-title-${index}`}
                          value={project.title}
                          onChange={(e) => handleUpdateProject(index, "title", e.target.value)}
                          placeholder="e.g., E-commerce Platform"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-desc-${index}`}>Description</Label>
                        <Textarea
                          id={`project-desc-${index}`}
                          value={project.description}
                          onChange={(e) => handleUpdateProject(index, "description", e.target.value)}
                          placeholder="Describe what the project does and your role in it..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`project-tech-${index}`}>Technologies Used</Label>
                        <Input
                          id={`project-tech-${index}`}
                          value={project.technologies}
                          onChange={(e) => handleUpdateProject(index, "technologies", e.target.value)}
                          placeholder="e.g., React, Node.js, MongoDB"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`project-url-${index}`}>Project URL</Label>
                          <Input
                            id={`project-url-${index}`}
                            value={project.url || ""}
                            onChange={(e) => handleUpdateProject(index, "url", e.target.value)}
                            placeholder="https://example.com/project"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`project-image-${index}`}>Project Image URL</Label>
                          <Input
                            id={`project-image-${index}`}
                            value={project.image_url || ""}
                            onChange={(e) => handleUpdateProject(index, "image_url", e.target.value)}
                            placeholder="https://example.com/image.jpg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="hourly_rate">Hourly Rate (USD)</Label>
                <Input
                  id="hourly_rate"
                  type="number"
                  value={formData.hourly_rate}
                  onChange={(e) => updateFormData("hourly_rate", e.target.value)}
                  placeholder="e.g., 75"
                />
                <p className="text-sm text-muted-foreground">
                  Your personal hourly rate. This may differ from your company's standard rates.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="availability_status">Current Availability</Label>
                <Select
                  value={formData.availability_status}
                  onValueChange={(value) => updateFormData("availability_status", value)}
                >
                  <SelectTrigger id="availability_status">
                    <SelectValue placeholder="Select your availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available for new projects</SelectItem>
                    <SelectItem value="limited">Limited availability</SelectItem>
                    <SelectItem value="unavailable">Not currently available</SelectItem>
                    <SelectItem value="contact">Contact to discuss</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remote_preference">Remote Work Preference</Label>
                <Select
                  value={formData.remote_preference}
                  onValueChange={(value) => updateFormData("remote_preference", value)}
                >
                  <SelectTrigger id="remote_preference">
                    <SelectValue placeholder="Select your remote work preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote_only">Remote only</SelectItem>
                    <SelectItem value="hybrid">Hybrid (remote & on-site)</SelectItem>
                    <SelectItem value="on_site">On-site preferred</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
