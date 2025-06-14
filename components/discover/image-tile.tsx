"use client"

import { Heart, MessageCircle, Repeat2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toggleLikePost } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import type { DiscoverPost } from "@/types"

interface ImageTileProps {
  post: DiscoverPost
  layout: "full" | "half" | "third"
  position: "left" | "right" | "center"
}

export function ImageTile({ post, layout, position }: ImageTileProps) {
  const [isLiked, setIsLiked] = useState(post.liked || false)
  const [likes, setLikes] = useState(post.likes)
  const { toast } = useToast()

  const badgePosition = position === "right" ? "top-2 right-2" : "top-2 left-2"

  const handleLike = async () => {
    // Update UI optimistically
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)

    // Send to server
    const result = await toggleLikePost(post.id, isLiked)

    if (!result.success) {
      // Revert on failure
      setIsLiked(isLiked)
      setLikes(post.likes)

      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Determine image height based on layout
  const getImageHeight = () => {
    switch (layout) {
      case "full":
        return "h-64 md:h-96"
      case "half":
        return "h-48 md:h-64"
      case "third":
        return "h-40 md:h-48"
      default:
        return "h-48"
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
      <div className="relative">
        <img
          src={post.image || "/placeholder.svg"}
          alt="Post content"
          className={`w-full object-cover ${getImageHeight()}`}
        />

        {/* Idol Badge */}
        <div className={`absolute ${badgePosition} z-10`}>
          <Avatar className={`${layout === "third" ? "h-6 w-6" : "h-8 w-8"} ring-2 ring-white`}>
            <AvatarImage src={post.idol.image || "/placeholder.svg"} alt={post.idol.name} />
            <AvatarFallback className={layout === "third" ? "text-xs" : "text-xs"}>
              {post.idol.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Trending Score Badge */}
        <Badge className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs">
          🔥 {post.trendingScore}
        </Badge>

        {/* Overlay with stats */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 md:p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-1 md:space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`${isLiked ? "text-red-400" : "text-white"} hover:text-red-400 p-1 h-auto text-xs`}
                  onClick={handleLike}
                >
                  <Heart className={`h-3 w-3 md:h-4 md:w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  <span className="text-xs">{likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-blue-400 p-1 h-auto text-xs">
                  <MessageCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span className="text-xs">{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-green-400 p-1 h-auto text-xs">
                  <Repeat2 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  <span className="text-xs">{post.reposts}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className={`${layout === "third" ? "p-2" : "p-4"}`}>
        <div className="flex items-center space-x-2">
          <Avatar className={layout === "third" ? "h-4 w-4" : "h-6 w-6"}>
            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
            <AvatarFallback className="text-xs">{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className={`font-medium ${layout === "third" ? "text-xs" : "text-sm"}`}>{post.user.name}</span>
          <span className={`text-muted-foreground ${layout === "third" ? "text-xs" : "text-xs"}`}>
            • {post.timestamp}
          </span>
        </div>
        {post.content && (
          <p className={`mt-2 line-clamp-2 ${layout === "third" ? "text-xs" : "text-sm"}`}>{post.content}</p>
        )}
      </CardContent>
    </Card>
  )
}
