import { getSupabaseBrowser } from "./supabase"
import type { DiscoverPost } from "@/types"

// Convert database post to app post
const mapDatabasePostToAppPost = async (post: any): Promise<DiscoverPost> => {
  const supabase = getSupabaseBrowser()

  // Fetch the user
  const { data: userData } = await supabase.from("users").select("*").eq("id", post.user_id).single()

  // Fetch the idol
  const { data: idolData } = await supabase.from("idols").select("*").eq("id", post.idol_id).single()

  // For poll posts, fetch options
  let pollOptions = null
  let totalVotes = 0

  if (post.type === "poll") {
    const { data: options } = await supabase.from("poll_options").select("*").eq("post_id", post.id)

    if (options) {
      pollOptions = options.map((option) => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
      }))

      totalVotes = options.reduce((sum, option) => sum + option.votes, 0)
    }
  }

  const user = userData
    ? {
        name: userData.name,
        username: userData.username,
        avatar: userData.avatar,
      }
    : { name: "Unknown User", username: "unknown", avatar: "" }

  const idol = idolData
    ? {
        id: idolData.id,
        name: idolData.name,
        image: idolData.image,
        category: idolData.category,
        stans: idolData.stans,
      }
    : { id: "", name: "Unknown Idol", image: "", category: "", stans: 0 }

  // Calculate timestamp
  const timestamp = getRelativeTimeString(new Date(post.created_at))

  return {
    id: post.id,
    type: post.type,
    trendingScore: post.trending_score,
    user,
    idol,
    timestamp,
    likes: post.likes,
    comments: post.comments,
    reposts: post.reposts,
    content: post.content || undefined,
    image: post.image || undefined,
    video: post.video || undefined,
    title: post.title || undefined,
    pollQuestion: post.poll_question || undefined,
    pollOptions: pollOptions || undefined,
    totalVotes: totalVotes || undefined,
  }
}

// Helper function to get relative time
function getRelativeTimeString(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  return `${Math.floor(diffInSeconds / 86400)}d`
}
