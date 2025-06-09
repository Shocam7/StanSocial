"use client"

import { MessageCircle, Heart, Repeat2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ExplorePost } from "@/types"

interface DiscussionTileProps {
  post: ExplorePost
  layout: "full" | "half"
  position: "left" | "right" | "center"
}

export function DiscussionTile({ post, layout, position }: DiscussionTileProps) {
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
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-600">
              <Heart className="h-4 w-4 mr-1" />
              {post.likes}
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
