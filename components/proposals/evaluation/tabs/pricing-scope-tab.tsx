'use client'

import { DollarSign, Package, Users, Calendar, TrendingUp, Info } from 'lucide-react'
import { AIGeneratedProposal } from '@/types/ai-proposal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface PricingScopeTabProps {
  proposal: AIGeneratedProposal
}

export function PricingScopeTab({ proposal }: PricingScopeTabProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const firstYearTotal = proposal.pricingScoping.totalProposedCost
  const annualRecurring = proposal.pricingScoping.annualLicenseFee + 
    proposal.pricingScoping.recurringFees.reduce((sum, fee) => sum + fee.cost, 0)

  return (
    <div className="space-y-6">
      {/* Pricing Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Pricing Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">First Year Total</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(firstYearTotal)}</p>
              <p className="text-xs text-gray-500 mt-1">Including setup costs</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Annual Recurring</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(annualRecurring)}</p>
              <p className="text-xs text-gray-500 mt-1">Year 2 onwards</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Licensing Model</p>
              <p className="text-lg font-bold text-purple-600">
                {proposal.pricingScoping.licensingModel.charAt(0).toUpperCase() + 
                 proposal.pricingScoping.licensingModel.slice(1).replace('-', ' ')}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatCurrency(proposal.pricingScoping.annualLicenseFee / 3000 / 12)}/user/month
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* One-Time Costs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">One-Time Implementation Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposal.pricingScoping.oneTimeCosts.map((cost) => (
                <div key={cost.id} className="flex items-start justify-between py-2 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{cost.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{cost.description}</p>
                  </div>
                  <p className="font-semibold text-gray-900 ml-4">{formatCurrency(cost.cost)}</p>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="flex justify-between font-semibold">
                <span>Total One-Time Costs</span>
                <span className="text-lg">
                  {formatCurrency(
                    proposal.pricingScoping.oneTimeCosts.reduce((sum, cost) => sum + cost.cost, 0)
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recurring Fees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Annual Recurring Fees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposal.pricingScoping.recurringFees.map((fee) => (
                <div key={fee.id} className="flex items-start justify-between py-2 border-b last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{fee.name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{fee.description}</p>
                  </div>
                  <p className="font-semibold text-gray-900 ml-4">{formatCurrency(fee.cost)}</p>
                </div>
              ))}
              <Separator className="my-3" />
              <div className="flex justify-between font-semibold">
                <span>Total Annual Recurring</span>
                <span className="text-lg">{formatCurrency(annualRecurring)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Included Modules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            Included Modules & Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {proposal.pricingScoping.includedModules.map((module, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full" />
                <span className="text-sm font-medium text-gray-700">{module}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optional Modules */}
      {proposal.pricingScoping.optionalModules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Optional Add-On Modules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {proposal.pricingScoping.optionalModules.map((module, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{module}</span>
                  <Badge variant="secondary">Available</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Support Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-600" />
            Recommended Support Team
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {proposal.pricingScoping.bauSupportRoles.map((role, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{role.roleName}</h4>
                  <Badge variant="outline">
                    {role.recommendedCount} {role.recommendedCount === 1 ? 'Person' : 'People'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{role.responsibilities}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Training Program
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Methods</h4>
            <div className="flex flex-wrap gap-2">
              {proposal.pricingScoping.trainingDeliveryMethods.map((method, index) => (
                <Badge key={index} variant="secondary">
                  {method}
                </Badge>
              ))}
            </div>
          </div>
          
          {proposal.pricingScoping.trainingDescription && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Training Details</h4>
              <p className="text-sm text-gray-600">{proposal.pricingScoping.trainingDescription}</p>
            </div>
          )}

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Training Investment</span>
            <span className="font-semibold text-gray-900">
              {formatCurrency(proposal.pricingScoping.trainingCosts || 0)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Model Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-600" />
            Pricing Model Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700">{proposal.pricingScoping.pricingModelDescription}</p>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Technology Stack:</span> {proposal.pricingScoping.technologyStack}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}