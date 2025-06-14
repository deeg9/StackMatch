import type { DealRoomParticipant } from "@/types" // Assuming types/index.ts or types/deal-room-types.ts has this
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DealRoomParticipantsProps {
  participants: DealRoomParticipant[]
}

// Mock DealRoomParticipant if not defined elsewhere for preview
// type DealRoomParticipant = {
//   id: string;
//   user_id: string;
//   user_full_name?: string; // Assuming you might join to get user name
//   user_email?: string;
//   role_in_deal_room?: string; // e.g., 'Business Lead', 'Provider Contact'
//   joined_at: string;
// };

export default function DealRoomParticipants({ participants }: DealRoomParticipantsProps) {
  if (!participants || participants.length === 0) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No participants listed for this deal room.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Participants</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {participants.map((participant) => (
            <li key={participant.id || participant.user_id} className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage
                  src={`/placeholder.svg?height=40&width=40&query=avatar+${participant.user_full_name || "user"}`}
                />
                <AvatarFallback>
                  {participant.user_full_name ? participant.user_full_name.substring(0, 2).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{participant.user_full_name || "Unnamed User"}</p>
                <p className="text-sm text-muted-foreground">{participant.user_email || "No email"}</p>
                {participant.role_in_deal_room && (
                  <p className="text-xs text-gray-500">{participant.role_in_deal_room}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
