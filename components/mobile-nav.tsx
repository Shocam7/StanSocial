"use client"

import { Home, Search, Plus, User, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function MobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-[#fec400]/40">
      <div className="flex items-center justify-around px-2 py-3">
        <Link href="/">
          <Button
            variant={isActive("/") ? "menuicon" : "ghost"}
            size="menuicon"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
        </Link>
        <Link href="/discover">
          <Button
            variant={isActive("/discover") ? "menuicon" : "ghost"}
            size="menuicon"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          >
            <Compass className="h-5 w-5" />
            <span className="text-xs">Discover</span>
          </Button>
        </Link>
        <div className="flex flex-col items-center gap-1 py-2 px-3">
          <div className="text-xl font-black text-black tracking-tight">Stan</div>
        </div>
        <Button variant="ghost" size="menuicon" className="rounded-full flex flex-col items-center gap-1 h-auto py-2 px-3">
          <Plus className="h-5 w-5" />
          <span className="text-xs">Create</span>
        </Button>
        <Button variant="ghost" size="menuicon" className="flex flex-col items-center gap-1 h-auto py-2 px-3">
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Button>
      </div>
    </div>
  )
}
