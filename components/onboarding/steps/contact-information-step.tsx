'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Phone } from 'lucide-react'

export default function ContactInformationStep({ data, onUpdate, onNext, onPrev, userType }: any) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1A2B4C] to-[#4A73CC] rounded-lg flex items-center justify-center mx-auto">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-[#1A2B4C]">Contact Information</h2>
        <p className="text-gray-600">How clients can reach you</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Contact information step coming soon...</p>
        </CardContent>
      </Card>
    </div>
  )
}