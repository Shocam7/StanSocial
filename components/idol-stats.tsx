"use client"

import { TrendingUp, Heart, MessageCircle, Repeat2, Users, Calendar, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Idol } from "@/types"

interface IdolStatsProps {
  idol: Idol
  stats: {
    totalPosts: number
    totalLikes: number
    totalComments: number
    totalReposts: number
    avgLikesPerPost: number
    avgCommentsPerPost: number
  }
}

export function IdolStats({ idol, stats }: IdolStatsProps) {
  const engagementRate =
    stats.totalPosts > 0 ? ((stats.totalLikes + stats.totalComments) / (stats.totalPosts * idol.stans)) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Statistics for {idol.name}</h2>
        <p className="text-muted-foreground">
          Comprehensive analytics and performance metrics for posts about {idol.name}.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">Posts about {idol.name}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+{stats.avgLikesPerPost} avg per post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalComments}</div>
            <p className="text-xs text-muted-foreground">+{stats.avgCommentsPerPost} avg per post</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reposts</CardTitle>
            <Repeat2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReposts}</div>
            <p className="text-xs text-muted-foreground">Content shared</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Engagement Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Engagement Rate</span>
                <span>{engagementRate.toFixed(2)}%</span>
              </div>
              <Progress value={Math.min(engagementRate * 10, 100)} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Like Rate</span>
                <span>{stats.totalPosts > 0 ? ((stats.totalLikes / stats.totalPosts) * 100).toFixed(1) : 0}%</span>
              </div>
              <Progress
                value={stats.totalPosts > 0 ? Math.min((stats.totalLikes / stats.totalPosts) * 10, 100) : 0}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Comment Rate</span>
                <span>{stats.totalPosts > 0 ? ((stats.totalComments / stats.totalPosts) * 100).toFixed(1) : 0}%</span>
              </div>
              <Progress
                value={stats.totalPosts > 0 ? Math.min((stats.totalComments / stats.totalPosts) * 5, 100) : 0}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Community Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Stans</span>
              <span className="font-bold">{idol.stans.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Active Posters</span>
              <span className="font-bold">{Math.floor(stats.totalPosts * 0.8)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Category Rank</span>
              <span className="font-bold">
                #{idol.category === "Music" ? "3" : idol.category === "K-Pop" ? "1" : "7"} in {idol.category}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm">Growth Rate</span>
              <span className="font-bold text-green-600">+12.5%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Recent Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">🏆</div>
              <div className="font-semibold">Most Stanned</div>
              <div className="text-xs text-muted-foreground">This month in {idol.category}</div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">🔥</div>
              <div className="font-semibold">Trending</div>
              <div className="text-xs text-muted-foreground">Top 5 this week</div>
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary mb-1">💫</div>
              <div className="font-semibold">Milestone</div>
              <div className="text-xs text-muted-foreground">
                {idol.stans > 1000000 ? "1M+" : "500K+"} stans reached
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Performance Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                period: "Last 7 days",
                posts: Math.floor(stats.totalPosts * 0.3),
                likes: Math.floor(stats.totalLikes * 0.4),
              },
              {
                period: "Last 30 days",
                posts: Math.floor(stats.totalPosts * 0.7),
                likes: Math.floor(stats.totalLikes * 0.8),
              },
              { period: "Last 90 days", posts: stats.totalPosts, likes: stats.totalLikes },
            ].map((period, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="font-medium">{period.period}</span>
                <div className="text-right">
                  <div className="text-sm">{period.posts} posts</div>
                  <div className="text-xs text-muted-foreground">{period.likes.toLocaleString()} likes</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
