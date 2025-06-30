"use client"

import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
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
    slug: "taylor-swift",
    image: "/placeholder.svg?height=120&width=120&text=TS",
    category: "Music",
    stans: 1200000,
    isStanned: true,
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
  },
  {
    id: "2",
    name: "BTS",
    slug: "bts",
    image: "/placeholder.svg?height=120&width=120&text=BTS",
    category: "K-Pop",
    stans: 2500000,
    isStanned: true,
    videoUrl: "https://7vfknjtmqkepip1x.public.blob.vercel-storage.com/bts.mp4",
  },
  {
    id: "3",
    name: "Zendaya",
    slug: "zendaya",
    image: "/placeholder.svg?height=120&width=120&text=Z",
    category: "Acting",
    stans: 980000,
    isStanned: false,
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
  },
  {
    id: "4",
    name: "Blackpink",
    slug: "blackpink",
    image: "/placeholder.svg?height=120&width=120&text=BP",
    category: "K-Pop",
    stans: 1800000,
    isStanned: false,
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
  },
  {
    id: "5",
    name: "Tom Holland",
    slug: "tom-holland",
    image: "/placeholder.svg?height=120&width=120&text=TH",
    category: "Acting",
    stans: 850000,
    isStanned: false,
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
  },
  {
    id: "6",
    name: "Ariana Grande",
    slug: "ariana-grande",
    image: "/placeholder.svg?height=120&width=120&text=AG",
    category: "Music",
    stans: 1500000,
    isStanned: true,
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
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
  // ... other posts remain the same
]

interface IdolPageProps {
  params: Promise<{ name: string }>
}

function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default async function IdolPage({ params }: IdolPageProps) {
  const { name } = await params
  
  // DEBUG: Add console logs
  console.log('IdolPage rendering with name:', name)
  
  const [showSplash, setShowSplash] = useState(true)
  const [videoEnded, setVideoEnded] = useState(false)
  const [crackAnimation, setCrackAnimation] = useState(false)
  const [videoError, setVideoError] = useState(false)

  // Find the idol by slug
  const idol = sampleIdols.find((i) => i.slug === name || nameToSlug(i.name) === name)
  
  console.log('Found idol:', idol)

  if (!idol) {
    console.log('Idol not found, calling notFound()')
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

  const recentActivity = [
    { type: "milestone", content: `Reached ${idol.stans.toLocaleString()} stans!`, timestamp: "2d" },
    { type: "trending", content: "Trending in Music category", timestamp: "3d" },
    { type: "popular", content: "Most discussed idol this week", timestamp: "5d" },
  ]

  useEffect(() => {
    console.log('Splash screen useEffect running')
    
    // REDUCED timeout to 3 seconds for debugging
    const timer = setTimeout(() => {
      console.log('Timer fired - hiding splash screen')
      if (!videoEnded) {
        setCrackAnimation(true)
        setTimeout(() => {
          console.log('Setting showSplash to false')
          setShowSplash(false)
        }, 500) // Reduced animation time
      }
    }, 3000) // Reduced from 10 seconds

    return () => {
      console.log('Cleaning up timer')
      clearTimeout(timer)
    }
  }, [videoEnded])

  const handleVideoEnd = () => {
    console.log('Video ended')
    setVideoEnded(true)
    setCrackAnimation(true)
    setTimeout(() => setShowSplash(false), 500)
  }

  const handleSkip = () => {
    console.log('Skip button clicked')
    setCrackAnimation(true)
    setTimeout(() => setShowSplash(false), 500)
  }

  const handleVideoError = (e: any) => {
    console.log("Video failed to load:", e)
    setVideoError(true)
    // Immediately hide splash on video error
    setShowSplash(false)
  }

  // TEMPORARY: Skip splash screen entirely for debugging
  // Remove this after testing
  useEffect(() => {
    const skipSplash = setTimeout(() => {
      console.log('Force skipping splash screen for debugging')
      setShowSplash(false)
    }, 1000)
    
    return () => clearTimeout(skipSplash)
  }, [])

  console.log('Render state:', { showSplash, videoEnded, crackAnimation, videoError })

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className={`relative w-full h-full overflow-hidden ${crackAnimation ? 'animate-crack-open' : ''}`}>
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            onEnded={handleVideoEnd}
            onError={handleVideoError}
            onLoadStart={() => console.log("Video loading started")}
            onCanPlay={() => console.log("Video can play")}
          >
            <source src={idol.videoUrl} type="video/mp4" />
          </video>

          {/* Fallback content for when video fails */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-6xl font-bold mb-4 animate-pulse">{idol.name}</h1>
              <p className="text-xl opacity-75">Loading amazing content...</p>
              <button 
                onClick={handleSkip}
                className="mt-4 bg-white bg-opacity-20 text-white px-6 py-2 rounded-full hover:bg-opacity-30 transition-all duration-300"
              >
                Continue to Page
              </button>
            </div>
          </div>

          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full hover:bg-opacity-70 transition-all duration-300 text-sm z-10"
          >
            Skip
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background animate-fade-in">
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
                <p className="text-2xl font-bold text-primary">{idol.stans.toLocaleString()}</p>
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