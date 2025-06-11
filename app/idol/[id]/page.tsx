"use client"

import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { StannedIdolsSidebar } from "@/components/stanned-idols-sidebar"
import { Post } from "@/components/post"
import { IdolProfileHeader } from "@/components/idol-profile-header"
import { IdolStats } from "@/components/idol-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Idol, Post as PostType } from "@/types"
import { FloatingNavButton } from "@/components/floating-nav-button"

// Sample data (in a real app, this would come from an API)
const sampleIdols: Idol[] = [
  {
    id: "1",
    name: "Taylor Swift",
    image: "/placeholder.svg?height=120&width=120&text=TS",
    category: "Music",
    followers: 1200000,
    isStanned: true,
  },
  {
    id: "2",
    name: "BTS",
    image: "/placeholder.svg?height=120&width=120&text=BTS",
    category: "K-Pop",
    followers: 2500000,
    isStanned: true,
  },
  {
    id: "3",
    name: "Zendaya",
    image: "/placeholder.svg?height=120&width=120&text=Z",
    category: "Acting",
    followers: 980000,
    isStanned: false,
  },
  {
    id: "4",
    name: "Blackpink",
    image: "/placeholder.svg?height=120&width=120&text=BP",
    category: "K-Pop",
    followers: 1800000,
    isStanned: false,
  },
  {
    id: "5",
    name: "Tom Holland",
    image: "/placeholder.svg?height=120&width=120&text=TH",
    category: "Acting",
    followers: 850000,
    isStanned: false,
  },
  {
    id: "6",
    name: "Ariana Grande",
    image: "/placeholder.svg?height=120&width=120&text=AG",
    category: "Music",
    followers: 1500000,
    isStanned: true,
  },
]

const samplePosts: PostType[] = [
  {
    id: "1",
    content:
      "Just saw Taylor's new music video and I'm obsessed! The visuals are incredible and the song is stuck in my head. #Swiftie",
    timestamp: "2h",
    likes: 245,
    comments: 32,
    reposts: 18,
    liked: true,
    user: { name: "Sarah Johnson", username: "sarahj_fan", avatar: "/placeholder.svg?height=24&width=24" },
    idol: sampleIdols[0],
  },
  {
    id: "2",
    content:
      "Taylor's surprise acoustic set at the end of the concert last night was magical. She played 'All Too Well' (10 minute version) and I was in tears. Best night ever! ❤️",
    image: "/placeholder.svg?height=300&width=500&text=Concert+Moment",
    timestamp: "12h",
    likes: 892,
    comments: 76,
    reposts: 41,
    user: { name: "David Kim", username: "david_swiftie", avatar: "/placeholder.svg?height=24&width=24" },
    idol: sampleIdols[0],
  },
  {
    id: "3",
    content:
      "The way Taylor writes about heartbreak is unmatched. Every lyric hits different when you're going through it yourself. Her music is therapy.",
    timestamp: "1d",
    likes: 567,
    comments: 89,
    reposts: 23,
    user: { name: "Emma Wilson", username: "emma_swiftie", avatar: "/placeholder.svg?height=24&width=24" },
    idol: sampleIdols[0],
  },
  {
    id: "4",
    content:
      "BTS just announced their world tour! Who's trying to get tickets? I'm already saving up for the VIP experience! 💜",
    image: "/placeholder.svg?height=300&width=500&text=BTS+World+Tour",
    timestamp: "4h",
    likes: 1024,
    comments: 156,
    reposts: 87,
    user: { name: "Alex Chen", username: "alexbtstan", avatar: "/placeholder.svg?height=24&width=24" },
    idol: sampleIdols[1],
  },
  {
    id: "5",
    content:
      "The choreography in BTS's new music video is mind-blowing. They never disappoint with their performances. I've been trying to learn it all day!",
    timestamp: "1d",
    likes: 1456,
    comments: 203,
    reposts: 178,
    user: { name: "Emma Wilson", username: "emma_btsarmy", avatar: "/placeholder.svg?height=24&width=24" },
    idol: sampleIdols[1],
  },
  {
    id: "6",
    content:
      "Ariana's vocals in her latest album are absolutely insane. The range, the control, the emotion... she's truly one of the best vocalists of our generation.",
    timestamp: "6h",
    likes: 578,
    comments: 43,
    reposts: 29,
    user: { name: "Maria Rodriguez", username: "maria_arianator", avatar: "/placeholder.svg?height=24&width=24" },
    idol: sampleIdols[5],
  },
]

