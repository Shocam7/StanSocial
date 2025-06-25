import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Star } from "lucide-react"

interface StannedIdol {
  id: string
  idol: {
    id: string
    name: string
    image: string
  }
  created_at: string
}

interface StannedIdolsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  stannedIdols: StannedIdol[]
}

export function StannedIdolsModal({ open, onOpenChange, stannedIdols }: StannedIdolsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Stanned Idols
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-96 overflow-y-auto">
          {stannedIdols.length > 0 ? (
            <div className="space-y-3">
              {stannedIdols.map((stan) => (
                <div key={stan.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={stan.idol.image} alt={stan.idol.name} />
                    <AvatarFallback>{stan.idol.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{stan.idol.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Stanned {new Date(stan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Star className="h-4 w-4 text-[#fec400] mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No stanned idols yet</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}