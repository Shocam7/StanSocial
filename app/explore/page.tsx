import { getSupabaseServer } from "@/lib/supabase"
import { Header } from "@/components/header"
import { StannedIdolsSidebar } from "@/components/stanned-idols-sidebar"
import { ExploreGrid } from "@/components/explore/explore-grid"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Filter } from "lucide-react"
import type { Idol, ExplorePost } from "@/types"

// Function to get relative time
function getRelativeTimeString(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return `${diffInSeconds}s`
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
  return `${Math.floor(diffInSeconds / 86400)}d`
}

export default async function ExplorePage() {
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
      followers: idol.followers,
      isStanned: stannedIdolIds.includes(idol.id),
    })) || []

  const stannedIdols = idols.filter((idol) => idol.isStanned)

  // Fetch posts with related data
  const { data: postsData } = await supabase.from("posts").select("*").order("trending_score", { ascending: false })

  // Transform posts data
  const explorePosts: ExplorePost[] = await Promise.all(
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
            followers: idolData.followers,
            isStanned: stannedIdolIds.includes(idolData.id),
          }
        : { id: "", name: "Unknown Idol", image: "", category: "", followers: 0, isStanned: false }

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
      <Header stannedIdols={stannedIdols} />

      <div className="container mx-auto flex flex-col md:flex-row">
        {/* Sidebar - hidden on mobile, shown in sheet via header */}
        <div className="hidden md:block">
          <StannedIdolsSidebar stannedIdols={stannedIdols} />
        </div>

        <main className="flex-1 max-w-full md:max-w-6xl border-x">
          <div className="sticky top-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">Explore</h1>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Tabs defaultValue="trending">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="trending">Trending</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="videos">Videos</TabsTrigger>
                <TabsTrigger value="polls">Polls</TabsTrigger>
                <TabsTrigger value="discussions">Discussions</TabsTrigger>
              </TabsList>
              <TabsContent value="trending" className="mt-0">
                <ExploreGrid posts={explorePosts} />
              </TabsContent>
              <TabsContent value="images" className="mt-0">
                <ExploreGrid posts={explorePosts.filter((post) => post.type === "image")} />
              </TabsContent>
              <TabsContent value="videos" className="mt-0">
                <ExploreGrid posts={explorePosts.filter((post) => post.type === "video")} />
              </TabsContent>
              <TabsContent value="polls" className="mt-0">
                <ExploreGrid posts={explorePosts.filter((post) => post.type === "poll")} />
              </TabsContent>
              <TabsContent value="discussions" className="mt-0">
                <ExploreGrid posts={explorePosts.filter((post) => post.type === "discussion")} />
              </TabsContent>
            </Tabs>
          </div>

          <div className="p-4">
            <p className="text-muted-foreground mb-6">Discover trending content about your favorite idols</p>
          </div>
        </main>
      </div>
    </div>
  )
}