interface IdolPageProps {
  params: Promise<{ id: string }>
}

export default async function IdolPage({ params }: IdolPageProps) {
  const { id } = await params

  // Find the idol by ID
  const idol = sampleIdols.find((i) => i.id === id)

  if (!idol) {
    notFound()
  }

  // Filter posts for this specific idol
  const idolPosts = samplePosts.filter((post) => post.idol.id === idol.id)

  // Calculate stats
  const totalPosts = idolPosts.length
  const totalLikes = idolPosts.reduce((sum, post) => sum + post.likes, 0)
  const totalComments = idolPosts.reduce((sum, post) => sum + post.comments, 0)
  const totalReposts = idolPosts.reduce((sum, post) => sum + post.reposts, 0)

  const stannedIdols = sampleIdols.filter((idol) => idol.isStanned)

  // Sample recent activity data
  const recentActivity = [
    { type: "milestone", content: `Reached ${idol.followers.toLocaleString()} stans!`, timestamp: "2d" },
    { type: "trending", content: "Trending in Music category", timestamp: "3d" },
    { type: "popular", content: "Most discussed idol this week", timestamp: "5d" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <FloatingNavButton />
      <Header />

      <div className="container mx-auto flex">
        <StannedIdolsSidebar stannedIdols={stannedIdols} />

        <main className="flex-1 max-w-4xl">
          <IdolProfileHeader idol={idol} />

          <div className="border-x">
            <Tabs defaultValue="posts" className="w-full">
              <div className="sticky top-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  <TabsTrigger
                    value="posts"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary"
                  >
                    Posts ({totalPosts})
                  </TabsTrigger>
                  <TabsTrigger
                    value="stats"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary"
                  >
                    Stats
                  </TabsTrigger>
                  <TabsTrigger
                    value="activity"
                    className="rounded-none border-b-2 border-transparent px-6 py-3 data-[state=active]:border-primary"
                  >
                    Activity
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="posts" className="mt-0">
                <div className="divide-y">
                  {idolPosts.length > 0 ? (
                    idolPosts.map((post) => <Post key={post.id} {...post} />)
                  ) : (
                    <div className="p-8 text-center">
                      <h3 className="font-semibold text-lg mb-2">No posts yet</h3>
                      <p className="text-muted-foreground">Be the first to post about {idol.name}!</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="stats" className="mt-0 p-6">
                <IdolStats
                  idol={idol}
                  stats={{
                    totalPosts,
                    totalLikes,
                    totalComments,
                    totalReposts,
                    avgLikesPerPost: totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0,
                    avgCommentsPerPost: totalPosts > 0 ? Math.round(totalComments / totalPosts) : 0,
                  }}
                />
              </TabsContent>

              <TabsContent value="activity" className="mt-0 p-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm">{activity.content}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.timestamp} ago</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <aside className="w-80 p-4 space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-primary">{totalPosts}</p>
                <p className="text-xs text-muted-foreground">Posts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{idol.followers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Stans</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{totalLikes.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Likes</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{totalComments}</p>
                <p className="text-xs text-muted-foreground">Comments</p>
              </div>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-bold text-lg mb-3">Similar Idols</h3>
            <div className="space-y-3">
              {sampleIdols
                .filter((i) => i.id !== idol.id && i.category === idol.category)
                .slice(0, 3)
                .map((similarIdol) => (
                  <div key={similarIdol.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                        {similarIdol.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{similarIdol.name}</p>
                        <p className="text-muted-foreground text-xs">{similarIdol.category}</p>
                      </div>
                    </div>
                    <button className="text-primary text-sm hover:underline">View</button>
                  </div>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
