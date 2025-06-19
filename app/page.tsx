"use client"

import { AvatarFallback } from "@/components/ui/avatar"
import { AvatarImage } from "@/components/ui/avatar"
import { Avatar } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Post } from "@/components/post"
import { IdolCard } from "@/components/idol-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FloatingNavButton } from "@/components/floating-nav-button"
import { getSupabaseBrowser } from "@/lib/supabase"
import type { Idol, Post as PostType, DiscoverPost } from "@/types"

// Convert DiscoverPost to PostType for compatibility
const convertDiscoverPostToPost = (discoverPost: DiscoverPost): PostType => ({
  id: discoverPost.id,
  content: discoverPost.content || discoverPost.title || discoverPost.pollQuestion || "",
  image: discoverPost.image,
  timestamp: discoverPost.timestamp,
  likes: discoverPost.likes,
  comments: discoverPost.comments,
  reposts: discoverPost.reposts,
  liked: discoverPost.liked,
  user: discoverPost.user,
  idol: discoverPost.idol,
})

// Helper function to get relative time
function getRelativeTimeString(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  return `${Math.floor(diffInSeconds / 86400)}d`
}

// Optimized function to batch convert database posts
const mapDatabasePostsToPosts = async (posts: any[], usersMap: Map<string, any>, idolsMap: Map<string, any>): Promise<PostType[]> => {
  return posts.map(post => {
    const userData = usersMap.get(post.user_id)
    const idolData = idolsMap.get(post.idol_id)

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

    const timestamp = getRelativeTimeString(new Date(post.created_at))

    return {
      id: post.id,
      content: post.content || post.title || post.poll_question || "",
      image: post.image || undefined,
      timestamp,
      likes: post.likes,
      comments: post.comments,
      reposts: post.reposts,
      user,
      idol,
    }
  })
}

