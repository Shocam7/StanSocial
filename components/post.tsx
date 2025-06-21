"use client"

import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, Bookmark, Plus, Lock, Globe, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import type { Post as PostType, Collection } from "@/types"
import { CollectionsService } from "@/lib/collections-service"
import Link from "next/link"
import { useState, useEffect } from "react"

interface PostProps extends PostType {
  currentUserId?: string // Add this prop to identify the current user
}

export function Post({ 
  id,
  user, 
  content, 
  image, 
  timestamp, 
  likes, 
  comments, 
  reposts, 
  liked = false, 
  idol,
  currentUserId 
}: PostProps) {
  const [collectionsDialogOpen, setCollectionsDialogOpen] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionVisibility, setNewCollectionVisibility] = useState("private")
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [isInCollections, setIsInCollections] = useState(false) // Track if post is in any collection

  const collectionsService = new CollectionsService()

  // Load initial collection status when component mounts
  useEffect(() => {
    if (currentUserId) {
      checkCollectionStatus()
    }
  }, [id, currentUserId])

  // Check if this post is in any of the user's collections
  const checkCollectionStatus = async () => {
    if (!currentUserId) return

    try {
      const postCollections = await collectionsService.getCollectionsForPost(id, currentUserId)
      setIsInCollections(postCollections.length > 0)
    } catch (error) {
      console.error("Error checking collection status:", error)
    }
  }

  // Load collections when dialog opens
  useEffect(() => {
    if (collectionsDialogOpen && currentUserId) {
      loadCollections()
    }
  }, [collectionsDialogOpen, currentUserId])

  const loadCollections = async () => {
    if (!currentUserId) return

    setLoading(true)
    try {
      const [userCollections, postCollections] = await Promise.all([
        collectionsService.getUserCollections(currentUserId),
        collectionsService.getCollectionsForPost(id, currentUserId)
      ])

      setCollections(userCollections)
      setSelectedCollections(postCollections)
    } catch (error) {
      console.error("Error loading collections:", error)
      toast.error("Failed to load collections")
    } finally {
      setLoading(false)
    }
  }

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleCreateCollection = async () => {
    if (!currentUserId || !newCollectionName.trim()) {
      toast.error("Please enter a collection name")
      return
    }

    setCreating(true)
    try {
      const newCollection = await collectionsService.createCollection(
        currentUserId,
        newCollectionName.trim(),
        newCollectionVisibility === "public"
      )

      if (newCollection) {
        // Add the new collection to the list
        setCollections(prev => [newCollection, ...prev])
        // Auto-select the new collection
        setSelectedCollections(prev => [...prev, newCollection.id])
        // Reset form
        setNewCollectionName("")
        setNewCollectionVisibility("private")
        setShowNewCollectionForm(false)
        toast.success("Collection created successfully")
      } else {
        toast.error("Failed to create collection")
      }
    } catch (error) {
      console.error("Error creating collection:", error)
      toast.error("Failed to create collection")
    } finally {
      setCreating(false)
    }
  }

  const handleSaveToCollections = async () => {
    if (!currentUserId) return

    setSaving(true)
    try {
      // Get the original collections for this post
      const originalCollections = await collectionsService.getCollectionsForPost(id, currentUserId)
      
      // Determine which collections to add to and remove from
      const collectionsToAdd = selectedCollections.filter(id => !originalCollections.includes(id))
      const collectionsToRemove = originalCollections.filter(id => !selectedCollections.includes(id))

      // Add to new collections
      if (collectionsToAdd.length > 0) {
        await collectionsService.addPostToCollections(id, collectionsToAdd)
      }

      // Remove from old collections
      if (collectionsToRemove.length > 0) {
        await collectionsService.removePostFromCollections(id, collectionsToRemove)
      }

      // Update the collection status based on final selected collections
      setIsInCollections(selectedCollections.length > 0)

      toast.success("Post saved to collections")
      setCollectionsDialogOpen(false)
      setSelectedCollections([])
      setShowNewCollectionForm(false)
    } catch (error) {
      console.error("Error saving to collections:", error)
      toast.error("Failed to save to collections")
    } finally {
      setSaving(false)
    }
  }

  const handleDialogClose = () => {
    setCollectionsDialogOpen(false)
    setSelectedCollections([])
    setShowNewCollectionForm(false)
    setNewCollectionName("")
    setNewCollectionVisibility("private")
  }

  const handleCancelNewCollection = () => {
    setShowNewCollectionForm(false)
    setNewCollectionName("")
    setNewCollectionVisibility("private")
  }

  return (
    <Card className="border-0 border-b border-[#fec400]/20 rounded-none">
      <CardContent className="p-4 relative">
        {/* Main content area with right padding to avoid overlap with avatar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6 my-auto">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="leading-none">
                <h4 className="font-semibold">{user.name}</h4>
                <span className="text-muted-foreground text-xs">@{user.username}</span>
              </div>
            </div>
            <Link href={`/idol/${idol.id}`} className="hover:opacity-80 transition-opacity">
              <Avatar className="h-12 w-12 ring-1 ring-[#fec400]">
                <AvatarImage src={idol.image || "/placeholder.svg"} alt={idol.name} />
                <AvatarFallback>{idol.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
          </div>

          <p className="text-sm leading-relaxed">{content}</p>
          
          {image && (
            <div className="rounded-lg overflow-hidden border border-[#fec400]/30">
              <img src={image || "/placeholder.svg"} alt="Post image" className="w-full h-64 object-cover" />
            </div>
          )}

          <span className="text-muted-foreground text-xs">{timestamp}</span>

          <div className="flex items-center justify-between pt-2">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-600">
              <MessageCircle className="h-4 w-4 mr-1" />
              {comments}
            </Button>

            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-600">
              <Repeat2 className="h-4 w-4 mr-1" />
              {reposts}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className={`text-muted-foreground hover:text-red-600 ${liked ? "text-red-600" : ""}`}
            >
              <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
              {likes}
            </Button>

            {/* Add to Collections Button */}
            {currentUserId && (
              <Dialog open={collectionsDialogOpen} onOpenChange={setCollectionsDialogOpen}>
                <DialogTrigger asChild>
<Button 
  variant="ghost" 
  size="sm"
>
  <Bookmark
    className={`h-4 w-4 transition-colors ${
      isInCollections
        ? "fill-green-600 text-white"
        : "fill-muted text-muted-foreground"
    } hover:fill-green-600`}
  />
</Button>

                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add to Collection</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    ) : (
                      <>
                        {/* Existing Collections */}
                        {collections.length > 0 && (
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Your Collections</Label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {collections.map((collection) => (
                                <div key={collection.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50">
                                  <Checkbox
                                    id={collection.id}
                                    checked={selectedCollections.includes(collection.id)}
                                    onCheckedChange={() => handleCollectionToggle(collection.id)}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <Label
                                      htmlFor={collection.id}
                                      className="flex items-center space-x-2 cursor-pointer"
                                    >
                                      <span className="truncate">{collection.name}</span>
                                      {collection.isPublic ? (
                                        <Globe className="h-3 w-3 text-green-600" />
                                      ) : (
                                        <Lock className="h-3 w-3 text-gray-500" />
                                      )}
                                    </Label>
                                    <p className="text-xs text-muted-foreground">
                                      {collection.postCount} posts
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Create New Collection */}
                        {!showNewCollectionForm ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowNewCollectionForm(true)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Collection
                          </Button>
                        ) : (
                          <div className="space-y-3 p-3 border rounded-md bg-gray-50">
                            <div>
                              <Label htmlFor="collection-name" className="text-sm">Collection Name</Label>
                              <Input
                                id="collection-name"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                placeholder="Enter collection name"
                                className="mt-1"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !creating && newCollectionName.trim()) {
                                    handleCreateCollection()
                                  }
                                }}
                              />
                            </div>
                            <div>
                              <Label className="text-sm">Visibility</Label>
                              <RadioGroup
                                value={newCollectionVisibility}
                                onValueChange={setNewCollectionVisibility}
                                className="mt-1"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="private" id="private" />
                                  <Label htmlFor="private" className="flex items-center space-x-1">
                                    <Lock className="h-3 w-3" />
                                    <span>Private</span>
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="public" id="public" />
                                  <Label htmlFor="public" className="flex items-center space-x-1">
                                    <Globe className="h-3 w-3" />
                                    <span>Public</span>
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={handleCreateCollection}
                                disabled={creating || !newCollectionName.trim()}
                              >
                                {creating ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                  </>
                                ) : (
                                  'Create'
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancelNewCollection}
                                disabled={creating}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-2">
                          <Button
                            onClick={handleSaveToCollections}
                            disabled={saving || creating}
                            className="flex-1"
                          >
                            {saving ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              `Save to Collections (${selectedCollections.length})`
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleDialogClose}
                            disabled={saving || creating}
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share post
                </DropdownMenuItem>
                <DropdownMenuItem>Stan {idol.name}</DropdownMenuItem>
                <DropdownMenuItem>Mute posts about {idol.name}</DropdownMenuItem>
                <DropdownMenuItem>Save post</DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">Report post</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}