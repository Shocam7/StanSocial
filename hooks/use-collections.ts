import { useState, useCallback } from 'react'
import { CollectionsService } from '@/lib/collections-service'
import type { Collection } from '@/types'
import { toast } from 'sonner'

export function useCollections(userId?: string) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const collectionsService = new CollectionsService()

  const loadCollections = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)
    
    try {
      const userCollections = await collectionsService.getUserCollections(userId)
      setCollections(userCollections)
    } catch (err) {
      const errorMessage = 'Failed to load collections'
      setError(errorMessage)
      console.error('Error loading collections:', err)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const createCollection = useCallback(async (
    name: string,
    isPublic: boolean = false,
    description?: string
  ) => {
    if (!userId) return null

    try {
      const newCollection = await collectionsService.createCollection(
        userId,
        name,
        isPublic,
        description
      )

      if (newCollection) {
        setCollections(prev => [newCollection, ...prev])
        toast.success('Collection created successfully')
        return newCollection
      } else {
        toast.error('Failed to create collection')
        return null
      }
    } catch (err) {
      console.error('Error creating collection:', err)
      toast.error('Failed to create collection')
      return null
    }
  }, [userId])

  const updateCollection = useCallback(async (
    collectionId: string,
    updates: Partial<Pick<Collection, 'name' | 'description' | 'isPublic'>>
  ) => {
    try {
      const success = await collectionsService.updateCollection(collectionId, updates)
      
      if (success) {
        setCollections(prev => prev.map(collection => 
          collection.id === collectionId 
            ? { ...collection, ...updates }
            : collection
        ))
        toast.success('Collection updated successfully')
        return true
      } else {
        toast.error('Failed to update collection')
        return false
      }
    } catch (err) {
      console.error('Error updating collection:', err)
      toast.error('Failed to update collection')
      return false
    }
  }, [])

  const deleteCollection = useCallback(async (collectionId: string) => {
    try {
      const success = await collectionsService.deleteCollection(collectionId)
      
      if (success) {
        setCollections(prev => prev.filter(collection => collection.id !== collectionId))
        toast.success('Collection deleted successfully')
        return true
      } else {
        toast.error('Failed to delete collection')
        return false
      }
    } catch (err) {
      console.error('Error deleting collection:', err)
      toast.error('Failed to delete collection')
      return false
    }
  }, [])

  const addPostToCollections = useCallback(async (postId: string, collectionIds: string[]) => {
    try {
      const success = await collectionsService.addPostToCollections(postId, collectionIds)
      
      if (success) {
        // Update post counts for affected collections
        setCollections(prev => prev.map(collection => 
          collectionIds.includes(collection.id)
            ? { ...collection, postCount: collection.postCount + 1 }
            : collection
        ))
        return true
      }
      return false
    } catch (err) {
      console.error('Error adding post to collections:', err)
      return false
    }
  }, [])

  const removePostFromCollections = useCallback(async (postId: string, collectionIds: string[]) => {
    try {
      const success = await collectionsService.removePostFromCollections(postId, collectionIds)
      
      if (success) {
        // Update post counts for affected collections
        setCollections(prev => prev.map(collection => 
          collectionIds.includes(collection.id)
            ? { ...collection, postCount: Math.max(0, collection.postCount - 1) }
            : collection
        ))
        return true
      }
      return false
    } catch (err) {
      console.error('Error removing post from collections:', err)
      return false
    }
  }, [])

  const getCollectionsForPost = useCallback(async (postId: string) => {
    if (!userId) return []
    
    try {
      return await collectionsService.getCollectionsForPost(postId, userId)
    } catch (err) {
      console.error('Error fetching collections for post:', err)
      return []
    }
  }, [userId])

  return {
    collections,
    loading,
    error,
    loadCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    addPostToCollections,
    removePostFromCollections,
    getCollectionsForPost,
  }
  }
