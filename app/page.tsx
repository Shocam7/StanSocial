"use client"

import { AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import { useState } from "react"
import { Header } from "@/components/header"
import { Post } from "@/components/post"
import { IdolCard } from "@/components/idol-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FloatingNavButton } from "@/components/floating-nav-button"
import type { Idol, Post as PostType } from "@/types"

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
    name: "Blackpink",
    image: "/placeholder.svg?height=48&width=48&text=BP",
    category: "K-Pop",
    followers: 1800000,
    isStanned: false,
  },
  {
    id: "5",
    name: "Tom Holland",
    image: "/placeholder.svg?height=48&width=48&text=TH",
    category: "Acting",
    followers: 850000,
    isStanned: false,
  },
  {
    id: "6",
    name: "Ariana Grande",
    image: "/placeholder.svg?height=48&width=48&text=AG",
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
    user: {
      name: "Sarah Johnson",
      username: "sarahj_fan",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    idol: sampleIdols[0], // Taylor Swift
  },
  {
    id: "2",
    content:
      "BeeTeeES just announced their world tour! Who's trying to get tickets? I'm already saving up for the VIP experience! 💜",
    image: "/placeholder.svg?height=300&width=500&text=BTS+World+Tour",
    timestamp: "4h",
    likes: 1024,
    comments: 156,
    reposts: 87,
    user: {
      name: "Alex Chen",
      username: "alexbtstan",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    idol: sampleIdols[1], // BTS
  },
  {
    id: "3",
    content:
      "Ariana's vocals in her latest album are absolutely insane. The range, the control, the emotion... she's truly one of the best vocalists of our generation.",
    timestamp: "6h",
    likes: 578,
    comments: 43,
    reposts: 29,
    user: {
      name: "Maria Rodriguez",
      username: "maria_arianator",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    idol: sampleIdols[5], // Ariana Grande
  },
  {
    id: "4",
    content:
      "Taylor's surprise acoustic set at the end of the concert last night was magical. She played 'All Too Well' (10 minute version) and I was in tears. Best night ever! ❤️",
    image: "/placeholder.svg?height=300&width=500&text=Concert+Moment",
    timestamp: "12h",
    likes: 892,
    comments: 76,
    reposts: 41,
    user: {
      name: "David Kim",
      username: "david_swiftie",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    idol: sampleIdols[0], // Taylor Swift
  },
  {
    id: "5",
    content:
      "The choreography in BTS's new music video is mind-blowing. They never disappoint with their performances. I've been trying to learn it all day!",
    timestamp: "1d",
    likes: 1456,
    comments: 203,
    reposts: 178,
    user: {
      name: "Emma Wilson",
      username: "emma_btsarmy",
      avatar: "/placeholder.svg?height=24&width=24",
    },
    idol: sampleIdols[1], // BTS
  },
]

export default function Home() {
  const [stannedIdols, setStannedIdols] = useState<Idol[]>(sampleIdols.filter((idol) => idol.isStanned))

  // Filter posts to only show those about stanned idols
  const stannedIdolIds = stannedIdols.map((idol) => idol.id)
  const feedPosts = samplePosts.filter((post) => stannedIdolIds.includes(post.idol.id))

  // Idols to discover (not currently stanned)
  const discoverIdols = sampleIdols.filter((idol) => !idol.isStanned)

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <FloatingNavButton />
      <Header stannedIdols={stannedIdols} />

      <div className="container mx-auto flex flex-col md:flex-row">
        <main className="flex-1 max-w-full md:max-w-4xl border-x border-[#fec400]/20">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="fixed top-0 left-0 z-[9998] w-full justify-end rounded-none bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-[#fec400]/40 p-0">
              <TabsTrigger
                value="feed"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#fec400]"
              >
                My Feed
              </TabsTrigger>
              <TabsTrigger
                value="new-for-you"
                className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-[#fec400]"
              >
                New For You
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="mt-0 pt-16">
              <div className="divide-y divide-[#fec400]/10">
                {feedPosts.length > 0 ? (
                  feedPosts.map((post) => <Post key={post.id} {...post} />)
                ) : (
                  <div className="p-8 text-center">
                    <h3 className="font-semibold text-lg mb-2">No posts in your feed</h3>
                    <p className="text-muted-foreground">Stan more idols to see their content in your feed</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="new-for-you" className="mt-0 pt-16">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Personalized For You</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Recommended Idols</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {discoverIdols.slice(0, 2).map((idol) => (
                        <IdolCard key={idol.id} idol={idol} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Trending Content</h3>
                    <div className="divide-y divide-[#fec400]/10">
                      {samplePosts.slice(0, 3).map((post) => (
                        <Post key={post.id} {...post} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discover" className="mt-0 p-4 pt-16">
              <h2 className="text-xl font-bold mb-4">Discover New Idols to Stan</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {discoverIdols.map((idol) => (
                  <IdolCard key={idol.id} idol={idol} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Right sidebar - hidden on mobile */}
        <aside className="hidden lg:block w-80 p-4 space-y-4">
          <div className="bg-muted rounded-lg p-4 border border-[#fec400]/20">
            <h3 className="font-bold text-lg mb-3">Popular Posts</h3>
            <div className="space-y-3">
              {samplePosts.slice(0, 3).map((post, index) => (
                <div key={index} className="border-b border-[#fec400]/10 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={post.idol.image || "/placeholder.svg"} alt={post.idol.name} />
                      <AvatarFallback>{post.idol.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{post.idol.name}</span>
                  </div>
                  <p className="text-sm line-clamp-2">{post.content}</p>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-muted-foreground">
                    <span>{post.likes} likes</span>
                    <span>•</span>
                    <span>{post.comments} comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4 border border-[#fec400]/20">
            <h3 className="font-bold text-lg mb-3">Trending Topics</h3>
            <div className="space-y-2">
              {[
                { tag: "#TaylorSwiftEra", posts: "12.5K posts" },
                { tag: "#BTSComeback", posts: "45.2K posts" },
                { tag: "#ArianaNewAlbum", posts: "8.7K posts" },
                { tag: "#KpopAwards", posts: "23.1K posts" },
              ].map((trend, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:bg-background rounded p-2 -m-2 border border-transparent hover:border-[#fec400]/20"
                >
                  <p className="font-medium">{trend.tag}</p>
                  <p className="text-muted-foreground text-xs">{trend.posts}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
