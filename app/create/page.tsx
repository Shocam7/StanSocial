"use client"

import { useState } from "react"
import { ArrowLeft, ImageIcon, Smile, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IdolSelector } from "@/components/idol-selector"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import type { Idol } from "@/types"

// Sample idols data - you can replace this with actual data from your backend
const sampleIdols: Idol[] = [
  {
    id: "1",
    name: "Taylor Swift",
    image: "/placeholder.svg?height=48&width=48&text=TS",
    category: "Music",
    followers: 1200000,
    isStanned: true,
  },
  {
    id: "2",
    name: "BTS",
    image: "/placeholder.svg?height=48&width=48&text=BTS",
    category: "K-Pop",
    followers: 2500000,
    isStanned: true,
  },
  {
    id: "3",
    name: "Zendaya",
    image: "/placeholder.svg?height=48&width=48&text=Z",
    category: "Acting",
    followers: 980000,
    isStanned: false,
  },
  {
    id: "4",
    name: "Blackpink",
    image: "/placeholder.svg?height=48&width=48&text=BP",
    category: "K-Pop",
    followers: 1800000,
    isStanned: false,
  },
  {
    id: "5",
    name: "Tom Holland",
    image: "/placeholder.svg?height=48&width=48&text=TH",
    category: "Acting",
    followers: 850000,
    isStanned: false,
  },
  {
    id: "6",
    name: "Ariana Grande",
    image: "/placeholder.svg?height=48&width=48&text=AG",
    category: "Music",
    followers: 1500000,
    isStanned: true,
  },
]

export default function CreatePostPage() {
  const [content, setContent] = useState("")
  const [selectedIdol, setSelectedIdol] = useState<Idol | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { toast } = useToast()
  const maxLength = 280

  const handleSelectIdol = (idol: Idol) => {
    setSelectedIdol(idol)
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
  }

  const isPostValid = content.trim().length > 0 && selectedIdol !== null

  const handleSubmit = async () => {
    if (!isPostValid) return

    setIsSubmitting(true)

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setContent("")
      setSelectedIdol(null)
      setSelectedImage(null)
      setImagePreview(null)
      
      toast({
        title: "Post created",
        description: "Your post has been published successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-[#fec400]/40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Create Post</h1>
          </div>
          <Button 
            disabled={!isPostValid || isSubmitting} 
            className="rounded-full px-6" 
            onClick={handleSubmit}
          >
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-2xl">
        <Card className="border-0 rounded-none">
          <CardContent className="p-6">
            <div className="flex space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg?height=48&width=48&text=You" alt="Your avatar" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-4">
                {/* Idol Selector */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Who are you posting about?
                  </label>
                  <IdolSelector 
                    idols={sampleIdols} 
                    selectedIdol={selectedIdol} 
                    onSelectIdol={handleSelectIdol} 
                  />
                </div>

                {/* Selected Idol Display */}
                {selectedIdol && (
                  <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg border border-[#fec400]/20">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedIdol.image} alt={selectedIdol.name} />
                      <AvatarFallback>{selectedIdol.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{selectedIdol.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedIdol.category}</p>
                    </div>
                    <Badge variant="secondary" className="bg-[#fec400]/10 text-[#fec400] border-[#fec400]/20">
                      {selectedIdol.isStanned ? "Stanned" : "Not Stanned"}
                    </Badge>
                  </div>
                )}

                {/* Content Input */}
                <div className="space-y-2">
                  <Textarea
                    placeholder={selectedIdol ? `What's on your mind about ${selectedIdol.name}?` : "Select an idol first"}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[120px] resize-none text-lg border-0 focus-visible:ring-0 p-0 placeholder:text-muted-foreground"
                    maxLength={maxLength}
                    disabled={!selectedIdol || isSubmitting}
                  />
                  
                  {/* Character count */}
                  <div className="flex justify-end">
                    <span className={`text-sm ${
                      content.length > maxLength * 0.8 
                        ? content.length > maxLength * 0.9 
                          ? "text-red-500" 
                          : "text-orange-500"
                        : "text-muted-foreground"
                    }`}>
                      {maxLength - content.length}
                    </span>
                  </div>
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full rounded-lg border border-[#fec400]/20 max-h-64 object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2 rounded-full"
                      onClick={removeImage}
                    >
                      ×
                    </Button>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[#fec400]/10">
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-[#fec400] hover:bg-[#fec400]/10"
                        asChild
                      >
                        <span>
                          <ImageIcon className="h-5 w-5" />
                        </span>
                      </Button>
                    </label>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-[#fec400] hover:bg-[#fec400]/10"
                    >
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-[#fec400] hover:bg-[#fec400]/10"
                    >
                      <Calendar className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-[#fec400] hover:bg-[#fec400]/10"
                    >
                      <MapPin className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="mt-6 border border-[#fec400]/20">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-[#fec400]">💡 Posting Tips</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be respectful and positive when posting about idols</li>
              <li>• Use relevant hashtags to reach more fans</li>
              <li>• Share your genuine thoughts and experiences</li>
              <li>• Avoid posting spoilers without warnings</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
  }