export default function Home() {
  const [stannedIdols, setStannedIdols] = useState<Idol[]>([])
  const [feedPosts, setFeedPosts] = useState<PostType[]>([])
  const [discoverIdols, setDiscoverIdols] = useState<Idol[]>([])
  const [trendingPosts, setTrendingPosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // For now, we'll use a mock user ID. In a real app, this would come from authentication
  const currentUserId = "00000000-0000-0000-0000-000000000001" // Replace with actual user ID from auth

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = getSupabaseBrowser()

        // Fetch user's stanned idol IDs from the array column
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("stanned_idol_ids")
          .eq("id", currentUserId)
          .single()

        if (userError) {
          console.error("Error fetching user data:", userError)
          setError("Failed to fetch user data")
          return
        }

        const stannedIdolIds = userData?.stanned_idol_ids || []

        // Fetch all idols
        const { data: allIdols, error: idolsError } = await supabase
          .from("idols")
          .select("*")
          .order("stans", { ascending: false })

        if (idolsError) {
          console.error("Error fetching idols:", idolsError)
          setError("Failed to fetch idols")
          return
        }

        const stannedIdolIdSet = new Set(stannedIdolIds)
        
        // Separate stanned and discover idols
        const stannedIdolsList: Idol[] = []
        const discoverIdolsList: Idol[] = []

        allIdols?.forEach(idol => {
          const isStanned = stannedIdolIdSet.has(idol.id)
          const idolData: Idol = {
            id: idol.id,
            name: idol.name,
            image: idol.image,
            category: idol.category,
            stans: idol.stans,
            isStanned
          }

          if (isStanned) {
            stannedIdolsList.push(idolData)
          } else {
            discoverIdolsList.push(idolData)
          }
        })

        setStannedIdols(stannedIdolsList)
        setDiscoverIdols(discoverIdolsList)

        // Fetch posts from stanned idols and trending posts in parallel
        const [feedPostsResponse, trendingPostsResponse] = await Promise.all([
          // Feed posts - only if user has stanned idols
          stannedIdolIds.length > 0 
            ? supabase
                .from("posts")
                .select(`
                  *,
                  users!posts_user_id_fkey(id, name, username, avatar),
                  idols!posts_idol_id_fkey(id, name, image, category, stans)
                `)
                .in("idol_id", stannedIdolIds)
                .order("created_at", { ascending: false })
                .limit(20)
            : Promise.resolve({ data: [], error: null }),
          
          // Trending posts
          supabase
            .from("posts")
            .select(`
              *,
              users!posts_user_id_fkey(id, name, username, avatar),
              idols!posts_idol_id_fkey(id, name, image, category, stans)
            `)
            .order("trending_score", { ascending: false })
            .limit(10)
        ])

        // Handle feed posts
        if (feedPostsResponse.error) {
          console.error("Error fetching feed posts:", feedPostsResponse.error)
          setError("Failed to fetch feed posts")
          return
        }

        // Handle trending posts
        if (trendingPostsResponse.error) {
          console.error("Error fetching trending posts:", trendingPostsResponse.error)
        }

        // Convert posts with embedded user and idol data
        const convertFeedPosts = (posts: any[]) => {
          return posts.map(post => ({
            id: post.id,
            content: post.content || post.title || post.poll_question || "",
            image: post.image || undefined,
            timestamp: getRelativeTimeString(new Date(post.created_at)),
            likes: post.likes,
            comments: post.comments,
            reposts: post.reposts,
            user: {
              name: post.users?.name || "Unknown User",
              username: post.users?.username || "unknown",
              avatar: post.users?.avatar || "",
            },
            idol: {
              id: post.idols?.id || "",
              name: post.idols?.name || "Unknown Idol",
              image: post.idols?.image || "",
              category: post.idols?.category || "",
              stans: post.idols?.stans || 0,
            },
          }))
        }

        setFeedPosts(convertFeedPosts(feedPostsResponse.data || []))
        setTrendingPosts(convertFeedPosts(trendingPostsResponse.data || []))

      } catch (err) {
        console.error("Error in fetchData:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUserId])

  // Function to handle stanning/unstanning idols
  const handleStanToggle = async (idolId: string, isCurrentlyStanned: boolean) => {
    try {
      const supabase = getSupabaseBrowser()
      
      if (isCurrentlyStanned) {
        // Unstan the idol
        const { error } = await supabase.rpc('unstan_idol', {
          user_uuid: currentUserId,
          idol_uuid: idolId
        })
        
        if (error) {
          console.error("Error unstanning idol:", error)
          return
        }
        
        // Update local state
        setStannedIdols(prev => prev.filter(idol => idol.id !== idolId))
        setDiscoverIdols(prev => [...prev, { 
          ...stannedIdols.find(idol => idol.id === idolId)!, 
          isStanned: false,
          stans: stannedIdols.find(idol => idol.id === idolId)!.stans - 1
        }])
        
      } else {
        // Stan the idol
        const { error } = await supabase.rpc('stan_idol', {
          user_uuid: currentUserId,
          idol_uuid: idolId
        })
        
        if (error) {
          console.error("Error stanning idol:", error)
          return
        }
        
        // Update local state
        const idolToStan = discoverIdols.find(idol => idol.id === idolId)!
        setDiscoverIdols(prev => prev.filter(idol => idol.id !== idolId))
        setStannedIdols(prev => [...prev, { 
          ...idolToStan, 
          isStanned: true,
          stans: idolToStan.stans + 1
        }])
      }
      
    } catch (error) {
      console.error("Error toggling stan status:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fec400] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your feed...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-[#fec400] text-black rounded-lg hover:bg-[#fec400]/80"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

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
                        <IdolCard 
                          key={idol.id} 
                          idol={idol} 
                          onStanToggle={handleStanToggle}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Trending Content</h3>
                    <div className="divide-y divide-[#fec400]/10">
                      {trendingPosts.slice(0, 3).map((post) => (
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
                  <IdolCard 
                    key={idol.id} 
                    idol={idol} 
                    onStanToggle={handleStanToggle}
                  />
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
              {trendingPosts.slice(0, 3).map((post, index) => (
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
              {stannedIdols.slice(0, 4).map((idol, index) => (
                <div
                  key={index}
                  className="cursor-pointer hover:bg-background rounded p-2 -m-2 border border-transparent hover:border-[#fec400]/20"
                >
                  <p className="font-medium">#{idol.name.replace(/\s+/g, '')}</p>
                  <p className="text-muted-foreground text-xs">{idol.stans.toLocaleString()} stans</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}