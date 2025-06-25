'use client'

import { MessageCircle } from 'lucide-react'

export function ReceivedProposalsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-trust-green to-success-green rounded-2xl animate-float">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold text-stackmatch-navy animate-fade-in">
            Received Proposals
          </h1>
          <p className="text-xl text-charcoal animate-fade-in">
            Review, compare, and manage all proposals submitted by vendors
          </p>
        </div>
      </div>
    </div>
  )
}