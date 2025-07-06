'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, FileText, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface Client {
  id: string;
  companyName: string;
  logo: string;
  industry: string;
  currentAnnualValue: number;
  activeAgreements: number;
  nextRenewalDate: string;
  status: 'active' | 'renewal-approaching' | 'inactive';
  primaryService: string;
  contractStartDate: string;
  lastContactDate: string;
  accountManager: string;
}

interface ClientCardProps {
  client: Client;
  viewType: 'list' | 'grid';
}

export function ClientCard({ client, viewType }: ClientCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-trust-green/10 text-trust-green border-trust-green/20';
      case 'renewal-approaching':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'renewal-approaching':
        return 'Renewal Approaching';
      case 'inactive':
        return 'Inactive';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntilRenewal = (dateString: string) => {
    const today = new Date();
    const renewalDate = new Date(dateString);
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleManageClient = () => {
    router.push(`/clients/${client.id}`);
  };

  if (viewType === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-stackmatch-blue/50">
          <div className="flex items-center justify-between gap-6">
            {/* Left Section - Logo, Name, Industry */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
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
                <h3 className="font-semibold text-lg text-stackmatch-navy">{client.companyName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {client.industry}
                  </Badge>
                  <span className="text-sm text-medium-gray">· {client.primaryService}</span>
                </div>
              </div>
            </div>

            {/* Middle Section - Financial & Contract Info */}
            <div className="flex items-center gap-8">
              <div>
                <p className="text-sm text-medium-gray">Current Annual Value</p>
                <p className="font-semibold text-lg text-stackmatch-navy">
                  ${client.currentAnnualValue.toLocaleString()}/yr
                </p>
              </div>

              <div>
                <p className="text-sm text-medium-gray">Active Agreements</p>
                <p className="font-semibold text-lg text-stackmatch-navy">
                  {client.activeAgreements} {client.activeAgreements === 1 ? 'Agreement' : 'Agreements'}
                </p>
              </div>

              <div>
                <p className="text-sm text-medium-gray">Next Renewal</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-stackmatch-navy">{formatDate(client.nextRenewalDate)}</p>
                  <Badge className={cn("text-xs", getStatusColor(client.status))}>
                    {getStatusLabel(client.status)}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Section - Action Button */}
            <div>
              <Button
                onClick={handleManageClient}
                className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white min-w-[140px]"
              >
                Manage Client
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 h-full hover:shadow-lg transition-all duration-200 border-2 hover:border-stackmatch-blue/50">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {client.logo ? (
                <Image
                  src={client.logo}
                  alt={client.companyName}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <Building2 className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-stackmatch-navy line-clamp-1">
                {client.companyName}
              </h3>
              <Badge variant="secondary" className="text-xs mt-1">
                {client.industry}
              </Badge>
            </div>
          </div>
        </div>

        {/* Key Financial Summary */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-trust-green" />
              <span className="text-sm text-medium-gray">Current Annual Value</span>
            </div>
            <span className="font-semibold text-stackmatch-navy">
              ${client.currentAnnualValue.toLocaleString()}/yr
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-stackmatch-blue" />
              <span className="text-sm text-medium-gray">Active Agreements</span>
            </div>
            <span className="font-semibold text-stackmatch-navy">
              {client.activeAgreements} {client.activeAgreements === 1 ? 'Agreement' : 'Agreements'}
            </span>
          </div>
        </div>

        {/* Next Key Date */}
        <div className="border-t pt-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-medium-gray">Next Renewal</span>
            </div>
            <Badge className={cn("text-xs", getStatusColor(client.status))}>
              {getStatusLabel(client.status)}
            </Badge>
          </div>
          <p className="font-medium text-stackmatch-navy">
            {formatDate(client.nextRenewalDate)}
          </p>
          {client.status === 'renewal-approaching' && (
            <p className="text-xs text-orange-600 mt-1">
              {getDaysUntilRenewal(client.nextRenewalDate)} days remaining
            </p>
          )}
        </div>

        {/* Primary Action Button */}
        <Button
          onClick={handleManageClient}
          className="w-full bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
        >
          Manage Client
        </Button>
      </Card>
    </motion.div>
  );
}