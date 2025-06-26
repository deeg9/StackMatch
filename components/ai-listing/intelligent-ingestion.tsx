'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Sparkles, 
  Globe,
  Linkedin,
  Upload,
  FileText,
  HelpCircle,
  CheckCircle,
  AlertCircle
} from "lucide-react"

interface IntelligentIngestionProps {
  categoryName: string
  onAnalyze: (data: IngestionData) => void
  isLoading?: boolean
}

interface IngestionData {
  companyWebsite: string
  linkedinPage: string
  uploadedFiles: File[]
}

export default function IntelligentIngestion({ categoryName, onAnalyze, isLoading = false }: IntelligentIngestionProps) {
  const [formData, setFormData] = useState<IngestionData>({
    companyWebsite: '',
    linkedinPage: '',
    uploadedFiles: []
  })
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})

  const validateUrl = (url: string, field: string) => {
    if (!url) return true // Optional fields
    try {
      new URL(url)
      return true
    } catch {
      setErrors(prev => ({ ...prev, [field]: 'Please enter a valid URL' }))
      return false
    }
  }

  const handleInputChange = (field: keyof IngestionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      const validFiles = files.filter(file => 
        file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword'
      )
      setFormData(prev => ({ ...prev, uploadedFiles: [...prev.uploadedFiles, ...validFiles] }))
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setFormData(prev => ({ ...prev, uploadedFiles: [...prev.uploadedFiles, ...files] }))
    }
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter((_, i) => i !== index)
    }))
  }

  const canProceed = formData.companyWebsite || formData.linkedinPage || formData.uploadedFiles.length > 0

  const handleAnalyze = () => {
    let isValid = true
    const newErrors: {[key: string]: string} = {}

    if (formData.companyWebsite && !validateUrl(formData.companyWebsite, 'companyWebsite')) {
      isValid = false
    }
    if (formData.linkedinPage && !validateUrl(formData.linkedinPage, 'linkedinPage')) {
      isValid = false
    }

    if (!canProceed) {
      newErrors.general = 'Please provide at least one source of information about your business'
      isValid = false
    }

    setErrors(newErrors)

    if (isValid) {
      onAnalyze(formData)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-16 bg-gradient-to-r from-[#4A73CC] to-[#22C55E] rounded-full flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#1A2B4C]">Let's Build Your RFQ</h1>
        </div>
        <p className="text-xl text-[#6B7280] max-w-2xl mx-auto">
          Give our AI some context about your business to create a detailed first draft for your {categoryName.toLowerCase()} project.
        </p>
      </div>

      {/* Company Website */}
      <Card className="border-2 border-[#E5E7EB] hover:border-[#4A73CC] transition-all duration-300 animate-slide-up" style={{animationDelay: '0.1s'}}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#1A2B4C]">
            <Globe className="h-5 w-5 text-[#4A73CC]" />
            <span>Company Website</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="company-website" className="text-[#374151] font-medium">
            Your company website URL
          </Label>
          <Input
            id="company-website"
            type="url"
            placeholder="https://yourcompany.com"
            value={formData.companyWebsite}
            onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
            className={`border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC] ${errors.companyWebsite ? 'border-red-300' : ''}`}
          />
          {errors.companyWebsite && (
            <p className="text-red-500 text-sm flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.companyWebsite}</span>
            </p>
          )}
          <div className="flex items-start space-x-2 text-sm text-[#6B7280]">
            <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Our AI will analyze your website to understand your business model, size, and industry</span>
          </div>
        </CardContent>
      </Card>

      {/* LinkedIn Page */}
      <Card className="border-2 border-[#E5E7EB] hover:border-[#4A73CC] transition-all duration-300 animate-slide-up" style={{animationDelay: '0.2s'}}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#1A2B4C]">
            <Linkedin className="h-5 w-5 text-[#4A73CC]" />
            <span>Company LinkedIn Page</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="linkedin-page" className="text-[#374151] font-medium">
            Your company LinkedIn page URL
          </Label>
          <Input
            id="linkedin-page"
            type="url"
            placeholder="https://linkedin.com/company/yourcompany"
            value={formData.linkedinPage}
            onChange={(e) => handleInputChange('linkedinPage', e.target.value)}
            className={`border-[#D1D5DB] focus:border-[#4A73CC] focus:ring-[#4A73CC] ${errors.linkedinPage ? 'border-red-300' : ''}`}
          />
          {errors.linkedinPage && (
            <p className="text-red-500 text-sm flex items-center space-x-1">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.linkedinPage}</span>
            </p>
          )}
          <div className="flex items-start space-x-2 text-sm text-[#6B7280]">
            <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>LinkedIn provides additional context about your company culture and team</span>
          </div>
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card className="border-2 border-[#E5E7EB] hover:border-[#4A73CC] transition-all duration-300 animate-slide-up" style={{animationDelay: '0.3s'}}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-[#1A2B4C]">
            <Upload className="h-5 w-5 text-[#4A73CC]" />
            <span>Upload a Document</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
              dragActive 
                ? 'border-[#4A73CC] bg-blue-50' 
                : 'border-[#D1D5DB] hover:border-[#4A73CC] hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.doc"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-[#6B7280]" />
              </div>
              <div>
                <p className="text-lg font-medium text-[#1A2B4C] mb-2">
                  Drop files here or click to browse
                </p>
                <p className="text-sm text-[#6B7280]">
                  PDF, DOCX files up to 10MB each
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          {formData.uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label className="text-[#374151] font-medium">Uploaded Files:</Label>
              {formData.uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-[#6B7280]" />
                    <div>
                      <p className="text-sm font-medium text-[#1A2B4C]">{file.name}</p>
                      <p className="text-xs text-[#6B7280]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start space-x-2 text-sm text-[#6B7280]">
            <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>
              This could be a business plan, project overview, or an existing requirements list
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {errors.general && (
        <Card className="border-2 border-red-200 bg-red-50 animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{errors.general}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Info */}
      <Card className="border-2 border-[#22C55E] bg-gradient-to-r from-[#F0FDF4] to-[#ECFDF5] animate-slide-up" style={{animationDelay: '0.4s'}}>
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-[#1A2B4C] mb-2">What happens next?</h4>
              <p className="text-[#6B7280] text-sm mb-3">
                Our AI will analyze the information you provide to:
              </p>
              <ul className="text-[#6B7280] text-sm space-y-1 ml-4">
                <li>• Understand your business model and requirements</li>
                <li>• Generate a comprehensive RFQ draft</li>
                <li>• Pre-populate forms with relevant details</li>
                <li>• Suggest best practices for your industry</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyze Button */}
      <div className="text-center animate-slide-up" style={{animationDelay: '0.5s'}}>
        <Button
          onClick={handleAnalyze}
          disabled={!canProceed || isLoading}
          size="lg"
          className="bg-gradient-to-r from-[#4A73CC] to-[#22C55E] hover:from-[#3B6CB8] hover:to-[#16A34A] text-white px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Analyze & Build Draft RFQ</span>
            </div>
          )}
        </Button>
        {!canProceed && (
          <p className="text-sm text-[#6B7280] mt-2">
            Please provide at least one source of information to continue
          </p>
        )}
      </div>
    </div>
  )
}