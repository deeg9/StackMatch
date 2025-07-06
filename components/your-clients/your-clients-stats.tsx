'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsData {
  totalActiveClients: number;
  totalContractValue: number;
  avgRevenuePerClient: number;
  upcomingRenewals: number;
  clientGrowth: number;
  revenueGrowth: number;
  avgClientGrowth: number;
  renewalGrowth: number;
}

export function YourClientsStats() {
  // Mock data - in production, this would come from an API
  const stats: StatsData = {
    totalActiveClients: 24,
    totalContractValue: 2850000,
    avgRevenuePerClient: 118750,
    upcomingRenewals: 8,
    clientGrowth: 12, // percentage
    revenueGrowth: 28, // percentage
    avgClientGrowth: 15, // percentage
    renewalGrowth: 5 // percentage
  };

  const kpiCards = [
    {
      title: 'Total Active Clients',
      value: stats.totalActiveClients,
      icon: Users,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10',
      growth: stats.clientGrowth,
      format: 'number'
    },
    {
      title: 'Total Contract Value',
      value: stats.totalContractValue,
      icon: DollarSign,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      growth: stats.revenueGrowth,
      format: 'currency'
    },
    {
      title: 'Avg. Revenue Per Client',
      value: stats.avgRevenuePerClient,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      growth: stats.avgClientGrowth,
      format: 'currency'
    },
    {
      title: 'Upcoming Renewals (Next 90 Days)',
      value: stats.upcomingRenewals,
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      growth: stats.renewalGrowth,
      format: 'number',
      suffix: ' clients'
    }
  ];

  const formatValue = (value: number, format: string, suffix?: string) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value.toLocaleString() + (suffix || '');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiCards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card
            key={index}
            className={cn(
              "relative overflow-hidden border-2 hover:border-stackmatch-blue/50 transition-all duration-300 hover:shadow-lg",
              "transform hover:-translate-y-1"
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-lg", card.bgColor)}>
                  <Icon className={cn("h-6 w-6", card.color)} />
                </div>
                {card.growth > 0 && (
                  <div className="flex items-center text-trust-green text-sm font-medium">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>+{card.growth}%</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-sm font-medium text-medium-gray mb-2">
                {card.title}
              </h3>
              
              <p className="text-2xl font-bold text-stackmatch-navy">
                {formatValue(card.value, card.format, card.suffix)}
              </p>

              {/* Decorative gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-stackmatch-blue/20 to-transparent" />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}