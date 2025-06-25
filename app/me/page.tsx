"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Edit3, Settings, Camera, Heart, MessageCircle, Repeat2, Share, Grid3X3, Bookmark, Star, Play, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { getSupabaseBrowser } from '@/lib/supabase'

// Mock posts data (you can replace this with actual user posts from your database)
const mockPosts = [
  {
    id: "1",
    type: "text",
    content: "Just watched Taylor's new music video and I'm OBSESSED! The cinematography is incredible 🎬✨ #TaylorSwift",
    timestamp: "2h",
    likes: 245,
    comments: 18,
    reposts: 32,
    image: "/placeholder.svg?height=300&width=500&text=Post+Image"
  },
  {
    id: "2",
    type: "text",
    content: "BTS really changed my life. Their message of self-love and acceptance means everything to me 💜 #BTS #ARMY",
    timestamp: "1d",
    likes: 189,
    comments: 24,
    reposts: 15,
  },
  {
    id: "3",
    type: "text",
    content: "Zendaya's fashion choices are always impeccable. She's truly an icon 👑",
    timestamp: "3d",
    likes: 156,
    comments: 12,
    reposts: 8,
  }
]

const mockMediaPosts = [
  { id: "1", type: "image", image: "/placeholder.svg?height=200&width=200&text=Media+1" },
  { id: "2", type: "video", image: "/placeholder.svg?height=200&width=200&text=Video+1" },
  { id: "3", type: "image", image: "/placeholder.svg?height=200&width=200&text=Media+2" },
  { id: "4", type: "image", image: "/placeholder.svg?height=200&width=200&text=Media+3" },
  { id: "5", type: "video", image: "/placeholder.svg?height=200&width=200&text=Video+2" },
  { id: "6", type: "image", image: "/placeholder.svg?height=200&width=200&text=Media+4" }
]

const mockCollections = [
  { id: "1", name: "Taylor Swift Era", postCount: 127, cover: "/placeholder.svg?height=150&width=150&text=TS" },
  { id: "2", name: "BTS Moments", postCount: 89, cover: "/placeholder.svg?height=150&width=150&text=BTS" },
  { id: "3", name: "Red Carpet Looks", postCount: 45, cover: "/placeholder.svg?height=150&width=150&text=RC" },
  { id: "4", name: "Concert Memories", postCount: 67, cover: "/placeholder.svg?height=150&width=150&text=CM" }
]

const mockFavorites = [
  { id: "1", idol: "Taylor Swift", question: "Favorite Song", answer: "All Too Well (10 Minute Version)" },
  { id: "2", idol: "BTS", question: "Bias", answer: "Jungkook" },
  { id: "3", idol: "Zendaya", question: "Favorite Role", answer: "MJ in Spider-Man" },
  { id: "4", idol: "Ariana Grande", question: "Era", answer: "Positions" }
]

