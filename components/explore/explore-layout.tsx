"use client"

import { PostTile } from "./post-tile"
import type { ExplorePost } from "@/types"

interface ExploreLayoutProps {
  posts: ExplorePost[]
}

export function ExploreLayout({ posts }: ExploreLayoutProps) {
  // Sort posts by trending score
  const sortedPosts = [...posts].sort((a, b) => b.trendingScore - a.trendingScore)

  const renderPosts = () => {
    const rows = []
    let i = 0

    while (i < sortedPosts.length) {
      const currentPost = sortedPosts[i]

      // Discussion posts always take full width
      if (currentPost.type === "discussion") {
        rows.push(
          <div key={currentPost.id} className="w-full">
            <PostTile post={currentPost} layout="full" position="center" />
          </div>,
        )
        i++
        continue
      }

      // Check if this is the most trending post (first non-discussion post)
      if (i === 0 || (i === 1 && sortedPosts[0].type === "discussion")) {
        rows.push(
          <div key={currentPost.id} className="w-full">
            <PostTile post={currentPost} layout="full" position="center" />
          </div>,
        )
        i++
        continue
      }

      // Check if we can pair this post with the next one
      const nextPost = sortedPosts[i + 1]
      if (
        nextPost &&
        nextPost.type !== "discussion" &&
        Math.abs(currentPost.trendingScore - nextPost.trendingScore) <= 10
      ) {
        // Place side by side
        rows.push(
          <div key={`${currentPost.id}-${nextPost.id}`} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PostTile post={currentPost} layout="half" position="left" />
            <PostTile post={nextPost} layout="half" position="right" />
          </div>,
        )
        i += 2
      } else {
        // This post has a significant trending margin, give it full width
        rows.push(
          <div key={currentPost.id} className="w-full">
            <PostTile post={currentPost} layout="full" position="center" />
          </div>,
        )
        i++
      }
    }

    return rows
  }

  return <div className="p-4 space-y-6">{renderPosts()}</div>
}
