'use client'

import { useEffect, useState } from 'react'
import { Sparkles, TrendingUp, Award, Clock, AlertCircle } from "lucide-react"

interface TickerItem {
  id: string
  type: 'new_listing' | 'proposal_accepted' | 'deadline' | 'featured'
  content: string
  icon: JSX.Element
}

export function TickerBanner() {
  const [tickerItems] = useState<TickerItem[]>([
    {
      id: '1',
      type: 'new_listing',
      content: 'New high-priority ERP implementation project posted - Budget: $500K+',
      icon: <Sparkles className="h-4 w-4" />
    },
    {
      id: '2',
      type: 'proposal_accepted',
      content: 'CloudSync Pro awarded CRM migration project for TechCorp Industries',
      icon: <Award className="h-4 w-4" />
    },
    {
      id: '3',
      type: 'deadline',
      content: 'Deadline approaching: HR System RFP closes in 48 hours',
      icon: <Clock className="h-4 w-4" />
    },
    {
      id: '4',
      type: 'featured',
      content: '15 new software vendors joined StackMatch this week',
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      id: '5',
      type: 'new_listing',
      content: 'Urgent: Financial services company seeking compliance software - Fast track',
      icon: <AlertCircle className="h-4 w-4" />
    }
  ])

  return (
    <div className="bg-gradient-to-r from-[#1A2B4C] to-[#4A73CC] text-white py-2 overflow-hidden relative">
      <div className="ticker-wrapper">
        <div className="ticker-content animate-ticker">
          {/* Duplicate items for seamless loop */}
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="inline-flex items-center space-x-2 mx-8 whitespace-nowrap"
            >
              <span className={`
                ${item.type === 'new_listing' && 'text-[#22C55E]'}
                ${item.type === 'proposal_accepted' && 'text-[#F59E0B]'}
                ${item.type === 'deadline' && 'text-red-400'}
                ${item.type === 'featured' && 'text-[#3B82F6]'}
              `}>
                {item.icon}
              </span>
              <span className="text-sm">{item.content}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#1A2B4C] to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#4A73CC] to-transparent pointer-events-none"></div>
    </div>
  )
}