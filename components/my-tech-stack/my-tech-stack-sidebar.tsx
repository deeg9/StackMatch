'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { SidebarWidget } from '@/components/ui/sidebar-widget';
import { 
  Sparkles, 
  FileText, 
  Download, 
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  PieChart,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export function MyTechStackSidebar() {
  // Sample data for cost breakdown
  const costBreakdown = [
    { category: 'CRM', amount: 156000, percentage: 28, color: 'bg-blue-500' },
    { category: 'Productivity', amount: 84000, percentage: 15, color: 'bg-green-500' },
    { category: 'HR', amount: 96000, percentage: 18, color: 'bg-purple-500' },
    { category: 'Communication', amount: 48000, percentage: 9, color: 'bg-orange-500' },
    { category: 'Marketing', amount: 76800, percentage: 14, color: 'bg-pink-500' },
    { category: 'Other', amount: 87240, percentage: 16, color: 'bg-gray-500' }
  ];

  // Sample upcoming renewals
  const upcomingRenewals = [
    { name: 'Workday', date: '2025-01-30', amount: 96000, daysLeft: 30 },
    { name: 'DocuSign', date: '2025-02-28', amount: 14400, daysLeft: 59 },
    { name: 'Slack', date: '2025-02-10', amount: 28800, daysLeft: 41 },
    { name: 'Salesforce', date: '2025-03-15', amount: 156000, daysLeft: 74 }
  ];

  // Sample optimization suggestions
  const optimizations = [
    {
      title: 'Reduce Zendesk licenses',
      description: 'Only 70% utilization detected',
      savings: '$10,800/year',
      icon: TrendingUp
    },
    {
      title: 'Consolidate communication tools',
      description: 'Using both Slack and Teams',
      savings: '$28,800/year',
      icon: Sparkles
    },
    {
      title: 'Review inactive licenses',
      description: '15 unused GitHub seats',
      savings: '$3,150/year',
      icon: AlertCircle
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-stackmatch-navy flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start gap-2 bg-stackmatch-blue hover:bg-stackmatch-navy text-white">
              <FileText className="h-4 w-4" />
              Generate Spend Report
            </Button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
              <Download className="h-4 w-4" />
              Export License Data
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors">
              <Calendar className="h-4 w-4" />
              Sync Renewal Calendar
            </button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Cost Breakdown */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SidebarWidget
          title="Cost Breakdown"
          icon={PieChart}
        >
          <div className="space-y-3">
            {costBreakdown.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm font-semibold">${(item.amount / 1000).toFixed(0)}K</span>
                </div>
                <div className="relative">
                  <Progress value={item.percentage} className="h-2" />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Annual Spend</span>
              <span className="text-lg font-bold text-stackmatch-navy">$548,040</span>
            </div>
          </div>
        </SidebarWidget>
      </motion.div>

      {/* Upcoming Renewals */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SidebarWidget
          title="Upcoming Renewals"
          icon={Calendar}
          actionLabel="Next 90 days"
        >
          <div className="space-y-3">
            {upcomingRenewals.map((renewal, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-stackmatch-navy">{renewal.name}</p>
                    <p className="text-sm text-gray-500">{renewal.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">${(renewal.amount / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-orange-600 font-medium">{renewal.daysLeft} days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SidebarWidget>
      </motion.div>

      {/* Optimization Suggestions */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <SidebarWidget
          title="Optimization Suggestions"
          icon={Sparkles}
          className="border-2 border-purple-100 bg-purple-50/50"
        >
          <div className="space-y-3">
            {optimizations.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index}
                  className="p-3 bg-white rounded-lg border border-purple-200 hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Icon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-stackmatch-navy text-sm">{item.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                      <p className="text-sm font-semibold text-trust-green mt-2">{item.savings}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-purple-100 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-purple-900">Total Potential Savings</span>
              <span className="text-lg font-bold text-purple-900">$42,750/year</span>
            </div>
          </div>
        </SidebarWidget>
      </motion.div>
    </div>
  );
}