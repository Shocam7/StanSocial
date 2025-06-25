import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { X, Users } from "lucide-react"

interface Friend {
  id: string
  friend: {
    id: string
    name: string
    username: string
    avatar: string
  }
  mutual_friends_count?: number
}

interface FriendsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  friends: Friend[]
}

export function FriendsModal({ open, onOpenChange, friends }: FriendsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Friends
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
          {friends.length > 0 ? (
            <div className="space-y-3">
              {friends.map((friendship) => (
                <div key={friendship.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={friendship.friend.avatar} alt={friendship.friend.name} />
                    <AvatarFallback>{friendship.friend.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{friendship.friend.name}</p>
                    <p className="text-xs text-muted-foreground">@{friendship.friend.username}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {friendship.mutual_friends_count || 0} mutual
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No friends yet</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}