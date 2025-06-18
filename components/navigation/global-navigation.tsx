'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Bell, MessageSquare, Menu, X, ChevronDown, Plus, Users,
  HelpCircle, CreditCard, Settings, LayoutDashboard, Briefcase, LogOut,
  Search, Star, Shield, CircleDot, Heart
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  userType: 'buyer' | 'seller'
  isVerified: boolean
  isOnline: boolean
  profileCompletion: number
}

interface GlobalNavigationProps {
  user?: User | null
  notificationCount?: number
  messageCount?: number
}

export function GlobalNavigation({ user, notificationCount = 0, messageCount = 0 }: GlobalNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const pathname = usePathname()

  // Mock notifications for demo
  useEffect(() => {
    if (user) {
      setNotifications([
        { id: 1, title: 'New proposal received', time: '2 min ago', unread: true },
        { id: 2, title: 'Project milestone completed', time: '1 hour ago', unread: true },
        { id: 3, title: 'Payment processed', time: '3 hours ago', unread: false },
      ])
    }
  }, [user])

  const mainNavigation = [
    { href: `/dashboard/${user?.userType || 'buyer'}`, label: 'Dashboard', icon: LayoutDashboard },
    { href: '/browse-sellers', label: 'Browse Sellers', icon: Users },
    { href: '/deal-rooms', label: 'Deal Rooms', icon: Briefcase },
    { href: '/stacktalk', label: 'StackTalk', icon: MessageSquare },
  ]

  const userMenuItems = user ? [
    { href: '/profile', label: 'Profile Settings', icon: Settings },
    { href: '/saved-sellers', label: 'Saves', icon: Heart },
    { href: '/billing', label: 'Billing', icon: CreditCard },
    { href: '/support', label: 'Help & Support', icon: HelpCircle },
  ] : []

  const isActivePage = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    // Implement sign out logic
    console.log('Signing out...')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-stackmatch-navy to-stackmatch-blue rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-2xl font-bold text-stackmatch-navy">StackMatch</span>
            </Link>
          </div>

          {/* Center Navigation - Desktop */}
          <div className="hidden lg:flex items-center space-x-8">
            {mainNavigation.map((item) => {
              const Icon = item.icon
              const isActive = isActivePage(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-stackmatch-blue bg-stackmatch-blue/10 shadow-sm"
                      : "text-charcoal hover:text-stackmatch-blue hover:bg-slate-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions - Only for authenticated users */}
          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5 text-charcoal" />
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  {notificationCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {notificationCount} new
                    </Badge>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.slice(0, 3).map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex items-start space-x-3 p-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full mt-2",
                      notification.unread ? "bg-stackmatch-blue" : "bg-slate-300"
                    )} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stackmatch-navy">{notification.title}</p>
                      <p className="text-xs text-medium-gray">{notification.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center py-2">
                  <Link href="/notifications" className="text-stackmatch-blue text-sm font-medium">
                    View All Notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Messages */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <MessageSquare className="w-5 h-5 text-charcoal" />
                  {messageCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-trust-green text-white text-xs">
                      {messageCount > 9 ? '9+' : messageCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Messages</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center py-4 text-medium-gray">
                  No new messages
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center py-2">
                  <Link href="/messages" className="text-stackmatch-blue text-sm font-medium">
                    View All Messages
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 p-2">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-stackmatch-blue text-white text-sm">
                        {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {user?.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-trust-green rounded-full border-2 border-white" />
                    )}
                    {user?.isVerified && (
                      <div className="absolute -top-0.5 -right-0.5">
                        <Shield className="w-3 h-3 text-trust-green" />
                      </div>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-stackmatch-navy">{user?.name || 'User'}</span>
                      {user?.isVerified && <Shield className="w-3 h-3 text-trust-green" />}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-xs capitalize",
                          user?.userType === 'buyer' ? "bg-stackmatch-blue/10 text-stackmatch-blue" : "bg-trust-green/10 text-trust-green"
                        )}
                      >
                        {user?.userType || 'user'}
                      </Badge>
                      {user && user.profileCompletion < 100 && (
                        <span className="text-xs text-medium-gray">
                          {user.profileCompletion}% complete
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-medium-gray" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex items-center space-x-2">
                    <span>{user?.name || 'User'}</span>
                    {user?.isVerified && <Shield className="w-4 h-4 text-trust-green" />}
                  </div>
                  <div className="text-xs text-medium-gray font-normal">{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {userMenuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link href={item.href} className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4">
            <div className="space-y-2">
              {/* Main navigation links */}
              {mainNavigation.map((item) => {
                const Icon = item.icon
                const isActive = isActivePage(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "text-stackmatch-blue bg-stackmatch-blue/10"
                        : "text-charcoal hover:text-stackmatch-blue hover:bg-slate-50"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              <div className="pt-4 mt-4 border-t border-slate-200">
                <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-stackmatch-blue text-white">
                        {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {user?.isOnline && (
                      <CircleDot className="absolute -bottom-1 -right-1 w-4 h-4 text-trust-green" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-stackmatch-navy">{user?.name || 'User'}</span>
                      {user?.isVerified && <Shield className="w-3 h-3 text-trust-green" />}
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs capitalize",
                        user?.userType === 'buyer' ? "bg-stackmatch-blue/10 text-stackmatch-blue" : "bg-trust-green/10 text-trust-green"
                      )}
                    >
                      {user?.userType || 'user'}
                    </Badge>
                  </div>
                </div>

                {userMenuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-charcoal hover:text-stackmatch-blue hover:bg-slate-50 transition-all"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}

                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-all w-full text-left mt-2"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}