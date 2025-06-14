"use client"

import { MessageCircle, Heart, Repeat2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toggleLikePost } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import type { DiscoverPost } from "@/types"

interface DiscussionTileProps {
  post: DiscoverPost
  layout: "full" | "half" | "third"
  position: "left" | "right" | "center"
}

export function DiscussionTile({ post, layout, position }: DiscussionTileProps) {
  const [isLiked, setIsLiked] = useState(post.liked || false)
  const [likes, setLikes] = useState(post.likes)
  const { toast } = useToast()

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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.user.name}</p>
              <p className="text-sm text-muted-foreground">
                @{post.user.username} • {post.timestamp}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className="bg-purple-100 text-purple-800">💬 Discussion</Badge>
            <Badge variant="secondary">🔥 {post.trendingScore}</Badge>
            <Avatar className="h-8 w-8 ring-2 ring-primary">
              <AvatarImage src={post.idol.image || "/placeholder.svg"} alt={post.idol.name} />
              <AvatarFallback className="text-xs">{post.idol.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <h2 className="text-lg md:text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>

        {post.content && <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={`${isLiked ? "text-red-600" : "text-muted-foreground"} hover:text-red-600`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-600">
              <Repeat2 className="h-4 w-4 mr-1" />
              {post.reposts}
            </Button>
          </div>

          <div className="flex items-center space-x-2 text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            <span className="text-sm font-medium">{post.comments} comments</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
