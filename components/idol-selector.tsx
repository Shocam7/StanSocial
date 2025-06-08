"use client"

import { useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Idol } from "@/types"

interface IdolSelectorProps {
  idols: Idol[]
  selectedIdol: Idol | null
  onSelectIdol: (idol: Idol) => void
}

export function IdolSelector({ idols, selectedIdol, onSelectIdol }: IdolSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="justify-between w-full">
          {selectedIdol ? (
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={selectedIdol.image || "/placeholder.svg"} alt={selectedIdol.name} />
                <AvatarFallback>{selectedIdol.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {selectedIdol.name}
            </div>
          ) : (
            "Select an idol for this post"
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search idols..." className="h-9" icon={Search} />
          <CommandList>
            <CommandEmpty>No idol found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] overflow-auto">
              {idols.map((idol) => (
                <CommandItem
                  key={idol.id}
                  value={idol.name}
                  onSelect={() => {
                    onSelectIdol(idol)
                    setOpen(false)
                  }}
                >
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={idol.image || "/placeholder.svg"} alt={idol.name} />
                      <AvatarFallback>{idol.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{idol.name}</p>
                      <p className="text-xs text-muted-foreground">{idol.category}</p>
                    </div>
                  </div>
                  {selectedIdol?.id === idol.id && <Check className="ml-auto h-4 w-4" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
