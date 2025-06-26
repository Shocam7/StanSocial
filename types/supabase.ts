// Updated types/supabase.ts
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      collections: {
        Row: {
          id: string
          name: string
          description: string | null
          is_public: boolean
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          is_public?: boolean
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          user_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collections_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      collection_posts: {
        Row: {
          id: string
          collection_id: string
          post_id: string
          added_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          post_id: string
          added_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          post_id?: string
          added_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_posts_collection_id_fkey"
            columns: ["collection_id"]
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_posts_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          id: string
          content: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          content: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          content?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      idols: {
        Row: {
          id: string
          name: string
          image: string
          category: string
          stans: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          image: string
          category: string
          stans?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          image?: string
          category?: string
          stans?: number
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
          }
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
          }
        ]
      }
      user_friendships: {
        Row: {
          id: string
          user_id_1: string
          user_id_2: string
          status: string
          requester_id: string
          created_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          user_id_1: string
          user_id_2: string
          status?: string
          requester_id: string
          created_at?: string
          accepted_at?: string | null
        }
        Update: {
          id?: string
          user_id_1?: string
          user_id_2?: string
          status?: string
          requester_id?: string
          created_at?: string
          accepted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_friendships_user_id_1_fkey"
            columns: ["user_id_1"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_friendships_user_id_2_fkey"
            columns: ["user_id_2"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_friendships_requester_id_fkey"
            columns: ["requester_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          idol_id: string
          question: string
          answer: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idol_id: string
          question: string
          answer: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idol_id?: string
          question?: string
          answer?: string
          category?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_favorites_idol_id_fkey"
            columns: ["idol_id"]
            referencedRelation: "idols"
            referencedColumns: ["id"]
          }
        ]
      }
      user_stanned_idols: {
        Row: {
          id: string
          user_id: string
          idol_id: string
          stanned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          idol_id: string
          stanned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          idol_id?: string
          stanned_at?: string
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
          }
        ]
      }
      users: {
        Row: {
          id: string
          name: string
          username: string
          avatar: string
          created_at: string
          bio: string | null
          friends_count: number
          posts_count: number
          onboarding_completed: boolean
          interests: string[] | null
        }
        Insert: {
          id?: string
          name: string
          username: string
          avatar: string
          created_at?: string
          bio?: string | null
          friends_count?: number
          posts_count?: number
          onboarding_completed?: boolean
          interests?: string[] | null
        }
        Update: {
          id?: string
          name?: string
          username?: string
          avatar?: string
          created_at?: string
          bio?: string | null
          friends_count?: number
          posts_count?: number
          onboarding_completed?: boolean
          interests?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_collection_post_count: {
        Args: {
          collection_id: string
        }
        Returns: number
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