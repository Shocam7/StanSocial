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
          <span className="text-muted-foreground text-xs">{timestamp}</span>

          {image && (
            <div className="rounded-lg overflow-hidden border border-[#fec400]/30">
              <img src={image || "/placeholder.svg"} alt="Post image" className="w-full h-64 object-cover" />
            </div>
          )}

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

            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-600">
              <Share className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
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
        </div>
      </CardContent>
    </Card>
  )
}
