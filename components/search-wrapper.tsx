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

// Utility function to convert names to URL-friendly slugs
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function SearchWrapper() {
  const router = useRouter()

  const handleSearchResultSelect = (result: SearchResult) => {
    // Handle navigation to idol or user profile using names/usernames
    if (result.type === 'idol') {
      // Navigate to idol profile using name slug
      const idolSlug = createSlug(result.name)
      router.push(`/idol/${idolSlug}`)
    } else {
      // Navigate to user profile using username (already URL-friendly)
      router.push(`/user/${result.username}`)
    }
  }

  return <SearchBar onResultSelect={handleSearchResultSelect} />
}