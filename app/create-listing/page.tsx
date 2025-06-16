"use client"

import { useState, useEffect } from "react"
import CategorySelectionGrid from "@/components/guided-listing/category-selection-grid"
import GuidedFormContainer from "@/components/guided-listing/guided-form-container"
import { hrPayrollTemplate } from "@/lib/category-templates/hr-payroll-template"
import type { CategoryTemplate } from "@/types/guided-listing-types"

const categories: CategoryTemplate[] = [
  hrPayrollTemplate,
  {
    value: "web-development",
    label: "Web Development",
    name: "Web Development",
    description: "Custom websites, web applications, and digital platforms",
    icon: "🌐",
    color: "blue",
    popularity: 2,
    avgTime: "10-15 min",
    qualificationQuestions: [],
    scopingQuestions: [],
  },
  {
    value: "mobile-development",
    label: "Mobile Development",
    name: "Mobile Development",
    description: "iOS and Android mobile applications",
    icon: "📱",
    color: "green",
    popularity: 3,
    avgTime: "12-18 min",
    qualificationQuestions: [],
    scopingQuestions: [],
  },
  {
    value: "design",
    label: "Design & Creative",
    name: "Design & Creative",
    description: "UI/UX design, branding, and creative services",
    icon: "🎨",
    color: "purple",
    popularity: 4,
    avgTime: "8-12 min",
    qualificationQuestions: [],
    scopingQuestions: [],
  },
  {
    value: "data-science",
    label: "Data Science",
    name: "Data Science",
    description: "Analytics, machine learning, and data visualization",
    icon: "📊",
    color: "orange",
    popularity: 5,
    avgTime: "15-20 min",
    qualificationQuestions: [],
    scopingQuestions: [],
  },
  {
    value: "marketing",
    label: "Digital Marketing",
    name: "Digital Marketing",
    description: "SEO, social media, content marketing, and advertising",
    icon: "📈",
    color: "pink",
    popularity: 6,
    avgTime: "8-12 min",
    qualificationQuestions: [],
    scopingQuestions: [],
  },
]

export default function CreateListingPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<CategoryTemplate | null>(null)
  const [showGuidedForm, setShowGuidedForm] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)

  console.log("🔍 DEBUG: CreateListingPage render")
  console.log("🔍 DEBUG: Selected template:", selectedTemplate?.value || "none")
  console.log("🔍 DEBUG: Show guided form:", showGuidedForm)

  useEffect(() => {
    console.log("🔍 DEBUG: CreateListingPage useEffect")
    setIsClient(true)

    // Monitor dynamic imports that might be happening
    console.log("🔍 DEBUG: CreateListingPage mounted")

    return () => {
      console.log("🔍 DEBUG: CreateListingPage unmounting")
    }
  }, [])

  const handleCategorySelect = (categoryId: string) => {
    console.log("🔍 DEBUG: Category selected:", categoryId)
    
    const template = categories.find(cat => cat.value === categoryId || cat.id === categoryId)
    if (!template) {
      console.error("❌ DEBUG: Template not found for category:", categoryId)
      return
    }
    
    console.log("🔍 DEBUG: Template qualification sections:", template.qualificationSections?.length || 0)

    try {
      setSelectedTemplate(template)
      setSelectedCategoryId(categoryId)
      setShowGuidedForm(true)
      console.log("✅ DEBUG: Category selection successful")
    } catch (error) {
      console.error("❌ DEBUG: Category selection error:", error)
    }
  }

  const handleBackToCategories = () => {
    console.log("🔍 DEBUG: Back to categories clicked")
    try {
      setSelectedTemplate(null)
      setShowGuidedForm(false)
      console.log("✅ DEBUG: Back to categories successful")
    } catch (error) {
      console.error("❌ DEBUG: Back to categories error:", error)
    }
  }

  if (!isClient) {
    console.log("🔍 DEBUG: CreateListingPage not client-side yet")
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  console.log("🔍 DEBUG: CreateListingPage rendering content")

  if (showGuidedForm && selectedTemplate) {
    console.log("🔍 DEBUG: Rendering GuidedFormContainer")
    try {
      return <GuidedFormContainer selectedTemplate={selectedTemplate} onBackToCategories={handleBackToCategories} />
    } catch (error) {
      console.error("❌ DEBUG: GuidedFormContainer render error:", error)
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="text-white">Error loading form. Please try again.</div>
        </div>
      )
    }
  }

  console.log("🔍 DEBUG: Rendering CategorySelectionGrid")
  
  // Transform CategoryTemplate[] to Category[]
  const transformedCategories = categories.map(template => ({
    id: template.id || template.value,
    name: template.name,
    description: template.description,
    icon: template.icon, // emoji string will work as React.ReactNode
    popular: template.popularity <= 2 // mark top 2 as popular
  }))
  
  try {
    return (
      <div className="min-h-screen bg-slate-950">
        <CategorySelectionGrid 
          categories={transformedCategories} 
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategorySelect} 
        />
      </div>
    )
  } catch (error) {
    console.error("❌ DEBUG: CategorySelectionGrid render error:", error)
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Error loading categories. Please try again.</div>
      </div>
    )
  }
}
