"use client"

import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal, BookmarkPlus, Plus, Lock, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import type { Post as PostType } from "@/types"
import Link from "next/link"
import { useState } from "react"

// Sample collections data - in a real app, this would come from your data store
const sampleCollections = [
  { id: "1", name: "Favorites", isPublic: false, postCount: 12 },
  { id: "2", name: "Workout Motivation", isPublic: true, postCount: 8 },
  { id: "3", name: "Funny Posts", isPublic: true, postCount: 24 },
]

export function Post({ user, content, image, timestamp, likes, comments, reposts, liked = false, idol }: PostType) {
  const [collectionsDialogOpen, setCollectionsDialogOpen] = useState(false)
  const [collections, setCollections] = useState(sampleCollections)
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [newCollectionName, setNewCollectionName] = useState("")
  const [newCollectionVisibility, setNewCollectionVisibility] = useState("private")
  const [showNewCollectionForm, setShowNewCollectionForm] = useState(false)

  const handleCollectionToggle = (collectionId: string) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    )
  }

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      const newCollection = {
        id: Date.now().toString(),
        name: newCollectionName.trim(),
        isPublic: newCollectionVisibility === "public",
        postCount: 0
      }
      setCollections(prev => [...prev, newCollection])
      setSelectedCollections(prev => [...prev, newCollection.id])
      setNewCollectionName("")
      setShowNewCollectionForm(false)
    }
  }

  const handleSaveToCollections = () => {
    // In a real app, you would save the post to the selected collections here
    console.log("Saving post to collections:", selectedCollections)
    setCollectionsDialogOpen(false)
    setSelectedCollections([])
    setShowNewCollectionForm(false)
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
            <Dialog open={collectionsDialogOpen} onOpenChange={setCollectionsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[#fec400]">
                  <BookmarkPlus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add to Collection</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Existing Collections */}
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
                        <Button size="sm" onClick={handleCreateCollection}>
                          Create
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowNewCollectionForm(false)
                            setNewCollectionName("")
                          }}
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
                      disabled={selectedCollections.length === 0}
                      className="flex-1"
                    >
                      Save to Collections ({selectedCollections.length})
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCollectionsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

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