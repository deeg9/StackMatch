import { type NextRequest, NextResponse } from "next/server"
import type { CategoryTemplate, LoadTemplateResponse } from "@/types/guided-listing-types"

// Mock templates - in production, these would come from a database
const templates: Record<string, CategoryTemplate> = {
  "web-development": {
    id: "web-development",
    name: "Web Development",
    description: "Custom websites, web applications, and digital platforms",
    icon: "🌐",
    color: "blue",
    estimatedTime: "10-15 minutes",
    popularityRank: 1,
    qualificationQuestions: [
      {
        id: "project_type",
        text: "What type of web project do you need?",
        type: "select",
        required: true,
        options: [
          { value: "website", label: "Business Website" },
          { value: "ecommerce", label: "E-commerce Store" },
          { value: "webapp", label: "Web Application" },
          { value: "api", label: "API Development" },
          { value: "other", label: "Other" },
        ],
        aiHints: "Help categorize the project type for better matching",
      },
      {
        id: "tech_stack",
        text: "Do you have any technology preferences?",
        type: "multiselect",
        required: false,
        options: [
          { value: "react", label: "React" },
          { value: "vue", label: "Vue.js" },
          { value: "angular", label: "Angular" },
          { value: "nodejs", label: "Node.js" },
          { value: "python", label: "Python" },
          { value: "php", label: "PHP" },
          { value: "no_preference", label: "No preference" },
        ],
      },
      {
        id: "existing_system",
        text: "Do you have an existing system that needs integration?",
        type: "boolean",
        required: true,
      },
    ],
    scopingQuestions: [
      {
        id: "features_needed",
        text: "What key features do you need?",
        type: "multiselect",
        required: true,
        options: [
          { value: "user_auth", label: "User Authentication" },
          { value: "payment", label: "Payment Processing" },
          { value: "cms", label: "Content Management" },
          { value: "analytics", label: "Analytics & Reporting" },
          { value: "mobile_responsive", label: "Mobile Responsive" },
          { value: "seo", label: "SEO Optimization" },
        ],
      },
      {
        id: "user_volume",
        text: "How many users do you expect?",
        type: "select",
        required: true,
        options: [
          { value: "small", label: "< 1,000 users" },
          { value: "medium", label: "1,000 - 10,000 users" },
          { value: "large", label: "10,000+ users" },
          { value: "unknown", label: "Not sure yet" },
        ],
      },
      {
        id: "design_assets",
        text: "Do you have existing design assets?",
        type: "select",
        required: true,
        options: [
          { value: "complete", label: "Complete designs ready" },
          { value: "partial", label: "Some designs/wireframes" },
          { value: "none", label: "Need design from scratch" },
          { value: "brand_only", label: "Only brand guidelines" },
        ],
      },
    ],
  },
  "mobile-development": {
    id: "mobile-development",
    name: "Mobile Development",
    description: "iOS and Android mobile applications",
    icon: "📱",
    color: "green",
    estimatedTime: "12-18 minutes",
    popularityRank: 2,
    qualificationQuestions: [
      {
        id: "platform",
        text: "Which platforms do you need?",
        type: "multiselect",
        required: true,
        options: [
          { value: "ios", label: "iOS (iPhone/iPad)" },
          { value: "android", label: "Android" },
          { value: "cross_platform", label: "Cross-platform (both)" },
        ],
      },
      {
        id: "app_type",
        text: "What type of mobile app?",
        type: "select",
        required: true,
        options: [
          { value: "native", label: "Native App" },
          { value: "hybrid", label: "Hybrid App" },
          { value: "pwa", label: "Progressive Web App" },
          { value: "not_sure", label: "Not sure - need advice" },
        ],
      },
    ],
    scopingQuestions: [
      {
        id: "core_features",
        text: "What are the core features?",
        type: "multiselect",
        required: true,
        options: [
          { value: "user_profiles", label: "User Profiles" },
          { value: "push_notifications", label: "Push Notifications" },
          { value: "offline_mode", label: "Offline Functionality" },
          { value: "camera", label: "Camera Integration" },
          { value: "gps", label: "GPS/Location Services" },
          { value: "payments", label: "In-app Payments" },
        ],
      },
    ],
  },
  design: {
    id: "design",
    name: "Design & Creative",
    description: "UI/UX design, branding, and creative services",
    icon: "🎨",
    color: "purple",
    estimatedTime: "8-12 minutes",
    popularityRank: 3,
    qualificationQuestions: [
      {
        id: "design_type",
        text: "What type of design work do you need?",
        type: "select",
        required: true,
        options: [
          { value: "ui_ux", label: "UI/UX Design" },
          { value: "branding", label: "Branding & Logo" },
          { value: "web_design", label: "Web Design" },
          { value: "print", label: "Print Design" },
          { value: "illustration", label: "Illustration" },
        ],
      },
    ],
    scopingQuestions: [
      {
        id: "deliverables",
        text: "What deliverables do you need?",
        type: "multiselect",
        required: true,
        options: [
          { value: "wireframes", label: "Wireframes" },
          { value: "mockups", label: "High-fidelity Mockups" },
          { value: "prototype", label: "Interactive Prototype" },
          { value: "style_guide", label: "Style Guide" },
          { value: "assets", label: "Design Assets" },
        ],
      },
    ],
  },
}

export async function GET(request: NextRequest, { params }: { params: { category: string } }) {
  try {
    const category = params.category
    const template = templates[category]

    if (!template) {
      return NextResponse.json({ error: "Template not found", success: false }, { status: 404 })
    }

    const response: LoadTemplateResponse = {
      template,
      success: true,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error loading template:", error)
    return NextResponse.json({ error: "Failed to load template", success: false }, { status: 500 })
  }
}
