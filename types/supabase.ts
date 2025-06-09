export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      idols: {
        Row: {
          id: string
          name: string
          image: string
          category: string
          followers: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          image: string
          category: string
          followers?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          image?: string
          category?: string
          followers?: number
          created_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          type: string
          content: string | null
          image: string | null
          video: string | null
          title: string | null
          poll_question: string | null
          trending_score: number
          likes: number
          comments: number
          reposts: number
          created_at: string
          user_id: string
          idol_id: string
        }
        Insert: {
          id?: string
          type: string
          content?: string | null
          image?: string | null
          video?: string | null
          title?: string | null
          poll_question?: string | null
          trending_score?: number
          likes?: number
          comments?: number
          reposts?: number
          created_at?: string
          user_id: string
          idol_id: string
        }
        Update: {
          id?: string
          type?: string
          content?: string | null
          image?: string | null
          video?: string | null
          title?: string | null
          poll_question?: string | null
          trending_score?: number
          likes?: number
          comments?: number
          reposts?: number
          created_at?: string
          user_id?: string
          idol_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_idol_id_fkey"
            columns: ["idol_id"]
            referencedRelation: "idols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_options: {
        Row: {
          id: string
          post_id: string
          text: string
          votes: number
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          text: string
          votes?: number
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          text?: string
          votes?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_stanned_idols: {
        Row: {
          user_id: string
          idol_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          idol_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          idol_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stanned_idols_idol_id_fkey"
            columns: ["idol_id"]
            referencedRelation: "idols"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_stanned_idols_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
          name: string
          username: string
          avatar: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          username: string
          avatar: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          username?: string
          avatar?: string
          created_at?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
