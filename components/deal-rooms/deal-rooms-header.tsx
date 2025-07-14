'use client'

import { Briefcase } from 'lucide-react'

export function DealRoomsHeader() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-stackmatch-blue to-stackmatch-navy rounded-2xl mb-4 animate-float">
        <Briefcase className="w-8 h-8 text-white" />
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-bold text-stackmatch-navy mb-2 animate-fade-in">
        Deal Rooms
      </h1>
      
      <p className="text-lg text-medium-gray max-w-2xl mx-auto animate-fade-in">
        Manage your active negotiations and project discussions
      </p>
    </div>
  )
}