"use client"

import { Clock, Plus, User, Compass } from "lucide-react"
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
        <Link href="/create">
          <Button 
            variant={isActive("/create") ? "menuicon" : "ghost"} 
            size="menuicon" 
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Create</span>
          </Button>
        </Link>
        <Link href="/">
          <Button
            variant={isActive("/") ? "stanicon" : "ghost"}
            size="stanicon"
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          >
            <div className="flex flex-col items-center gap-1 py-2 px-3">
              <span className="text-xl font-black tracking-tight">
                Stan
              </span>
            </div>
          </Button>
        </Link>
        <Link href="/moments">
          <Button 
            variant={isActive("/moments") ? "menuicon" : "ghost"} 
            size="menuicon" 
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          >
            <Clock className="h-5 w-5" />
            <span className="text-xs">Moments</span>
          </Button>
        </Link>
        <Link href="/me">
          <Button 
            variant={isActive("/me") ? "menuicon" : "ghost"} 
            size="menuicon" 
            className="flex flex-col items-center gap-1 h-auto py-2 px-3"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Me</span>
          </Button>
        </Link>
      </div>
    </div>
  )
              }
