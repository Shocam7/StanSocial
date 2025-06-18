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
  coverImage: "/placeholder.svg?height=200&width=800&text=Cover",
  stats: {
    posts: 1247,
    friends: 89, // Changed from following
    stannedIdols: 12 // Keep stanned idols
  }
}

// Mock posts data
const mockPosts = [
  {
    id: "1",
    content: "Just watched Taylor's new music video and I'm OBSESSED! The cinematography is incredible 🎬✨ #TaylorSwift",
    timestamp: "2h",
    likes: 245,
    comments: 18,
    reposts: 32,
    idol: {
      name: "Taylor Swift",
      avatar: "/placeholder.svg?height=24&width=24&text=TS"
    },
    image: "/placeholder.svg?height=300&width=500&text=Post+Image"
  },
  {
    id: "2",
    content: "BTS really changed my life. Their message of self-love and acceptance means everything to me 💜 #BTS #ARMY",
    timestamp: "1d",
    likes: 189,
    comments: 24,
    reposts: 15,
    idol: {
      name: "BTS",
      avatar: "/placeholder.svg?height=24&width=24&text=BTS"
    }
  },
  {
    id: "3",
    content: "Zendaya's fashion choices are always impeccable. She's truly an icon 👑",
    timestamp: "3d",
    likes: 156,
    comments: 12,
    reposts: 8,
    idol: {
      name: "Zendaya",
      avatar: "/placeholder.svg?height=24&width=24&text=Z"
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

// Mock mutual friends data (for the popup)
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

  const PostCard = ({ post }: { post: any }) => (
    <Card className="border-0 border-b border-[#fec400]/10 rounded-none">
      <CardContent className="p-4">
        <div className="flex space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userData.avatar} alt={userData.name} />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{userData.name}</span>
              <span className="text-muted-foreground">{userData.username}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground text-sm">{post.timestamp}</span>
            </div>

            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={post.idol.avatar} alt={post.idol.name} />
                <AvatarFallback>{post.idol.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-[#fec400] font-medium">About {post.idol.name}</span>
            </div>

            <p className="text-sm leading-relaxed">{post.content}</p>

            {post.image && (
              <div className="rounded-lg overflow-hidden border border-[#fec400]/20">
                <img src={post.image} alt="Post image" className="w-full h-48 object-cover" />
              </div>
            )}

            <div className="flex items-center justify-between pt-2 max-w-md">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[#fec400] hover:bg-[#fec400]/10">
                <MessageCircle className="h-4 w-4 mr-2" />
                {post.comments}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[#fec400] hover:bg-[#fec400]/10">
                <Repeat2 className="h-4 w-4 mr-2" />
                {post.reposts}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
                <Heart className="h-4 w-4 mr-2" />
                {post.likes}
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[#fec400] hover:bg-[#fec400]/10">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-[#fec400]/40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Profile</h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-48 bg-gradient-to-r from-[#fec400]/20 to-[#fec400]/10">
        <img 
          src={userData.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover"
        />
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute bottom-4 right-4 rounded-full"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      {/* Profile Info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start -mt-16 mb-4">
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={userData.avatar} alt={userData.name} />
              <AvatarFallback className="text-2xl">AC</AvatarFallback>
            </Avatar>
            <Button 
              variant="secondary" 
              size="icon" 
              className="absolute bottom-2 right-2 rounded-full h-8 w-8"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" className="mt-16 rounded-full border-[#fec400] text-[#fec400] hover:bg-[#fec400] hover:text-black">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-bold">{userData.name}</h2>
            <p className="text-muted-foreground">{userData.username}</p>
          </div>

          <p className="text-sm leading-relaxed">{userData.bio}</p>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {userData.location}
            </div>
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />
              <Link href={`https://${userData.website}`} className="text-[#fec400] hover:underline">
                {userData.website}
              </Link>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {userData.joinDate}
            </div>
          </div>

          {/* Updated stats section */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="font-bold text-foreground">{userData.stats.posts.toLocaleString()}</span>
              <span className="text-muted-foreground ml-1">Posts</span>
            </div>
            
            {/* Friends Dialog with blur effect */}
            <Dialog open={friendsDialogOpen} onOpenChange={setFriendsDialogOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer hover:underline">
                  <span className="font-bold text-foreground">{userData.stats.friends.toLocaleString()}</span>
                  <span className="text-muted-foreground ml-1">Friends</span>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-hidden bg-background/10 backdrop-blur supports-[backdrop-filter]:bg-background/10 border border-border/30">
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

            {/* Stanned Idols Dialog with blur effect */}
            <Dialog open={stannedDialogOpen} onOpenChange={setStannedDialogOpen}>
              <DialogTrigger asChild>
                <div className="cursor-pointer hover:underline">
                  <span className="font-bold text-[#fec400]">{userData.stats.stannedIdols}</span>
                  <span className="text-muted-foreground ml-1">Stanned</span>
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-transparent border-b border-[#fec400]/20 rounded-none h-auto p-0">
          <TabsTrigger 
            value="posts" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent"
          >
            Posts
          </TabsTrigger>
          <TabsTrigger 
            value="stanned" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent"
          >
            Stanned
          </TabsTrigger>
          <TabsTrigger 
            value="friends" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent"
          >
            Friends
          </TabsTrigger>
          <TabsTrigger 
            value="liked" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#fec400] data-[state=active]:bg-transparent"
          >
            Liked
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          <div className="space-y-0">
            {mockPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stanned" className="mt-0">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {stannedIdols.map((idol) => (
                <Card key={idol.id} className="border border-[#fec400]/20 hover:border-[#fec400]/40 transition-colors">
                  <CardContent className="p-4 text-center">
                    <Avatar className="h-16 w-16 mx-auto mb-3">
                      <AvatarImage src={idol.avatar} alt={idol.name} />
                      <AvatarFallback>{idol.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-sm mb-1">{idol.name}</h3>
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

        {/* New Friends tab */}
        <TabsContent value="friends" className="mt-0">
          <div className="p-4 space-y-4">
            <div className="space-y-3">
              {friends.map((friend) => (
                <Card key={friend.id} className="border border-[#fec400]/20 hover:border-[#fec400]/40 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={friend.avatar} alt={friend.name} />
                        <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{friend.name}</h3>
                        <p className="text-xs text-muted-foreground mb-1">{friend.username}</p>
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground">
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
                      <Button variant="outline" size="sm" className="border-[#fec400]/40 text-[#fec400] hover:bg-[#fec400] hover:text-black">
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
          <div className="p-8 text-center text-muted-foreground">
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Your liked posts will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}