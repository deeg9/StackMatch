'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SidebarWidget } from '@/components/ui/sidebar-widget';
import { 
  FileText, 
  Calendar, 
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowRight,
  Building2,
  Users,
  BarChart3,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function YourClientsSidebar() {
  // Mock data for sidebar sections
  const quickActions = [
    { id: 1, label: 'Export Reports', icon: FileText },
    { id: 2, label: 'Schedule Review', icon: Calendar },
    { id: 3, label: 'Analyze Trends', icon: TrendingUp }
  ];

  const revenueBreakdown = [
    { industry: 'Technology', percentage: 35, value: 997500, color: 'bg-stackmatch-blue' },
    { industry: 'Finance', percentage: 28, value: 798000, color: 'bg-trust-green' },
    { industry: 'Healthcare', percentage: 20, value: 570000, color: 'bg-purple-600' },
    { industry: 'Retail', percentage: 10, value: 285000, color: 'bg-orange-600' },
    { industry: 'Other', percentage: 7, value: 199500, color: 'bg-gray-500' }
  ];

  const upcomingReviews = [
    { id: 1, client: 'TechCorp Industries', date: '2025-02-05', type: 'Quarterly Review' },
    { id: 2, client: 'Global Finance Corp', date: '2025-02-12', type: 'Annual Review' },
    { id: 3, client: 'RetailFlow Systems', date: '2025-02-18', type: 'Renewal Discussion' },
    { id: 4, client: 'HealthTech Solutions', date: '2025-02-25', type: 'Strategy Session' }
  ];

  const clientHealthScores = [
    { client: 'Global Finance Corp', score: 95, trend: 'up' },
    { client: 'TechCorp Industries', score: 88, trend: 'stable' },
    { client: 'HealthTech Solutions', score: 82, trend: 'up' },
    { client: 'RetailFlow Systems', score: 65, trend: 'down' }
  ];

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-trust-green';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-stackmatch-navy flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            const isPrimary = index === 0;
            
            if (isPrimary) {
              return (
                <Button
                  key={action.id}
                  className="w-full justify-start bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              );
            }
            
            return (
              <button
                key={action.id}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:text-stackmatch-blue transition-colors"
              >
                <Icon className="w-4 h-4" />
                {action.label}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <SidebarWidget
        title="Revenue Breakdown by Industry"
        icon={DollarSign}
        className="border-2"
      >
          {revenueBreakdown.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-medium-gray">{item.industry}</span>
                <span className="font-medium text-stackmatch-navy">
                  {formatCurrency(item.value)}
                </span>
              </div>
              <div className="relative">
                <Progress value={item.percentage} className="h-2" />
                <div 
                  className={cn("absolute top-0 left-0 h-2 rounded-full transition-all", item.color)}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className="text-xs text-medium-gray">{item.percentage}% of total</p>
            </div>
          ))}
      </SidebarWidget>

      {/* Upcoming Client Reviews */}
      <SidebarWidget
        title="Upcoming Client Reviews"
        icon={Calendar}
        className="border-2"
      >
          {upcomingReviews.map((review) => (
            <div 
              key={review.id} 
              className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-1">
                <h4 className="font-medium text-sm text-stackmatch-navy line-clamp-1">
                  {review.client}
                </h4>
                <ArrowRight className="h-4 w-4 text-medium-gray flex-shrink-0" />
              </div>
              <p className="text-xs text-medium-gray">{review.type}</p>
              <p className="text-xs text-stackmatch-blue mt-1">
                {new Date(review.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          ))}
      </SidebarWidget>

      {/* Client Health Scores */}
      <SidebarWidget
        title="Client Health Scores"
        icon={Users}
        className="border-2"
        actionLabel="View All Health Scores"
        onAction={() => window.location.href = '/your-clients/health-scores'}
      >
          {clientHealthScores.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div className="flex-1">
                <p className="font-medium text-sm text-stackmatch-navy">{item.client}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("text-2xl font-bold", getHealthColor(item.score))}>
                    {item.score}
                  </span>
                  <span className="text-xs text-medium-gray">/ 100</span>
                  {item.trend === 'up' && (
                    <TrendingUp className="h-3 w-3 text-trust-green" />
                  )}
                  {item.trend === 'down' && (
                    <AlertCircle className="h-3 w-3 text-orange-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
      </SidebarWidget>
    </div>
  );
}