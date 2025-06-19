"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toggleStanIdol } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import type { Idol } from "@/types"
import Link from "next/link"

interface IdolCardProps {
  idol: Idol
  onStanToggle?: (idolId: string, isCurrentlyStanned: boolean) => void
}

export function IdolCard({ idol }: IdolCardProps) {
  const [isStanned, setIsStanned] = useState(idol.isStanned || false)
  const [stans, setFollowers] = useState(idol.stans)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const toggleStan = async () => {
    setIsLoading(true)

    // Update UI optimistically
    setIsStanned(!isStanned)
    setFollowers(isStanned ? stans - 1 : stans + 1)

    // Send to server
    const result = await toggleStanIdol(idol.id, isStanned)

    setIsLoading(false)

    if (!result.success) {
      // Revert on failure
      setIsStanned(isStanned)
      setFollowers(idol.stans)

      toast({
        title: "Error",
        description: "Failed to update stan status. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border border-[#fec400]/20">
      <Link href={`/idol/${idol.id}`}>
        <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/40" />
        <CardContent className="pt-0 relative">
          <div className="absolute -top-12 left-4">
            <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-[#fec400]">
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
              <span className="font-semibold">{stans.toLocaleString()}</span>{" "}
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
            onClick={() => onStanToggle?.(idol.id, idol.isStanned)}

            disabled={isLoading}
            className={
              isStanned
                ? "bg-[#fec400] hover:bg-[#fec400]/90 border-[#fec400] text-white"
                : "border-black text-black hover:bg-[#fec400] hover:text-white hover:border-[#fec400]"
            }
          >
            {isLoading ? "..." : isStanned ? "Stanning" : "Stan"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
