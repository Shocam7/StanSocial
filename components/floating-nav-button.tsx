"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Home, Search, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

// Mock data for stanned idols - replace with your actual data
const stannedIdols = [
  { id: 1, name: "Idol 1", profileImage: "/api/placeholder/40/40" },
  { id: 2, name: "Idol 2", profileImage: "/api/placeholder/40/40" },
  { id: 3, name: "Idol 3", profileImage: "/api/placeholder/40/40" },
  { id: 4, name: "Idol 4", profileImage: "/api/placeholder/40/40" },
  { id: 5, name: "Idol 5", profileImage: "/api/placeholder/40/40" },
]

export function FloatingNavButton() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="fixed bottom-8 right-4 z-[9999]">
      {/* Tube Menu */}
      <div
        className={`absolute bottom-16 right-0 w-16 bg-black rounded-full transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'h-80 opacity-100' : 'h-0 opacity-0'
        }`}
      >
        <div className="p-2 pt-4">
          {stannedIdols.map((idol, index) => (
            <div
              key={idol.id}
              className={`mb-3 transition-all duration-300 ease-in-out ${
                isMenuOpen 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionDelay: isMenuOpen ? `${index * 100}ms` : '0ms'
              }}
            >
              <button
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors duration-200"
                onClick={() => {
                  // Handle idol selection here
                  console.log('Selected idol:', idol.name)
                  setIsMenuOpen(false)
                }}
              >
                <img
                  src={idol.profileImage}
                  alt={idol.name}
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Floating Button */}
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-transform duration-200 hover:scale-105"
        onClick={toggleMenu}
      >
        {getPageIcon()}
      </Button>
    </div>
  )
}