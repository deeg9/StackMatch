'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Zap, Plus, X, Star, Award } from 'lucide-react'

interface Skill {
  name: string
  level: 'Beginner' | 'Intermediate' | 'Expert'
  isPrimary: boolean
}

interface Certification {
  name: string
  issuer: string
  year: string
}

interface SkillsExpertiseData {
  skillsList: Skill[]
  certifications: Certification[]
}

interface SkillsExpertiseStepProps {
  data: SkillsExpertiseData
  onUpdate: (data: SkillsExpertiseData) => void
  onNext: () => void
  onPrev: () => void
  userType: 'buyer' | 'seller' | 'consultant'
}

const commonSkills = {
  buyer: [
    'Vendor Management', 'Contract Negotiation', 'Budget Planning', 'Risk Assessment',
    'Compliance Management', 'Project Management', 'Technology Strategy', 'Change Management'
  ],
  seller: [
    'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL',
    'MongoDB', 'Git', 'REST APIs', 'GraphQL', 'Kubernetes', 'Terraform', 'Jenkins',
    'Figma', 'Adobe Creative Suite', 'Sketch', 'Photoshop', 'Illustrator'
  ],
  consultant: [
    'Business Analysis', 'Strategic Planning', 'Process Optimization', 'Change Management',
    'Stakeholder Management', 'Risk Assessment', 'Technology Evaluation', 'Training & Development'
  ]
}

