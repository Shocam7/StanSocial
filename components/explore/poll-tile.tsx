"use client"

import { useState } from "react"
import { Heart, MessageCircle, Repeat2, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { voteInPoll, toggleLikePost } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import type { ExplorePost } from "@/types"

interface PollTileProps {
  post: ExplorePost
  layout: "full" | "half"
  position: "left" | "right" | "center"
}

export function PollTile({ post, layout, position }: PollTileProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [isLiked, setIsLiked] = useState(post.liked || false)
  const [likes, setLikes] = useState(post.likes)
  const [pollOptions, setPollOptions] = useState(post.pollOptions || [])
  const [totalVotes, setTotalVotes] = useState(post.totalVotes || 0)
  const { toast } = useToast()

  const badgePosition = position === "right" ? "top-4 right-4" : "top-4 left-4"

  const handleVote = async (optionId: string) => {
    if (!hasVoted) {
      setSelectedOption(optionId)
      setHasVoted(true)

      // Update UI optimistically
      const updatedOptions = pollOptions.map((option) => {
        if (option.id === optionId) {
          return { ...option, votes: option.votes + 1 }
        }
        return option
      })

      setPollOptions(updatedOptions)
      setTotalVotes(totalVotes + 1)

      // Send to server
      const result = await voteInPoll(optionId)

      if (!result.success) {
        // Revert on failure
        setPollOptions(post.pollOptions || [])
        setTotalVotes(post.totalVotes || 0)
        setHasVoted(false)
        setSelectedOption(null)

        toast({
          title: "Error",
          description: "Failed to register your vote. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

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

  const getPercentage = (votes: number) => {
    return totalVotes ? Math.round((votes / totalVotes) * 100) : 0
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer h-full">
      <CardContent className="p-4 md:p-6 relative">
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
          {pollOptions.map((option) => (
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
            <Button
              variant="ghost"
              size="sm"
              className={`${isLiked ? "text-red-600" : "text-muted-foreground"} hover:text-red-600`}
              onClick={handleLike}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
              {likes}
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
            <span className="text-sm">{totalVotes.toLocaleString()} votes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
