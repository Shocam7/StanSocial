// lib/friendship-service.ts
import { getSupabaseBrowser } from "./supabase"
import type { Friend, UserFriendship } from "@/types"

export class FriendshipService {
  private supabase = getSupabaseBrowser()

  /**
   * Send a friend request
   */
  async sendFriendRequest(senderId: string, receiverId: string) {
    if (senderId === receiverId) {
      throw new Error("Cannot send friend request to yourself")
    }

    const { data, error } = await this.supabase.rpc('send_friend_request', {
      sender_id: senderId,
      receiver_id: receiverId
    })

    if (error) throw error
    return data
  }

  /**
   * Accept a friend request
   */
  async acceptFriendRequest(friendshipId: string, accepterId: string) {
    const { data, error } = await this.supabase.rpc('accept_friend_request', {
      friendship_id: friendshipId,
      accepter_id: accepterId
    })

    if (error) throw error
    return data
  }

  /**
   * Decline a friend request
   */
  async declineFriendRequest(friendshipId: string, declinerId: string) {
    const { error } = await this.supabase
      .from('user_friendships')
      .update({ status: 'declined' })
      .eq('id', friendshipId)
      .or(`user_id_1.eq.${declinerId},user_id_2.eq.${declinerId}`)
      .neq('requester_id', declinerId)

    if (error) throw error
  }

  /**
   * Remove/unfriend a user
   */
  async removeFriend(userId: string, friendId: string) {
    // Order the IDs consistently
    const [user1, user2] = [userId, friendId].sort()
    
    const { error } = await this.supabase
      .from('user_friendships')
      .delete()
      .eq('user_id_1', user1)
      .eq('user_id_2', user2)

    if (error) throw error
  }

  /**
   * Get user's friends
   */
  async getUserFriends(userId: string): Promise<Friend[]> {
    const { data, error } = await this.supabase.rpc('get_user_friends', {
      target_user_id: userId
    })

    if (error) throw error
    
    return data?.map((row: any) => ({
      id: row.friend_id,
      name: row.friend_name,
      username: row.friend_username,
      avatar: row.friend_avatar,
      friendshipDate: row.friendship_date
    })) || []
  }

  /**
   * Get pending friend requests sent to user
   */
  async getPendingRequests(userId: string): Promise<UserFriendship[]> {
    const { data, error } = await this.supabase
      .from('user_friendships')
      .select(`
        *,
        requester:users!user_friendships_requester_id_fkey(name, username, avatar)
      `)
      .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`)
      .neq('requester_id', userId)
      .eq('status', 'pending')

    if (error) throw error
    
    return data?.map(friendship => ({
      id: friendship.id,
      userId1: friendship.user_id_1,
      userId2: friendship.user_id_2,
      status: friendship.status as 'pending' | 'accepted' | 'declined',
      requesterId: friendship.requester_id,
      createdAt: friendship.created_at,
      acceptedAt: friendship.accepted_at || undefined,
      requester: friendship.requester
    })) || []
  }

  /**
   * Get friendship status between two users
   */
  async getFriendshipStatus(userId: string, otherUserId: string) {
    const [user1, user2] = [userId, otherUserId].sort()
    
    const { data, error } = await this.supabase
      .from('user_friendships')
      .select('*')
      .eq('user_id_1', user1)
      .eq('user_id_2', user2)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    
    if (!data) return null
    
    return {
      id: data.id,
      userId1: data.user_id_1,
      userId2: data.user_id_2,
      status: data.status as 'pending' | 'accepted' | 'declined',
      requesterId: data.requester_id,
      createdAt: data.created_at,
      acceptedAt: data.accepted_at || undefined,
      // Helper properties
      areFriends: data.status === 'accepted',
      isPending: data.status === 'pending',
      canAccept: data.status === 'pending' && data.requester_id !== userId,
      sentByMe: data.requester_id === userId
    }
  }

  /**
   * Check if two users are friends
   */
  async areFriends(userId: string, otherUserId: string): Promise<boolean> {
    const status = await this.getFriendshipStatus(userId, otherUserId)
    return status?.areFriends || false
  }

  /**
   * Get mutual friends between two users
   */
  async getMutualFriends(userId: string, otherUserId: string): Promise<Friend[]> {
    const [userFriends, otherUserFriends] = await Promise.all([
      this.getUserFriends(userId),
      this.getUserFriends(otherUserId)
    ])

    const userFriendIds = new Set(userFriends.map(f => f.id))
    return otherUserFriends.filter(friend => userFriendIds.has(friend.id))
  }
}

// Export singleton instance
export const friendshipService = new FriendshipService()