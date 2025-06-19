'use client'

import { Activity, Briefcase, Clock } from 'lucide-react'

export function DealRoomsHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-stackmatch-blue to-stackmatch-navy rounded-2xl mb-4 animate-float">
        <Briefcase className="w-8 h-8 text-white" />
      </div>
      
      <h1 className="text-4xl font-bold text-stackmatch-navy mb-2 animate-fade-in">
        Deal Rooms
      </h1>
      
      <p className="text-xl text-charcoal mb-6 animate-fade-in">
        Manage your active negotiations and project discussions
      </p>
      
      <div className="flex justify-center items-center gap-8 animate-slide-up">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-trust-green" />
          <span className="text-medium-gray">
            <span className="font-semibold text-stackmatch-navy">15</span> Total Deal Rooms
          </span>
        </div>
        
        <div className="w-1 h-1 bg-medium-gray rounded-full"></div>
        
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-stackmatch-blue" />
          <span className="text-medium-gray">
            <span className="font-semibold text-stackmatch-navy">3</span> Upcoming Deadlines
          </span>
        </div>
      </div>
    </div>
  )
}