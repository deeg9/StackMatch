"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/mode-toggle"
import { useClientAuth } from "@/hooks/useClientAuth"
import { Home, MessageSquare, Bell, LogOut, Settings, User } from "lucide-react"

function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading, signOut } = useClientAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  if (loading) {
    return (
      <nav className="border-b bg-[#0a101e] text-white">
        <div className="container flex h-14 items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-[#0a101e] text-white">
      <div className="container flex h-14 items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-blue-500 text-white rounded-md p-1 font-bold">
              <span>SM</span>
            </div>
            <span className="font-bold text-lg">StackMatch</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center space-x-8">
          <Link
            href="/buyer-dashboard"
            className={`flex items-center space-x-1 ${
              isActive("/buyer-dashboard") ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/browse-sellers"
            className={`flex items-center space-x-1 ${
              isActive("/browse-sellers") ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Browse Sellers</span>
          </Link>
          <Link
            href="/deal-rooms"
            className={`flex items-center space-x-1 ${
              isActive("/deal-rooms") ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Deal Rooms</span>
          </Link>
          <Link
            href="/forum"
            className={`flex items-center space-x-1 ${
              isActive("/forum") ? "text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Forum</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="text-white">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="h-5 w-5" />
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg"} alt={user.email} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => router.push("/signup")}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export { Navigation }
export default Navigation
