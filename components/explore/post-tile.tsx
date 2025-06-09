"use client"

import { ImageTile } from "./image-tile"
import { VideoTile } from "./video-tile"
import { DiscussionTile } from "./discussion-tile"
import { PollTile } from "./poll-tile"
import type { ExplorePost } from "@/types"

interface PostTileProps {
  post: ExplorePost
  layout: "full" | "half"
  position: "left" | "right" | "center"
}

export function PostTile({ post, layout, position }: PostTileProps) {
  const renderTile = () => {
    switch (post.type) {
      case "image":
        return <ImageTile post={post} layout={layout} position={position} />
      case "video":
        return <VideoTile post={post} layout={layout} position={position} />
      case "discussion":
        return <DiscussionTile post={post} layout={layout} position={position} />
      case "poll":
        return <PollTile post={post} layout={layout} position={position} />
      default:
        return null
    }
  }

  return renderTile()
}
