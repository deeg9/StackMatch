'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Users, Calendar, DollarSign, ExternalLink, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export interface TechStackItem {
  id: string;
  name: string;
  logo: string;
  category: string;
  annualCost: number;
  monthlyCost: number;
  renewalDate: string;
  status: 'active' | 'renewal-approaching' | 'inactive' | 'trial';
  owner: string;
  department: string;
  totalLicenses: number;
  activeLicenses: number;
  utilizationRate: number;
  contractType: string;
  vendor: string;
}

interface TechStackCardProps {
  item: TechStackItem;
  viewType: 'list' | 'grid';
  onViewDetails: (id: string) => void;
  onExploreAlternatives: (item: TechStackItem) => void;
}

export function TechStackCard({ item, viewType, onViewDetails, onExploreAlternatives }: TechStackCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-trust-green/10 text-trust-green border-trust-green/20';
      case 'renewal-approaching':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'trial':
        return 'bg-purple-100 text-purple-700 border-purple-200';
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
      case 'trial':
        return 'Trial';
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

  if (viewType === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-4 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between gap-4">
            {/* Left Section - Logo, Name, Category */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                {item.logo ? (
                  <Image
                    src={item.logo}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                ) : (
                  <span className="text-lg font-semibold text-gray-400">
                    {item.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-stackmatch-navy">{item.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                  <span className="text-sm text-gray-500">{item.vendor}</span>
                </div>
              </div>
            </div>

            {/* Middle Section - Financial & Renewal Info */}
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500">Annual Cost</p>
                <p className="font-semibold text-stackmatch-navy">
                  ${item.annualCost.toLocaleString()}/yr
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Renewal Date</p>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-stackmatch-navy">{formatDate(item.renewalDate)}</p>
                  <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                    {getStatusLabel(item.status)}
                  </Badge>
                </div>
              </div>

              {/* Usage & Ownership */}
              <div className="min-w-[200px]">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-gray-500">License Utilization</p>
                  <p className="text-sm font-medium">{item.utilizationRate}%</p>
                </div>
                <Progress value={item.utilizationRate} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {item.activeLicenses} / {item.totalLicenses} Licenses Active
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Owner</p>
                <p className="font-medium text-stackmatch-navy">{item.owner}</p>
                <p className="text-xs text-gray-500">{item.department}</p>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => onViewDetails(item.id)}
                className="bg-stackmatch-blue hover:bg-stackmatch-blue/90"
              >
                View Details
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onExploreAlternatives(item)}
              >
                <Search className="h-3 w-3 mr-1" />
                Alternatives
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 h-full hover:shadow-xl transition-all duration-200 group">
        {/* Card Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {item.logo ? (
                <Image
                  src={item.logo}
                  alt={item.name}
                  fill
                  className="object-contain p-2"
                />
              ) : (
                <span className="text-lg font-semibold text-gray-400">
                  {item.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-stackmatch-navy">{item.name}</h3>
              <Badge variant="secondary" className="mt-1">
                {item.category}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Financial & Renewal Information */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Annual Cost</span>
            </div>
            <span className="font-semibold text-lg text-stackmatch-navy">
              ${item.annualCost.toLocaleString()}/yr
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500">Renewal Date</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{formatDate(item.renewalDate)}</span>
              {item.status === 'renewal-approaching' && (
                <span className="text-xs text-orange-600 font-medium">
                  {getDaysUntilRenewal(item.renewalDate)} days
                </span>
              )}
            </div>
          </div>

          <Badge className={`w-full justify-center ${getStatusColor(item.status)}`}>
            {getStatusLabel(item.status)}
          </Badge>
        </div>

        {/* Usage & Ownership Data */}
        <div className="space-y-3 mb-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">License Utilization</span>
              </div>
              <span className="text-sm font-semibold">{item.utilizationRate}%</span>
            </div>
            <Progress value={item.utilizationRate} className="h-2 mb-1" />
            <p className="text-xs text-gray-500">
              {item.activeLicenses} / {item.totalLicenses} Licenses Active
            </p>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs text-gray-500 mb-1">Owner / Point of Contact</p>
            <p className="font-medium text-sm text-stackmatch-navy">{item.owner}</p>
            <p className="text-xs text-gray-500">{item.department}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="default"
            className="w-full bg-stackmatch-blue hover:bg-stackmatch-blue/90"
            onClick={() => onViewDetails(item.id)}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onExploreAlternatives(item)}
          >
            <Search className="h-4 w-4 mr-2" />
            Explore Alternatives
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}