export interface Idol {
  id: string
  name: string
  image: string
  category: string
  followers: number
  isStanned?: boolean
}

export interface User {
  id: string
  name: string
  username: string
  avatar: string
  stannedIdols: string[]
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
