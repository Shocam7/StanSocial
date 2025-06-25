// Updated types/index.ts

export interface Idol {
  id: string
  name: string
  image: string
  category: string
  stans: number
  isStanned?: boolean
}

export interface User {
  id: string
  name: string
  username: string
  avatar: string
  bio?: string // NEW
  friendsCount: number // NEW
  postsCount: number // NEW
  stannedIdols: string[]
}

export interface UserFriendship {
  id: string
  userId1: string
  userId2: string
  status: 'pending' | 'accepted' | 'declined'
  requesterId: string
  createdAt: string
  acceptedAt?: string
}

export interface Friend {
  id: string
  name: string
  username: string
  avatar: string
  friendshipDate: string
}

export interface UserFavorite {
  id: string
  userId: string
  idolId: string
  question: string
  answer: string
  category?: string
  createdAt: string
  idol?: Idol // Populated when needed
}

export interface Collection {
  id: string
  name: string
  description?: string
  isPublic: boolean
  postCount: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  reposts: number
  liked?: boolean
  user: {
    name: string
    username: string
    avatar: string
  }
  idol: Idol
}

export interface DiscoverPost {
  id: string
  type: "image" | "video" | "discussion" | "poll"
  trendingScore: number
  user: {
    name: string
    username: string
    avatar: string
  }
  idol: Idol
  timestamp: string
  likes: number
  comments: number
  reposts: number
  liked?: boolean

  // Type-specific fields
  image?: string
  video?: string
  title?: string // for discussions
  content?: string
  pollQuestion?: string
  pollOptions?: Array<{
    id: string
    text: string
    votes: number
  }>
  totalVotes?: number
}

// Profile page specific types
export interface ProfileData {
  user: User
  posts: Post[]
  mediaPosts: Post[]
  collections: Collection[]
  favorites: UserFavorite[]
  stannedIdolsCount: number
}