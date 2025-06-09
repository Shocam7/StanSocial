"use client"

import { PostTile } from "./post-tile"
import type { ExplorePost } from "@/types"
import { useEffect, useState } from "react"

interface ExploreGridProps {
  posts: ExplorePost[]
}

export function ExploreGrid({ posts }: ExploreGridProps) {
  // Sort posts by trending score
  const sortedPosts = [...posts].sort((a, b) => b.trendingScore - a.trendingScore)
  const [columns, setColumns] = useState(2)

  // Responsive column count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setColumns(1)
      } else if (window.innerWidth < 1024) {
        setColumns(2)
      } else {
        setColumns(3)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Organize posts into a grid layout
  const organizeGrid = () => {
    // Always put the most trending post at the top with full width
    const topPost = sortedPosts[0]
    const remainingPosts = sortedPosts.slice(1)

    // Group discussion posts (they always take full width)
    const discussionPosts = remainingPosts.filter((post) => post.type === "discussion")

    // Other posts that can be arranged in a grid
    const gridPosts = remainingPosts.filter((post) => post.type !== "discussion")

    // Group posts with similar trending scores
    const groupedPosts: ExplorePost[][] = []
    let i = 0

    while (i < gridPosts.length) {
      const currentPost = gridPosts[i]

      // Check if we can pair this post with the next one based on trending score
      if (i + 1 < gridPosts.length && Math.abs(currentPost.trendingScore - gridPosts[i + 1].trendingScore) <= 10) {
        // Similar trending scores, group them
        groupedPosts.push([currentPost, gridPosts[i + 1]])
        i += 2
      } else {
        // Significant trending margin, keep it alone
        groupedPosts.push([currentPost])
        i += 1
      }
    }

    return { topPost, discussionPosts, groupedPosts }
  }

  const { topPost, discussionPosts, groupedPosts } = organizeGrid()

  if (!topPost) return <div className="p-4 text-center">No posts to display</div>

  return (
    <div className="grid gap-4">
      {/* Top trending post - full width */}
      <div className="col-span-full">
        <PostTile post={topPost} layout="full" position="center" />
      </div>

      {/* Grid layout for remaining posts */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
        {groupedPosts.map((group, groupIndex) => {
          // For single posts in a group
          if (group.length === 1) {
            return (
              <div
                key={group[0].id}
                className={columns === 1 ? "col-span-1" : "col-span-1 sm:col-span-2 lg:col-span-1"}
              >
                <PostTile post={group[0]} layout={columns === 1 ? "full" : "half"} position="center" />
              </div>
            )
          }

          // For pairs of posts with similar trending scores
          return (
            <div key={`group-${groupIndex}`} className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <PostTile post={group[0]} layout="half" position="left" />
              <PostTile post={group[1]} layout="half" position="right" />
            </div>
          )
        })}

        {/* Discussion posts - always full width */}
        {discussionPosts.map((post) => (
          <div key={post.id} className="col-span-1 sm:col-span-2 lg:col-span-3">
            <PostTile post={post} layout="full" position="center" />
          </div>
        ))}
      </div>
    </div>
  )
}