export default function SkillsExpertiseStep({ 
  data, 
  onUpdate, 
  onNext, 
  onPrev, 
  userType 
}: SkillsExpertiseStepProps) {
  const [formData, setFormData] = useState<SkillsExpertiseData>(data)
  const [newSkillName, setNewSkillName] = useState('')
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate')
  const [newCertification, setNewCertification] = useState<Certification>({
    name: '',
    issuer: '',
    year: new Date().getFullYear().toString()
  })

  const handleUpdate = (newData: SkillsExpertiseData) => {
    setFormData(newData)
    onUpdate(newData)
  }

  const addSkill = (name: string, level: 'Beginner' | 'Intermediate' | 'Expert' = 'Intermediate') => {
    if (name.trim() && !formData.skillsList.some(skill => skill.name.toLowerCase() === name.toLowerCase())) {
      const newSkill: Skill = {
        name: name.trim(),
        level,
        isPrimary: formData.skillsList.length < 5 // First 5 skills are primary by default
      }
      handleUpdate({
        ...formData,
        skillsList: [...formData.skillsList, newSkill]
      })
      setNewSkillName('')
    }
  }

  const removeSkill = (skillName: string) => {
    handleUpdate({
      ...formData,
      skillsList: formData.skillsList.filter(skill => skill.name !== skillName)
    })
  }

  const updateSkill = (skillName: string, updates: Partial<Skill>) => {
    handleUpdate({
      ...formData,
      skillsList: formData.skillsList.map(skill =>
        skill.name === skillName ? { ...skill, ...updates } : skill
      )
    })
  }

  const addCertification = () => {
    if (newCertification.name.trim() && newCertification.issuer.trim()) {
      handleUpdate({
        ...formData,
        certifications: [...formData.certifications, { ...newCertification }]
      })
      setNewCertification({ name: '', issuer: '', year: new Date().getFullYear().toString() })
    }
  }

  const removeCertification = (index: number) => {
    handleUpdate({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index)
    })
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-[#22C55E] hover:bg-[#22C55E]/80 text-white'
      case 'Intermediate': return 'bg-[#F59E0B] hover:bg-[#F59E0B]/80 text-white'
      case 'Beginner': return 'bg-gray-400 hover:bg-gray-400/80 text-white'
      default: return 'bg-gray-200'
    }
  }

  const primarySkills = formData.skillsList.filter(skill => skill.isPrimary)
  const secondarySkills = formData.skillsList.filter(skill => !skill.isPrimary)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1A2B4C] to-[#4A73CC] rounded-lg flex items-center justify-center mx-auto">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#1A2B4C]">Your Skills & Expertise</h2>
        <p className="text-gray-600">
          {userType === 'buyer' 
            ? 'What skills do you bring to technology procurement and vendor management?'
            : 'Showcase your technical and professional capabilities'
          }
        </p>
      </div>

      <div className="space-y-8">
        {/* Add New Skill */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add Skills
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Add your key skills and rate your proficiency level
              </p>
            </div>

            {/* Quick Add from Common Skills */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Popular skills:</p>
              <div className="flex flex-wrap gap-2">
                {commonSkills[userType]
                  .filter(skill => !formData.skillsList.some(s => s.name.toLowerCase() === skill.toLowerCase()))
                  .slice(0, 8)
                  .map((skill, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-[#4A73CC]/10 hover:text-[#4A73CC] hover:border-[#4A73CC]"
                      onClick={() => addSkill(skill)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {skill}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Custom Skill Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Enter skill name..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addSkill(newSkillName, newSkillLevel)
                  }
                }}
              />
              <Select value={newSkillLevel} onValueChange={(value: any) => setNewSkillLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Expert">Expert</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => addSkill(newSkillName, newSkillLevel)}
                disabled={!newSkillName.trim()}
                className="bg-[#1A2B4C]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Primary Skills */}
        {primarySkills.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-lg font-semibold text-[#1A2B4C] flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#F59E0B]" />
                  Primary Skills
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Your top skills that best represent your expertise
                </p>
              </div>

              <div className="space-y-3">
                {primarySkills.map((skill, index) => (
                  <div key={skill.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <Badge className={getLevelColor(skill.level)}>
                        {skill.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={skill.level}
                        onValueChange={(value: any) => updateSkill(skill.name, { level: value })}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateSkill(skill.name, { isPrimary: false })}
                      >
                        Move to Secondary
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.name)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Secondary Skills */}
        {secondarySkills.length > 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-lg font-semibold text-[#1A2B4C]">
                  Secondary Skills
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Additional skills in your toolkit
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {secondarySkills.map((skill) => (
                  <Badge
                    key={skill.name}
                    variant="secondary"
                    className="pr-1 flex items-center gap-1"
                  >
                    {skill.name}
                    <span className={`px-1 py-0.5 rounded text-xs ${getLevelColor(skill.level)}`}>
                      {skill.level.charAt(0)}
                    </span>
                    <button
                      onClick={() => updateSkill(skill.name, { isPrimary: primarySkills.length < 8 })}
                      className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                      title="Move to Primary"
                    >
                      <Star className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeSkill(skill.name)}
                      className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certifications */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6 space-y-4">
            <div>
              <Label className="text-lg font-semibold text-[#1A2B4C] flex items-center gap-2">
                <Award className="w-5 h-5" />
                Professional Certifications
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Add any relevant certifications or credentials you've earned
              </p>
            </div>

            {/* Add Certification Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Certification name..."
                value={newCertification.name}
                onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
              />
              <Input
                placeholder="Issuing organization..."
                value={newCertification.issuer}
                onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
              />
              <Input
                type="number"
                placeholder="Year obtained..."
                value={newCertification.year}
                onChange={(e) => setNewCertification({ ...newCertification, year: e.target.value })}
                min="1990"
                max={new Date().getFullYear()}
              />
              <Button
                onClick={addCertification}
                disabled={!newCertification.name.trim() || !newCertification.issuer.trim()}
                className="bg-[#1A2B4C]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>

            {/* Current Certifications */}
            {formData.certifications.length > 0 && (
              <div className="space-y-3">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tips */}
        <Card className="border-0 bg-gradient-to-r from-[#4A73CC]/10 to-[#22C55E]/10">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[#1A2B4C] mb-3 flex items-center gap-2">
              <div className="w-5 h-5 bg-[#4A73CC] rounded-full flex items-center justify-center">
                <span className="text-white text-xs">💡</span>
              </div>
              Skills best practices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="space-y-2">
                <p className="font-medium">Skill Organization:</p>
                <ul className="space-y-1 text-xs">
                  <li>• List your strongest skills as "Primary"</li>
                  <li>• Be honest about your proficiency levels</li>
                  <li>• Include both technical and soft skills</li>
                  <li>• Focus on skills relevant to your target clients</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium">Certifications:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Include recent and relevant certifications</li>
                  <li>• Professional certifications carry more weight</li>
                  <li>• Keep them current and up-to-date</li>
                  <li>• Consider adding certification numbers if applicable</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}