import { createClient } from "@/lib/supabase/client-wrapper"

export interface UserProfile {
  id: string
  email: string
  user_type: "BUYER" | "SELLER"
  first_name: string
  last_name: string
  avatar_url?: string
  phone?: string
  timezone: string
  is_verified: boolean
  verification_status: "PENDING" | "VERIFIED" | "REJECTED"
  created_at: string
  updated_at: string
  last_active: string
  preferences?: UserPreferences
  buyer_profile?: BuyerProfile
  seller_profile?: SellerProfile
}

export interface UserPreferences {
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  notification_frequency: "IMMEDIATE" | "HOURLY" | "DAILY" | "WEEKLY"
  bid_notifications: boolean
  message_notifications: boolean
  project_updates: boolean
  forum_notifications: boolean
  marketing_emails: boolean
  security_alerts: boolean
  theme: "LIGHT" | "DARK" | "SYSTEM"
  language: string
  timezone: string
  date_format: string
  currency: string
  profile_visibility: "PUBLIC" | "VERIFIED_ONLY" | "PRIVATE"
  show_online_status: boolean
  allow_direct_messages: boolean
  show_email_publicly: boolean
}

export interface BuyerProfile {
  id: string
  company_name: string
  company_description?: string
  company_logo_url?: string
  website_url?: string
  industry?: string
  company_size?: string
  founded_year?: number
  headquarters_location?: string
  annual_revenue_range?: string
  is_verified_buyer: boolean
}

export interface SellerProfile {
  id: string
  company_name: string
  tagline?: string
  description?: string
  logo_url?: string
  website_url?: string
  location?: string
  founded_year?: number
  team_size?: string
  hourly_rate_min?: number
  hourly_rate_max?: number
  next_availability?: string
  is_accepting_projects: boolean
  health_score: number
  background_check_status: "PENDING" | "VERIFIED" | "REJECTED"
  is_public: boolean
  allow_direct_contact: boolean
}

export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select(`
        *,
        user_preferences (*),
        buyer_profiles (*),
        seller_profiles (*)
      `)
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching user profile:", profileError)
      return null
    }

    return {
      ...profile,
      preferences: profile.user_preferences?.[0],
      buyer_profile: profile.buyer_profiles?.[0],
      seller_profile: profile.seller_profiles?.[0],
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function logUserActivity(
  userId: string,
  action: string,
  details: Record<string, any> = {},
  request?: Request,
) {
  try {
    const supabase = await createClient()

    const ipAddress = request?.headers.get("x-forwarded-for") || request?.headers.get("x-real-ip") || "unknown"
    const userAgent = request?.headers.get("user-agent") || "unknown"

    await supabase.rpc("log_user_activity", {
      p_user_id: userId,
      p_action: action,
      p_details: details,
      p_ip_address: ipAddress,
      p_user_agent: userAgent,
    })
  } catch (error) {
    console.error("Error logging user activity:", error)
  }
}
