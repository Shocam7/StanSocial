"use client"

import { Heart, MessageCircle, Repeat2, Play } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ExplorePost } from "@/types"

interface VideoTileProps {
  post: ExplorePost
  layout: "full" | "half"
  position: "left" | "right" | "center"
}

export function VideoTile({ post, layout, position }: VideoTileProps) {
  const badgePosition = position === "right" ? "top-2 right-2" : "top-2 left-2"

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
      <div className="relative">
        {/* Video preview - in a real app, this would be an actual video element */}
        <div className={`relative w-full ${layout === "full" ? "h-64 md:h-96" : "h-48 md:h-64"} bg-black`}>
          <img src={post.video || "/placeholder.svg"} alt="Video thumbnail" className="w-full h-full object-cover" />

          {/* Play button overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-full p-4 group-hover:bg-black/70 transition-colors">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>

          {/* Video indicator */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">🎥 Video</div>
        </div>

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
                <Button variant="ghost" size="sm" className="text-white hover:text-red-400 p-1 h-auto">
                  <Heart className="h-4 w-4 mr-1" />
                  <span className="text-xs">{post.likes}</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-blue-400 p-1 h-auto">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">{post.comments}</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:text-green-400 p-1 h-auto">
                  <Repeat2 className="h-4 w-4 mr-1" />
                  <span className="text-xs">{post.reposts}</span>
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
