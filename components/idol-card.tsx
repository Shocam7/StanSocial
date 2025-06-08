"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Idol } from "@/types"
import Link from "next/link"

interface IdolCardProps {
  idol: Idol
}

export function IdolCard({ idol }: IdolCardProps) {
  const [isStanned, setIsStanned] = useState(idol.isStanned || false)
  const [followers, setFollowers] = useState(idol.followers)

  const toggleStan = () => {
    setIsStanned(!isStanned)
    setFollowers(isStanned ? followers - 1 : followers + 1)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/idol/${idol.id}`}>
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40" />
        <CardContent className="pt-0 relative">
          <div className="absolute -top-12 left-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={idol.image || "/placeholder.svg"} alt={idol.name} />
              <AvatarFallback className="text-2xl">{idol.name.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="pt-14">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg hover:text-primary">{idol.name}</h3>
                <p className="text-muted-foreground text-sm">{idol.category}</p>
              </div>
            </div>
            <p className="text-sm mt-2">
              <span className="font-semibold">{followers.toLocaleString()}</span>{" "}
              <span className="text-muted-foreground">stans</span>
            </p>
          </div>
        </CardContent>
      </Link>
      <CardContent className="pt-0">
        <div className="flex justify-end">
          <Button
            variant={isStanned ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              toggleStan()
            }}
            className={isStanned ? "bg-primary" : ""}
          >
            {isStanned ? "Stanning" : "Stan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
