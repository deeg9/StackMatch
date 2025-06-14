"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Edit3, Save, X, Plus, MapPin, Building, Calendar } from "lucide-react"

interface CompanyData {
  name: string
  logo: string
  banner: string
  industry: string
  size: string
  location: string
  founded: string
  description: string
  techStack: string[]
  isAvailable: boolean
  nextAvailability: string
}

interface CompanyInfoTabProps {
  companyData: CompanyData
  isViewOnly?: boolean
}

export function CompanyInfoTab({ companyData, isViewOnly = false }: CompanyInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState(companyData)
  const [newTech, setNewTech] = useState("")

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving company data:", editedData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedData(companyData)
    setIsEditing(false)
  }

  const addTechStack = () => {
    if (newTech.trim() && !editedData.techStack.includes(newTech.trim())) {
      setEditedData({
        ...editedData,
        techStack: [...editedData.techStack, newTech.trim()],
      })
      setNewTech("")
    }
  }

  const removeTechStack = (tech: string) => {
    setEditedData({
      ...editedData,
      techStack: editedData.techStack.filter((t) => t !== tech),
    })
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Company core details and public information</CardDescription>
            </div>
            {!isViewOnly && !isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {!isViewOnly && isEditing && (
              <div className="flex space-x-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="company-name">Company Name</Label>
              {!isViewOnly && isEditing ? (
                <Input
                  id="company-name"
                  value={editedData.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{editedData.name}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              {!isViewOnly && isEditing ? (
                <Select
                  value={editedData.industry}
                  onValueChange={(value) => setEditedData({ ...editedData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Software Development">Software Development</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>{editedData.industry}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Headquarters Location</Label>
              {!isViewOnly && isEditing ? (
                <Input
                  id="location"
                  value={editedData.location}
                  onChange={(e) => setEditedData({ ...editedData, location: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{editedData.location}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="founded">Founded Year</Label>
              {!isViewOnly && isEditing ? (
                <Input
                  id="founded"
                  value={editedData.founded}
                  onChange={(e) => setEditedData({ ...editedData, founded: e.target.value })}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{editedData.founded}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Company Size</Label>
              {!isViewOnly && isEditing ? (
                <Select
                  value={editedData.size}
                  onValueChange={(value) => setEditedData({ ...editedData, size: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10 employees">1-10 employees</SelectItem>
                    <SelectItem value="11-50 employees">11-50 employees</SelectItem>
                    <SelectItem value="51-200 employees">51-200 employees</SelectItem>
                    <SelectItem value="201-500 employees">201-500 employees</SelectItem>
                    <SelectItem value="500+ employees">500+ employees</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span>{editedData.size}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Company Description</Label>
            {!isViewOnly && isEditing ? (
              <Textarea
                id="description"
                value={editedData.description}
                onChange={(e) => setEditedData({ ...editedData, description: e.target.value })}
                rows={4}
                placeholder="Describe your company, services, and what makes you unique..."
              />
            ) : (
              <p className="text-muted-foreground leading-relaxed">{editedData.description}</p>
            )}
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <Label>Tech Stack & Expertise</Label>
            <div className="flex flex-wrap gap-2">
              {editedData.techStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="flex items-center space-x-1">
                  <span>{tech}</span>
                  {!isViewOnly && isEditing && (
                    <button onClick={() => removeTechStack(tech)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {!isViewOnly && isEditing && (
              <div className="flex space-x-2">
                <Input
                  placeholder="Add technology or skill"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTechStack()}
                />
                <Button onClick={addTechStack} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Availability Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
          <CardDescription>Current availability for new projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="available">Available for New Projects</Label>
              <p className="text-sm text-muted-foreground">Current availability status</p>
            </div>
            {!isViewOnly && isEditing ? (
              <Switch
                id="available"
                checked={editedData.isAvailable}
                onCheckedChange={(checked) => setEditedData({ ...editedData, isAvailable: checked })}
              />
            ) : (
              <Badge variant={editedData.isAvailable ? "default" : "secondary"}>
                {editedData.isAvailable ? "Available" : "Not Available"}
              </Badge>
            )}
          </div>

          {!editedData.isAvailable && (
            <div className="space-y-2">
              <Label htmlFor="next-availability">Next Available Date</Label>
              {!isViewOnly && isEditing ? (
                <Input
                  id="next-availability"
                  type="date"
                  value={editedData.nextAvailability}
                  onChange={(e) => setEditedData({ ...editedData, nextAvailability: e.target.value })}
                />
              ) : (
                <p className="text-muted-foreground">{editedData.nextAvailability}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
