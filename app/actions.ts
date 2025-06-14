"use server"

import { getSupabaseServer } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Stan/unstan an idol
export async function toggleStanIdol(idolId: string, isStanning: boolean) {
  const supabase = getSupabaseServer()

  // Get current user (in a real app, this would use auth)
  // For demo purposes, we'll use a fixed user ID
  const userId = "00000000-0000-0000-0000-000000000001"

  try {
    if (isStanning) {
      // Remove the stan relationship
      await supabase.from("user_stanned_idols").delete().eq("user_id", userId).eq("idol_id", idolId)

      // Decrease follower count
      await supabase
        .from("idols")
        .update({ followers: supabase.rpc("decrement", { x: 1 }) })
        .eq("id", idolId)
    } else {
      // Add the stan relationship
      await supabase.from("user_stanned_idols").insert({ user_id: userId, idol_id: idolId })

      // Increase follower count
      await supabase
        .from("idols")
        .update({ followers: supabase.rpc("increment", { x: 1 }) })
        .eq("id", idolId)
    }

    revalidatePath("/")
    revalidatePath("/idol/[id]")
    return { success: true }
  } catch (error) {
    console.error("Error toggling stan status:", error)
    return { success: false, error: "Failed to update stan status" }
  }
}

// Create a new post
export async function createPost(formData: FormData) {
  const supabase = getSupabaseServer()

  // Get current user (in a real app, this would use auth)
  const userId = "00000000-0000-0000-0000-000000000001"

  const content = formData.get("content") as string
  const idolId = formData.get("idolId") as string

  try {
    const { data, error } = await supabase
      .from("posts")
      .insert({
        type: "image",
        content,
        user_id: userId,
        idol_id: idolId,
        trending_score: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
      })
      .select()

    if (error) throw error

    revalidatePath("/")
    return { success: true, post: data[0] }
  } catch (error) {
    console.error("Error creating post:", error)
    return { success: false, error: "Failed to create post" }
  }
}

// Like/unlike a post
export async function toggleLikePost(postId: string, isLiked: boolean) {
  const supabase = getSupabaseServer()

  try {
    await supabase
      .from("posts")
      .update({
        likes: supabase.rpc(isLiked ? "decrement" : "increment", { x: 1 }),
      })
      .eq("id", postId)

    revalidatePath("/")
    revalidatePath("/discover")
    revalidatePath("/idol/[id]")
    return { success: true }
  } catch (error) {
    console.error("Error toggling like:", error)
    return { success: false, error: "Failed to update like status" }
  }
}

// Vote in a poll
export async function voteInPoll(optionId: string) {
  const supabase = getSupabaseServer()

  try {
    // Increment votes for the option
    await supabase
      .from("poll_options")
      .update({ votes: supabase.rpc("increment", { x: 1 }) })
      .eq("id", optionId)

    // Get the post ID for this option
    const { data } = await supabase.from("poll_options").select("post_id").eq("id", optionId).single()

    if (data) {
      // Increment likes for the post
      await supabase
        .from("posts")
        .update({ likes: supabase.rpc("increment", { x: 1 }) })
        .eq("id", data.post_id)
    }

    revalidatePath("/discover")
    return { success: true }
  } catch (error) {
    console.error("Error voting in poll:", error)
    return { success: false, error: "Failed to register vote" }
  }
}
