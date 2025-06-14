import { createClient } from "@/utils/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 BUYER ONBOARDING: Starting complete onboarding...")

    const supabase = createClient()

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("🔍 BUYER ONBOARDING: Authentication failed")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const onboardingData = await request.json()
    console.log("🔍 BUYER ONBOARDING: Data received:", Object.keys(onboardingData))

    // Check if buyer profile already exists
    const { data: existingProfile } = await supabase.from("buyer_profiles").select("id").eq("user_id", user.id).single()

    const profileData = {
      user_id: user.id,
      company_name: onboardingData.companyName,
      company_description: onboardingData.companyDescription,
      detailed_company_description: onboardingData.detailedCompanyDescription,
      company_logo_url: onboardingData.companyLogoUrl,
      website_url: onboardingData.websiteUrl,
      industry: onboardingData.industry,
      company_size: onboardingData.companySize,
      founded_year: onboardingData.foundedYear,
      headquarters_location: onboardingData.headquartersLocation,
      annual_revenue_range: onboardingData.annualRevenueRange,

      // Contact Information
      primary_contact_name: onboardingData.primaryContactName,
      primary_contact_title: onboardingData.primaryContactTitle,
      primary_contact_email: onboardingData.primaryContactEmail,
      primary_contact_phone: onboardingData.primaryContactPhone,

      // Project & Budget Information
      annual_project_budget: onboardingData.annualProjectBudget,
      average_project_duration: onboardingData.averageProjectDuration,
      preferred_pm_methodology: onboardingData.preferredPmMethodology,
      typical_team_size: onboardingData.typicalTeamSize,
      business_objectives: onboardingData.businessObjectives || [],

      // Communication & Verification
      social_media_profiles: onboardingData.socialMediaProfiles || {},
      verification_documents_url: onboardingData.verificationDocumentsUrl,
      preferred_meeting_times: onboardingData.preferredMeetingTimes || [],
      language_preferences: onboardingData.languagePreferences || [],
      timezone: onboardingData.timezone,

      // Goals & Expectations
      business_challenges: onboardingData.businessChallenges,
      success_metrics: onboardingData.successMetrics || [],
      previous_experience: onboardingData.previousExperience,
      preferred_provider_characteristics: onboardingData.preferredProviderCharacteristics || {},
      partnership_goals: onboardingData.partnershipGoals,

      updated_at: new Date().toISOString(),
    }

    let profile
    if (existingProfile) {
      // Update existing profile
      console.log("🔍 BUYER ONBOARDING: Updating existing profile")
      const { data, error } = await supabase
        .from("buyer_profiles")
        .update(profileData)
        .eq("user_id", user.id)
        .select()
        .single()

      if (error) {
        console.error("🔍 BUYER ONBOARDING: Update error:", error)
        return NextResponse.json({ error: "Failed to update buyer profile" }, { status: 500 })
      }
      profile = data
    } else {
      // Create new profile
      console.log("🔍 BUYER ONBOARDING: Creating new profile")
      profileData.created_at = new Date().toISOString()

      const { data, error } = await supabase.from("buyer_profiles").insert(profileData).select().single()

      if (error) {
        console.error("🔍 BUYER ONBOARDING: Create error:", error)
        return NextResponse.json({ error: "Failed to create buyer profile" }, { status: 500 })
      }
      profile = data
    }

    // Update the main profile to mark onboarding as completed
    await supabase
      .from("profiles")
      .update({
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    console.log("🔍 BUYER ONBOARDING: Onboarding completed successfully")
    return NextResponse.json({
      success: true,
      profile,
      message: "Buyer onboarding completed successfully",
    })
  } catch (error) {
    console.error("🔍 BUYER ONBOARDING: Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
