'use client'

import { MessageCircle } from 'lucide-react'

export function ReceivedProposalsHeader() {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-trust-green to-success-green rounded-2xl mb-4 animate-float">
        <MessageCircle className="w-8 h-8 text-white" />
      </div>
      
      <h1 className="text-4xl sm:text-5xl font-bold text-stackmatch-navy mb-2 animate-fade-in">
        Received Proposals
      </h1>
      
      <p className="text-lg text-medium-gray max-w-2xl mx-auto animate-fade-in">
        Review, compare, and manage all proposals submitted by vendors
      </p>
    </div>
  )
}