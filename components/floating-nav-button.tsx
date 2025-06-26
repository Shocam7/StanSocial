"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Home, Search, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowser } from "@/lib/supabase"
import type { Idol } from "@/types"

export function FloatingNavButton() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [stannedIdols, setStannedIdols] = useState<Idol[]>([])
  const [loading, setLoading] = useState(true)

  // Mock user ID - in a real app, this would come from authentication
  const currentUserId = "00000000-0000-0000-0000-000000000001"

  useEffect(() => {
    const fetchStannedIdols = async () => {
      try {
        const supabase = getSupabaseBrowser()

        // Fetch user's stanned idol IDs
        const { data: stannedIdolsData, error: stannedError } = await supabase
          .from("user_stanned_idols")
          .select("idol_id")
          .eq("user_id", currentUserId)

        if (stannedError) {
          console.error("Error fetching stanned idols:", stannedError)
          return
        }

        const stannedIdolIds = stannedIdolsData?.map(item => item.idol_id) || []

        if (stannedIdolIds.length === 0) {
          setStannedIdols([])
          setLoading(false)
          return
        }

        // Fetch full idol data for stanned idols
        const { data: idolsData, error: idolsError } = await supabase
          .from("idols")
          .select("*")
          .in("id", stannedIdolIds)
          .order("name")

        if (idolsError) {
          console.error("Error fetching idols:", idolsError)
          return
        }

        const idolsList: Idol[] = idolsData?.map(idol => ({
          id: idol.id,
          name: idol.name,
          image: idol.image,
          category: idol.category,
          stans: idol.stans,
          isStanned: true
        })) || []

        setStannedIdols(idolsList)
      } catch (error) {
        console.error("Error in fetchStannedIdols:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStannedIdols()
  }, [currentUserId])

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

  const handleIdolSelect = (idolId: string) => {
    // Set the selected idol in URL params and navigate
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('selectedIdol', idolId)
    
    // Navigate to the current page with the selected idol parameter
    router.push(currentUrl.pathname + currentUrl.search)
    
    // Close the menu
    setIsMenuOpen(false)
  }

  const clearIdolFilter = () => {
    // Remove the selected idol parameter
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.delete('selectedIdol')
    
    // Navigate to the current page without the parameter
    router.push(currentUrl.pathname + (currentUrl.search ? currentUrl.search : ''))
    
    // Close the menu
    setIsMenuOpen(false)
  }

  return (
    <div className="fixed bottom-20 right-4 z-[9999] md:bottom-4">
      {/* Tube Menu */}
      <div
        className={`absolute bottom-16 right-0 w-16 bg-black rounded-full transition-all duration-300 ease-in-out overflow-hidden ${
          isMenuOpen ? 'h-80 opacity-100' : 'h-0 opacity-0'
        }`}
      >
        <div className="p-2 pt-4">
          {/* Clear Filter Option */}
          <div
            className={`mb-3 transition-all duration-300 ease-in-out ${
              isMenuOpen 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-4 opacity-0'
            }`}
            style={{
              transitionDelay: isMenuOpen ? '0ms' : '0ms'
            }}
          >
            <button
              className="w-12 h-12 rounded-full bg-white/10 border-2 border-white/20 hover:border-white/40 transition-colors duration-200 flex items-center justify-center"
              onClick={clearIdolFilter}
              title="Show All Posts"
            >
              <Home className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Stanned Idols */}
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            </div>
          ) : stannedIdols.length === 0 ? (
            <div className="flex items-center justify-center h-32 px-2">
              <p className="text-white/60 text-xs text-center">No stanned idols yet</p>
            </div>
          ) : (
            stannedIdols.map((idol, index) => (
              <div
                key={idol.id}
                className={`mb-3 transition-all duration-300 ease-in-out ${
                  isMenuOpen 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-4 opacity-0'
                }`}
                style={{
                  transitionDelay: isMenuOpen ? `${(index + 1) * 100}ms` : '0ms'
                }}
              >
                <button
                  className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 hover:border-white/40 transition-colors duration-200 group relative"
                  onClick={() => handleIdolSelect(idol.id)}
                  title={`Filter by ${idol.name}`}
                >
                  <img
                    src={idol.image}
                    alt={idol.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </button>
              </div>
            ))
          )}
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