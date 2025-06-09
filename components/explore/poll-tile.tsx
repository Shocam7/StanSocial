"use client"

import { useState } from "react"
import { Heart, MessageCircle, Repeat2, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { ExplorePost } from "@/types"

interface PollTileProps {
  post: ExplorePost
  layout: "full" | "half"
  position: "left" | "right" | "center"
}

export function PollTile({ post, layout, position }: PollTileProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const badgePosition = position === "right" ? "top-4 right-4" : "top-4 left-4"

  const handleVote = (optionId: string) => {
    if (!hasVoted) {
      setSelectedOption(optionId)
      setHasVoted(true)
    }
  }

  const getPercentage = (votes: number) => {
    return post.totalVotes ? Math.round((votes / post.totalVotes) * 100) : 0
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
      <CardContent className="p-6 relative">
        {/* Idol Badge */}
        <div className={`absolute ${badgePosition} z-10`}>
          <Avatar className="h-8 w-8 ring-2 ring-white">
            <AvatarImage src={post.idol.image || "/placeholder.svg"} alt={post.idol.name} />
            <AvatarFallback className="text-xs">{post.idol.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.user.avatar || "/placeholder.svg"} alt={post.user.name} />
              <AvatarFallback className="text-xs">{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{post.user.name}</p>
              <p className="text-xs text-muted-foreground">{post.timestamp}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">📊 Poll</Badge>
            <Badge variant="secondary">🔥 {post.trendingScore}</Badge>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-4">{post.pollQuestion}</h3>

        <div className="space-y-3 mb-4">
          {post.pollOptions?.map((option) => (
            <div key={option.id} className="space-y-2">
              <Button
                variant={selectedOption === option.id ? "default" : "outline"}
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => handleVote(option.id)}
                disabled={hasVoted}
              >
                <span className="flex-1">{option.text}</span>
                {hasVoted && <span className="text-sm font-medium">{getPercentage(option.votes)}%</span>}
              </Button>

              {hasVoted && <Progress value={getPercentage(option.votes)} className="h-2" />}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-600">
              <Heart className="h-4 w-4 mr-1" />
              {post.likes}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-600">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.comments}
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-green-600">
              <Repeat2 className="h-4 w-4 mr-1" />
              {post.reposts}
            </Button>
          </div>

          <div className="flex items-center space-x-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">{post.totalVotes?.toLocaleString()} votes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
