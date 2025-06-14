"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { getCurrentToken } from "@/lib/auth/token-utils"
import { Search, Loader2, UserPlus, Mail } from "lucide-react"

interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

interface AddParticipantModalProps {
  isOpen: boolean
  onClose: () => void
  dealRoomId: string
  onParticipantAdded: (participant: any) => void
}

export function AddParticipantModal({ isOpen, onClose, dealRoomId, onParticipantAdded }: AddParticipantModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState("PARTICIPANT")
  const [isSearching, setIsSearching] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      const { token } = await getCurrentToken()

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication failed",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to search users")
      }

      const data = await response.json()
      setSearchResults(data.users || [])
    } catch (error) {
      console.error("Error searching users:", error)
      toast({
        title: "Error",
        description: "Failed to search users",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setSelectedUser(null)
    searchUsers(value)
  }

  const handleAddParticipant = async () => {
    if (!selectedUser) {
      toast({
        title: "Error",
        description: "Please select a user to add",
        variant: "destructive",
      })
      return
    }

    try {
      setIsAdding(true)
      const { token } = await getCurrentToken()

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication failed",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`/api/deal-rooms/${dealRoomId}/participants`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: selectedUser.email,
          role: selectedRole,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add participant")
      }

      const data = await response.json()
      onParticipantAdded(data.participant)

      toast({
        title: "Success",
        description: `${selectedUser.full_name || selectedUser.email} has been added to the deal room`,
      })

      // Reset form
      setSearchQuery("")
      setSearchResults([])
      setSelectedUser(null)
      setSelectedRole("PARTICIPANT")
      onClose()
    } catch (error) {
      console.error("Error adding participant:", error)
      toast({
        title: "Error",
        description: String(error),
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const handleClose = () => {
    setSearchQuery("")
    setSearchResults([])
    setSelectedUser(null)
    setSelectedRole("PARTICIPANT")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-slate-200">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Add Participant</DialogTitle>
          <DialogDescription className="text-slate-400">
            Search for a user by email or name to add them to this deal room.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-slate-300">
              Search Users
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="search"
                placeholder="Enter email or name..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-slate-200 placeholder-slate-400"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
              )}
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <Label className="text-slate-300">Search Results</Label>
              <div className="space-y-1">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUser?.id === user.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-slate-600 text-slate-200">
                        {user.full_name?.[0] || user.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{user.full_name || "No name"}</p>
                      <p className="text-sm opacity-80 truncate">{user.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected User */}
          {selectedUser && (
            <div className="space-y-2">
              <Label className="text-slate-300">Selected User</Label>
              <div className="flex items-center gap-3 p-3 bg-blue-600 rounded-lg text-white">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedUser.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-blue-700 text-white">
                    {selectedUser.full_name?.[0] || selectedUser.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedUser.full_name || "No name"}</p>
                  <p className="text-sm opacity-90 truncate">{selectedUser.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Role Selection */}
          {selectedUser && (
            <div className="space-y-2">
              <Label htmlFor="role" className="text-slate-300">
                Role
              </Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="PARTICIPANT">Participant</SelectItem>
                  <SelectItem value="PROJECT_MANAGER">Project Manager</SelectItem>
                  <SelectItem value="TECHNICAL_LEAD">Technical Lead</SelectItem>
                  <SelectItem value="STAKEHOLDER">Stakeholder</SelectItem>
                  <SelectItem value="OBSERVER">Observer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* No Results Message */}
          {searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
            <div className="text-center py-8 text-slate-400">
              <Mail className="h-8 w-8 mx-auto mb-2" />
              <p>No users found matching "{searchQuery}"</p>
              <p className="text-sm mt-1">The user might not be registered on the platform yet.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddParticipant}
            disabled={!selectedUser || isAdding}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Participant
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
