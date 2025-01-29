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
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_url: string
          group_type: 'ponto-interesse' | 'embaixador'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_url: string
          group_type: 'ponto-interesse' | 'embaixador'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_url?: string
          group_type?: 'ponto-interesse' | 'embaixador'
          created_at?: string
        }
      }
      points_of_interest: {
        Row: {
          id: string
          name: string
          description: string
          project: string
          url: string | null
          category_id: string
          image_url: string | null
          latitude: number
          longitude: number
          has_moeda_id: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          project: string
          url?: string | null
          category_id: string
          image_url?: string | null
          latitude: number
          longitude: number
          has_moeda_id?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          project?: string
          url?: string | null
          category_id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          has_moeda_id?: boolean
          created_at?: string
        }
      }
      poi_routes: {
        Row: {
          poi_id: string
          route_id: string
          created_at: string
        }
        Insert: {
          poi_id: string
          route_id: string
          created_at?: string
        }
        Update: {
          poi_id?: string
          route_id?: string
          created_at?: string
        }
      }
      routes: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string | null
          created_at?: string
        }
      }
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
  }
}