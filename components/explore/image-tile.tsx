"use client"

import { Heart, MessageCircle, Repeat2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ExplorePost } from "@/types"

interface ImageTileProps {
  post: ExplorePost
  layout: "full" | "half"
  position: "left" | "right" | "center"
}

export function ImageTile({ post, layout, position }: ImageTileProps) {
  const badgePosition = position === "right" ? "top-2 right-2" : "top-2 left-2"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
      <div className="relative">
        <img
          src={post.image || "/placeholder.svg"}
          alt="Post content"
          className={`w-full object-cover ${layout === "full" ? "h-96" : "h-64"}`}
        />

        {/* Idol Badge */}
        <div className={`absolute ${badgePosition} z-10`}>
          <Avatar className="h-8 w-8 ring-2 ring-white">
            <AvatarImage src={post.idol.image || "/placeholder.svg"} alt={post.idol.name} />
            <AvatarFallback className="text-xs">{post.idol.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        {/* Trending Score Badge */}
        <Badge className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-black/70 text-white">
          🔥 {post.trendingScore}
        </Badge>

        {/* Overlay with stats */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" className="text-white hover:text-red-400">
                  <Heart className="h-4 w-4 mr-1" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-blue-400">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-green-400">
                  <Repeat2 className="h-4 w-4 mr-1" />
                  {post.reposts}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
            <AvatarFallback className="text-xs">{post.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-sm">{post.user.name}</span>
          <span className="text-muted-foreground text-xs">• {post.timestamp}</span>
        </div>
        {post.content && <p className="text-sm mt-2 line-clamp-2">{post.content}</p>}
      </CardContent>
    </Card>
  )
}
