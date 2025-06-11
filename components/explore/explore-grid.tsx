"use client"

import { PostTile } from "./post-tile"
import type { ExplorePost } from "@/types"

interface ExploreGridProps {
  posts: ExplorePost[]
}

interface PostGroup {
  posts: ExplorePost[]
  averageScore: number
}

export function ExploreGrid({ posts }: ExploreGridProps) {
  // Sort posts by trending score (descending)
  const sortedPosts = [...posts].sort((a, b) => b.trendingScore - a.trendingScore)

  // Group posts with similar trending scores (difference ≤ 10)
  const groupPosts = (): PostGroup[] => {
    if (sortedPosts.length === 0) return []

    const groups: PostGroup[] = []
    let currentGroup: ExplorePost[] = [sortedPosts[0]]

    for (let i = 1; i < sortedPosts.length; i++) {
      const currentPost = sortedPosts[i]
      const lastPostInGroup = currentGroup[currentGroup.length - 1]

      // Check if the current post should be in the same group
      if (Math.abs(lastPostInGroup.trendingScore - currentPost.trendingScore) <= 10) {
        currentGroup.push(currentPost)
      } else {
        // Finalize current group and start a new one
        groups.push({
          posts: currentGroup,
          averageScore: currentGroup.reduce((sum, post) => sum + post.trendingScore, 0) / currentGroup.length,
        })
        currentGroup = [currentPost]
      }
    }

    // Add the last group
    if (currentGroup.length > 0) {
      groups.push({
        posts: currentGroup,
        averageScore: currentGroup.reduce((sum, post) => sum + post.trendingScore, 0) / currentGroup.length,
      })
    }

    return groups
  }

  const postGroups = groupPosts()

  const renderGroup = (group: PostGroup, groupIndex: number) => {
    const { posts } = group

    // Discussion posts always take full width
    const discussionPosts = posts.filter((post) => post.type === "discussion")
    const nonDiscussionPosts = posts.filter((post) => post.type !== "discussion")

    const elements: JSX.Element[] = []

    // Render discussion posts first (full width)
    discussionPosts.forEach((post, index) => {
      elements.push(
        <div key={`discussion-${post.id}`} className="col-span-full">
          <PostTile post={post} layout="full" position="center" />
        </div>,
      )
    })

    // Handle non-discussion posts
    if (nonDiscussionPosts.length === 1) {
      // Single post takes full width
      elements.push(
        <div key={`single-${nonDiscussionPosts[0].id}`} className="col-span-full">
          <PostTile post={nonDiscussionPosts[0]} layout="full" position="center" />
        </div>,
      )
    } else if (nonDiscussionPosts.length === 2) {
      // Two posts in same line
      elements.push(
        <div key={`pair-${groupIndex}`} className="col-span-full grid grid-cols-2 gap-4">
          <PostTile post={nonDiscussionPosts[0]} layout="half" position="left" />
          <PostTile post={nonDiscussionPosts[1]} layout="half" position="right" />
        </div>,
      )
    } else if (nonDiscussionPosts.length === 3) {
      // Three posts in same line
      elements.push(
        <div key={`triple-${groupIndex}`} className="col-span-full grid grid-cols-3 gap-4">
          <PostTile post={nonDiscussionPosts[0]} layout="third" position="left" />
          <PostTile post={nonDiscussionPosts[1]} layout="third" position="center" />
          <PostTile post={nonDiscussionPosts[2]} layout="third" position="right" />
        </div>,
      )
    } else if (nonDiscussionPosts.length > 3) {
      // More than 3 posts: first 3 in one line, rest in subsequent lines
      const firstThree = nonDiscussionPosts.slice(0, 3)
      const remaining = nonDiscussionPosts.slice(3)

      // First line with 3 posts
      elements.push(
        <div key={`first-three-${groupIndex}`} className="col-span-full grid grid-cols-3 gap-4">
          <PostTile post={firstThree[0]} layout="third" position="left" />
          <PostTile post={firstThree[1]} layout="third" position="center" />
          <PostTile post={firstThree[2]} layout="third" position="right" />
        </div>,
      )

      // Handle remaining posts in groups of 3, 2, or 1
      let remainingIndex = 0
      while (remainingIndex < remaining.length) {
        const chunk = remaining.slice(remainingIndex, remainingIndex + 3)

        if (chunk.length === 1) {
          elements.push(
            <div key={`remaining-single-${remainingIndex}`} className="col-span-full">
              <PostTile post={chunk[0]} layout="full" position="center" />
            </div>,
          )
        } else if (chunk.length === 2) {
          elements.push(
            <div key={`remaining-pair-${remainingIndex}`} className="col-span-full grid grid-cols-2 gap-4">
              <PostTile post={chunk[0]} layout="half" position="left" />
              <PostTile post={chunk[1]} layout="half" position="right" />
            </div>,
          )
        } else if (chunk.length === 3) {
          elements.push(
            <div key={`remaining-triple-${remainingIndex}`} className="col-span-full grid grid-cols-3 gap-4">
              <PostTile post={chunk[0]} layout="third" position="left" />
              <PostTile post={chunk[1]} layout="third" position="center" />
              <PostTile post={chunk[2]} layout="third" position="right" />
            </div>,
          )
        }

        remainingIndex += 3
      }
    }

    return elements
  }

  if (sortedPosts.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="font-semibold text-lg mb-2">No posts to display</h3>
        <p className="text-muted-foreground">Check back later for trending content!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-4">
      {postGroups.map((group, groupIndex) => renderGroup(group, groupIndex))}
    </div>
  )
}
