"use client"

import { useState } from "react"
import { ImageIcon, Smile, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { IdolSelector } from "@/components/idol-selector"
import { createPost } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import type { Idol } from "@/types"

interface CreatePostProps {
  idols: Idol[]
  userAvatar: string
}

export function CreatePost({ idols, userAvatar }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [selectedIdol, setSelectedIdol] = useState<Idol | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const maxLength = 280

  const handleSelectIdol = (idol: Idol) => {
    setSelectedIdol(idol)
  }

  const isPostValid = content.trim().length > 0 && selectedIdol !== null

  const handleSubmit = async () => {
    if (!isPostValid) return

    setIsSubmitting(true)

    const formData = new FormData()
    formData.append("content", content)
    formData.append("idolId", selectedIdol!.id)

    const result = await createPost(formData)

    setIsSubmitting(false)

    if (result.success) {
      setContent("")
      setSelectedIdol(null)
      toast({
        title: "Post created",
        description: "Your post has been published successfully!",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="border-0 border-b rounded-none">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userAvatar || "/placeholder.svg"} alt="Your avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            <IdolSelector idols={idols} selectedIdol={selectedIdol} onSelectIdol={handleSelectIdol} />

            <Textarea
              placeholder={selectedIdol ? `What's on your mind about ${selectedIdol.name}?` : "Select an idol first"}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none text-lg focus-visible:ring-0"
              maxLength={maxLength}
              disabled={!selectedIdol || isSubmitting}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <Smile className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <Calendar className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                  <MapPin className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                <span
                  className={`text-sm ${content.length > maxLength * 0.8 ? "text-orange-500" : "text-muted-foreground"}`}
                >
                  {maxLength - content.length}
                </span>
                <Button disabled={!isPostValid || isSubmitting} className="rounded-full px-6" onClick={handleSubmit}>
                  {isSubmitting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
