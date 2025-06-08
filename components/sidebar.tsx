"use client"

import { Home, Search, Bell, Mail, Bookmark, User, Settings, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const navigationItems = [
  { icon: Home, label: "Home", active: true },
  { icon: Search, label: "Explore" },
  { icon: Bell, label: "Notifications" },
  { icon: Mail, label: "Messages" },
  { icon: Bookmark, label: "Bookmarks" },
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Settings" },
]

const trendingTopics = ["#NextJS", "#WebDevelopment", "#React", "#TypeScript", "#TailwindCSS"]

export function Sidebar() {
  return (
    <aside className="w-64 p-4 space-y-4">
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "default" : "ghost"}
            className="w-full justify-start"
            size="lg"
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </Button>
        ))}
      </nav>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="h-5 w-5" />
            <h3 className="font-semibold">Trending</h3>
          </div>
          <div className="space-y-2">
            {trendingTopics.map((topic) => (
              <Button key={topic} variant="ghost" className="w-full justify-start p-2 h-auto">
                <span className="text-primary font-medium">{topic}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
