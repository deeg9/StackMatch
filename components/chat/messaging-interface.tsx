\
Now
let
's verify the forum components:

```tsx file="app/forum/page.tsx"
[v0-no-op-code-block-prefix]
\
Let's check the deal rooms components:

```tsx file="app/deal-rooms/[id]/page.tsx"
[v0-no-op-code-block-prefix]
import { createClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import DealRoomFiles from "@/components/deal-rooms/deal-room-files"
import DealRoomParticipants from "@/components/deal-rooms/deal-room-participants"
import DealRoomDetails from "@/components/deal-rooms/deal-room-details"
import type { DealRoom, DealRoomFile, DealRoomParticipant } from "@/types"

interface DealRoomPageProps {
  params: {
    id: string
  }
}

async function getDealRoom(id: string): Promise<DealRoom | null> {
  const supabase = createClient()
  const { data: dealRoom, error } = await supabase.from("deal_rooms").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching deal room:", error)
    return null
  }

  return dealRoom as DealRoom
}

async function getDealRoomFiles(dealRoomId: string): Promise<DealRoomFile[]> {
  const supabase = createClient()
  const { data: dealRoomFiles, error } = await supabase
    .from("deal_room_files")
    .select("*")
    .eq("deal_room_id", dealRoomId)

  if (error) {
    console.error("Error fetching deal room files:", error)
    return []
  }

  return dealRoomFiles as DealRoomFile[]
}

async function getDealRoomParticipants(dealRoomId: string): Promise<DealRoomParticipant[]> {
  const supabase = createClient()
  const { data: dealRoomParticipants, error } = await supabase
    .from("deal_room_participants")
    .select("*")
    .eq("deal_room_id", dealRoomId)

  if (error) {
    console.error("Error fetching deal room participants:", error)
    return []
  }

  return dealRoomParticipants as DealRoomParticipant[]
}

export default async function DealRoomPage({ params: { id } }: DealRoomPageProps) {
  const dealRoom = await getDealRoom(id)

  if (!dealRoom) {
    notFound()
  }

  const dealRoomFiles = await getDealRoomFiles(id)
  const dealRoomParticipants = await getDealRoomParticipants(id)

  return (
    <div className="container max-w-5xl py-12">
      <DealRoomDetails dealRoom={dealRoom} />
      <DealRoomFiles files={dealRoomFiles} />
      <DealRoomParticipants participants={dealRoomParticipants} />
    </div>
  )
}
