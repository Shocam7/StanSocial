"use client"

import { useState } from "react"
import { ArrowLeft, Calendar, MapPin, ExternalLink, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import type { Idol } from "@/types"

interface IdolProfileHeaderProps {
  idol: Idol
}

export function IdolProfileHeader({ idol }: IdolProfileHeaderProps) {
  const router = useRouter()
  const [isStanned, setIsStanned] = useState(idol.isStanned || false)
  const [stans, setFollowers] = useState(idol.stans)

  const toggleStan = () => {
    setIsStanned(!isStanned)
    setFollowers(isStanned ? stans - 1 : stans + 1)
  }

  return (
    <div className="border-x">
      {/* Header with back button */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{idol.name}</h1>
            <p className="text-sm text-muted-foreground">{stans.toLocaleString()} stans</p>
          </div>
        </div>
      </div>

      {/* Cover image */}
      <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 relative">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Profile info */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-start -mt-16 mb-4">
          <Avatar className="h-32 w-32 border-4 border-background">
            <AvatarImage src={idol.image || "/placeholder.svg"} alt={idol.name} />
            <AvatarFallback className="text-4xl">{idol.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex space-x-2 mt-16">
            <Button variant="outline" size="icon">
              <Share className="h-4 w-4" />
            </Button>
            <Button
              variant={isStanned ? "default" : "outline"}
              onClick={toggleStan}
              className={`px-6 ${isStanned ? "bg-primary" : ""}`}
            >
              {isStanned ? "Stanning" : "Stan"}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-bold">{idol.name}</h2>
            <Badge variant="secondary" className="mt-1">
              {idol.category}
            </Badge>
          </div>

          <p className="text-muted-foreground">
            {idol.category === "Music" &&
              "Singer, songwriter, and performer captivating audiences worldwide with incredible talent and artistry."}
            {idol.category === "K-Pop" &&
              "Global K-Pop sensation bringing innovative music, stunning visuals, and powerful performances to fans everywhere."}
            {idol.category === "Acting" &&
              "Talented actor bringing compelling characters to life on screen with remarkable skill and dedication."}
          </p>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Joined Stan in 2023</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>
                {idol.category === "Music" && "Nashville, TN"}
                {idol.category === "K-Pop" && "Seoul, South Korea"}
                {idol.category === "Acting" && "Los Angeles, CA"}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <ExternalLink className="h-4 w-4" />
              <a href="#" className="hover:underline text-primary">
                Official Website
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div>
              <span className="font-bold">{stans.toLocaleString()}</span>{" "}
              <span className="text-muted-foreground">Stans</span>
            </div>
            <div>
              <span className="font-bold">
                {idol.category === "Music" && "12"}
                {idol.category === "K-Pop" && "25"}
                {idol.category === "Acting" && "8"}
              </span>{" "}
              <span className="text-muted-foreground">Albums/Projects</span>
            </div>
            <div>
              <span className="font-bold">
                {idol.category === "Music" && "156"}
                {idol.category === "K-Pop" && "89"}
                {idol.category === "Acting" && "23"}
              </span>{" "}
              <span className="text-muted-foreground">Awards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
