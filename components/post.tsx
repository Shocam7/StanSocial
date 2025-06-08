"use client"

import { Heart, MessageCircle, Repeat2, Share, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Post as PostType } from "@/types"
import Link from "next/link"

export function Post({ user, content, image, timestamp, likes, comments, reposts, liked = false, idol }: PostType) {
  return (
    <Card className="border-0 border-b rounded-none">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Link
            href={`/idol/${idol.id}`}
            className="flex flex-col items-center space-y-2 hover:opacity-80 transition-opacity"
          >
            <Avatar className="h-12 w-12 ring-2 ring-primary">
              <AvatarImage src={idol.image || "/placeholder.svg"} alt={idol.name} />
              <AvatarFallback>{idol.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-center hover:text-primary">{idol.name}</span>
          </Link>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h4 className="font-semibold">{user.name}</h4>
                <span className="text-muted-foreground">@{user.username}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground text-sm">{timestamp}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Stan {idol.name}</DropdownMenuItem>
                  <DropdownMenuItem>Mute posts about {idol.name}</DropdownMenuItem>
                  <DropdownMenuItem>Save post</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Report post</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm leading-relaxed">{content}</p>

            {image && (
              <div className="rounded-lg overflow-hidden border">
                <img src={image || "/placeholder.svg"} alt="Post image" className="w-full h-64 object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 max-w-md">
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

              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-600">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
