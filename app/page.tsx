"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Post } from "@/components/post"
import { IdolCard } from "@/components/idol-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FloatingNavButton } from "@/components/floating-nav-button"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getSupabaseBrowser } from "@/lib/supabase"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/hooks/use-auth"
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

function HomeContent() {
  const { user } = useAuth()
  const [stannedIdols, setStannedIdols] = useState<Idol[]>([])
  const [feedPosts, setFeedPosts] = useState<PostType[]>([])
  const [discoverIdols, setDiscoverIdols] = useState<Idol[]>([])
  const [explorePosts, setExplorePosts] = useState<PostType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  // Get current user ID from auth
  const currentUserId = user?.id || ""

  // Carousel navigation
  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % Math.ceil(discoverIdols.length / 2))
  }

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + Math.ceil(discoverIdols.length / 2)) % Math.ceil(discoverIdols.length / 2))
  }

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const supabase = getSupabaseBrowser()

        // Fetch user's stanned idol IDs using the junction table
        const { data: stannedIdolsData, error: stannedError } = await supabase
          .from("user_stanned_idols")
          .select("idol_id")
          .eq("user_id", currentUserId)

        if (stannedError) {
          console.error("Error fetching stanned idols:", stannedError)
          setError("Failed to fetch stanned idols")
          return
        }

        const stannedIdolIds = stannedIdolsData?.map(item => item.idol_id) || []

        // Fetch all idols with their stan counts
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

        // Get unstanned idol IDs for explore posts
        const unstannedIdolIds = discoverIdolsList.map(idol => idol.id)

        // Fetch posts from stanned idols and explore posts in parallel
        const [feedPostsResponse, explorePostsResponse] = await Promise.all([
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
          
          // Explore posts - recent posts from unstanned idols
          unstannedIdolIds.length > 0
            ? supabase
                .from("posts")
                .select(`
                  *,
                  users!posts_user_id_fkey(id, name, username, avatar),
                  idols!posts_idol_id_fkey(id, name, image, category, stans)
                `)
                .in("idol_id", unstannedIdolIds)
                .order("created_at", { ascending: false })
                .limit(10)
            : Promise.resolve({ data: [], error: null })
        ])

        // Handle feed posts
        if (feedPostsResponse.error) {
          console.error("Error fetching feed posts:", feedPostsResponse.error)
          setError("Failed to fetch feed posts")
          return
        }

        // Handle explore posts
        if (explorePostsResponse.error) {
          console.error("Error fetching explore posts:", explorePostsResponse.error)
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
        setExplorePosts(convertFeedPosts(explorePostsResponse.data || []))

      } catch (err) {
        console.error("Error in fetchData:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentUserId, user])

  // Function to handle stanning/unstanning idols using the junction table
  const handleStanToggle = async (idolId: string, isCurrentlyStanned: boolean) => {
    if (!user) return

    try {
      const supabase = getSupabaseBrowser()
      
      if (isCurrentlyStanned) {
        // Unstan the idol - remove from junction table and decrement idol stans
        const [junctionResult, idolResult] = await Promise.all([
          supabase
            .from("user_stanned_idols")
            .delete()
            .eq("user_id", currentUserId)
            .eq("idol_id", idolId),
          supabase
            .from("idols")
            .update({ stans: Math.max(0, stannedIdols.find(idol => idol.id === idolId)!.stans - 1) })
            .eq("id", idolId)
        ])
        
        if (junctionResult.error) {
          console.error("Error unstanning idol:", junctionResult.error)
          return
        }
        
        if (idolResult.error) {
          console.error("Error updating idol stans:", idolResult.error)
          return
        }
        
        // Update local state
        const unstannedIdol = stannedIdols.find(idol => idol.id === idolId)!
        setStannedIdols(prev => prev.filter(idol => idol.id !== idolId))
        setDiscoverIdols(prev => [...prev, { 
          ...unstannedIdol, 
          isStanned: false,
          stans: Math.max(0, unstannedIdol.stans - 1)
        }])
        
      } else {
        // Stan the idol - add to junction table and increment idol stans
        const idolToStan = discoverIdols.find(idol => idol.id === idolId)!
        
        const [junctionResult, idolResult] = await Promise.all([
          supabase
            .from("user_stanned_idols")
            .insert({
              user_id: currentUserId,
              idol_id: idolId
            }),
          supabase
            .from("idols")
            .update({ stans: idolToStan.stans + 1 })
            .eq("id", idolId)
        ])
        
        if (junctionResult.error) {
          console.error("Error stanning idol:", junctionResult.error)
          return
        }
        
        if (idolResult.error) {
          console.error("Error updating idol stans:", idolResult.error)
          return
        }
        
        // Update local state
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
                  feedPosts.map((post) => (
                    <Post 
                      key={post.id} 
                      {...post} 
                      currentUserId={currentUserId} 
                    />
                  ))
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
                
                <div className="space-y-6">
                  {/* Recommended Idols Carousel */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Recommended Idols</h3>
                    {discoverIdols.length > 0 ? (
                      <div className="relative">
                        <div className="overflow-hidden">
                          <div 
                            className="flex transition-transform duration-300 ease-in-out"
                            style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
                          >
                            {Array.from({ length: Math.ceil(discoverIdols.length / 2) }, (_, slideIndex) => (
                              <div key={slideIndex} className="w-full flex-shrink-0">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-1">
                                  {discoverIdols.slice(slideIndex * 2, (slideIndex * 2) + 2).map((idol) => (
                                    <div key={idol.id} className="transform scale-90 origin-center">
                                      <IdolCard 
                                        idol={idol} 
                                        onStanToggle={handleStanToggle}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Navigation buttons */}
                        {discoverIdols.length > 2 && (
                          <>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/80 backdrop-blur border-[#fec400]/40"
                              onClick={prevSlide}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/80 backdrop-blur border-[#fec400]/40"
                              onClick={nextSlide}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        
                        {/* Dots indicator */}
                        {discoverIdols.length > 2 && (
                          <div className="flex justify-center mt-4 space-x-2">
                            {Array.from({ length: Math.ceil(discoverIdols.length / 2) }, (_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === carouselIndex ? 'bg-[#fec400]' : 'bg-muted-foreground/30'
                                }`}
                                onClick={() => setCarouselIndex(index)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">No new idols to discover right now</p>
                    )}
                  </div>

                  {/* Explore Content */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Explore Content</h3>
                    <div className="divide-y divide-[#fec400]/10">
                      {explorePosts.length > 0 ? (
                        explorePosts.slice(0, 5).map((post) => (
                          <Post 
                            key={post.id} 
                            {...post} 
                            currentUserId={currentUserId} 
                          />
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <p className="text-muted-foreground">No explore content available</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Right sidebar - hidden on mobile */}
        <aside className="hidden lg:block w-80 p-4 space-y-4">
          <div className="bg-muted rounded-lg p-4 border border-[#fec400]/20">
            <h3 className="font-bold text-lg mb-3">Popular Posts</h3>
            <div className="space-y-3">
              {explorePosts.slice(0, 3).map((post, index) => (
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

export default function Home() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  )
}