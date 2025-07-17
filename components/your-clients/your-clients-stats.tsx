'use client';

import { KPICard } from '@/components/shared/kpi-card';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';

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
      value: stats.totalActiveClients.toString(),
      subtitle: 'Active accounts',
      trend: { value: `+${stats.clientGrowth}%`, direction: 'up' as const },
      icon: Users,
      color: 'text-stackmatch-blue',
      bgColor: 'bg-stackmatch-blue/10',
      borderColor: 'hover:border-stackmatch-blue',
      sparklineData: [18, 19, 20, 21, 22, 23, 23, 24]
    },
    {
      title: 'Total Contract Value',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(stats.totalContractValue),
      subtitle: 'Annual recurring revenue',
      trend: { value: `+${stats.revenueGrowth}%`, direction: 'up' as const },
      icon: DollarSign,
      color: 'text-trust-green',
      bgColor: 'bg-trust-green/10',
      borderColor: 'hover:border-trust-green',
      sparklineData: [2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.85]
    },
    {
      title: 'Avg. Revenue Per Client',
      value: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(stats.avgRevenuePerClient),
      subtitle: 'Per client value',
      trend: { value: `+${stats.avgClientGrowth}%`, direction: 'up' as const },
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      borderColor: 'hover:border-purple-500',
      sparklineData: [95, 100, 105, 110, 112, 115, 117, 118.75]
    },
    {
      title: 'Upcoming Renewals',
      value: `${stats.upcomingRenewals}`,
      subtitle: 'Next 90 days',
      trend: { value: `+${stats.renewalGrowth}%`, direction: 'up' as const },
      icon: Calendar,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      borderColor: 'hover:border-orange-500',
      sparklineData: [6, 5, 6, 7, 6, 8, 7, 8]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpiCards.map((card, index) => (
        <KPICard
          key={card.title}
          {...card}
          animationDelay={index * 100}
        />
      ))}
    </div>
  );
}