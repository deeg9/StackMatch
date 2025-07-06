'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  FileText,
  ArrowRight,
  Clock,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ClientOverviewProps {
  clientId: string
}

export function ClientOverview({ clientId }: ClientOverviewProps) {
  // Mock data - in production this would come from API
  const financialSummary = {
    totalContractValue: 450000,
    annualRecurringRevenue: 375000,
    nextRenewalDate: '2025-03-15',
    renewalValue: 150000,
    growthRate: 28,
    paymentStatus: 'current'
  }

  const activeAgreements = [
    {
      id: '1',
      name: 'Enterprise CRM Solution',
      value: 250000,
      status: 'active',
      startDate: '2024-03-15',
      endDate: '2025-03-15',
      progress: 75,
      dealRoomId: 'dr-123'
    },
    {
      id: '2',
      name: 'Data Analytics Platform',
      value: 150000,
      status: 'renewal-approaching',
      startDate: '2024-06-01',
      endDate: '2025-03-15',
      progress: 85,
      dealRoomId: 'dr-124'
    },
    {
      id: '3',
      name: 'Security Compliance Suite',
      value: 50000,
      status: 'active',
      startDate: '2024-09-01',
      endDate: '2025-09-01',
      progress: 40,
      dealRoomId: 'dr-125'
    }
  ]

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-trust-green/10 text-trust-green border-trust-green/20'
      case 'renewal-approaching':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Financial Summary */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-trust-green" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Contract Value */}
            <div className="space-y-2">
              <p className="text-sm text-medium-gray">Total Contract Value (TCV)</p>
              <p className="text-2xl font-bold text-stackmatch-navy">
                {formatCurrency(financialSummary.totalContractValue)}
              </p>
              <div className="flex items-center text-trust-green text-sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{financialSummary.growthRate}% YoY</span>
              </div>
            </div>

            {/* Annual Recurring Revenue */}
            <div className="space-y-2">
              <p className="text-sm text-medium-gray">Annual Recurring Revenue (ARR)</p>
              <p className="text-2xl font-bold text-stackmatch-navy">
                {formatCurrency(financialSummary.annualRecurringRevenue)}
              </p>
              <Badge className="bg-trust-green/10 text-trust-green border-trust-green/20">
                {financialSummary.paymentStatus}
              </Badge>
            </div>

            {/* Next Renewal */}
            <div className="space-y-2">
              <p className="text-sm text-medium-gray">Next Renewal Date</p>
              <p className="text-2xl font-bold text-stackmatch-navy">
                {formatDate(financialSummary.nextRenewalDate)}
              </p>
              <p className="text-sm text-orange-600">
                {getDaysUntilRenewal(financialSummary.nextRenewalDate)} days remaining
              </p>
            </div>
          </div>

          {/* Renewal Value Banner */}
          <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-900">Upcoming Renewal Value</p>
                  <p className="text-lg font-bold text-orange-900">
                    {formatCurrency(financialSummary.renewalValue)}
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-orange-700 border-orange-700 hover:bg-orange-100"
              >
                Prepare Renewal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Agreements */}
      <Card className="border-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-stackmatch-blue" />
            Active Agreements
          </CardTitle>
          <Link href={`/clients/${clientId}?tab=agreements`}>
            <Button variant="ghost" size="sm" className="text-stackmatch-blue hover:text-stackmatch-navy">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAgreements.map((agreement) => (
              <div 
                key={agreement.id}
                className="p-4 border-2 rounded-lg hover:border-stackmatch-blue/50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-stackmatch-navy">
                      {agreement.name}
                    </h4>
                    <p className="text-sm text-medium-gray mt-1">
                      {formatDate(agreement.startDate)} - {formatDate(agreement.endDate)}
                    </p>
                  </div>
                  <Badge className={cn("text-xs", getStatusColor(agreement.status))}>
                    {agreement.status === 'renewal-approaching' ? 'Renewal Approaching' : 'Active'}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-medium-gray">Contract Value</span>
                    <span className="font-semibold text-stackmatch-navy">
                      {formatCurrency(agreement.value)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-medium-gray">Progress</span>
                      <span className="text-sm font-medium">{agreement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-stackmatch-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${agreement.progress}%` }}
                      />
                    </div>
                  </div>

                  <Link href={`/deal-rooms/${agreement.dealRoomId}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full hover:bg-stackmatch-blue/10 hover:text-stackmatch-blue"
                    >
                      <Target className="h-4 w-4 mr-2" />
                      Manage in Deal Room
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}