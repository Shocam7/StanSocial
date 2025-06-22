import { getSupabaseServer } from "@/lib/supabase"
import { Header } from "@/components/header"
import { DiscoverGrid } from "@/components/discover/discover-grid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Sparkles, TrendingUp, Image, Video, BarChart3, MessageCircle } from "lucide-react"
import { FloatingNavButton } from "@/components/floating-nav-button"
import type { Idol, DiscoverPost } from "@/types"

// Function to get relative time
function getRelativeTimeString(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  return `${Math.floor(diffInSeconds / 86400)}d`
}

export default async function DiscoverPage() {
  const supabase = getSupabaseServer()

  // Fetch stanned idols (in a real app, this would be for the current user)
  const { data: stannedIdolsData } = await supabase
    .from("user_stanned_idols")
    .select("idol_id")
    .eq("user_id", "00000000-0000-0000-0000-000000000001")

  const stannedIdolIds = stannedIdolsData?.map((item) => item.idol_id) || []

  // Fetch all idols
  const { data: idolsData } = await supabase.from("idols").select("*")

  const idols: Idol[] =
    idolsData?.map((idol) => ({
      id: idol.id,
      name: idol.name,
      image: idol.image,
      category: idol.category,
      stans: idol.stans,
      isStanned: stannedIdolIds.includes(idol.id),
    })) || []

  const stannedIdols = idols.filter((idol) => idol.isStanned)

  // Fetch ALL posts (trending on platform regardless of stanned status)
  const { data: postsData } = await supabase.from("posts").select("*").order("trending_score", { ascending: false })

  // Transform posts data
  const discoverPosts: DiscoverPost[] = await Promise.all(
    (postsData || []).map(async (post) => {
      // Fetch user data
      const { data: userData } = await supabase.from("users").select("*").eq("id", post.user_id).single()

      // Fetch idol data
      const { data: idolData } = await supabase.from("idols").select("*").eq("id", post.idol_id).single()

      // For poll posts, fetch options
      let pollOptions = undefined
      let totalVotes = undefined

      if (post.type === "poll") {
        const { data: options } = await supabase.from("poll_options").select("*").eq("post_id", post.id)

        if (options) {
          pollOptions = options.map((option) => ({
            id: option.id,
            text: option.text,
            votes: option.votes,
          }))

          totalVotes = options.reduce((sum, option) => sum + option.votes, 0)
        }
      }

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
            isStanned: stannedIdolIds.includes(idolData.id),
          }
        : { id: "", name: "Unknown Idol", image: "", category: "", stans: 0, isStanned: false }

      return {
        id: post.id,
        type: post.type,
        trendingScore: post.trending_score,
        user,
        idol,
        timestamp: getRelativeTimeString(new Date(post.created_at)),
        likes: post.likes,
        comments: post.comments,
        reposts: post.reposts,
        content: post.content || undefined,
        image: post.image || undefined,
        video: post.video || undefined,
        title: post.title || undefined,
        pollQuestion: post.poll_question || undefined,
        pollOptions,
        totalVotes,
      }
    }),
  )

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <FloatingNavButton />
      <Header stannedIdols={stannedIdols} />

      <div className="container mx-auto max-w-6xl px-4">
        {/* Search Header Section */}
        <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-6 border-b border-[#fec400]/20">
          <div className="flex flex-col space-y-4">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#fec400] to-orange-400 bg-clip-text text-transparent">
                Discover
              </h1>
              <p className="text-muted-foreground mt-1">Trending content from across the platform</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md mx-auto w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts, idols, users..."
                className="pl-10 pr-4 py-2 rounded-full border-[#fec400]/30 focus:border-[#fec400] focus:ring-[#fec400]/20"
              />
            </div>

            {/* Icon-based Tabs */}
            <Tabs defaultValue="vibe" className="w-full">
              <TabsList className="grid grid-cols-6 w-full max-w-lg mx-auto bg-muted/50 p-1 rounded-full">
                <TabsTrigger 
                  value="vibe" 
                  className="rounded-full data-[state=active]:bg-[#fec400] data-[state=active]:text-black"
                  title="Vibe"
                >
                  <Sparkles className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className="rounded-full data-[state=active]:bg-[#fec400] data-[state=active]:text-black"
                  title="Trending"
                >
                  <TrendingUp className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger 
                  value="images" 
                  className="rounded-full data-[state=active]:bg-[#fec400] data-[state=active]:text-black"
                  title="Images"
                >
                  <Image className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger 
                  value="videos" 
                  className="rounded-full data-[state=active]:bg-[#fec400] data-[state=active]:text-black"
                  title="Videos"
                >
                  <Video className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger 
                  value="polls" 
                  className="rounded-full data-[state=active]:bg-[#fec400] data-[state=active]:text-black"
                  title="Polls"
                >
                  <BarChart3 className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger 
                  value="discussions" 
                  className="rounded-full data-[state=active]:bg-[#fec400] data-[state=active]:text-black"
                  title="Discussions"
                >
                  <MessageCircle className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>

              {/* Tab Content with Instagram-like Grid */}
              <div className="mt-8">
                <TabsContent value="vibe" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <DiscoverGrid posts={discoverPosts} />
                  </div>
                </TabsContent>
                
                <TabsContent value="trending" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <DiscoverGrid posts={discoverPosts} />
                  </div>
                </TabsContent>
                
                <TabsContent value="images" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <DiscoverGrid posts={discoverPosts.filter((post) => post.type === "image")} />
                  </div>
                </TabsContent>
                
                <TabsContent value="videos" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <DiscoverGrid posts={discoverPosts.filter((post) => post.type === "video")} />
                  </div>
                </TabsContent>
                
                <TabsContent value="polls" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <DiscoverGrid posts={discoverPosts.filter((post) => post.type === "poll")} />
                  </div>
                </TabsContent>
                
                <TabsContent value="discussions" className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <DiscoverGrid posts={discoverPosts.filter((post) => post.type === "discussion")} />
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}