'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  DollarSign, 
  User, 
  Mail, 
  FileText,
  Clock,
  Users,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Agreement } from './client-agreements'

interface AgreementCardProps {
  agreement: Agreement
}

export function AgreementCard({ agreement }: AgreementCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-trust-green/10 text-trust-green border-trust-green/20'
      case 'renewal-approaching':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active'
      case 'renewal-approaching':
        return 'Renewal Approaching'
      case 'expired':
        return 'Expired'
      default:
        return status
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getDaysUntilRenewal = (dateString: string) => {
    const today = new Date()
    const renewalDate = new Date(dateString)
    const diffTime = renewalDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-2 hover:border-stackmatch-blue/50 transition-all duration-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
                  {agreement.productServiceName}
                </h3>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="text-xs">
                    {agreement.category}
                  </Badge>
                  <Badge className={cn("text-xs", getStatusColor(agreement.status))}>
                    {getStatusLabel(agreement.status)}
                  </Badge>
                  {agreement.licenseCount && (
                    <div className="flex items-center text-sm text-medium-gray">
                      <Users className="h-4 w-4 mr-1" />
                      {agreement.licenseCount} licenses
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contract Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-t border-b">
              {/* Contract Value */}
              <div>
                <div className="flex items-center text-sm text-medium-gray mb-1">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Contract Value
                </div>
                <p className="font-semibold text-stackmatch-navy">
                  {formatCurrency(agreement.contractValue)}
                </p>
              </div>

              {/* Renewal Date */}
              <div>
                <div className="flex items-center text-sm text-medium-gray mb-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  Renewal Date
                </div>
                <p className="font-semibold text-stackmatch-navy">
                  {formatDate(agreement.renewalDate)}
                </p>
                {agreement.status === 'renewal-approaching' && (
                  <p className="text-xs text-orange-600 mt-1">
                    {getDaysUntilRenewal(agreement.renewalDate)} days remaining
                  </p>
                )}
              </div>

              {/* Contract Period */}
              <div>
                <div className="flex items-center text-sm text-medium-gray mb-1">
                  <Clock className="h-4 w-4 mr-1" />
                  Contract Period
                </div>
                <p className="text-sm text-stackmatch-navy">
                  {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}
                </p>
              </div>
            </div>

            {/* Point of Contact */}
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm font-medium text-medium-gray mb-2">Point of Contact</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-stackmatch-blue/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-stackmatch-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-stackmatch-navy">
                      {agreement.pointOfContact.name}
                    </p>
                    <p className="text-sm text-medium-gray">
                      {agreement.pointOfContact.title}
                    </p>
                  </div>
                </div>
                <a
                  href={`mailto:${agreement.pointOfContact.email}`}
                  className="flex items-center gap-1 text-sm text-stackmatch-blue hover:text-stackmatch-navy transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </div>
            </div>

            {/* Action Button */}
            <Link href={`/deal-rooms/${agreement.dealRoomId}`}>
              <Button className="w-full bg-stackmatch-blue hover:bg-stackmatch-navy text-white">
                <FileText className="h-4 w-4 mr-2" />
                Manage
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}