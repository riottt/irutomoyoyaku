export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          language: 'ko' | 'ja' | 'en'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          phone?: string | null
          language?: 'ko' | 'ja' | 'en'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          phone?: string | null
          language?: 'ko' | 'ja' | 'en'
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          name_ko: string | null
          description: string | null
          description_ko: string | null
          address: string
          phone: string
          cuisine_type: string
          price_range: '¥' | '¥¥' | '¥¥¥' | '¥¥¥¥'
          opening_hours: Record<string, any>
          image_urls: string[] | null
          average_rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          name_ko?: string | null
          description?: string | null
          description_ko?: string | null
          address: string
          phone: string
          cuisine_type: string
          price_range: '¥' | '¥¥' | '¥¥¥' | '¥¥¥¥'
          opening_hours: Record<string, any>
          image_urls?: string[] | null
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          name_ko?: string | null
          description?: string | null
          description_ko?: string | null
          address?: string
          phone?: string
          cuisine_type?: string
          price_range?: '¥' | '¥¥' | '¥¥¥' | '¥¥¥¥'
          opening_hours?: Record<string, any>
          image_urls?: string[] | null
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          reservation_date: string
          reservation_time: string
          number_of_people: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests: string | null
          payment_status: 'pending' | 'paid' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          reservation_date: string
          reservation_time: string
          number_of_people: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests?: string | null
          payment_status: 'pending' | 'paid' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          reservation_date?: string
          reservation_time?: string
          number_of_people?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          special_requests?: string | null
          payment_status?: 'pending' | 'paid' | 'refunded'
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          reservation_id: string
          rating: number
          comment: string | null
          image_urls: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          reservation_id: string
          rating: number
          comment?: string | null
          image_urls?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          reservation_id?: string
          rating?: number
          comment?: string | null
          image_urls?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
