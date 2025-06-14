// Complete Supabase Database Type Definitions
// Generated from actual codebase usage analysis

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          user_type: "buyer" | "seller"
          full_name: string | null
          avatar_url: string | null
          company_name: string | null
          phone: string | null
          is_verified: boolean | null
          onboarding_completed: boolean | null
          email_verified: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          user_type: "buyer" | "seller"
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          is_verified?: boolean | null
          onboarding_completed?: boolean | null
          email_verified?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          user_type?: "buyer" | "seller"
          full_name?: string | null
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          is_verified?: boolean | null
          onboarding_completed?: boolean | null
          email_verified?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      buyer_profiles: {
        Row: {
          id: string
          user_id: string
          industry: string | null
          company_size: string | null
          annual_software_budget: number | null
          preferred_project_size: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          industry?: string | null
          company_size?: string | null
          annual_software_budget?: number | null
          preferred_project_size?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          industry?: string | null
          company_size?: string | null
          annual_software_budget?: number | null
          preferred_project_size?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      seller_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string | null
          business_description: string | null
          website_url: string | null
          portfolio_url: string | null
          years_in_business: number | null
          company_size: string | null
          hourly_rate_min: number | null
          hourly_rate_max: number | null
          project_rate_min: number | null
          project_rate_max: number | null
          availability: string | null
          next_available_date: string | null
          time_zone: string | null
          is_accepting_projects: boolean | null
          health_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name?: string | null
          business_description?: string | null
          website_url?: string | null
          portfolio_url?: string | null
          years_in_business?: number | null
          company_size?: string | null
          hourly_rate_min?: number | null
          hourly_rate_max?: number | null
          project_rate_min?: number | null
          project_rate_max?: number | null
          availability?: string | null
          next_available_date?: string | null
          time_zone?: string | null
          is_accepting_projects?: boolean | null
          health_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string | null
          business_description?: string | null
          website_url?: string | null
          portfolio_url?: string | null
          years_in_business?: number | null
          company_size?: string | null
          hourly_rate_min?: number | null
          hourly_rate_max?: number | null
          project_rate_min?: number | null
          project_rate_max?: number | null
          availability?: string | null
          next_available_date?: string | null
          time_zone?: string | null
          is_accepting_projects?: boolean | null
          health_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          id: string
          buyer_profile_id: string
          title: string
          description: string | null
          category_id: string | null
          budget_min: number | null
          budget_max: number | null
          timeline: string | null
          status: "OPEN" | "CLOSED" | "AWARDED" | "COMPLETED"
          is_featured: boolean | null
          created_at: string
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          buyer_profile_id: string
          title: string
          description?: string | null
          category_id?: string | null
          budget_min?: number | null
          budget_max?: number | null
          timeline?: string | null
          status?: "OPEN" | "CLOSED" | "AWARDED" | "COMPLETED"
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          buyer_profile_id?: string
          title?: string
          description?: string | null
          category_id?: string | null
          budget_min?: number | null
          budget_max?: number | null
          timeline?: string | null
          status?: "OPEN" | "CLOSED" | "AWARDED" | "COMPLETED"
          is_featured?: boolean | null
          created_at?: string
          updated_at?: string
          expires_at?: string | null
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
          seller_profile_id: string
          title: string
          description: string | null
          amount: number | null
          timeline: string | null
          status: "DRAFT" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
          submitted_at: string | null
          response_due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          seller_profile_id: string
          title: string
          description?: string | null
          amount?: number | null
          timeline?: string | null
          status?: "DRAFT" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
          submitted_at?: string | null
          response_due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          seller_profile_id?: string
          title?: string
          description?: string | null
          amount?: number | null
          timeline?: string | null
          status?: "DRAFT" | "SUBMITTED" | "ACCEPTED" | "REJECTED" | "WITHDRAWN"
          submitted_at?: string | null
          response_due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          type: "PROPOSAL_DISCUSSION" | "DEAL_ROOM" | "GENERAL" | "SUPPORT"
          listing_id: string | null
          proposal_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: "PROPOSAL_DISCUSSION" | "DEAL_ROOM" | "GENERAL" | "SUPPORT"
          listing_id?: string | null
          proposal_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: "PROPOSAL_DISCUSSION" | "DEAL_ROOM" | "GENERAL" | "SUPPORT"
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
          conversation_id: string
          sender_id: string
          content: string
          is_encrypted: boolean | null
          message_type: "TEXT" | "FILE" | "SYSTEM"
          file_url: string | null
          file_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          is_encrypted?: boolean | null
          message_type?: "TEXT" | "FILE" | "SYSTEM"
          file_url?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          is_encrypted?: boolean | null
          message_type?: "TEXT" | "FILE" | "SYSTEM"
          file_url?: string | null
          file_name?: string | null
          created_at?: string
          updated_at?: string
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
          status: "ACTIVE" | "COMPLETED" | "TERMINATED" | "ON_HOLD" | "PENDING_CLOSURE" | "CLOSED_SUCCESSFULLY" | "CLOSED_UNSUCCESSFULLY"
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
          status?: "ACTIVE" | "COMPLETED" | "TERMINATED" | "ON_HOLD" | "PENDING_CLOSURE" | "CLOSED_SUCCESSFULLY" | "CLOSED_UNSUCCESSFULLY"
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
          status?: "ACTIVE" | "COMPLETED" | "TERMINATED" | "ON_HOLD" | "PENDING_CLOSURE" | "CLOSED_SUCCESSFULLY" | "CLOSED_UNSUCCESSFULLY"
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
          status: "DRAFT" | "PENDING_SIGNATURES" | "ACTIVE" | "COMPLETED" | "TERMINATED"
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
          status?: "DRAFT" | "PENDING_SIGNATURES" | "ACTIVE" | "COMPLETED" | "TERMINATED"
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
          status?: "DRAFT" | "PENDING_SIGNATURES" | "ACTIVE" | "COMPLETED" | "TERMINATED"
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
          buyer_profile_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          buyer_profile_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          buyer_profile_id?: string
          listing_id?: string
          created_at?: string
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