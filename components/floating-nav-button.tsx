"use client"

import { usePathname } from "next/navigation"
import { Home, Search, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingNavButton() {
  const pathname = usePathname()

  const getPageIcon = () => {
    if (pathname === "/") {
      return <Home className="h-6 w-6" />
    } else if (pathname === "/discover") {
      return <Search className="h-6 w-6" />
    } else if (pathname.startsWith("/idol/")) {
      return <User className="h-6 w-6" />
    } else {
      return <Settings className="h-6 w-6" />
    }
  }

  return (
    <div className="fixed top-4 left-4 z-[9999]">
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
      >
        {getPageIcon()}
      </Button>
    </div>
  )
}
