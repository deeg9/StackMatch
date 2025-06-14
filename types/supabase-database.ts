// Generated Supabase Database Types based on actual table usage in the codebase

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
          full_name: string | null
          company_name: string | null
          avatar_url: string | null
          user_type: 'buyer' | 'seller'
          is_verified: boolean
          email_verified: boolean
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          avatar_url?: string | null
          user_type: 'buyer' | 'seller'
          is_verified?: boolean
          email_verified?: boolean
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          avatar_url?: string | null
          user_type?: 'buyer' | 'seller'
          is_verified?: boolean
          email_verified?: boolean
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      buyer_profiles: {
        Row: {
          id: string
          user_id: string
          company_name: string | null
          industry: string | null
          company_size: string | null
          website: string | null
          is_verified_buyer: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name?: string | null
          industry?: string | null
          company_size?: string | null
          website?: string | null
          is_verified_buyer?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string | null
          industry?: string | null
          company_size?: string | null
          website?: string | null
          is_verified_buyer?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      seller_profiles: {
        Row: {
          id: string
          user_id: string
          business_type: string | null
          years_experience: number | null
          specializations: string[] | null
          hourly_rate_min: number | null
          hourly_rate_max: number | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_type?: string | null
          years_experience?: number | null
          specializations?: string[] | null
          hourly_rate_min?: number | null
          hourly_rate_max?: number | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_type?: string | null
          years_experience?: number | null
          specializations?: string[] | null
          hourly_rate_min?: number | null
          hourly_rate_max?: number | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          title: string
          description: string
          buyer_id: string
          category_id: string | null
          status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'CANCELLED'
          budget_min: number | null
          budget_max: number | null
          bid_deadline: string | null
          project_start_date: string | null
          project_duration: string | null
          required_skills: string[] | null
          location_preference: string | null
          remote_preference: string | null
          about_company: string | null
          about_business: string | null
          attachments: Json[] | null
          success_metrics: string[] | null
          current_challenges: string[] | null
          timeline_phases: Json[] | null
          view_count: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          buyer_id: string
          category_id?: string | null
          status?: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'CANCELLED'
          budget_min?: number | null
          budget_max?: number | null
          bid_deadline?: string | null
          project_start_date?: string | null
          project_duration?: string | null
          required_skills?: string[] | null
          location_preference?: string | null
          remote_preference?: string | null
          about_company?: string | null
          about_business?: string | null
          attachments?: Json[] | null
          success_metrics?: string[] | null
          current_challenges?: string[] | null
          timeline_phases?: Json[] | null
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          buyer_id?: string
          category_id?: string | null
          status?: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'CANCELLED'
          budget_min?: number | null
          budget_max?: number | null
          bid_deadline?: string | null
          project_start_date?: string | null
          project_duration?: string | null
          required_skills?: string[] | null
          location_preference?: string | null
          remote_preference?: string | null
          about_company?: string | null
          about_business?: string | null
          attachments?: Json[] | null
          success_metrics?: string[] | null
          current_challenges?: string[] | null
          timeline_phases?: Json[] | null
          view_count?: number
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      listing_requirements: {
        Row: {
          id: string
          listing_id: string
          requirement: string
          priority: 'low' | 'medium' | 'high'
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          requirement: string
          priority?: 'low' | 'medium' | 'high'
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          requirement?: string
          priority?: 'low' | 'medium' | 'high'
          order_index?: number
          created_at?: string
        }
      }
      project_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          icon: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          parent_id?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          icon?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      proposals: {
        Row: {
          id: string
          listing_id: string
          seller_id: string
          cover_letter: string
          proposed_budget: number
          proposed_timeline: string | null
          technical_approach: string | null
          relevant_experience: string | null
          status: 'DRAFT' | 'SUBMITTED' | 'WITHDRAWN' | 'ACCEPTED' | 'REJECTED'
          is_sealed: boolean
          attachments: Json[] | null
          submitted_at: string | null
          withdrawn_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          seller_id: string
          cover_letter: string
          proposed_budget: number
          proposed_timeline?: string | null
          technical_approach?: string | null
          relevant_experience?: string | null
          status?: 'DRAFT' | 'SUBMITTED' | 'WITHDRAWN' | 'ACCEPTED' | 'REJECTED'
          is_sealed?: boolean
          attachments?: Json[] | null
          submitted_at?: string | null
          withdrawn_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          seller_id?: string
          cover_letter?: string
          proposed_budget?: number
          proposed_timeline?: string | null
          technical_approach?: string | null
          relevant_experience?: string | null
          status?: 'DRAFT' | 'SUBMITTED' | 'WITHDRAWN' | 'ACCEPTED' | 'REJECTED'
          is_sealed?: boolean
          attachments?: Json[] | null
          submitted_at?: string | null
          withdrawn_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      proposal_milestones: {
        Row: {
          id: string
          proposal_id: string
          title: string
          description: string | null
          deliverables: string[] | null
          amount: number
          duration_days: number | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          proposal_id: string
          title: string
          description?: string | null
          deliverables?: string[] | null
          amount: number
          duration_days?: number | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          proposal_id?: string
          title?: string
          description?: string | null
          deliverables?: string[] | null
          amount?: number
          duration_days?: number | null
          order_index?: number
          created_at?: string
        }
      }
      deal_rooms: {
        Row: {
          id: string
          listing_id: string | null
          proposal_id: string | null
          buyer_id: string
          seller_id: string
          room_name: string | null
          status: 'active' | 'pending_closure' | 'closed' | 'cancelled'
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
          room_name?: string | null
          status?: 'active' | 'pending_closure' | 'closed' | 'cancelled'
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
          room_name?: string | null
          status?: 'active' | 'pending_closure' | 'closed' | 'cancelled'
          created_at?: string
          completed_at?: string | null
          last_activity_at?: string | null
        }
      }
      deal_room_participants: {
        Row: {
          id: string
          deal_room_id: string
          user_id: string
          role: 'buyer' | 'seller' | 'observer'
          joined_at: string
          last_seen_at: string | null
        }
        Insert: {
          id?: string
          deal_room_id: string
          user_id: string
          role: 'buyer' | 'seller' | 'observer'
          joined_at?: string
          last_seen_at?: string | null
        }
        Update: {
          id?: string
          deal_room_id?: string
          user_id?: string
          role?: 'buyer' | 'seller' | 'observer'
          joined_at?: string
          last_seen_at?: string | null
        }
      }
      deal_room_messages: {
        Row: {
          id: string
          deal_room_id: string
          sender_id: string
          content: string
          sender_type: 'text' | 'file' | 'system'
          created_at: string
          updated_at: string
          edited_at: string | null
          is_deleted: boolean
        }
        Insert: {
          id?: string
          deal_room_id: string
          sender_id: string
          content: string
          sender_type?: 'text' | 'file' | 'system'
          created_at?: string
          updated_at?: string
          edited_at?: string | null
          is_deleted?: boolean
        }
        Update: {
          id?: string
          deal_room_id?: string
          sender_id?: string
          content?: string
          sender_type?: 'text' | 'file' | 'system'
          created_at?: string
          updated_at?: string
          edited_at?: string | null
          is_deleted?: boolean
        }
      }
      deal_room_files: {
        Row: {
          id: string
          deal_room_id: string
          uploader_id: string
          file_name: string
          file_path: string
          file_size_bytes: number | null
          mime_type: string | null
          type: string | null
          version: number
          is_latest: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deal_room_id: string
          uploader_id: string
          file_name: string
          file_path: string
          file_size_bytes?: number | null
          mime_type?: string | null
          type?: string | null
          version?: number
          is_latest?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deal_room_id?: string
          uploader_id?: string
          file_name?: string
          file_path?: string
          file_size_bytes?: number | null
          mime_type?: string | null
          type?: string | null
          version?: number
          is_latest?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          type: 'DIRECT' | 'LISTING_INQUIRY' | 'PROPOSAL_DISCUSSION'
          listing_id: string | null
          proposal_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'DIRECT' | 'LISTING_INQUIRY' | 'PROPOSAL_DISCUSSION'
          listing_id?: string | null
          proposal_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'DIRECT' | 'LISTING_INQUIRY' | 'PROPOSAL_DISCUSSION'
          listing_id?: string | null
          proposal_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          last_read_at: string | null
          is_archived: boolean
          joined_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          last_read_at?: string | null
          is_archived?: boolean
          joined_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          last_read_at?: string | null
          is_archived?: boolean
          joined_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          is_encrypted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          is_encrypted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          is_encrypted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json | null
          is_read: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json | null
          is_read?: boolean
          read_at?: string | null
          created_at?: string
        }
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
      }
      seller_services: {
        Row: {
          id: string
          seller_profile_id: string
          service_name: string
          description: string | null
          price_range: string | null
          created_at: string
        }
        Insert: {
          id?: string
          seller_profile_id: string
          service_name: string
          description?: string | null
          price_range?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          seller_profile_id?: string
          service_name?: string
          description?: string | null
          price_range?: string | null
          created_at?: string
        }
      }
      seller_technologies: {
        Row: {
          id: string
          seller_profile_id: string
          technology_name: string
          proficiency_level: string | null
          years_experience: number | null
        }
        Insert: {
          id?: string
          seller_profile_id: string
          technology_name: string
          proficiency_level?: string | null
          years_experience?: number | null
        }
        Update: {
          id?: string
          seller_profile_id?: string
          technology_name?: string
          proficiency_level?: string | null
          years_experience?: number | null
        }
      }
      seller_team_members: {
        Row: {
          id: string
          seller_profile_id: string
          name: string
          role: string
          bio: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          seller_profile_id: string
          name: string
          role: string
          bio?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          seller_profile_id?: string
          name?: string
          role?: string
          bio?: string | null
          avatar_url?: string | null
        }
      }
      seller_certifications: {
        Row: {
          id: string
          seller_profile_id: string
          certification_name: string
          issuing_organization: string
          issue_date: string
          expiry_date: string | null
          credential_id: string | null
          verification_url: string | null
        }
        Insert: {
          id?: string
          seller_profile_id: string
          certification_name: string
          issuing_organization: string
          issue_date: string
          expiry_date?: string | null
          credential_id?: string | null
          verification_url?: string | null
        }
        Update: {
          id?: string
          seller_profile_id?: string
          certification_name?: string
          issuing_organization?: string
          issue_date?: string
          expiry_date?: string | null
          credential_id?: string | null
          verification_url?: string | null
        }
      }
      seller_portfolio: {
        Row: {
          id: string
          seller_profile_id: string
          title: string
          description: string | null
          project_url: string | null
          completed_date: string | null
          tags: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          seller_profile_id: string
          title: string
          description?: string | null
          project_url?: string | null
          completed_date?: string | null
          tags?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          seller_profile_id?: string
          title?: string
          description?: string | null
          project_url?: string | null
          completed_date?: string | null
          tags?: string[] | null
          created_at?: string
        }
      }
      portfolio_images: {
        Row: {
          id: string
          portfolio_id: string
          image_url: string
          caption: string | null
          order_index: number
        }
        Insert: {
          id?: string
          portfolio_id: string
          image_url: string
          caption?: string | null
          order_index?: number
        }
        Update: {
          id?: string
          portfolio_id?: string
          image_url?: string
          caption?: string | null
          order_index?: number
        }
      }
      seller_metrics: {
        Row: {
          id: string
          seller_profile_id: string
          total_projects: number
          completed_projects: number
          average_rating: number | null
          total_reviews: number
          response_time_hours: number | null
          on_time_delivery_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_profile_id: string
          total_projects?: number
          completed_projects?: number
          average_rating?: number | null
          total_reviews?: number
          response_time_hours?: number | null
          on_time_delivery_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_profile_id?: string
          total_projects?: number
          completed_projects?: number
          average_rating?: number | null
          total_reviews?: number
          response_time_hours?: number | null
          on_time_delivery_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      seller_working_hours: {
        Row: {
          id: string
          seller_profile_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
        }
        Insert: {
          id?: string
          seller_profile_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
        }
        Update: {
          id?: string
          seller_profile_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
        }
      }
      seller_badges: {
        Row: {
          id: string
          seller_profile_id: string
          badge_type: string
          badge_name: string
          earned_at: string
        }
        Insert: {
          id?: string
          seller_profile_id: string
          badge_type: string
          badge_name: string
          earned_at?: string
        }
        Update: {
          id?: string
          seller_profile_id?: string
          badge_type?: string
          badge_name?: string
          earned_at?: string
        }
      }
      payment_milestones: {
        Row: {
          id: string
          contract_id: string
          deal_room_id: string | null
          milestone_name: string
          description: string | null
          due_date: string | null
          amount: number
          currency: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          deal_room_id?: string | null
          milestone_name: string
          description?: string | null
          due_date?: string | null
          amount: number
          currency?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          deal_room_id?: string | null
          milestone_name?: string
          description?: string | null
          due_date?: string | null
          amount?: number
          currency?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          deal_room_id: string
          title: string
          content: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deal_room_id: string
          title: string
          content?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          deal_room_id?: string
          title?: string
          content?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      proposal_requests: {
        Row: {
          id: string
          user_id: string
          seller_id: string
          listing_id: string | null
          message: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          seller_id: string
          listing_id?: string | null
          message: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          seller_id?: string
          listing_id?: string | null
          message?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      proposal_responses: {
        Row: {
          id: string
          proposal_request_id: string
          seller_id: string
          message: string
          attachments: Json[] | null
          created_at: string
        }
        Insert: {
          id?: string
          proposal_request_id: string
          seller_id: string
          message: string
          attachments?: Json[] | null
          created_at?: string
        }
        Update: {
          id?: string
          proposal_request_id?: string
          seller_id?: string
          message?: string
          attachments?: Json[] | null
          created_at?: string
        }
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
          p_type: 'DIRECT' | 'LISTING_INQUIRY' | 'PROPOSAL_DISCUSSION'
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

// Helper type for accessing table types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']