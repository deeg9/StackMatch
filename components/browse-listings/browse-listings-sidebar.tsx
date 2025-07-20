'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { SidebarWidget } from '@/components/ui/sidebar-widget'
import { 
  Search, 
  Bell, 
  Sparkles, 
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Target,
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react'
import Link from 'next/link'

export function BrowseListingsSidebar() {
  const savedSearches = [
    { id: 1, name: 'High-Budget CRM Projects', count: 12, isActive: true },
    { id: 2, name: 'Healthcare Tech Opportunities', count: 8, isActive: false },
    { id: 3, name: 'Quick Turnaround Projects', count: 5, isActive: true }
  ]

  const recommendedListings = [
    {
      id: '1',
      title: 'AI-Powered Analytics Platform',
      company: 'DataTech Solutions',
      budget: '$200K-$400K',
      matchScore: 98,
      deadline: '5 days'
    },
    {
      id: '2',
      title: 'Cloud Migration Project',
      company: 'Enterprise Corp',
      budget: '$150K-$300K',
      matchScore: 94,
      deadline: '12 days'
    },
    {
      id: '3',
      title: 'Mobile App Development',
      company: 'StartupX Inc',
      budget: '$50K-$100K',
      matchScore: 91,
      deadline: '8 days'
    }
  ]

  const proposalTips = [
    'Personalize your cover letter for each client',
    'Highlight relevant case studies',
    'Include a clear project timeline',
    'Provide transparent pricing breakdown'
  ]

  return (
    <div className="space-y-6">
      {/* Saved Searches */}
      <SidebarWidget
        title="Saved Searches"
        icon={Search}
      >
        <div className="space-y-2">
          {savedSearches.map((search) => (
            <div
              key={search.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <Bell className={`h-4 w-4 ${search.isActive ? 'text-trust-green' : 'text-medium-gray'}`} />
                <span className="text-sm font-medium text-charcoal">{search.name}</span>
              </div>
              <Badge variant="secondary">{search.count}</Badge>
            </div>
          ))}
          <Button variant="outline" className="w-full mt-2" size="sm">
            Manage Alerts
          </Button>
        </div>
      </SidebarWidget>

      {/* AI Recommendations */}
      <SidebarWidget
        title="AI-Matched Opportunities"
        icon={Sparkles}
        className="border-2 border-stackmatch-blue/20"
      >
        <div className="space-y-3">
          {recommendedListings.map((listing) => (
            <div
              key={listing.id}
              className="p-3 bg-gradient-to-r from-stackmatch-blue/5 to-trust-green/5 rounded-lg border border-stackmatch-blue/10"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-stackmatch-navy line-clamp-1">
                  {listing.title}
                </h4>
                <Badge className="bg-trust-green text-white text-xs">
                  {listing.matchScore}%
                </Badge>
              </div>
              <p className="text-xs text-charcoal mb-1">{listing.company}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-medium-gray">{listing.budget}</span>
                <span className="text-attention-orange font-medium">{listing.deadline}</span>
              </div>
              <Link href={`/listings/${listing.id}`}>
                <Button variant="link" size="sm" className="p-0 h-auto mt-2 text-stackmatch-blue">
                  View Details
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </SidebarWidget>

      {/* Quick Stats */}
      <SidebarWidget
        title="Market Insights"
        icon={TrendingUp}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-information-blue" />
              <span className="text-sm text-charcoal">Avg. Competition</span>
            </div>
            <span className="text-sm font-semibold text-charcoal">8-12 proposals</span>
          </div>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-trust-green" />
              <span className="text-sm text-charcoal">Avg. Budget</span>
            </div>
            <span className="text-sm font-semibold text-charcoal">$125K</span>
          </div>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-attention-orange" />
              <span className="text-sm text-charcoal">Response Time</span>
            </div>
            <span className="text-sm font-semibold text-charcoal">48-72 hours</span>
          </div>
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-stackmatch-blue" />
              <span className="text-sm text-charcoal">Win Rate</span>
            </div>
            <span className="text-sm font-semibold text-trust-green">23% average</span>
          </div>
        </div>
      </SidebarWidget>

      {/* Proposal Tips */}
      <SidebarWidget
        title="Winning Proposal Tips"
        icon={BookOpen}
      >
        <div>
          <ul className="space-y-2">
            {proposalTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Award className="h-4 w-4 text-trust-green mt-0.5 flex-shrink-0" />
                <span className="text-charcoal">{tip}</span>
              </li>
            ))}
          </ul>
          <Link href="/resources/proposal-guide">
            <Button variant="link" size="sm" className="p-0 h-auto mt-3 text-stackmatch-blue">
              View Complete Guide
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </SidebarWidget>

      {/* CTA */}
      <Card className="bg-gradient-to-br from-stackmatch-blue to-stackmatch-navy text-white">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Boost Your Proposals</h3>
          <p className="text-sm mb-4 text-white/90">
            Use AI to create winning proposals 10x faster
          </p>
          <Link href="/create-proposal">
            <Button className="w-full bg-white text-stackmatch-blue hover:bg-gray-100">
              <Sparkles className="h-4 w-4 mr-2" />
              Try Smart Proposals
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}