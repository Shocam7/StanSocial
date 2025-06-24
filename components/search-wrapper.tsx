"use client"

import { useRouter } from "next/navigation"
import { SearchBar } from "@/components/search-bar"

interface SearchResult {
  id: string
  name: string
  image?: string
  type: 'idol' | 'user'
  username?: string
  category?: string
}

export function SearchWrapper() {
  const router = useRouter()

  const handleSearchResultSelect = (result: SearchResult) => {
    // Handle navigation to idol or user profile
    if (result.type === 'idol') {
      // Navigate to idol profile
      router.push(`/idol/${result.id}`)
    } else {
      // Navigate to user profile
      router.push(`/user/${result.username}`)
    }
  }

  return <SearchBar onResultSelect={handleSearchResultSelect} />
}