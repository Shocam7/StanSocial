"use client"

import { useState } from "react"
import { Settings, Edit3, Calendar, MapPin, Link as LinkIcon, MoreHorizontal, Heart, MessageCircle, Repeat2, Share, Camera, Users, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Post } from "@/components/post"
import Link from "next/link"

// Mock user data with friends system
const userData = {
  name: "Alex Chen",
  username: "@alexchen",
  bio: "Stan culture enthusiast 🌟 | K-pop lover | Swiftie since 2006 | Spreading positivity through fandoms ✨",
  location: "Los Angeles, CA",
  website: "alexchen.com",
  joinDate: "March 2023",
  avatar: "/placeholder.svg?height=120&width=120&text=AC",
  stats: {
    posts: 1247,
    friends: 89,
    stannedIdols: 12
  }
}

// Mock posts data
const mockPosts = [
  {
    id: "1",
    user: {
      id: "1",
      name: userData.name,
      username: userData.username.replace("@", ""),
      avatar: userData.avatar
    },
    content: "Just watched Taylor's new music video and I'm OBSESSED! The cinematography is incredible 🎬✨ #TaylorSwift",
    timestamp: "2h",
    likes: 245,
    comments: 18,
    reposts: 32,
    liked: false,
    idol: {
      id: "1",
      name: "Taylor Swift",
      image: "/placeholder.svg?height=48&width=48&text=TS"
    },
    image: "/placeholder.svg?height=300&width=500&text=Post+Image"
  },
  {
    id: "2",
    user: {
      id: "1",
      name: userData.name,
      username: userData.username.replace("@", ""),
      avatar: userData.avatar
    },
    content: "BTS really changed my life. Their message of self-love and acceptance means everything to me 💜 #BTS #ARMY",
    timestamp: "1d",
    likes: 189,
    comments: 24,
    reposts: 15,
    liked: true,
    idol: {
      id: "2",
      name: "BTS",
      image: "/placeholder.svg?height=48&width=48&text=BTS"
    }
  },
  {
    id: "3",
    user: {
      id: "1",
      name: userData.name,
      username: userData.username.replace("@", ""),
      avatar: userData.avatar
    },
    content: "Zendaya's fashion choices are always impeccable. She's truly an icon 👑",
    timestamp: "3d",
    likes: 156,
    comments: 12,
    reposts: 8,
    liked: false,
    idol: {
      id: "3",
      name: "Zendaya",
      image: "/placeholder.svg?height=48&width=48&text=Z"
    }
  }
]

// Mock stanned idols
const stannedIdols = [
  { id: "1", name: "Taylor Swift", avatar: "/placeholder.svg?height=48&width=48&text=TS", category: "Music", stans: 1200000 },
  { id: "2", name: "BTS", avatar: "/placeholder.svg?height=48&width=48&text=BTS", category: "K-Pop", stans: 2500000 },
  { id: "3", name: "Zendaya", avatar: "/placeholder.svg?height=48&width=48&text=Z", category: "Acting", stans: 980000 },
  { id: "4", name: "Ariana Grande", avatar: "/placeholder.svg?height=48&width=48&text=AG", category: "Music", stans: 1500000 },
  { id: "5", name: "Blackpink", avatar: "/placeholder.svg?height=48&width=48&text=BP", category: "K-Pop", stans: 1800000 },
  { id: "6", name: "Tom Holland", avatar: "/placeholder.svg?height=48&width=48&text=TH", category: "Acting", stans: 850000 }
]

// Mock mutual friends data
const mutualFriends = [
  { id: "1", name: "Jake Wilson", username: "@jakew", avatar: "/placeholder.svg?height=48&width=48&text=JW", commonWith: "Sarah Johnson" },
  { id: "2", name: "Amy Chen", username: "@amyc", avatar: "/placeholder.svg?height=48&width=48&text=AC", commonWith: "Mike Park" },
  { id: "3", name: "Luis Garcia", username: "@luisg", avatar: "/placeholder.svg?height=48&width=48&text=LG", commonWith: "Emma Wilson" },
  { id: "4", name: "Sophie Kim", username: "@sophiek", avatar: "/placeholder.svg?height=48&width=48&text=SK", commonWith: "David Kim" },
  { id: "5", name: "Ryan Taylor", username: "@ryant", avatar: "/placeholder.svg?height=48&width=48&text=RT", commonWith: "Lisa Chen" }
]

