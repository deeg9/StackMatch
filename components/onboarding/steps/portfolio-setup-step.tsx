'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Folder } from 'lucide-react'

export default function PortfolioSetupStep({ data, onUpdate, onNext, onPrev, userType }: any) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1A2B4C] to-[#4A73CC] rounded-lg flex items-center justify-center mx-auto">
          <Folder className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#1A2B4C]">Portfolio Setup</h2>
        <p className="text-gray-600">Showcase your best work</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Portfolio step coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}