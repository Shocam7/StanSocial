"use client"

import { Home, Search, Plus, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background border-t py-2">
      <div className="flex items-center justify-around">
        <Link href="/">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="icon"
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
        </Link>
        <Link href="/explore">
          <Button
            variant={isActive("/explore") ? "default" : "ghost"}
            size="icon"
            className="flex flex-col items-center gap-1 h-auto py-2"
          >
            <Search className="h-5 w-5" />
            <span className="text-xs">Explore</span>
          </Button>
        </Link>
        <Button variant="default" size="icon" className="rounded-full flex flex-col items-center gap-1 h-auto py-2">
          <Plus className="h-5 w-5" />
          <span className="text-xs">Post</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col items-center gap-1 h-auto py-2">
          <Bell className="h-5 w-5" />
          <span className="text-xs">Alerts</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex flex-col items-center gap-1 h-auto py-2">
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  )
}
