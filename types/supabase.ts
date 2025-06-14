// Complete Supabase Database Type Definitions
// Generated from actual codebase usage analysis

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

// Database Enums
export type DatabaseEnums = {
  user_type: 'buyer' | 'seller'
  listing_status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'AWARDED' | 'CANCELLED'
  proposal_status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  contract_status: 'DRAFT' | 'PENDING_SIGNATURES' | 'ACTIVE' | 'COMPLETED' | 'TERMINATED'
  deal_room_status: 'ACTIVE' | 'COMPLETED' | 'CLOSED' | 'CANCELLED' | 'PENDING_CLOSURE' | 'CLOSED_SUCCESSFULLY' | 'CLOSED_UNSUCCESSFULLY'
  milestone_status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED'
  conversation_type: 'DIRECT' | 'LISTING_INQUIRY' | 'PROPOSAL_DISCUSSION'
  message_type: 'TEXT' | 'FILE' | 'SYSTEM'
  file_type: 'CONTRACT' | 'SCOPE_DOCUMENT' | 'INVOICE' | 'DELIVERABLE' | 'OTHER'
  thread_type: 'DISCUSSION' | 'QUESTION' | 'ANNOUNCEMENT' | 'POLL'
  thread_status: 'OPEN' | 'CLOSED' | 'PINNED' | 'ARCHIVED'
  vote_type: 'UPVOTE' | 'DOWNVOTE'
  verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  requirement_priority: 'HIGH' | 'MEDIUM' | 'LOW'
}

