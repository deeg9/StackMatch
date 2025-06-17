export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          company_name: string | null
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          is_verified: boolean | null
          email_verified: boolean | null
          onboarding_completed: boolean | null
          created_at: string | null
          updated_at: string | null
          user_type: Database["public"]["Enums"]["user_type"] | null
        }
        Insert: {
          id: string
          email: string
          company_name?: string | null
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_verified?: boolean | null
          email_verified?: boolean | null
          onboarding_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Update: {
          id?: string
          email?: string
          company_name?: string | null
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          is_verified?: boolean | null
          email_verified?: boolean | null
          onboarding_completed?: boolean | null
          created_at?: string | null
          updated_at?: string | null
          user_type?: Database["public"]["Enums"]["user_type"] | null
        }
        Relationships: []
      }
      buyer_profiles: {
        Row: {
          id: string
          user_id: string | null
          industry: string | null
          company_size: string | null
          annual_software_budget: number | null
          preferred_project_size: string | null
          created_at: string | null
          company_logo_url: string | null
          detailed_company_description: string | null
          primary_contact_name: string | null
          primary_contact_title: string | null
          primary_contact_email: string | null
          primary_contact_phone: string | null
          annual_project_budget: string | null
          average_project_duration: string | null
          preferred_pm_methodology: string | null
          typical_team_size: number | null
          business_objectives: Json | null
          social_media_profiles: Json | null
          verification_documents_url: string | null
          preferred_meeting_times: Json | null
          language_preferences: Json | null
          timezone: string | null
          business_challenges: string | null
          success_metrics: Json | null
          previous_experience: string | null
          preferred_provider_characteristics: Json | null
          partnership_goals: string | null
          updated_at: string | null
          company_description: string | null
          website_url: string | null
          founded_year: number | null
          headquarters_location: string | null
          annual_revenue_range: string | null
          company_name: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          industry?: string | null
          company_size?: string | null
          annual_software_budget?: number | null
          preferred_project_size?: string | null
          created_at?: string | null
          company_logo_url?: string | null
          detailed_company_description?: string | null
          primary_contact_name?: string | null
          primary_contact_title?: string | null
          primary_contact_email?: string | null
          primary_contact_phone?: string | null
          annual_project_budget?: string | null
          average_project_duration?: string | null
          preferred_pm_methodology?: string | null
          typical_team_size?: number | null
          business_objectives?: Json | null
          social_media_profiles?: Json | null
          verification_documents_url?: string | null
          preferred_meeting_times?: Json | null
          language_preferences?: Json | null
          timezone?: string | null
          business_challenges?: string | null
          success_metrics?: Json | null
          previous_experience?: string | null
          preferred_provider_characteristics?: Json | null
          partnership_goals?: string | null
          updated_at?: string | null
          company_description?: string | null
          website_url?: string | null
          founded_year?: number | null
          headquarters_location?: string | null
          annual_revenue_range?: string | null
          company_name?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          industry?: string | null
          company_size?: string | null
          annual_software_budget?: number | null
          preferred_project_size?: string | null
          created_at?: string | null
          company_logo_url?: string | null
          detailed_company_description?: string | null
          primary_contact_name?: string | null
          primary_contact_title?: string | null
          primary_contact_email?: string | null
          primary_contact_phone?: string | null
          annual_project_budget?: string | null
          average_project_duration?: string | null
          preferred_pm_methodology?: string | null
          typical_team_size?: number | null
          business_objectives?: Json | null
          social_media_profiles?: Json | null
          verification_documents_url?: string | null
          preferred_meeting_times?: Json | null
          language_preferences?: Json | null
          timezone?: string | null
          business_challenges?: string | null
          success_metrics?: Json | null
          previous_experience?: string | null
          preferred_provider_characteristics?: Json | null
          partnership_goals?: string | null
          updated_at?: string | null
          company_description?: string | null
          website_url?: string | null
          founded_year?: number | null
          headquarters_location?: string | null
          annual_revenue_range?: string | null
          company_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      listings: {
        Row: {
          id: string
          buyer_id: string
          title: string
          description: string
          category_id: string | null
          status: Database["public"]["Enums"]["listing_status"] | null
          budget_min: number | null
          budget_max: number | null
          project_duration: string | null
          required_skills: string[] | null
          location_preference: string | null
          remote_preference: string | null
          bid_deadline: string | null
          project_start_date: string | null
          attachments: Json | null
          view_count: number | null
          created_at: string | null
          updated_at: string | null
          published_at: string | null
          about_business: string | null
          about_company: string | null
          success_metrics: Json | null
          current_challenges: Json | null
          timeline_phases: Json | null
          tags: string[] | null
          timeline: Json | null
        }
        Insert: {
          id?: string
          buyer_id: string
          title: string
          description: string
          category_id?: string | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          budget_min?: number | null
          budget_max?: number | null
          project_duration?: string | null
          required_skills?: string[] | null
          location_preference?: string | null
          remote_preference?: string | null
          bid_deadline?: string | null
          project_start_date?: string | null
          attachments?: Json | null
          view_count?: number | null
          created_at?: string | null
          updated_at?: string | null
          published_at?: string | null
          about_business?: string | null
          about_company?: string | null
          success_metrics?: Json | null
          current_challenges?: Json | null
          timeline_phases?: Json | null
          tags?: string[] | null
          timeline?: Json | null
        }
        Update: {
          id?: string
          buyer_id?: string
          title?: string
          description?: string
          category_id?: string | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          budget_min?: number | null
          budget_max?: number | null
          project_duration?: string | null
          required_skills?: string[] | null
          location_preference?: string | null
          remote_preference?: string | null
          bid_deadline?: string | null
          project_start_date?: string | null
          attachments?: Json | null
          view_count?: number | null
          created_at?: string | null
          updated_at?: string | null
          published_at?: string | null
          about_business?: string | null
          about_company?: string | null
          success_metrics?: Json | null
          current_challenges?: Json | null
          timeline_phases?: Json | null
          tags?: string[] | null
          timeline?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "project_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      proposals: {
        Row: {
          id: string
          listing_id: string
          seller_id: string
          status: Database["public"]["Enums"]["proposal_status"] | null
          cover_letter: string
          proposed_budget: number
          proposed_timeline: string | null
          technical_approach: string | null
          relevant_experience: string | null
          attachments: Json | null
          is_sealed: boolean | null
          submitted_at: string | null
          reviewed_at: string | null
          created_at: string | null
          updated_at: string | null
          withdrawn_at: string | null
          withdrawal_reason: string | null
        }
        Insert: {
          id?: string
          listing_id: string
          seller_id: string
          status?: Database["public"]["Enums"]["proposal_status"] | null
          cover_letter: string
          proposed_budget: number
          proposed_timeline?: string | null
          technical_approach?: string | null
          relevant_experience?: string | null
          attachments?: Json | null
          is_sealed?: boolean | null
          submitted_at?: string | null
          reviewed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          withdrawn_at?: string | null
          withdrawal_reason?: string | null
        }
        Update: {
          id?: string
          listing_id?: string
          seller_id?: string
          status?: Database["public"]["Enums"]["proposal_status"] | null
          cover_letter?: string
          proposed_budget?: number
          proposed_timeline?: string | null
          technical_approach?: string | null
          relevant_experience?: string | null
          attachments?: Json | null
          is_sealed?: boolean | null
          submitted_at?: string | null
          reviewed_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          withdrawn_at?: string | null
          withdrawal_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "proposals_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      project_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          icon: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          icon?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          icon?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "project_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      deal_rooms: {
        Row: {
          id: string
          listing_id: string | null
          proposal_id: string | null
          buyer_id: string
          seller_id: string
          status: Database["public"]["Enums"]["deal_room_status"] | null
          created_at: string | null
          completed_at: string | null
          room_name: string | null
          updated_at: string | null
          last_activity_at: string | null
        }
        Insert: {
          id?: string
          listing_id?: string | null
          proposal_id?: string | null
          buyer_id: string
          seller_id: string
          status?: Database["public"]["Enums"]["deal_room_status"] | null
          created_at?: string | null
          completed_at?: string | null
          room_name?: string | null
          updated_at?: string | null
          last_activity_at?: string | null
        }
        Update: {
          id?: string
          listing_id?: string | null
          proposal_id?: string | null
          buyer_id?: string
          seller_id?: string
          status?: Database["public"]["Enums"]["deal_room_status"] | null
          created_at?: string | null
          completed_at?: string | null
          room_name?: string | null
          updated_at?: string | null
          last_activity_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deal_rooms_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_rooms_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_rooms_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deal_rooms_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "proposals"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: "buyer" | "seller"
      listing_status: "DRAFT" | "ACTIVE" | "CLOSED" | "AWARDED" | "CANCELLED"
      proposal_status: "DRAFT" | "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
      deal_room_status: "ACTIVE" | "COMPLETED" | "CLOSED" | "CANCELLED" | "PENDING_CLOSURE" | "CLOSED_SUCCESSFULLY" | "CLOSED_UNSUCCESSFULLY"
      contract_status: "DRAFT" | "PENDING_SIGNATURES" | "ACTIVE" | "COMPLETED" | "TERMINATED"
      milestone_status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE" | "CANCELLED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never