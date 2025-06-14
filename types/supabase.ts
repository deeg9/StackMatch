// This is a placeholder. You should replace this with your actual Supabase schema types.
// You can generate this using: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string // Assuming this is UUID and primary key, references auth.users.id
          email: string
          user_type: "buyer" | "seller"
          full_name?: string | null
          onboarding_completed: boolean
          email_verified: boolean
          // Add other columns from your profiles table
          created_at?: string | null
          updated_at?: string | null
          avatar_url?: string | null
          company_name?: string | null // If applicable to all profiles
          phone?: string | null // If applicable to all profiles
          is_verified?: boolean | null // If applicable to all profiles
        }
        Insert: {
          id: string
          email: string
          user_type: "buyer" | "seller"
          full_name?: string | null
          onboarding_completed?: boolean
          email_verified?: boolean
          created_at?: string | null
          updated_at?: string | null
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          is_verified?: boolean | null
        }
        Update: {
          id?: string
          email?: string
          user_type?: "buyer" | "seller"
          full_name?: string | null
          onboarding_completed?: boolean
          email_verified?: boolean
          created_at?: string | null
          updated_at?: string | null
          avatar_url?: string | null
          company_name?: string | null
          phone?: string | null
          is_verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey" // This should reference auth.users.id
            columns: ["id"]
            referencedRelation: "users" // This should resolve to auth.users
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_profiles: {
        Row: {
          user_id: string // Assuming this is UUID and FK to profiles.id
          // Add other buyer specific columns
          id?: string // Often buyer_profiles has its own PK
          industry?: string | null
          company_size?: string | null
          annual_software_budget?: number | null
          preferred_project_size?: string | null
          created_at?: string | null
        }
        Insert: {
          user_id: string
          id?: string
          industry?: string | null
          company_size?: string | null
          annual_software_budget?: number | null
          preferred_project_size?: string | null
          created_at?: string | null
        }
        Update: {
          user_id?: string
          id?: string
          industry?: string | null
          company_size?: string | null
          annual_software_budget?: number | null
          preferred_project_size?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_profiles_user_id_fkey" // Example name
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seller_profiles: {
        Row: {
          user_id: string // Assuming this is UUID and FK to profiles.id
          // Add other seller specific columns
          id?: string // Often seller_profiles has its own PK
          expertise?: string[] | null
          portfolio_url?: string | null
          years_in_business?: number | null
          company_size?: string | null
          created_at?: string | null
        }
        Insert: {
          user_id: string
          id?: string
          expertise?: string[] | null
          portfolio_url?: string | null
          years_in_business?: number | null
          company_size?: string | null
          created_at?: string | null
        }
        Update: {
          user_id?: string
          id?: string
          expertise?: string[] | null
          portfolio_url?: string | null
          years_in_business?: number | null
          company_size?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seller_profiles_user_id_fkey" // Example name
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      // Add other tables as needed from your schema dump
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
