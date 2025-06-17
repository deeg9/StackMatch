'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Bell, MessageSquare, Moon, Sun, ChevronDown, Menu, X,
  Users, FileText, Briefcase, Building2
} from 'lucide-react'

interface MainNavigationProps {
  userType?: 'buyer' | 'seller'
  userName?: string
  companyName?: string
}

export function MainNavigation({ userType = 'buyer', userName, companyName }: MainNavigationProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = userType === 'buyer' ? [
    { href: '/dashboard/buyer', label: 'Dashboard', icon: Building2 },
    { href: '/browse-sellers', label: 'Browse Sellers', icon: Users },
    { href: '/create-listing', label: 'Create Listing', icon: FileText },
    { href: '/deal-rooms', label: 'Deal Rooms', icon: Briefcase },
  ] : [
    { href: '/dashboard/seller', label: 'Dashboard', icon: Building2 },
    { href: '/browse-listings', label: 'Browse Listings', icon: FileText },
    { href: '/proposals', label: 'My Proposals', icon: Briefcase },
    { href: '/deal-rooms', label: 'Deal Rooms', icon: Briefcase },
  ]

  return (
    <nav className="bg-stackmatch-navy border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white hover:text-stackmatch-blue transition-colors">
              StackMatch
            </Link>
            <Badge className="ml-3 bg-stackmatch-blue text-white capitalize">
              {userType}
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-white hover:text-stackmatch-blue transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-stackmatch-blue hover:bg-white/10 relative"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-trust-green rounded-full animate-pulse"></span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-stackmatch-blue hover:bg-white/10 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="hidden sm:flex text-white hover:text-stackmatch-blue hover:bg-white/10"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              className="hidden sm:flex text-white hover:text-stackmatch-blue hover:bg-white/10"
            >
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/avatar.png" />
                <AvatarFallback className="bg-stackmatch-blue text-white">
                  {userName ? userName.split(' ').map(n => n[0]).join('') : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium">{userName || 'User'}</div>
                <div className="text-xs text-white/70">{companyName}</div>
              </div>
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-white hover:text-stackmatch-blue hover:bg-white/10"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-white hover:text-stackmatch-blue transition-colors px-3 py-2 rounded-lg hover:bg-white/10"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Mobile user info */}
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback className="bg-stackmatch-blue text-white text-sm">
                      {userName ? userName.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-white">
                    <div className="text-sm font-medium">{userName || 'User'}</div>
                    <div className="text-xs text-white/70">{companyName}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}