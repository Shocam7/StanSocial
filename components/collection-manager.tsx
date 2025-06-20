"use client"

import { useState, useEffect } from 'react'
import { Plus, Globe, Lock, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { useCollections } from '@/hooks/use-collections'
import type { Collection } from '@/types'
import Link from 'next/link'

interface CollectionsPageProps {
  currentUserId: string
}

export function CollectionsPage({ currentUserId }: CollectionsPageProps) {
  const {
    collections,
    loading,
    loadCollections,
    createCollection,
    updateCollection,
    deleteCollection,
  } = useCollections(currentUserId)

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    visibility: 'private'
  })

  useEffect(() => {
    loadCollections()
  }, [loadCollections])

  const handleCreateCollection = async () => {
    if (!formData.name.trim()) return

    const success = await createCollection(
      formData.name,
      formData.visibility === 'public',
      formData.description || undefined
    )

    if (success) {
      setCreateDialogOpen(false)
      setFormData({ name: '', description: '', visibility: 'private' })
    }
  }

  const handleEditCollection = async () => {
    if (!selectedCollection || !formData.name.trim()) return

    const success = await updateCollection(selectedCollection.id, {
      name: formData.name,
      description: formData.description || undefined,
      isPublic: formData.visibility === 'public'
    })

    if (success) {
      setEditDialogOpen(false)
      setSelectedCollection(null)
      setFormData({ name: '', description: '', visibility: 'private' })
    }
  }

  const handleDeleteCollection = async () => {
    if (!selectedCollection) return

    const success = await deleteCollection(selectedCollection.id)

    if (success) {
      setDeleteDialogOpen(false)
      setSelectedCollection(null)
    }
  }

  const openEditDialog = (collection: Collection) => {
    setSelectedCollection(collection)
    setFormData({
      name: collection.name,
      description: collection.description || '',
      visibility: collection.isPublic ? 'public' : 'private'
    })
    setEditDialogOpen(true)
  }

  const openDeleteDialog = (collection: Collection) => {
    setSelectedCollection(collection)
    setDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fec400] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading collections...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Collections</h1>
          <p className="text-muted-foreground">Organize and save your favorite posts</p>
        </div>
        
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#fec400] hover:bg-[#fec400]/90 text-black">
              <Plus className="h-4 w-4 mr-2" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Collection Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter collection name"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your collection..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Visibility</Label>
                <RadioGroup
                  value={formData.visibility}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="create-private" />
                    <Label htmlFor="create-private" className="flex items-center space-x-2">
                      <Lock className="h-4 w-4" />
                      <span>Private - Only you can see this collection</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="create-public" />
                    <Label htmlFor="create-public" className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <span>Public - Anyone can see this collection</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex space-x-2 pt-4">
                <Button onClick={handleCreateCollection} className="flex-1">
                  Create Collection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCreateDialogOpen(false)
                    setFormData({ name: '', description: '', visibility: 'private' })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first collection to start organizing your favorite posts
          </p>
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-[#fec400] hover:bg-[#fec400]/90 text-black"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collections.map((collection) => (
            <Card key={collection.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{collection.name}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {collection.isPublic ? (
                        <Globe className="h-4 w-4 text-green-600" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-500" />
                      )}
                      <span className="text-sm text-muted-foreground">
                        {collection.isPublic ? 'Public' : 'Private'}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/collections/${collection.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Collection
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEditDialog(collection)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => openDeleteDialog(collection)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {collection.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {collection.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {collection.postCount} {collection.postCount === 1 ? 'post' : 'posts'}
                  </span>
                  <Link
                    href={`/collections/${collection.id}`}
                    className="text-[#fec400] hover:underline"
                  >
                    View →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Collection Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter collection name"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your collection..."
                rows={3}
              />
            </div>
            <div>
              <Label>Visibility</Label>
              <RadioGroup
                value={formData.visibility}
                onValueChange={(value) => setFormData(prev => ({ ...prev, visibility: value }))}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="edit-private" />
                  <Label htmlFor="edit-private" className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <span>Private</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="edit-public" />
                  <Label htmlFor="edit-public" className="flex items-center space-x-2">
                    <Globe className="h-4 w-4" />
                    <span>Public</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="flex space-x-2 pt-4">
              <Button onClick={handleEditCollection} className="flex-1">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditDialogOpen(false)
                  setSelectedCollection(null)
                  setFormData({ name: '', description: '', visibility: 'private' })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedCollection?.name}"? This action cannot be undone.
              All posts will be removed from this collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCollection(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCollection}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Collection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}