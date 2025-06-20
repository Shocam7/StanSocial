import { getSupabaseBrowser } from "./supabase"
import type { Collection } from "@/types"

export class CollectionsService {
  private supabase = getSupabaseBrowser()

  // Get all collections for the current user
  async getUserCollections(userId: string): Promise<Collection[]> {
    try {
      const { data, error } = await this.supabase
        .from("collections")
        .select(`
          id,
          name,
          description,
          is_public,
          user_id,
          created_at,
          updated_at
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

      if (error) throw error

      // Get post counts for each collection
      const collectionsWithCounts = await Promise.all(
        (data || []).map(async (collection) => {
          const { data: countData } = await this.supabase
            .rpc("get_collection_post_count", { collection_id: collection.id })

          return {
            id: collection.id,
            name: collection.name,
            description: collection.description || undefined,
            isPublic: collection.is_public,
            postCount: countData || 0,
            userId: collection.user_id,
            createdAt: collection.created_at,
            updatedAt: collection.updated_at,
          }
        })
      )

      return collectionsWithCounts
    } catch (error) {
      console.error("Error fetching user collections:", error)
      return []
    }
  }

  // Create a new collection
  async createCollection(
    userId: string,
    name: string,
    isPublic: boolean = false,
    description?: string
  ): Promise<Collection | null> {
    try {
      const { data, error } = await this.supabase
        .from("collections")
        .insert({
          name: name.trim(),
          description: description?.trim() || null,
          is_public: isPublic,
          user_id: userId,
        })
        .select()
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        description: data.description || undefined,
        isPublic: data.is_public,
        postCount: 0,
        userId: data.user_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      }
    } catch (error) {
      console.error("Error creating collection:", error)
      return null
    }
  }

  // Add a post to collections
  async addPostToCollections(postId: string, collectionIds: string[]): Promise<boolean> {
    try {
      const insertData = collectionIds.map((collectionId) => ({
        collection_id: collectionId,
        post_id: postId,
      }))

      const { error } = await this.supabase
        .from("collection_posts")
        .insert(insertData)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error adding post to collections:", error)
      return false
    }
  }

  // Remove a post from collections
  async removePostFromCollections(postId: string, collectionIds: string[]): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("collection_posts")
        .delete()
        .eq("post_id", postId)
        .in("collection_id", collectionIds)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error removing post from collections:", error)
      return false
    }
  }

  // Get collections that contain a specific post
  async getCollectionsForPost(postId: string, userId: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase
        .from("collection_posts")
        .select(`
          collection_id,
          collections!inner(user_id)
        `)
        .eq("post_id", postId)
        .eq("collections.user_id", userId)

      if (error) throw error

      return (data || []).map((item) => item.collection_id)
    } catch (error) {
      console.error("Error fetching collections for post:", error)
      return []
    }
  }

  // Update a collection
  async updateCollection(
    collectionId: string,
    updates: Partial<Pick<Collection, 'name' | 'description' | 'isPublic'>>
  ): Promise<boolean> {
    try {
      const updateData: any = {}
      
      if (updates.name !== undefined) updateData.name = updates.name.trim()
      if (updates.description !== undefined) updateData.description = updates.description?.trim() || null
      if (updates.isPublic !== undefined) updateData.is_public = updates.isPublic

      const { error } = await this.supabase
        .from("collections")
        .update(updateData)
        .eq("id", collectionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating collection:", error)
      return false
    }
  }

  // Delete a collection
  async deleteCollection(collectionId: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("collections")
        .delete()
        .eq("id", collectionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting collection:", error)
      return false
    }
  }

  // Get posts in a collection
  async getCollectionPosts(collectionId: string, limit: number = 20, offset: number = 0) {
    try {
      const { data, error } = await this.supabase
        .from("collection_posts")
        .select(`
          post_id,
          added_at,
          posts!inner(*)
        `)
        .eq("collection_id", collectionId)
        .order("added_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error

      return data || []
    } catch (error) {
      console.error("Error fetching collection posts:", error)
      return []
    }
  }
            }