export type Database = {
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
          user_type: DatabaseEnums['user_type'] | null
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
          user_type?: DatabaseEnums['user_type'] | null
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
          user_type?: DatabaseEnums['user_type'] | null
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
        Relationships: []
      }
      seller_profiles: {
        Row: {
          id: string
          user_id: string | null
          business_type: string | null
          years_in_business: number | null
          team_size: number | null
          hourly_rate_min: number | null
          hourly_rate_max: number | null
          expertise_areas: string[] | null
          certifications: Json | null
          portfolio_url: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          business_type?: string | null
          years_in_business?: number | null
          team_size?: number | null
          hourly_rate_min?: number | null
          hourly_rate_max?: number | null
          expertise_areas?: string[] | null
          certifications?: Json | null
          portfolio_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          business_type?: string | null
          years_in_business?: number | null
          team_size?: number | null
          hourly_rate_min?: number | null
          hourly_rate_max?: number | null
          expertise_areas?: string[] | null
          certifications?: Json | null
          portfolio_url?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      listings: {
        Row: {
          id: string
          buyer_id: string
          title: string
          description: string
          category_id: string | null
          status: DatabaseEnums['listing_status'] | null
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
          status?: DatabaseEnums['listing_status'] | null
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
          status?: DatabaseEnums['listing_status'] | null
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
        Relationships: []
      }
      project_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          id: string
          listing_id: string
          seller_id: string
          status: DatabaseEnums['proposal_status'] | null
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
          status?: DatabaseEnums['proposal_status'] | null
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
          status?: DatabaseEnums['proposal_status'] | null
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
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          type: DatabaseEnums['conversation_type']
          listing_id: string | null
          proposal_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: DatabaseEnums['conversation_type']
          listing_id?: string | null
          proposal_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: DatabaseEnums['conversation_type']
          listing_id?: string | null
          proposal_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          last_read_at: string | null
          is_archived: boolean | null
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          last_read_at?: string | null
          is_archived?: boolean | null
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          last_read_at?: string | null
          is_archived?: boolean | null
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string | null
          sender_id: string | null
          content: string
          attachments: Json | null
          is_encrypted: boolean | null
          is_edited: boolean | null
          edited_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          content: string
          attachments?: Json | null
          is_encrypted?: boolean | null
          is_edited?: boolean | null
          edited_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          content?: string
          attachments?: Json | null
          is_encrypted?: boolean | null
          is_edited?: boolean | null
          edited_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      deal_rooms: {
        Row: {
          id: string
          listing_id: string | null
          proposal_id: string | null
          buyer_id: string
          seller_id: string
          status: DatabaseEnums['deal_room_status']
          room_name: string | null
          created_at: string
          completed_at: string | null
          last_activity_at: string | null
        }
        Insert: {
          id?: string
          listing_id?: string | null
          proposal_id?: string | null
          buyer_id: string
          seller_id: string
          status?: DatabaseEnums['deal_room_status']
          room_name?: string | null
          created_at?: string
          completed_at?: string | null
          last_activity_at?: string | null
        }
        Update: {
          id?: string
          listing_id?: string | null
          proposal_id?: string | null
          buyer_id?: string
          seller_id?: string
          status?: DatabaseEnums['deal_room_status']
          room_name?: string | null
          created_at?: string
          completed_at?: string | null
          last_activity_at?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          id: string
          deal_room_id: string
          title: string
          description: string | null
          value: number | null
          status: DatabaseEnums['contract_status']
          start_date: string | null
          end_date: string | null
          signed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deal_room_id: string
          title: string
          description?: string | null
          value?: number | null
          status?: DatabaseEnums['contract_status']
          start_date?: string | null
          end_date?: string | null
          signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deal_room_id?: string
          title?: string
          description?: string | null
          value?: number | null
          status?: DatabaseEnums['contract_status']
          start_date?: string | null
          end_date?: string | null
          signed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contract_files: {
        Row: {
          id: string
          contract_id: string
          title: string
          description: string | null
          file_type: string | null
          is_active: boolean | null
          current_version_id: string | null
          uploaded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          title: string
          description?: string | null
          file_type?: string | null
          is_active?: boolean | null
          current_version_id?: string | null
          uploaded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          title?: string
          description?: string | null
          file_type?: string | null
          is_active?: boolean | null
          current_version_id?: string | null
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      contract_file_versions: {
        Row: {
          id: string
          contract_file_id: string
          version_number: number
          blob_url: string
          file_type: string | null
          file_size_bytes: number | null
          change_description: string | null
          uploaded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_file_id: string
          version_number: number
          blob_url: string
          file_type?: string | null
          file_size_bytes?: number | null
          change_description?: string | null
          uploaded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_file_id?: string
          version_number?: number
          blob_url?: string
          file_type?: string | null
          file_size_bytes?: number | null
          change_description?: string | null
          uploaded_by?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      seller_services: {
        Row: {
          id: string
          seller_profile_id: string
          service_category_id: string | null
          name: string
          description: string | null
          min_price: number | null
          max_price: number | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_profile_id: string
          service_category_id?: string | null
          name: string
          description?: string | null
          min_price?: number | null
          max_price?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_profile_id?: string
          service_category_id?: string | null
          name?: string
          description?: string | null
          min_price?: number | null
          max_price?: number | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      seller_portfolio: {
        Row: {
          id: string
          seller_profile_id: string
          title: string
          description: string | null
          project_type: string | null
          client_industry: string | null
          technologies_used: string[] | null
          project_url: string | null
          completion_date: string | null
          is_public: boolean | null
          is_featured: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_profile_id: string
          title: string
          description?: string | null
          project_type?: string | null
          client_industry?: string | null
          technologies_used?: string[] | null
          project_url?: string | null
          completion_date?: string | null
          is_public?: boolean | null
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_profile_id?: string
          title?: string
          description?: string | null
          project_type?: string | null
          client_industry?: string | null
          technologies_used?: string[] | null
          project_url?: string | null
          completion_date?: string | null
          is_public?: boolean | null
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string | null
          is_read: boolean | null
          related_entity_type: string | null
          related_entity_id: string | null
          action_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string | null
          is_read?: boolean | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          action_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string | null
          is_read?: boolean | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          action_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      saved_listings: {
        Row: {
          id: string
          seller_id: string
          listing_id: string
          saved_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          listing_id: string
          saved_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          listing_id?: string
          saved_at?: string
        }
        Relationships: []
      }
      listing_conversations: {
        Row: {
          id: string
          user_id: string
          session_id: string
          conversation_data: Json
          form_state: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          session_id: string
          conversation_data?: Json
          form_state?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string
          conversation_data?: Json
          form_state?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          email: string
          email_confirmed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          email_confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          email_confirmed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      deal_room_participants: {
        Row: {
          id: string
          deal_room_id: string
          user_id: string
          role: "BUYER" | "SELLER"
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deal_room_id: string
          user_id: string
          role: "BUYER" | "SELLER"
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deal_room_id?: string
          user_id?: string
          role?: "BUYER" | "SELLER"
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      deal_room_files: {
        Row: {
          id: string
          deal_room_id: string
          uploader_id: string | null
          contract_id: string | null
          milestone_id: string | null
          file_name: string
          file_path: string
          file_size_bytes: number
          mime_type: string
          type: DatabaseEnums['file_type'] | null
          description: string | null
          version: number | null
          parent_file_id: string | null
          is_latest: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          deal_room_id: string
          uploader_id?: string | null
          contract_id?: string | null
          milestone_id?: string | null
          file_name: string
          file_path: string
          file_size_bytes: number
          mime_type: string
          type?: DatabaseEnums['file_type'] | null
          description?: string | null
          version?: number | null
          parent_file_id?: string | null
          is_latest?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          deal_room_id?: string
          uploader_id?: string | null
          contract_id?: string | null
          milestone_id?: string | null
          file_name?: string
          file_path?: string
          file_size_bytes?: number
          mime_type?: string
          type?: DatabaseEnums['file_type'] | null
          description?: string | null
          version?: number | null
          parent_file_id?: string | null
          is_latest?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      deal_room_messages: {
        Row: {
          id: string
          deal_room_id: string
          sender_id: string
          sender_type: string
          content: string
          created_at: string
          updated_at: string | null
          is_read: boolean | null
        }
        Insert: {
          id?: string
          deal_room_id: string
          sender_id: string
          sender_type: string
          content: string
          created_at?: string
          updated_at?: string | null
          is_read?: boolean | null
        }
        Update: {
          id?: string
          deal_room_id?: string
          sender_id?: string
          sender_type?: string
          content?: string
          created_at?: string
          updated_at?: string | null
          is_read?: boolean | null
        }
        Relationships: []
      }
      milestones: {
        Row: {
          id: string
          contract_id: string
          title: string
          description: string | null
          due_date: string | null
          status: DatabaseEnums['milestone_status']
          amount: number | null
          is_payment_milestone: boolean
          submitted_at: string | null
          approved_at: string | null
          rejected_at: string | null
          paid_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          title: string
          description?: string | null
          due_date?: string | null
          status?: DatabaseEnums['milestone_status']
          amount?: number | null
          is_payment_milestone?: boolean
          submitted_at?: string | null
          approved_at?: string | null
          rejected_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          status?: DatabaseEnums['milestone_status']
          amount?: number | null
          is_payment_milestone?: boolean
          submitted_at?: string | null
          approved_at?: string | null
          rejected_at?: string | null
          paid_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_enhancements: {
        Row: {
          id: string
          conversation_id: string | null
          field_name: string
          original_value: string | null
          enhanced_value: string
          enhancement_type: string
          user_feedback: number | null
          created_at: string | null
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          field_name: string
          original_value?: string | null
          enhanced_value: string
          enhancement_type: string
          user_feedback?: number | null
          created_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string | null
          field_name?: string
          original_value?: string | null
          enhanced_value?: string
          enhancement_type?: string
          user_feedback?: number | null
          created_at?: string | null
        }
        Relationships: []
      }
      buyer_budgets: {
        Row: {
          id: string
          buyer_profile_id: string | null
          project_name: string
          allocated_budget: number
          spent_amount: number | null
          remaining_budget: number | null
          budget_period: string | null
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          buyer_profile_id?: string | null
          project_name: string
          allocated_budget: number
          spent_amount?: number | null
          remaining_budget?: number | null
          budget_period?: string | null
          status?: DatabaseEnums['listing_status'] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          buyer_profile_id?: string | null
          project_name?: string
          allocated_budget?: number
          spent_amount?: number | null
          remaining_budget?: number | null
          budget_period?: string | null
          status?: DatabaseEnums['listing_status'] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      buyer_expenses: {
        Row: {
          id: string
          buyer_profile_id: string | null
          budget_id: string | null
          expense_name: string
          amount: number
          category: string
          expense_date: string
          description: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          buyer_profile_id?: string | null
          budget_id?: string | null
          expense_name: string
          amount: number
          category: string
          expense_date: string
          description?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          buyer_profile_id?: string | null
          budget_id?: string | null
          expense_name?: string
          amount?: number
          category?: string
          expense_date?: string
          description?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      deal_room_activities: {
        Row: {
          id: string
          deal_room_id: string
          user_id: string | null
          activity_type: string
          content: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          deal_room_id: string
          user_id?: string | null
          activity_type: string
          content?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          deal_room_id?: string
          user_id?: string | null
          activity_type?: string
          content?: Json | null
          created_at?: string | null
        }
        Relationships: []
      }
      deal_room_closures: {
        Row: {
          id: string
          deal_room_id: string
          initiator_id: string
          initiator_type: string
          reason_category: string
          reason_description: string | null
          outcome_type: string
          requested_at: string
          finalized_at: string | null
          cooling_period_ends_at: string | null
          feedback_buyer_rating: number | null
          feedback_buyer_comment: string | null
          feedback_seller_rating: number | null
          feedback_seller_comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deal_room_id: string
          initiator_id: string
          initiator_type: string
          reason_category: string
          reason_description?: string | null
          outcome_type: string
          requested_at?: string
          finalized_at?: string | null
          cooling_period_ends_at?: string | null
          feedback_buyer_rating?: number | null
          feedback_buyer_comment?: string | null
          feedback_seller_rating?: number | null
          feedback_seller_comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deal_room_id?: string
          initiator_id?: string
          initiator_type?: string
          reason_category?: string
          reason_description?: string | null
          outcome_type?: string
          requested_at?: string
          finalized_at?: string | null
          cooling_period_ends_at?: string | null
          feedback_buyer_rating?: number | null
          feedback_buyer_comment?: string | null
          feedback_seller_rating?: number | null
          feedback_seller_comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      deal_room_documents: {
        Row: {
          id: string
          deal_room_id: string
          title: string
          content: string | null
          document_type: string
          created_at: string
          updated_at: string | null
          created_by_id: string | null
        }
        Insert: {
          id?: string
          deal_room_id: string
          title: string
          content?: string | null
          document_type: string
          created_at: string
          updated_at?: string | null
          created_by_id?: string | null
        }
        Update: {
          id?: string
          deal_room_id?: string
          title?: string
          content?: string | null
          document_type?: string
          created_at?: string
          updated_at?: string | null
          created_by_id?: string | null
        }
        Relationships: []
      }
      listing_drafts: {
        Row: {
          id: string
          user_id: string
          category: string
          form_data: Json
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          form_data: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          form_data?: Json
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      listing_requirements: {
        Row: {
          id: string
          listing_id: string | null
          requirement: string
          priority: string | null
          order_index: number | null
        }
        Insert: {
          id?: string
          listing_id?: string | null
          requirement: string
          priority?: string | null
          order_index?: number | null
        }
        Update: {
          id?: string
          listing_id?: string | null
          requirement?: string
          priority?: string | null
          order_index?: number | null
        }
        Relationships: []
      }
      message_reactions: {
        Row: {
          id: string
          message_id: string | null
          user_id: string | null
          emoji: string
          created_at: string | null
        }
        Insert: {
          id?: string
          message_id?: string | null
          user_id?: string | null
          emoji: string
          created_at?: string | null
        }
        Update: {
          id?: string
          message_id?: string | null
          user_id?: string | null
          emoji?: string
          created_at?: string | null
        }
        Relationships: []
      }
      proposal_milestones: {
        Row: {
          id: string
          proposal_id: string | null
          title: string
          description: string | null
          deliverables: string[] | null
          amount: number
          duration_days: number | null
          order_index: number | null
        }
        Insert: {
          id?: string
          proposal_id?: string | null
          title: string
          description?: string | null
          deliverables?: string[] | null
          amount: number
          duration_days?: number | null
          order_index?: number | null
        }
        Update: {
          id?: string
          proposal_id?: string | null
          title?: string
          description?: string | null
          deliverables?: string[] | null
          amount?: number
          duration_days?: number | null
          order_index?: number | null
        }
        Relationships: []
      }
      user_reputation: {
        Row: {
          id: string
          user_id: string
          points: number | null
          threads_created: number | null
          comments_created: number | null
          upvotes_received: number | null
          downvotes_received: number | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          points?: number | null
          threads_created?: number | null
          comments_created?: number | null
          upvotes_received?: number | null
          downvotes_received?: number | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          points?: number | null
          threads_created?: number | null
          comments_created?: number | null
          upvotes_received?: number | null
          downvotes_received?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          icon: string | null
          color: string | null
          order_index: number | null
          parent_id: string | null
          is_active: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order_index?: number | null
          parent_id?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          order_index?: number | null
          parent_id?: string | null
          is_active?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      forum_comments: {
        Row: {
          id: string
          thread_id: string
          author_id: string | null
          parent_comment_id: string | null
          content: string
          is_edited: boolean | null
          is_deleted: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          thread_id: string
          author_id?: string | null
          parent_comment_id?: string | null
          content: string
          is_edited?: boolean | null
          is_deleted?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          thread_id?: string
          author_id?: string | null
          parent_comment_id?: string | null
          content?: string
          is_edited?: boolean | null
          is_deleted?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_threads: {
        Row: {
          id: string
          author_id: string
          category_id: string | null
          title: string
          content: string
          type: DatabaseEnums['thread_type'] | null
          status: DatabaseEnums['thread_status'] | null
          view_count: number | null
          is_featured: boolean | null
          tags: string[] | null
          created_at: string | null
          updated_at: string | null
          last_activity_at: string | null
          is_anonymous: boolean | null
        }
        Insert: {
          id?: string
          author_id: string
          category_id?: string | null
          title: string
          content: string
          type?: DatabaseEnums['thread_type'] | null
          status?: DatabaseEnums['thread_status'] | null
          view_count?: number | null
          is_featured?: boolean | null
          tags?: string[] | null
          created_at?: string | null
          updated_at?: string | null
          last_activity_at?: string | null
          is_anonymous?: boolean | null
        }
        Update: {
          id?: string
          author_id?: string
          category_id?: string | null
          title?: string
          content?: string
          type?: DatabaseEnums['thread_type'] | null
          status?: DatabaseEnums['thread_status'] | null
          view_count?: number | null
          is_featured?: boolean | null
          tags?: string[] | null
          created_at?: string | null
          updated_at?: string | null
          last_activity_at?: string | null
          is_anonymous?: boolean | null
        }
        Relationships: []
      }
      forum_votes: {
        Row: {
          id: string
          user_id: string | null
          thread_id: string | null
          comment_id: string | null
          vote_type: DatabaseEnums['vote_type']
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          thread_id?: string | null
          comment_id?: string | null
          vote_type: DatabaseEnums['vote_type']
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          thread_id?: string | null
          comment_id?: string | null
          vote_type?: DatabaseEnums['vote_type']
          created_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_or_create_conversation: {
        Args: {
          p_user1_id: string
          p_user2_id: string
          p_type: string
          p_listing_id?: string
          p_proposal_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Export individual enum types for easy access
export type UserType = DatabaseEnums['user_type']
export type ListingStatus = DatabaseEnums['listing_status']
export type ProposalStatus = DatabaseEnums['proposal_status']
export type ContractStatus = DatabaseEnums['contract_status']
export type DealRoomStatus = DatabaseEnums['deal_room_status']
export type MilestoneStatus = DatabaseEnums['milestone_status']
export type ConversationType = DatabaseEnums['conversation_type']
export type MessageType = DatabaseEnums['message_type']
export type FileType = DatabaseEnums['file_type']
export type ThreadType = DatabaseEnums['thread_type']
export type ThreadStatus = DatabaseEnums['thread_status']
export type VoteType = DatabaseEnums['vote_type']
export type VerificationStatus = DatabaseEnums['verification_status']
export type RequirementPriority = DatabaseEnums['requirement_priority']