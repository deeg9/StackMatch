"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { updateData } from "@/store/slices/projectWizardSlice"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = ["Web Development", "Mobile Development", "Enterprise Software", "AI/ML", "Other"] as const

export function ProjectBasicsStep() {
  const dispatch = useDispatch()
  const { data } = useSelector((state: RootState) => state.projectWizard)

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateData({ [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Project Basics</h3>
        <p className="text-muted-foreground mb-6">Let's start with the basic information about your project.</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Project Title *</Label>
          <Input
            id="title"
            placeholder="e.g., E-commerce Website Development"
            value={data.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="category">Project Category *</Label>
          <Select value={data.category || ""} onValueChange={(value) => handleInputChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="description">Project Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe your project in detail..."
            value={data.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            rows={6}
          />
        </div>
      </div>
    </div>
  )
}
