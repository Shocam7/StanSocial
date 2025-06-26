"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Edit3, Settings, Camera, Heart, MessageCircle, Repeat2, Share, Grid3X3, Bookmark, Star, Play, Loader2, Plus, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from '@/hooks/use-auth'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { getSupabaseBrowser } from '@/lib/supabase'
import { FriendsModal } from '@/components/friends-modal'
import { StannedIdolsModal } from '@/components/stanned-idols-modal'

function ProfileContent() {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState("posts")
  const [isContentExpanded, setIsContentExpanded] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [userPosts, setUserPosts] = useState([])
  const [userMedia, setUserMedia] = useState([])
  const [userCollections, setUserCollections] = useState([])
  const [userFavorites, setUserFavorites] = useState([])
  const [friends, setFriends] = useState([])
  const [stannedIdols, setStannedIdols] = useState([])
  const [showFriendsModal, setShowFriendsModal] = useState(false)
  const [showStannedModal, setShowStannedModal] = useState(false)
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

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching user posts:', error)
        } else {
          setUserPosts(data || [])
        }
      } catch (error) {
        console.error('Error fetching user posts:', error)
      }
    }

    fetchUserPosts()
  }, [user, supabase])

  // Fetch user collections
  useEffect(() => {
    const fetchUserCollections = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('collections')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching user collections:', error)
        } else {
          setUserCollections(data || [])
        }
      } catch (error) {
        console.error('Error fetching user collections:', error)
      }
    }

    fetchUserCollections()
  }, [user, supabase])

  // Fetch friends
  useEffect(() => {
    const fetchFriends = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('friendships')
          .select(`
            *,
            friend:users!friendships_friend_id_fkey(id, name, username, avatar)
          `)
          .eq('user_id', user.id)
          .eq('status', 'accepted')

        if (error) {
          console.error('Error fetching friends:', error)
        } else {
          setFriends(data || [])
        }
      } catch (error) {
        console.error('Error fetching friends:', error)
      }
    }

    fetchFriends()
  }, [user, supabase])

  // Fetch stanned idols
  useEffect(() => {
    const fetchStannedIdols = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('user_stanned_idols')
          .select(`
            *,
            idol:idols(id, name, image)
          `)
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching stanned idols:', error)
        } else {
          setStannedIdols(data || [])
        }
      } catch (error) {
        console.error('Error fetching stanned idols:', error)
      }
    }

    fetchStannedIdols()
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
  const displayBio = userProfile?.bio || null
  const displayAvatar = userProfile?.avatar || user?.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayUsername}`

  // Stats
  const stats = {
    posts: userPosts.length,
    friends: friends.length,
    stanned: stannedIdols.length
  }

  // Filter media posts from user posts
  const mediaPosts = userPosts.filter(post => post.image_url || post.video_url)

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Made thinner */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-6 py-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack}
            className="rounded-full hover:bg-muted/50 h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-muted/50 h-8 w-8"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-muted/50 h-8 w-8"
              onClick={handleSignOut}
            >
              <Settings className="h-4 w-4" />
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
        <div className="flex items-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-black text-foreground tracking-tighter leading-none">
              {stats.posts.toLocaleString()}
            </div>
            <div className="text-sm text-foreground font-black tracking-tight -mt-1">
              posts
            </div>
          </div>
          <div 
            className="text-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowFriendsModal(true)}
          >
            <div className="text-2xl font-black text-foreground tracking-tighter leading-none">
              {stats.friends.toLocaleString()}
            </div>
            <div className="text-sm text-foreground font-black tracking-tight -mt-1">
              friends
            </div>
          </div>
          <div 
            className="text-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setShowStannedModal(true)}
          >
            <div className="text-2xl font-black text-[#fec400] tracking-tighter leading-none">
              {stats.stanned}
            </div>
            <div className="text-sm text-foreground font-black tracking-tight -mt-1">
              stanned
            </div>
          </div>
        </div>

        {/* Bio */}
        {displayBio ? (
          <p className="text-center text-foreground/90 leading-relaxed max-w-md px-4 font-normal">
            {displayBio}
          </p>
        ) : (
          <div className="text-center max-w-md px-4">
            <p className="text-muted-foreground text-sm mb-2">Add your bio to tell others about yourself</p>
            <Button variant="outline" size="sm" className="text-[#fec400] border-[#fec400]/30 hover:bg-[#fec400]/10">
              <Plus className="h-4 w-4 mr-2" />
              Add Bio
            </Button>
          </div>
        )}

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
        {!isContentExpanded && mediaPosts.length > 0 && (
          <div className="h-20 overflow-hidden">
            <div className="p-6 opacity-60">
              <div className="grid grid-cols-3 gap-2">
                {mediaPosts.slice(0, 3).map((post, index) => (
                  <div key={post.id} className="aspect-square bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={post.image_url || post.video_url} 
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
            <div className="sticky top-[49px] z-40 bg-background/95 backdrop-blur-md border-b border-border/30">
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
              {userPosts.length > 0 ? (
                <div className="space-y-0">
                  {userPosts.map((post) => (
                    <div key={post.id} className="border-b border-border/30 p-6 hover:bg-muted/20 transition-colors">
                      <div className="space-y-4">
                        <p className="text-foreground leading-relaxed">{post.content}</p>
                        {post.image_url && (
                          <div className="rounded-xl overflow-hidden">
                            <img 
                              src={post.image_url} 
                              alt="Post content"
                              className="w-full max-h-96 object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="text-sm">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-6">
                            <button className="flex items-center gap-2 hover:text-red-500 transition-colors">
                              <Heart className="h-4 w-4" />
                              <span className="text-sm">{post.likes_count || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-[#fec400] transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-sm">{post.comments_count || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                              <Repeat2 className="h-4 w-4" />
                              <span className="text-sm">{post.reposts_count || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="text-center">
                    <MessageCircle className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Create a post to share your thoughts about your favorite idols
                    </p>
                    <Button className="bg-[#fec400] hover:bg-[#fec400]/90 text-black">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Post
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="media" className="mt-0 min-h-screen">
              {mediaPosts.length > 0 ? (
                <div className="p-6">
                  <div className="grid grid-cols-3 gap-2">
                    {mediaPosts.map((post) => (
                      <div key={post.id} className="aspect-square bg-muted rounded-lg overflow-hidden relative group">
                        <img 
                          src={post.image_url || post.video_url} 
                          alt="Media content"
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        {post.video_url && (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="text-center">
                    <Grid3X3 className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No media yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Share photos and videos of your favorite idols and moments
                    </p>
                    <Button className="bg-[#fec400] hover:bg-[#fec400]/90 text-black">
                      <Camera className="h-4 w-4 mr-2" />
                      Share Your First Photo
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="collections" className="mt-0 min-h-screen">
              {userCollections.length > 0 ? (
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {userCollections.map((collection) => (
                      <Card key={collection.id} className="border border-border/50 hover:border-[#fec400]/40 transition-all duration-200 hover:shadow-lg group">
                        <CardContent className="p-4">
                          <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-3 relative">
                            {collection.cover_image ? (
                              <img 
                                src={collection.cover_image} 
                                alt={collection.name}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Bookmark className="h-8 w-8 text-muted-foreground/50" />
                              </div>
                            )}
                            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                              <Bookmark className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{collection.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {collection.posts_count || 0} posts
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="text-center">
                    <Bookmark className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No collections yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Create a collection to organize your favorite posts by era, idol, or theme
                    </p>
                    <Button className="bg-[#fec400] hover:bg-[#fec400]/90 text-black">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Collection
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-0 min-h-screen">
              {userFavorites.length > 0 ? (
                <div className="p-6 space-y-4">
                  {userFavorites.map((favorite) => (
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
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6">
                  <div className="text-center">
                    <Star className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm">
                      Stan an idol to curate favorites like your bias, favorite songs, and memorable moments
                    </p>
                    <Button className="bg-[#fec400] hover:bg-[#fec400]/90 text-black">
                      <Heart className="h-4 w-4 mr-2" />
                      Stan Your First Idol
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Use the separate modal components */}
      <FriendsModal 
        open={showFriendsModal}
        onOpenChange={setShowFriendsModal}
        friends={friends}
      />

      <StannedIdolsModal 
        open={showStannedModal}
        onOpenChange={setShowStannedModal}
        stannedIdols={stannedIdols}
      />
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