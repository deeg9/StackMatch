'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, FileText, Building2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ClientRecord } from '@/app/clients/[id]/page'

interface ClientRecordHeaderProps {
  client: ClientRecord
  onNewProposal: () => void
  onLogActivity: () => void
}

export function ClientRecordHeader({ client, onNewProposal, onLogActivity }: ClientRecordHeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link 
        href="/your-clients" 
        className="inline-flex items-center text-medium-gray hover:text-stackmatch-blue transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Your Clients
      </Link>

      {/* Client Identity Section */}
      <div className="bg-white rounded-lg shadow-sm border-2 border-slate-200 p-6">
        <div className="flex items-start justify-between">
          {/* Left Side - Logo and Company Info */}
          <div className="flex items-start gap-4">
            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {client.logo ? (
                <Image
                  src={client.logo}
                  alt={client.companyName}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <Building2 className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-stackmatch-navy mb-2">
                {client.companyName}
              </h1>
              <div className="flex items-center gap-6 text-medium-gray">
                <div>
                  <span className="text-sm">Client Since:</span>
                  <span className="ml-2 font-medium text-stackmatch-navy">
                    {formatDate(client.clientSince)}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div>
                  <span className="text-sm">Total Lifetime Value:</span>
                  <span className="ml-2 font-medium text-stackmatch-navy">
                    {formatCurrency(client.totalLifetimeValue)}
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300" />
                <div>
                  <span className="text-sm">Active Agreements:</span>
                  <span className="ml-2 font-medium text-stackmatch-navy">
                    {client.activeAgreements}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={onNewProposal}
              className="bg-trust-green hover:bg-trust-green/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Proposal
            </Button>
            <Button
              onClick={onLogActivity}
              variant="outline"
              className="border-stackmatch-blue text-stackmatch-blue hover:bg-stackmatch-blue/10"
            >
              <FileText className="h-4 w-4 mr-2" />
              Log an Activity
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}