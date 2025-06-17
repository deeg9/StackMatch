'use client'

import { useState } from 'react'
import { NavigationWrapper } from '@/components/navigation/navigation-wrapper'
import { TickerBanner } from '@/components/ticker/ticker-banner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  MessageSquare, Users, TrendingUp, Hash, Search, Plus, Eye, Heart, 
  MessageCircle, Share2, MoreVertical, Clock, Activity, Award, 
  BookOpen, HelpCircle, Shield, Tag, List, Grid3X3, CircleDot,
  Flame, Pin, Lock, CheckCircle, AlertCircle, Star, ThumbsUp
} from 'lucide-react'

export default function StackTalkPage() {
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for demonstration
  const discussions = [
    {
      id: 1,
      title: 'Best practices for ERP selection in mid-market companies?',
      category: 'Technical Help',
      categoryColor: 'bg-information-blue',
      status: 'solved',
      priority: 'hot',
      author: {
        name: 'Sarah Chen',
        avatar: '/api/placeholder/40/40',
        role: 'Expert',
        reputation: 1250,
        isOnline: true
      },
      timestamp: '2 hours ago',
      replies: 15,
      views: 234,
      likes: 12,
      lastActivity: '30 min ago',
      excerpt: 'We are a growing company looking to implement an ERP system. What are the key factors we should consider during the selection process?',
      tags: ['ERP', 'Enterprise', 'Selection Process'],
      hasAttachments: true,
      hasPoll: false
    },
    {
      id: 2,
      title: 'Successfully migrated from legacy CRM to Salesforce - AMA',
      category: 'Success Stories',
      categoryColor: 'bg-trust-green',
      status: 'open',
      priority: 'trending',
      author: {
        name: 'Michael Thompson',
        avatar: '/api/placeholder/40/40',
        role: 'Member',
        reputation: 520,
        isOnline: false
      },
      timestamp: '5 hours ago',
      replies: 28,
      views: 567,
      likes: 45,
      lastActivity: '1 hour ago',
      excerpt: 'Just completed a 6-month migration project from our 15-year-old legacy CRM to Salesforce. Happy to share lessons learned and answer questions!',
      tags: ['CRM', 'Salesforce', 'Migration'],
      hasAttachments: false,
      hasPoll: true
    },
    {
      id: 3,
      title: 'New to StackMatch - How to get started as a buyer?',
      category: 'Getting Started',
      categoryColor: 'bg-stackmatch-blue',
      status: 'open',
      priority: 'normal',
      author: {
        name: 'Jennifer Davis',
        avatar: '/api/placeholder/40/40',
        role: 'New Member',
        reputation: 10,
        isOnline: true
      },
      timestamp: '1 day ago',
      replies: 8,
      views: 89,
      likes: 3,
      lastActivity: '4 hours ago',
      excerpt: 'Hi everyone! I just joined StackMatch and I am looking to post my first project. Can someone guide me through the process?',
      tags: ['Newbie', 'Getting Started', 'Buyer Guide'],
      hasAttachments: false,
      hasPoll: false
    }
  ]

  const categories = [
    { id: 'all', name: 'All Discussions', count: 1234 },
    { id: 'general', name: 'General Discussion', count: 342 },
    { id: 'technical', name: 'Technical Help', count: 289 },
    { id: 'showcase', name: 'Project Showcase', count: 156 },
    { id: 'features', name: 'Feature Requests', count: 98 },
    { id: 'announcements', name: 'Announcements', count: 45 },
    { id: 'getting-started', name: 'Getting Started', count: 234 },
    { id: 'success', name: 'Success Stories', count: 120 }
  ]

  const popularTags = [
    'CRM', 'ERP', 'Cloud Migration', 'Security', 'Integration', 
    'API', 'Data Analytics', 'SaaS', 'Project Management', 'AI/ML'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <TickerBanner />
      <NavigationWrapper />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-stackmatch-navy mb-2">Community Forum</h1>
          <p className="text-xl text-charcoal">Connect, share knowledge, and get help from the StackMatch community</p>
          <div className="flex justify-center items-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <CircleDot className="w-4 h-4 text-trust-green" />
              <span className="text-medium-gray">
                <span className="font-semibold text-stackmatch-navy">238</span> members online
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-stackmatch-blue" />
              <span className="text-medium-gray">
                <span className="font-semibold text-stackmatch-navy">15,342</span> total posts
              </span>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
            
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
              <Input
                placeholder="Search discussions, topics, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General Discussion</SelectItem>
                <SelectItem value="technical">Technical Help</SelectItem>
                <SelectItem value="showcase">Project Showcase</SelectItem>
                <SelectItem value="features">Feature Requests</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest Activity</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'card' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('card')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-2 hover:border-stackmatch-blue transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-gray">Total Members</p>
                  <p className="text-2xl font-bold text-stackmatch-navy">8,342</p>
                  <p className="text-xs text-trust-green mt-1">+124 this month</p>
                </div>
                <Users className="w-8 h-8 text-stackmatch-blue/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-trust-green transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-gray">Active Today</p>
                  <p className="text-2xl font-bold text-stackmatch-navy">1,284</p>
                  <p className="text-xs text-medium-gray mt-1">In last 24 hours</p>
                </div>
                <Activity className="w-8 h-8 text-trust-green/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-attention-orange transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-gray">Posts This Week</p>
                  <p className="text-2xl font-bold text-stackmatch-navy">342</p>
                  <p className="text-xs text-attention-orange mt-1">15 trending</p>
                </div>
                <TrendingUp className="w-8 h-8 text-attention-orange/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-information-blue transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-medium-gray">Solved Questions</p>
                  <p className="text-2xl font-bold text-stackmatch-navy">89%</p>
                  <p className="text-xs text-information-blue mt-1">Avg response: 2.5h</p>
                </div>
                <CheckCircle className="w-8 h-8 text-information-blue/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Discussion List */}
          <div className="flex-1">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
              <TabsList className="w-full justify-start mb-6 bg-white">
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name} <Badge variant="secondary" className="ml-2">{category.count}</Badge>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={selectedCategory} className="space-y-4">
                {discussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Thread Header */}
                          <div className="flex items-start gap-4 mb-3">
                            <div className="relative">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={discussion.author.avatar} alt={discussion.author.name} />
                                <AvatarFallback>{discussion.author.name[0]}</AvatarFallback>
                              </Avatar>
                              {discussion.author.isOnline && (
                                <CircleDot className="absolute -bottom-1 -right-1 w-4 h-4 text-trust-green" />
                              )}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-stackmatch-navy hover:text-stackmatch-blue cursor-pointer">
                                  {discussion.title}
                                </h3>
                                {discussion.priority === 'hot' && (
                                  <Badge className="bg-red-500 text-white">
                                    <Flame className="w-3 h-3 mr-1" />
                                    Hot
                                  </Badge>
                                )}
                                {discussion.priority === 'trending' && (
                                  <Badge className="bg-attention-orange text-white">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    Trending
                                  </Badge>
                                )}
                                {discussion.status === 'solved' && (
                                  <Badge className="bg-trust-green text-white">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Solved
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-4 text-sm text-medium-gray mb-3">
                                <span className="flex items-center gap-1">
                                  <span className="font-medium text-stackmatch-navy">{discussion.author.name}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {discussion.author.role}
                                  </Badge>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    {discussion.author.reputation}
                                  </span>
                                </span>
                                <span>•</span>
                                <span>{discussion.timestamp}</span>
                                <span>•</span>
                                <Badge className={`${discussion.categoryColor} text-white text-xs`}>
                                  {discussion.category}
                                </Badge>
                              </div>
                              
                              <p className="text-charcoal mb-3">{discussion.excerpt}</p>
                              
                              <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                  {discussion.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      <Tag className="w-3 h-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Engagement Metrics */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm text-medium-gray">
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                {discussion.replies} replies
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {discussion.views} views
                              </span>
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                {discussion.likes} likes
                              </span>
                              <span className="text-xs">Last activity {discussion.lastActivity}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Reply
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-6">
            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Forum Guidelines
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  How to Post
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Contact Moderators
                </Button>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['John Smith', 'Emily Chen', 'Michael Davis'].map((user) => (
                    <div key={user} className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{user[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-charcoal">{user}</span>
                      <CircleDot className="w-3 h-3 text-trust-green ml-auto" />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-medium-gray mt-3">+235 more online</p>
              </CardContent>
            </Card>

            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trending Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="secondary" 
                      className="cursor-pointer hover:bg-stackmatch-blue hover:text-white transition-colors"
                    >
                      <Hash className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Contributor */}
            <Card className="bg-gradient-to-br from-stackmatch-blue/5 to-trust-green/5">
              <CardHeader>
                <CardTitle className="text-lg">Top Contributor</CardTitle>
                <p className="text-sm text-medium-gray">This Month</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src="/api/placeholder/48/48" alt="Top Contributor" />
                    <AvatarFallback>TC</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-stackmatch-navy">David Kim</p>
                    <p className="text-sm text-medium-gray">42 helpful answers</p>
                  </div>
                  <Award className="w-8 h-8 text-yellow-500 ml-auto" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}