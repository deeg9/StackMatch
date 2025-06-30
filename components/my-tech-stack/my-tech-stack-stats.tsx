'use client';

import { motion } from 'framer-motion';
import { DollarSign, Package, CalendarClock, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

const stats = [
  {
    id: 1,
    title: 'Total Annual Spend',
    value: '$548,040',
    change: '+12.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'blue',
    subtitle: 'vs. last year',
    sparklineData: [30, 35, 40, 38, 45, 42, 48, 50, 55, 52, 58, 60]
  },
  {
    id: 2,
    title: 'Active Subscriptions',
    value: '47',
    change: '+5',
    trend: 'up',
    icon: Package,
    color: 'green',
    subtitle: 'applications',
    sparklineData: [42, 42, 43, 43, 44, 45, 45, 46, 46, 47, 47, 47]
  },
  {
    id: 3,
    title: 'Upcoming Renewals',
    value: '8',
    change: 'Next 90 days',
    trend: 'neutral',
    icon: CalendarClock,
    color: 'orange',
    subtitle: '$124,500 total',
    sparklineData: [2, 3, 2, 4, 3, 5, 4, 6, 5, 7, 6, 8]
  },
  {
    id: 4,
    title: 'Potential Savings',
    value: '$32,400',
    change: '5.9%',
    trend: 'down',
    icon: TrendingDown,
    color: 'purple',
    subtitle: 'optimization available',
    sparklineData: [100, 95, 90, 92, 88, 85, 82, 80, 78, 75, 72, 68]
  }
];

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const colorClasses = {
    blue: 'stroke-stackmatch-blue',
    green: 'stroke-trust-green',
    orange: 'stroke-orange-500',
    purple: 'stroke-purple-500'
  };

  return (
    <svg width="100" height="40" className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={colorClasses[color as keyof typeof colorClasses]}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function MyTechStackStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = {
          blue: 'bg-stackmatch-blue/10 text-stackmatch-blue',
          green: 'bg-trust-green/10 text-trust-green',
          orange: 'bg-orange-100 text-orange-600',
          purple: 'bg-purple-100 text-purple-600'
        };

        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-200 group relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-stackmatch-blue to-transparent" />
              </div>

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkline data={stat.sparklineData} color={stat.color} />
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-bold text-stackmatch-navy">{stat.value}</p>
                    {stat.trend === 'up' && (
                      <span className="text-sm font-medium text-trust-green flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change}
                      </span>
                    )}
                    {stat.trend === 'down' && (
                      <span className="text-sm font-medium text-purple-600 flex items-center gap-1">
                        <TrendingDown className="h-3 w-3" />
                        {stat.change}
                      </span>
                    )}
                    {stat.trend === 'neutral' && (
                      <span className="text-sm font-medium text-orange-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{stat.subtitle}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}