const friends = [
  { id: "1", name: "Sarah Johnson", username: "@sarahj_fan", avatar: "/placeholder.svg?height=48&width=48&text=SJ", mutualFriends: 12, topIdol: "Taylor Swift" },
  { id: "2", name: "Mike Park", username: "@mikepark", avatar: "/placeholder.svg?height=48&width=48&text=MP", mutualFriends: 8, topIdol: "BTS" },
  { id: "3", name: "Emma Wilson", username: "@emmaw", avatar: "/placeholder.svg?height=48&width=48&text=EW", mutualFriends: 15, topIdol: "Ariana Grande" },
  { id: "4", name: "David Kim", username: "@davidk", avatar: "/placeholder.svg?height=48&width=48&text=DK", mutualFriends: 6, topIdol: "Taylor Swift" },
  { id: "5", name: "Lisa Chen", username: "@lisac", avatar: "/placeholder.svg?height=48&width=48&text=LC", mutualFriends: 9, topIdol: "Blackpink" },
  { id: "6", name: "Ryan Martinez", username: "@ryanm", avatar: "/placeholder.svg?height=48&width=48&text=RM", mutualFriends: 4, topIdol: "Zendaya" }
]

export default function MePage() {
  const [activeTab, setActiveTab] = useState("posts")
  const [friendsDialogOpen, setFriendsDialogOpen] = useState(false)
  const [stannedDialogOpen, setStannedDialogOpen] = useState(false)
  const [friendsTabValue, setFriendsTabValue] = useState("all")

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Profile Section */}
      <div className="px-6 py-8">
        {/* Profile Header with Avatar and Action Buttons */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="h-24 w-24 ring-2 ring-[#fec400]/20">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="text-xl bg-gradient-to-br from-[#fec400]/20 to-[#fec400]/10">AC</AvatarFallback>
              </Avatar>
              <Button 
                variant="secondary" 
                size="icon" 
                className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 bg-[#fec400] hover:bg-[#fec400]/90 text-black"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-foreground mb-1">{userData.name}</h1>
                <p className="text-muted-foreground">{userData.username}</p>
              </div>
              
              {/* Stats */}
              <div className="flex gap-6 text-sm mb-4">
                <div className="text-center">
                  <div className="font-bold text-foreground">{userData.stats.posts.toLocaleString()}</div>
                  <div className="text-muted-foreground text-xs">Posts</div>
                </div>
                
                <Dialog open={friendsDialogOpen} onOpenChange={setFriendsDialogOpen}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors text-center">
                      <div className="font-bold text-foreground">{userData.stats.friends.toLocaleString()}</div>
                      <div className="text-muted-foreground text-xs">Friends</div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[80vh] overflow-hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/50">
                    <DialogHeader>
                      <DialogTitle>Friends</DialogTitle>
                    </DialogHeader>
                    <Tabs value={friendsTabValue} onValueChange={setFriendsTabValue} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="all">All Friends</TabsTrigger>
                        <TabsTrigger value="mutual">Mutual Friends</TabsTrigger>
                      </TabsList>
                      <TabsContent value="all" className="mt-0 max-h-96 overflow-y-auto">
                        <div className="space-y-3 p-1">
                          {friends.map((friend) => (
                            <div key={friend.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={friend.avatar} alt={friend.name} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">{friend.name}</h3>
                                <p className="text-xs text-muted-foreground">{friend.username}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                Message
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="mutual" className="mt-0 max-h-96 overflow-y-auto">
                        <div className="space-y-3 p-1">
                          {mutualFriends.map((friend) => (
                            <div key={friend.id} className="flex items-center space-x-3 p-2 rounded hover:bg-muted/50">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={friend.avatar} alt={friend.name} />
                                <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h3 className="font-semibold text-sm">{friend.name}</h3>
                                <p className="text-xs text-muted-foreground">{friend.username}</p>
                                <p className="text-xs text-[#fec400]">Mutual with {friend.commonWith}</p>
                              </div>
                              <Button variant="outline" size="sm">
                                Add Friend
                              </Button>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>

                <Dialog open={stannedDialogOpen} onOpenChange={setStannedDialogOpen}>
                  <DialogTrigger asChild>
                    <div className="cursor-pointer hover:bg-muted/50 rounded-lg p-2 -m-2 transition-colors text-center">
                      <div className="font-bold text-[#fec400]">{userData.stats.stannedIdols}</div>
                      <div className="text-muted-foreground text-xs">Stanned</div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-md max-h-[80vh] overflow-hidden bg-[#fec400]/10 backdrop-blur supports-[backdrop-filter]:bg-[#fec400]/10 border border-[#fec400]/30">
                    <DialogHeader>
                      <DialogTitle className="text-[#fec400]">Stanned Idols</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-3 p-1">
                        {stannedIdols.map((idol) => (
                          <div key={idol.id} className="border border-[#fec400]/20 hover:border-[#fec400]/40 transition-colors rounded-lg p-3 text-center bg-background/20 backdrop-blur-sm">
                            <Avatar className="h-12 w-12 mx-auto mb-2">
                              <AvatarImage src={idol.avatar} alt={idol.name} />
                              <AvatarFallback>{idol.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <h3 className="font-semibold text-sm mb-1">{idol.name}</h3>
                            <Badge variant="secondary" className="text-xs bg-[#fec400]/20 text-[#fec400] border-[#fec400]/30 mb-1">
                              {idol.category}
                            </Badge>
                            <p className="text-xs text-muted-foreground">
                              {idol.stans.toLocaleString()} stans
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="rounded-full border-[#fec400] text-[#fec400] hover:bg-[#fec400] hover:text-black transition-colors"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-muted/50"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Bio and Info */}
        <div className="space-y-4 mb-8">
          <p className="text-sm leading-relaxed text-foreground/90">{userData.bio}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <MapPin className="h-4 w-4" />
              {userData.location}
            </div>
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <LinkIcon className="h-4 w-4" />
              <Link href={`https://${userData.website}`} className="text-[#fec400] hover:text-[#fec400]/80 hover:underline">
                {userData.website}
              </Link>
            </div>
            <div className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Calendar className="h-4 w-4" />
              Joined {userData.joinDate}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="border-t border-border/50">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-transparent border-b border-border/30 rounded-none h-auto p-0">
            <TabsTrigger 
              value="posts" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent data-[state=active]:text-[#fec400] py-4 font-medium transition-all hover:bg-muted/30"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger 
              value="stanned" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent data-[state=active]:text-[#fec400] py-4 font-medium transition-all hover:bg-muted/30"
            >
              Stanned
            </TabsTrigger>
            <TabsTrigger 
              value="friends" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent data-[state=active]:text-[#fec400] py-4 font-medium transition-all hover:bg-muted/30"
            >
              Friends
            </TabsTrigger>
            <TabsTrigger 
              value="liked" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent data-[state=active]:text-[#fec400] py-4 font-medium transition-all hover:bg-muted/30"
            >
              Liked
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <div className="space-y-0">
              {mockPosts.map((post) => (
                <Post
                  key={post.id}
                  user={post.user}
                  content={post.content}
                  image={post.image}
                  timestamp={post.timestamp}
                  likes={post.likes}
                  comments={post.comments}
                  reposts={post.reposts}
                  liked={post.liked}
                  idol={post.idol}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stanned" className="mt-0">
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stannedIdols.map((idol) => (
                  <Card key={idol.id} className="border border-[#fec400]/20 hover:border-[#fec400]/40 transition-all duration-200 hover:shadow-lg hover:shadow-[#fec400]/10">
                    <CardContent className="p-6 text-center">
                      <Avatar className="h-16 w-16 mx-auto mb-3 ring-2 ring-[#fec400]/20">
                        <AvatarImage src={idol.avatar} alt={idol.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#fec400]/20 to-[#fec400]/10">{idol.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-sm mb-2">{idol.name}</h3>
                      <Badge variant="secondary" className="text-xs bg-[#fec400]/10 text-[#fec400] border-[#fec400]/20 mb-2">
                        {idol.category}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {idol.stans.toLocaleString()} stans
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="friends" className="mt-0">
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                {friends.map((friend) => (
                  <Card key={friend.id} className="border border-border/50 hover:border-[#fec400]/40 transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 ring-2 ring-border/20">
                          <AvatarImage src={friend.avatar} alt={friend.name} />
                          <AvatarFallback className="bg-gradient-to-br from-muted to-muted/50">{friend.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm mb-1">{friend.name}</h3>
                          <p className="text-xs text-muted-foreground mb-2">{friend.username}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{friend.mutualFriends} mutual</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="h-3 w-3 text-[#fec400]" />
                              <span>Stans {friend.topIdol}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-[#fec400]/40 text-[#fec400] hover:bg-[#fec400] hover:text-black transition-colors"
                        >
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-0">
            <div className="p-12 text-center text-muted-foreground">
              <div className="max-w-sm mx-auto">
                <Heart className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-medium mb-2 text-foreground/60">No liked posts yet</h3>
                <p className="text-sm">When you like posts, they'll appear here for easy access.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}