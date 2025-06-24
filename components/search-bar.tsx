"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Search, X, User, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase"

interface SearchResult {
  id: string
  name: string
  image?: string
  type: 'idol' | 'user'
  username?: string
  category?: string
}

interface SearchBarProps {
  placeholder?: string
  onResultSelect?: (result: SearchResult) => void
  className?: string
}

export function SearchBar({ 
  placeholder = "Search posts, idols, users...", 
  onResultSelect,
  className = ""
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Live search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    setIsSearching(true)
    
    try {
      // Search idols
      const { data: idolsData } = await supabase
        .from("idols")
        .select("id, name, image, category")
        .ilike("name", `%${query}%`)
        .limit(5)

      // Search users
      const { data: usersData } = await supabase
        .from("users")
        .select("id, name, username, avatar")
        .or(`name.ilike.%${query}%,username.ilike.%${query}%`)
        .limit(5)

      const results: SearchResult[] = [
        ...(idolsData?.map(idol => ({
          id: idol.id,
          name: idol.name,
          image: idol.image,
          type: 'idol' as const,
          category: idol.category
        })) || []),
        ...(usersData?.map(user => ({
          id: user.id,
          name: user.name,
          image: user.avatar,
          type: 'user' as const,
          username: user.username
        })) || [])
      ]

      setSearchResults(results)
      setShowResults(results.length > 0)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      setShowResults(false)
    } finally {
      setIsSearching(false)
    }
  }

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  // Handle click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery(result.name)
    setShowResults(false)
    if (onResultSelect) {
      onResultSelect(result)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
    setShowResults(false)
  }

  return (
    <div ref={searchRef} className={`relative max-w-md mx-auto w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchResults.length > 0 && setShowResults(true)}
          placeholder={placeholder}
          className="pl-10 pr-12 py-2 rounded-full border-[#fec400]/30 focus:border-[#fec400] focus:ring-[#fec400]/20"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
          >
            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-[#fec400]/20 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-muted-foreground">
              <Search className="h-4 w-4 animate-spin mx-auto mb-2" />
              Searching...
            </div>
          ) : searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={result.image} alt={result.name} />
                    <AvatarFallback>
                      {result.type === 'idol' ? (
                        <Star className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {result.type === 'idol' ? (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {result.category}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          @{result.username}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize">
                    {result.type}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery && (
            <div className="p-4 text-center text-muted-foreground">
              No results found for "{searchQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}