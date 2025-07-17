'use client';

import { KPICard } from '@/components/shared/kpi-card';
import { DollarSign, Package, CalendarClock, TrendingDown } from 'lucide-react';

const stats = [
  {
    title: 'Total Annual Spend',
    value: '$548,040',
    subtitle: 'vs. last year',
    trend: { value: '+12.3%', direction: 'up' as const },
    icon: DollarSign,
    color: 'text-stackmatch-blue',
    bgColor: 'bg-stackmatch-blue/10',
    borderColor: 'hover:border-stackmatch-blue',
    sparklineData: [30, 35, 40, 38, 45, 42, 48, 50, 55, 52, 58, 60]
  },
  {
    title: 'Active Subscriptions',
    value: '47',
    subtitle: 'applications',
    trend: { value: '+5', direction: 'up' as const },
    icon: Package,
    color: 'text-trust-green',
    bgColor: 'bg-trust-green/10',
    borderColor: 'hover:border-trust-green',
    sparklineData: [42, 42, 43, 43, 44, 45, 45, 46, 46, 47, 47, 47]
  },
  {
    title: 'Upcoming Renewals',
    value: '8',
    subtitle: '$124,500 total',
    trend: { value: 'Next 90 days', direction: 'neutral' as const },
    icon: CalendarClock,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    borderColor: 'hover:border-orange-500',
    sparklineData: [2, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8]
  },
  {
    title: 'Potential Savings',
    value: '$32,400',
    subtitle: 'optimization available',
    trend: { value: '5.9%', direction: 'down' as const },
    icon: TrendingDown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    borderColor: 'hover:border-purple-500',
    sparklineData: [100, 95, 90, 92, 88, 85, 82, 80, 78, 75, 72, 68]
  }
];

export function MyTechStackStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <KPICard
          key={stat.title}
          {...stat}
          animationDelay={index * 100}
        />
      ))}
    </div>
  );
}