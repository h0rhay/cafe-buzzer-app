import { createClient } from '@supabase/supabase-js'

// Force cloud Supabase - ignore local env
const supabaseUrl = 'https://qbczhoqekmpbfbakqgyj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFiY3pob3Fla21wYmZiYWtxZ3lqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMjE4NDgsImV4cCI6MjA2Mjg5Nzg0OH0.lxhv---s14c5TzEKHFVveuSErQrzX31No1BQLuTmlu4'

console.log('🔗 Supabase URL:', supabaseUrl)
console.log('🔑 Using cloud Supabase (not local)')

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Generated Database types from Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          created_at: string | null
          default_eta: number
          id: string
          name: string
          owner_id: string | null
          show_timers: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          default_eta?: number
          id?: string
          name: string
          owner_id?: string | null
          show_timers?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          default_eta?: number
          id?: string
          name?: string
          owner_id?: string | null
          show_timers?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      buzzers: {
        Row: {
          business_id: string | null
          created_at: string | null
          customer_name: string | null
          eta: number
          id: string
          menu_item_ids: string[] | null
          picked_up_at: string | null
          public_token: string
          ready_at: string | null
          started_at: string
          status: Database["public"]["Enums"]["buzzer_status"]
          ticket: string | null
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          customer_name?: string | null
          eta: number
          id?: string
          menu_item_ids?: string[] | null
          picked_up_at?: string | null
          public_token: string
          ready_at?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["buzzer_status"]
          ticket?: string | null
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          customer_name?: string | null
          eta?: number
          id?: string
          menu_item_ids?: string[] | null
          picked_up_at?: string | null
          public_token?: string
          ready_at?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["buzzer_status"]
          ticket?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buzzers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          business_id: string | null
          created_at: string | null
          description: string | null
          estimated_time: number
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_time?: number
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_time?: number
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          business_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string | null
        }
        Insert: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Update: {
          business_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_businesses: {
        Args: Record<PropertyKey, never>
        Returns: {
          business_id: string
        }[]
      }
      is_business_member: {
        Args: { business_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      buzzer_status: "active" | "ready" | "picked_up" | "canceled" | "expired"
      user_role: "owner" | "staff"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}