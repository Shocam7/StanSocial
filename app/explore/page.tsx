"use client"

import { Header } from "@/components/header"
import { StannedIdolsSidebar } from "@/components/stanned-idols-sidebar"
import { ExploreLayout } from "@/components/explore/explore-layout"
import type { Idol, ExplorePost } from "@/types"

// Sample data
const sampleIdols: Idol[] = [
  {
    id: "1",
    name: "Taylor Swift",
    image: "/placeholder.svg?height=48&width=48&text=TS",
    category: "Music",
    followers: 1200000,
    isStanned: true,
  },
  {
    id: "2",
    name: "BTS",
    image: "/placeholder.svg?height=48&width=48&text=BTS",
    category: "K-Pop",
    followers: 2500000,
    isStanned: true,
  },
  {
    id: "3",
    name: "Zendaya",
    image: "/placeholder.svg?height=48&width=48&text=Z",
    category: "Acting",
    followers: 980000,
    isStanned: false,
  },
  {
    id: "4",
    name: "Ariana Grande",
    image: "/placeholder.svg?height=48&width=48&text=AG",
    category: "Music",
    followers: 1500000,
    isStanned: true,
  },
]

const sampleExplorePosts: ExplorePost[] = [
  {
    id: "1",
    type: "video",
    trendingScore: 95,
    user: { name: "Sarah Johnson", username: "sarahj_fan", avatar: "/placeholder.svg?height=32&width=32" },
    idol: sampleIdols[0],
    timestamp: "2h",
    likes: 2450,
    comments: 156,
    reposts: 89,
    video: "/placeholder.svg?height=400&width=600&text=Taylor+Concert+Video",
    content: "Taylor's surprise acoustic performance last night was absolutely magical! 🎵✨",
  },
  {
    id: "2",
    type: "poll",
    trendingScore: 88,
    user: { name: "Alex Chen", username: "alexbtstan", avatar: "/placeholder.svg?height=32&width=32" },
    idol: sampleIdols[1],
    timestamp: "4h",
    likes: 1890,
    comments: 234,
    reposts: 67,
    pollQuestion: "Which BTS album is your all-time favorite?",
    pollOptions: [
      { id: "1", text: "Love Yourself: Tear", votes: 1250 },
      { id: "2", text: "Map of the Soul: 7", votes: 980 },
      { id: "3", text: "BE", votes: 756 },
      { id: "4", text: "Wings", votes: 1100 },
    ],
    totalVotes: 4086,
  },
  {
    id: "3",
    type: "discussion",
    trendingScore: 92,
    user: { name: "Maria Rodriguez", username: "maria_discusses", avatar: "/placeholder.svg?height=32&width=32" },
    idol: sampleIdols[0],
    timestamp: "6h",
    likes: 567,
    comments: 89,
    reposts: 23,
    title: "Taylor Swift's songwriting evolution: From country roots to pop mastery",
    content: "Let's discuss how Taylor's songwriting has evolved over the years...",
  },
  {
    id: "4",
    type: "image",
    trendingScore: 85,
    user: { name: "David Kim", username: "david_photographer", avatar: "/placeholder.svg?height=32&width=32" },
    idol: sampleIdols[2],
    timestamp: "8h",
    likes: 1456,
    comments: 78,
    reposts: 45,
    image: "/placeholder.svg?height=500&width=400&text=Zendaya+Photoshoot",
    content: "Behind the scenes from Zendaya's latest photoshoot 📸",
  },
  {
    id: "5",
    type: "image",
    trendingScore: 82,
    user: { name: "Emma Wilson", username: "emma_captures", avatar: "/placeholder.svg?height=32&width=32" },
    idol: sampleIdols[3],
    timestamp: "10h",
    likes: 1234,
    comments: 56,
    reposts: 34,
    image: "/placeholder.svg?height=600&width=400&text=Ariana+Concert",
    content: "Ariana's vocals were absolutely incredible tonight! 🎤",
  },
  {
    id: "6",
    type: "video",
    trendingScore: 78,
    user: { name: "Chris Park", username: "chris_edits", avatar: "/placeholder.svg?height=32&width=32" },
    idol: sampleIdols[1],
    timestamp: "12h",
    likes: 2100,
    comments: 145,
    reposts: 78,
    video: "/placeholder.svg?height=400&width=600&text=BTS+Dance+Practice",
    content: "BTS dance practice compilation - their synchronization is unreal! 💜",
  },
  {
    id: "7",
    type: "poll",
    trendingScore: 75,
    user: { name: "Lisa Thompson", username: "lisa_polls", avatar: "/placeholder.svg?height=32&width=32" },
    idol: sampleIdols[3],
    timestamp: "14h",
    likes: 890,
    comments: 67,
    reposts: 23,
    pollQuestion: "What's your favorite Ariana Grande era?",
    pollOptions: [
      { id: "1", text: "Sweetener Era", votes: 450 },
      { id: "2", text: "Thank U, Next Era", votes: 680 },
      { id: "3", text: "Positions Era", votes: 320 },
      { id: "4", text: "Eternal Sunshine Era", votes: 290 },
    ],
    totalVotes: 1740,
  },
  {
    id: "8",
    type: "discussion",
    trendingScore: 70,
    user: { name: "Jordan Lee", username: "jordan_talks", avatar: "/placeholder.svg?height=32&width=32" },
    idol: sampleIdols[2],
    timestamp: "16h",
    likes: 445,
    comments: 123,
    reposts: 34,
    title: "Zendaya's impact on young actors and representation in Hollywood",
    content: "How has Zendaya changed the landscape for young actors...",
  },
]

export default function ExplorePage() {
  const stannedIdols = sampleIdols.filter((idol) => idol.isStanned)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto flex">
        <StannedIdolsSidebar stannedIdols={stannedIdols} />

        <main className="flex-1 max-w-6xl border-x">
          <div className="sticky top-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
            <h1 className="text-2xl font-bold">Explore</h1>
            <p className="text-muted-foreground">Discover trending content about your favorite idols</p>
          </div>

          <ExploreLayout posts={sampleExplorePosts} />
        </main>

        <aside className="w-80 p-4 space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">Trending Categories</h3>
            <div className="space-y-2">
              {[
                { category: "Music", posts: "2.5K posts", trend: "+15%" },
                { category: "K-Pop", posts: "1.8K posts", trend: "+23%" },
                { category: "Acting", posts: "890 posts", trend: "+8%" },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 hover:bg-background rounded">
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-xs text-muted-foreground">{item.posts}</p>
                  </div>
                  <span className="text-xs text-green-600 font-medium">{item.trend}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">Post Types</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: "Images", count: "1.2K", icon: "🖼️" },
                { type: "Videos", count: "856", icon: "🎥" },
                { type: "Polls", count: "234", icon: "📊" },
                { type: "Discussions", count: "445", icon: "💬" },
              ].map((item, index) => (
                <div key={index} className="text-center p-3 bg-background rounded">
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <p className="font-medium text-sm">{item.type}</p>
                  <p className="text-xs text-muted-foreground">{item.count}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
