'use client'

import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function MyListingsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-stackmatch-blue to-stackmatch-navy rounded-2xl animate-float">
          <FileText className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-stackmatch-navy animate-fade-in">
            My Listings
          </h1>
          <p className="text-xl text-charcoal animate-fade-in">
            Create, manage, and track all your software and service listings
          </p>
        </div>
      </div>
      
      <Link href="/create-listing">
        <Button 
          size="lg" 
          className="bg-trust-green hover:bg-success-green text-white transform hover:scale-105 transition-all duration-200 animate-slide-up"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Listing
        </Button>
      </Link>
    </div>
  )
}