function ProfileContent() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("posts")
  const [isContentExpanded, setIsContentExpanded] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const contentRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)
  const supabase = getSupabaseBrowser()

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching user profile:', error)
        } else {
          setUserProfile(data)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setLoadingProfile(false)
      }
    }

    fetchUserProfile()
  }, [user, supabase])

  useEffect(() => {
    const handleScroll = () => {
      if (contentRef.current) {
        const rect = contentRef.current.getBoundingClientRect()
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight * 0.3)))
        setScrollY(scrollProgress)
        setIsContentExpanded(scrollProgress > 0.5)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const goBack = () => {
    window.history.back()
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Show loading state while fetching profile
  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#fec400]" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Use profile data or fallback to user metadata
  const displayName = userProfile?.name || user?.user_metadata?.name || 'User'
  const displayUsername = userProfile?.username || user?.user_metadata?.username || user?.email?.split('@')[0]
  const displayBio = userProfile?.bio || "Welcome to my profile! 🌟"
  const displayAvatar = userProfile?.avatar || user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUsername}`

  // Mock stats (you can replace with actual data from your database)
  const stats = {
    posts: userProfile?.posts_count || 0,
    friends: userProfile?.friends_count || 0,
    stanned: userProfile?.stanned_count || 0
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack}
            className="rounded-full hover:bg-muted/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-muted/50"
            >
              <Edit3 className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-muted/50"
              onClick={handleSignOut}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section 1: Profile Info (60% of screen) */}
      <div className="relative h-[60vh] flex flex-col items-center justify-center px-6 bg-gradient-to-b from-background via-background to-background/95">
        {/* Profile Avatar */}
        <div className="relative mb-6">
          <Avatar className="h-32 w-32 ring-4 ring-[#fec400]/20 shadow-2xl">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback className="text-3xl bg-gradient-to-br from-[#fec400]/20 to-[#fec400]/10 font-bold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button 
            variant="secondary" 
            size="icon" 
            className="absolute -bottom-2 -right-2 rounded-full h-10 w-10 bg-[#fec400] hover:bg-[#fec400]/90 text-black shadow-lg"
          >
            <Camera className="h-5 w-5" />
          </Button>
        </div>

        {/* Name */}
        <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">
          {displayName}
        </h1>

        {/* Username */}
        <p className="text-sm font-light text-muted-foreground mb-6">
          @{displayUsername}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-12 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground tracking-tight">
              {stats.posts.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-light">
              posts
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground tracking-tight">
              {stats.friends.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground font-light">
              friends
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#fec400] tracking-tight">
              {stats.stanned}
            </div>
            <div className="text-sm text-muted-foreground font-light">
              stanned
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-center text-foreground/90 leading-relaxed max-w-md px-4 font-normal">
          {displayBio}
        </p>

        {/* User Info for Development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-muted/50 rounded-lg text-xs text-muted-foreground">
            <p>User ID: {user?.id}</p>
            <p>Email: {user?.email}</p>
          </div>
        )}
      </div>

      {/* Section 2: Content Gallery (20% preview, expandable) */}
      <div 
        ref={contentRef}
        className="relative bg-background border-t border-border/50"
        style={{
          transform: `translateY(${Math.max(0, (1 - scrollY) * 20)}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* Preview hint when not expanded */}
        {!isContentExpanded && (
          <div className="h-20 overflow-hidden">
            <div className="p-6 opacity-60">
              <div className="grid grid-cols-3 gap-2">
                {mockMediaPosts.slice(0, 3).map((post, index) => (
                  <div key={post.id} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Full content tabs */}
        <div className={`transition-all duration-300 ${isContentExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-[73px] z-40 bg-background/95 backdrop-blur-md border-b border-border/30">
              <TabsList className="grid w-full grid-cols-4 bg-transparent rounded-none h-auto p-0">
                <TabsTrigger 
                  value="posts" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent data-[state=active]:text-[#fec400] py-4 font-medium transition-all hover:bg-muted/30"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger 
                  value="media" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent data-[state=active]:text-[#fec400] py-4 font-medium transition-all hover:bg-muted/30"
                >
                  Media
                </TabsTrigger>
                <TabsTrigger 
                  value="collections" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent data-[state=active]:text-[#fec400] py-4 font-medium transition-all hover:bg-muted/30"
                >
                  Collections
                </TabsTrigger>
                <TabsTrigger 
                  value="favorites" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent data-[state=active]:text-[#fec400] py-4 font-medium transition-all hover:bg-muted/30"
                >
                  Favorites
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="posts" className="mt-0 min-h-screen">
              <div className="space-y-0">
                {mockPosts.map((post) => (
                  <div key={post.id} className="border-b border-border/30 p-6 hover:bg-muted/20 transition-colors">
                    <div className="space-y-4">
                      <p className="text-foreground leading-relaxed">{post.content}</p>
                      {post.image && (
                        <div className="rounded-xl overflow-hidden">
                          <img 
                            src={post.image} 
                            alt="Post content"
                            className="w-full max-h-96 object-cover"
                          />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="text-sm">{post.timestamp}</span>
                        <div className="flex items-center gap-6">
                          <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                            <span className="text-sm">{post.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-[#fec400] transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{post.comments}</span>
                          </button>
                          <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                            <Repeat2 className="h-4 w-4" />
                            <span className="text-sm">{post.reposts}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="media" className="mt-0 min-h-screen">
              <div className="p-6">
                <div className="grid grid-cols-3 gap-2">
                  {mockMediaPosts.map((post) => (
                    <div key={post.id} className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
                      <img 
                        src={post.image} 
                        alt="Media content"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {post.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-2">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="collections" className="mt-0 min-h-screen">
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {mockCollections.map((collection) => (
                    <Card key={collection.id} className="border border-border/50 hover:border-[#fec400]/40 transition-all duration-200 hover:shadow-lg group">
                      <CardContent className="p-4">
                        <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 relative">
                          <img 
                            src={collection.cover} 
                            alt={collection.name}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                            <Bookmark className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{collection.name}</h3>
                        <p className="text-xs text-muted-foreground">
                          {collection.postCount} posts
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="favorites" className="mt-0 min-h-screen">
              <div className="p-6 space-y-4">
                {mockFavorites.map((favorite) => (
                  <Card key={favorite.id} className="border border-border/50 hover:border-[#fec400]/40 transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-[#fec400]/10 rounded-lg">
                          <Star className="h-5 w-5 text-[#fec400]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs bg-[#fec400]/20 text-[#fec400] border-[#fec400]/30">
                              {favorite.idol}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-sm mb-1">{favorite.question}</h3>
                          <p className="text-sm text-muted-foreground">{favorite.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function AuthenticatedProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}