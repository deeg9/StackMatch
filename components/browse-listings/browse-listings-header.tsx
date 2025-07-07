'use client'

import { useEffect, useState } from 'react'
import { FileText, TrendingUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function BrowseListingsHeader() {
  const [activeCount, setActiveCount] = useState(0)
  const targetCount = 347

  useEffect(() => {
    const duration = 2000
    const increment = targetCount / (duration / 16)
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= targetCount) {
        setActiveCount(targetCount)
        clearInterval(timer)
      } else {
        setActiveCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-center mb-8 animate-fade-in">
      <div className="flex justify-center items-center gap-3 mb-4">
        <div className="relative">
          <FileText className="w-10 h-10 text-stackmatch-blue" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-trust-green rounded-full flex items-center justify-center">
            <TrendingUp className="w-2.5 h-2.5 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-stackmatch-navy">
          Browse Project Listings
        </h1>
      </div>
      
      <p className="text-xl text-charcoal mb-3 max-w-2xl mx-auto font-medium">
        Discover available projects to bid on
      </p>
      
      <div className="flex items-center justify-center gap-2 text-stackmatch-blue mb-6">
        <div className="w-2 h-2 bg-trust-green rounded-full animate-pulse"></div>
        <span className="text-lg font-semibold">
          {activeCount.toLocaleString()} active opportunities
        </span>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="bg-gradient-to-r from-trust-green/10 to-stackmatch-blue/10 rounded-full px-6 py-2 border border-trust-green/20">
          <span className="text-sm text-stackmatch-navy font-medium">
            🎯 Matched to your expertise • 📊 Transparent budgets • ⚡ Fast response times
          </span>
        </div>
        
        <Link href="/create-proposal">
          <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Create Smart Proposal
          </Button>
        </Link>
      </div>
    </div>
  )
}