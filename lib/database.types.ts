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
      restaurants: {
        Row: {
          id: string
          name: string
          name_ko: string
          description: string
          description_ko: string
          cuisine: string
          price_range: string
          location: string
          address: string
          rating: number
          images: string[]
          features: string[]
          opening_hours: Json
          coordinates: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ko: string
          description: string
          description_ko: string
          cuisine: string
          price_range: string
          location: string
          address: string
          rating: number
          images: string[]
          features: string[]
          opening_hours: Json
          coordinates: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ko?: string
          description?: string
          description_ko?: string
          cuisine?: string
          price_range?: string
          location?: string
          address?: string
          rating?: number
          images?: string[]
          features?: string[]
          opening_hours?: Json
          coordinates?: Json
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          date: string
          time: string
          number_of_people: number
          status: 'pending' | 'confirmed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          date: string
          time: string
          number_of_people: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          date?: string
          time?: string
          number_of_people?: number
          status?: 'pending' | 'confirmed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          rating: number
          content: string
          content_ko: string | null
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          rating: number
          content: string
          content_ko?: string | null
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          rating?: number
          content?: string
          content_ko?: string | null
          images?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
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
