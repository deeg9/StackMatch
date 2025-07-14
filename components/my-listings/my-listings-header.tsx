'use client'

import { FileText, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function MyListingsHeader() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-stackmatch-blue to-stackmatch-navy rounded-2xl mb-4 animate-float">
        <FileText className="w-8 h-8 text-white" />
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-bold text-stackmatch-navy mb-2 animate-fade-in">
        My Listings
      </h1>
      
      <p className="text-lg text-medium-gray max-w-2xl mx-auto mb-6 animate-fade-in">
        Create, manage, and track all your software and service listings
      </p>
      
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