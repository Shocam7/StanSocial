"use client"

import { Home, Search, Compass, Star, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Idol } from "@/types"
import Link from "next/link"

const navigationItems = [
  { icon: Home, label: "Home", active: true, href: "/" },
  { icon: Search, label: "Explore", active: false, href: "/explore" },
  { icon: Compass, label: "Discover Idols", active: false, href: "/" },
  { icon: Star, label: "Popular", active: false, href: "/" },
  { icon: Settings, label: "Settings", active: false, href: "/" },
]

interface StannedIdolsSidebarProps {
  stannedIdols: Idol[]
}

export function StannedIdolsSidebar({ stannedIdols }: StannedIdolsSidebarProps) {
  return (
    <aside className="w-64 p-4 space-y-6">
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <Button variant={item.active ? "default" : "ghost"} className="w-full justify-start" size="lg">
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t">
        <h3 className="font-semibold mb-3 text-lg">My Stanned Idols</h3>
        <div className="space-y-2">
          {stannedIdols.map((idol) => (
            <Link key={idol.id} href={`/idol/${idol.id}`}>
              <Button variant="ghost" className="w-full justify-start p-2 h-auto">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={idol.image || "/placeholder.svg"} alt={idol.name} />
                    <AvatarFallback>{idol.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium text-sm">{idol.name}</p>
                    <p className="text-xs text-muted-foreground">{idol.category}</p>
                  </div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
