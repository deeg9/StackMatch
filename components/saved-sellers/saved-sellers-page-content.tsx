'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { 
  Heart,
  Search,
  Filter,
  Grid3X3,
  List,
  RotateCcw,
  Star,
  MapPin,
  Clock,
  Eye,
  MessageSquare,
  Share2,
  Download,
  Plus,
  FolderPlus,
  Settings2,
  Calendar,
  Target,
  TrendingUp,
  Users,
  Award,
  Shield,
  CheckCircle,
  Globe,
  DollarSign,
  Briefcase,
  StickyNote,
  Mail,
  Phone,
  Quote,
  UserPlus,
  Bell,
  MoreHorizontal,
  X,
  ChevronDown,
  Sparkles,
  Activity,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SavedSeller {
  id: string
  name: string
  title: string
  location: string
  avatar: string
  rating: number
  reviewCount: number
  isTopRated: boolean
  successRate: number
  isOnline: boolean
  responseTime: string
  availability: string
  timezone: string
  skills: string[]
  experience: number
  specializations: string[]
  certifications: string[]
  hourlyRate: { min: number; max: number }
  projectMinimum?: number
  pricingModel: 'hourly' | 'fixed' | 'both'
  projectsCompleted: number
  clientSatisfaction: number
  repeatClientRate: number
  portfolioCount: number
  savedOn: string
  lastContacted?: string
  collections: string[]
  notes?: string
  isVerified: boolean
  isPremium: boolean
  isRisingTalent: boolean
}

interface Collection {
  id: string
  name: string
  count: number
  color: string
}

export default function SavedSellersPageContent() {
  const [savedSellers, setSavedSellers] = useState<SavedSeller[]>([])
  const [filteredSellers, setFilteredSellers] = useState<SavedSeller[]>([])
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedSellers, setSelectedSellers] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [availabilityFilter, setAvailabilityFilter] = useState('all')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [sortBy, setSortBy] = useState('recently-added')
  const [activeCollection, setActiveCollection] = useState('all')
  const [showCollectionModal, setShowCollectionModal] = useState(false)

  useEffect(() => {
    // Load saved sellers data
    const mockSavedSellers: SavedSeller[] = [
      {
        id: 'seller-1',
        name: 'Sarah Johnson',
        title: 'Senior Full-Stack Developer & CRM Specialist',
        location: 'San Francisco, CA',
        avatar: '/api/placeholder/80/80',
        rating: 4.9,
        reviewCount: 156,
        isTopRated: true,
        successRate: 98.5,
        isOnline: true,
        responseTime: 'within 2 hours',
        availability: 'Available now',
        timezone: 'PST',
        skills: ['React', 'Node.js', 'Salesforce', 'PostgreSQL'],
        experience: 8,
        specializations: ['CRM Implementation', 'E-commerce Development', 'API Integration'],
        certifications: ['Salesforce Certified', 'AWS Solutions Architect'],
        hourlyRate: { min: 95, max: 150 },
        projectMinimum: 5000,
        pricingModel: 'both',
        projectsCompleted: 127,
        clientSatisfaction: 4.9,
        repeatClientRate: 78,
        portfolioCount: 24,
        savedOn: '2 days ago',
        lastContacted: '1 week ago',
        collections: ['Web Developers', 'For CRM Project'],
        notes: 'Excellent for Salesforce implementations. Very responsive.',
        isVerified: true,
        isPremium: true,
        isRisingTalent: false
      },
      {
        id: 'seller-2',
        name: 'Marcus Chen',
        title: 'UI/UX Designer & Brand Strategist',
        location: 'Remote (Toronto, CA)',
        avatar: '/api/placeholder/80/80',
        rating: 4.8,
        reviewCount: 89,
        isTopRated: true,
        successRate: 96.2,
        isOnline: false,
        responseTime: 'within 4 hours',
        availability: 'Busy until Jan 15',
        timezone: 'EST',
        skills: ['Figma', 'Adobe Creative Suite', 'Webflow', 'Branding'],
        experience: 6,
        specializations: ['SaaS Design', 'Mobile Apps', 'Brand Identity'],
        certifications: ['Google UX Design', 'Adobe Certified Expert'],
        hourlyRate: { min: 75, max: 120 },
        pricingModel: 'hourly',
        projectsCompleted: 89,
        clientSatisfaction: 4.8,
        repeatClientRate: 85,
        portfolioCount: 31,
        savedOn: '1 week ago',
        collections: ['Designers', 'For Future Projects'],
        isVerified: true,
        isPremium: false,
        isRisingTalent: true
      },
      {
        id: 'seller-3',
        name: 'Elena Rodriguez',
        title: 'Mobile App Developer & Tech Lead',
        location: 'Austin, TX',
        avatar: '/api/placeholder/80/80',
        rating: 5.0,
        reviewCount: 72,
        isTopRated: true,
        successRate: 100,
        isOnline: true,
        responseTime: 'within 1 hour',
        availability: 'Available now',
        timezone: 'CST',
        skills: ['React Native', 'Flutter', 'iOS', 'Android'],
        experience: 7,
        specializations: ['Cross-platform Apps', 'Performance Optimization', 'App Store Optimization'],
        certifications: ['Google Developer Expert', 'Apple Developer'],
        hourlyRate: { min: 110, max: 180 },
        projectMinimum: 8000,
        pricingModel: 'both',
        projectsCompleted: 45,
        clientSatisfaction: 5.0,
        repeatClientRate: 92,
        portfolioCount: 18,
        savedOn: '3 days ago',
        collections: ['Mobile Developers', 'Top Performers'],
        notes: 'Perfect 5-star rating. Specializes in fintech apps.',
        isVerified: true,
        isPremium: true,
        isRisingTalent: false
      },
      {
        id: 'seller-4',
        name: 'David Kim',
        title: 'DevOps Engineer & Cloud Architect',
        location: 'Seattle, WA',
        avatar: '/api/placeholder/80/80',
        rating: 4.7,
        reviewCount: 134,
        isTopRated: false,
        successRate: 94.8,
        isOnline: false,
        responseTime: 'within 6 hours',
        availability: 'Available in 2 weeks',
        timezone: 'PST',
        skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
        experience: 9,
        specializations: ['Cloud Migration', 'Infrastructure as Code', 'CI/CD'],
        certifications: ['AWS Solutions Architect Pro', 'Certified Kubernetes Administrator'],
        hourlyRate: { min: 125, max: 200 },
        projectMinimum: 10000,
        pricingModel: 'hourly',
        projectsCompleted: 98,
        clientSatisfaction: 4.7,
        repeatClientRate: 73,
        portfolioCount: 16,
        savedOn: '2 weeks ago',
        collections: ['DevOps', 'For Infrastructure Project'],
        isVerified: true,
        isPremium: false,
        isRisingTalent: false
      },
      {
        id: 'seller-5',
        name: 'Aisha Patel',
        title: 'Data Scientist & Machine Learning Engineer',
        location: 'Remote (Mumbai, IN)',
        avatar: '/api/placeholder/80/80',
        rating: 4.9,
        reviewCount: 67,
        isTopRated: true,
        successRate: 97.1,
        isOnline: true,
        responseTime: 'within 3 hours',
        availability: 'Available now',
        timezone: 'IST',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'SQL'],
        experience: 5,
        specializations: ['Predictive Analytics', 'NLP', 'Computer Vision'],
        certifications: ['Google Cloud ML Engineer', 'Microsoft Azure AI'],
        hourlyRate: { min: 60, max: 95 },
        pricingModel: 'both',
        projectsCompleted: 52,
        clientSatisfaction: 4.9,
        repeatClientRate: 88,
        portfolioCount: 22,
        savedOn: '5 days ago',
        collections: ['Data Scientists', 'For AI Project'],
        notes: 'Excellent ML expertise. Great communication despite timezone.',
        isVerified: true,
        isPremium: false,
        isRisingTalent: true
      }
    ]

    const mockCollections: Collection[] = [
      { id: 'all', name: 'All Saved Sellers', count: 5, color: 'gray' },
      { id: 'web-dev', name: 'Web Developers', count: 1, color: 'blue' },
      { id: 'designers', name: 'Designers', count: 1, color: 'purple' },
      { id: 'mobile-dev', name: 'Mobile Developers', count: 1, color: 'green' },
      { id: 'future', name: 'For Future Projects', count: 2, color: 'orange' },
      { id: 'top-performers', name: 'Top Performers', count: 1, color: 'yellow' }
    ]

    setSavedSellers(mockSavedSellers)
    setFilteredSellers(mockSavedSellers)
    setCollections(mockCollections)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = [...savedSellers]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(seller => 
        seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(seller => 
        seller.skills.some(skill => skill.toLowerCase().includes(categoryFilter.toLowerCase())) ||
        seller.specializations.some(spec => spec.toLowerCase().includes(categoryFilter.toLowerCase()))
      )
    }

    // Apply availability filter
    if (availabilityFilter !== 'all') {
      if (availabilityFilter === 'available-now') {
        filtered = filtered.filter(seller => seller.availability.includes('Available now'))
      } else if (availabilityFilter === 'within-week') {
        filtered = filtered.filter(seller => 
          seller.availability.includes('Available now') || 
          seller.availability.includes('week')
        )
      }
    }

    // Apply rating filter
    if (ratingFilter !== 'all') {
      if (ratingFilter === '4plus') {
        filtered = filtered.filter(seller => seller.rating >= 4.0)
      } else if (ratingFilter === '5only') {
        filtered = filtered.filter(seller => seller.rating === 5.0)
      }
    }

    // Apply collection filter
    if (activeCollection !== 'all') {
      const collection = collections.find(c => c.id === activeCollection)
      if (collection) {
        filtered = filtered.filter(seller => 
          seller.collections.some(c => c.toLowerCase().includes(collection.name.toLowerCase().replace(/s$/, '')))
        )
      }
    }

    // Apply sorting
    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        filtered.sort((a, b) => a.hourlyRate.min - b.hourlyRate.min)
        break
      case 'price-high':
        filtered.sort((a, b) => b.hourlyRate.max - a.hourlyRate.max)
        break
      case 'recently-added':
      default:
        // Keep original order for recently added
        break
    }

    setFilteredSellers(filtered)
  }, [searchQuery, categoryFilter, locationFilter, availabilityFilter, ratingFilter, sortBy, activeCollection, savedSellers, collections])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSellers(filteredSellers.map(seller => seller.id))
    } else {
      setSelectedSellers([])
    }
  }

  const handleSelectSeller = (sellerId: string, checked: boolean) => {
    if (checked) {
      setSelectedSellers([...selectedSellers, sellerId])
    } else {
      setSelectedSellers(selectedSellers.filter(id => id !== sellerId))
    }
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setLocationFilter('all')
    setAvailabilityFilter('all')
    setRatingFilter('all')
    setSortBy('recently-added')
    setActiveCollection('all')
  }

  const removeSeller = (sellerId: string) => {
    setSavedSellers(savedSellers.filter(seller => seller.id !== sellerId))
    setSelectedSellers(selectedSellers.filter(id => id !== sellerId))
  }

  const getStatistics = () => {
    const totalSellers = savedSellers.length
    const newThisMonth = savedSellers.filter(seller => {
      const savedDate = new Date(seller.savedOn)
      const monthAgo = new Date()
      monthAgo.setMonth(monthAgo.getMonth() - 1)
      return savedDate > monthAgo
    }).length
    
    const uniqueCategories = new Set()
    savedSellers.forEach(seller => {
      seller.specializations.forEach(spec => uniqueCategories.add(spec))
    })
    
    const averageRating = savedSellers.reduce((sum, seller) => sum + seller.rating, 0) / savedSellers.length
    const availableNow = savedSellers.filter(seller => seller.availability.includes('Available now')).length
    const onlineNow = savedSellers.filter(seller => seller.isOnline).length
    const quickResponders = savedSellers.filter(seller => seller.responseTime.includes('hour')).length
    const contacted = savedSellers.filter(seller => seller.lastContacted).length
    const topRated = savedSellers.filter(seller => seller.isTopRated).length
    const verified = savedSellers.filter(seller => seller.isVerified).length
    const premium = savedSellers.filter(seller => seller.isPremium).length
    const risingTalent = savedSellers.filter(seller => seller.isRisingTalent).length

    return {
      totalSellers,
      newThisMonth,
      categoriesRepresented: uniqueCategories.size,
      averageRating: averageRating.toFixed(1),
      availableNow,
      onlineNow,
      quickResponders,
      contacted,
      topRated,
      verified,
      premium,
      risingTalent
    }
  }

  const stats = getStatistics()

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#1A2B4C] mb-2">Saved Sellers</h1>
            <p className="text-lg text-gray-600">Your bookmarked sellers and favorite service providers</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#1A2B4C]">{stats.totalSellers}</div>
              <div className="text-sm text-gray-600">Total Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#22C55E]">{stats.newThisMonth}</div>
              <div className="text-sm text-gray-600">Added This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-4 border-b">
        {collections.map((collection) => (
          <Button
            key={collection.id}
            variant={activeCollection === collection.id ? 'default' : 'outline'}
            className={cn(
              "rounded-full",
              activeCollection === collection.id 
                ? 'bg-[#1A2B4C] hover:bg-[#1A2B4C]/90 text-white' 
                : 'text-gray-600 hover:text-[#1A2B4C]'
            )}
            onClick={() => setActiveCollection(collection.id)}
          >
            {collection.name}
            <Badge variant="secondary" className="ml-2 bg-white/20">
              {collection.count}
            </Badge>
          </Button>
        ))}
        <Button
          variant="outline"
          className="rounded-full text-[#4A73CC] border-[#4A73CC] hover:bg-[#4A73CC]/10"
          onClick={() => setShowCollectionModal(true)}
        >
          <FolderPlus className="w-4 h-4 mr-2" />
          New Collection
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-8 gap-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Total Sellers</p>
                <p className="text-2xl font-bold text-[#1A2B4C]">{stats.totalSellers}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-[#22C55E]">{stats.newThisMonth}</p>
              </div>
              <Plus className="w-8 h-8 text-[#22C55E]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-[#4A73CC]">{stats.categoriesRepresented}</p>
              </div>
              <Target className="w-8 h-8 text-[#4A73CC]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-[#F59E0B]">{stats.averageRating}</p>
              </div>
              <Star className="w-8 h-8 text-[#F59E0B]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Available</p>
                <p className="text-2xl font-bold text-[#10B981]">{stats.availableNow}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-[#10B981]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Online Now</p>
                <p className="text-2xl font-bold text-[#22C55E]">{stats.onlineNow}</p>
              </div>
              <Activity className="w-8 h-8 text-[#22C55E]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Top Rated</p>
                <p className="text-2xl font-bold text-[#8B5CF6]">{stats.topRated}</p>
              </div>
              <Award className="w-8 h-8 text-[#8B5CF6]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-[#3B82F6]">{stats.verified}</p>
              </div>
              <Shield className="w-8 h-8 text-[#3B82F6]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Action Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search saved sellers by name, skills, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="web">Web Development</SelectItem>
                  <SelectItem value="mobile">Mobile Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="data">Data Science</SelectItem>
                  <SelectItem value="devops">DevOps</SelectItem>
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Availability</SelectItem>
                  <SelectItem value="available-now">Available Now</SelectItem>
                  <SelectItem value="within-week">Within 1 Week</SelectItem>
                  <SelectItem value="within-month">Within 1 Month</SelectItem>
                </SelectContent>
              </Select>

              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="4plus">4+ Stars</SelectItem>
                  <SelectItem value="5only">5 Stars Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recently-added">Recently Added</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-[#1A2B4C]' : ''}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-[#1A2B4C]' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <Button variant="outline" onClick={clearAllFilters}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedSellers.length > 0 && (
            <div className="mt-4 pt-4 border-t flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                  {selectedSellers.length} seller{selectedSellers.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <Button size="sm" className="bg-[#1A2B4C]">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Selected
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" variant="outline" className="text-red-600">
                    <X className="w-4 h-4 mr-2" />
                    Remove Selected
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Saved Sellers Grid */}
        <div className="lg:col-span-3">
          {/* Select All */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Checkbox
                checked={selectedSellers.length === filteredSellers.length && filteredSellers.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
            <span className="text-sm text-gray-600">
              {filteredSellers.length} of {savedSellers.length} sellers
            </span>
          </div>

          {/* Sellers Grid/List */}
          <div className={cn(
            "space-y-6",
            viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0"
          )}>
            {filteredSellers.map((seller) => (
              <Card key={seller.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Selection and Avatar */}
                    <div className="flex flex-col items-center gap-3">
                      <Checkbox
                        checked={selectedSellers.includes(seller.id)}
                        onCheckedChange={(checked) => handleSelectSeller(seller.id, checked as boolean)}
                      />
                      <div className="relative">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={seller.avatar} alt={seller.name} />
                          <AvatarFallback className="bg-[#1A2B4C] text-white">
                            {seller.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        {seller.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#22C55E] border-2 border-white rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Seller Information */}
                    <div className="flex-1 space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-[#1A2B4C] group-hover:text-[#4A73CC] transition-colors cursor-pointer">
                            {seller.name}
                          </h3>
                          <p className="text-gray-600 text-sm">{seller.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{seller.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {seller.isVerified && <Shield className="w-4 h-4 text-[#22C55E]" />}
                          {seller.isPremium && <Sparkles className="w-4 h-4 text-[#F59E0B]" />}
                          {seller.isRisingTalent && <TrendingUp className="w-4 h-4 text-[#8B5CF6]" />}
                        </div>
                      </div>

                      {/* Rating and Badges */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-semibold">{seller.rating}</span>
                          <span className="text-gray-500 text-sm">({seller.reviewCount})</span>
                        </div>
                        {seller.isTopRated && (
                          <Badge className="bg-[#22C55E] hover:bg-[#22C55E]/80">
                            Top Rated
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {seller.successRate}% Success
                        </Badge>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-600">Responds {seller.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-[#22C55E]" />
                          <span className="text-gray-600">{seller.availability}</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1">
                        {seller.skills.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs bg-[#4A73CC]/10 text-[#4A73CC]">
                            {skill}
                          </Badge>
                        ))}
                        {seller.skills.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{seller.skills.length - 4} more
                          </Badge>
                        )}
                      </div>

                      {/* Pricing and Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-semibold text-[#1A2B4C]">
                            ${seller.hourlyRate.min}-${seller.hourlyRate.max}/hr
                          </span>
                          <span className="text-gray-500">
                            {seller.projectsCompleted} projects
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          Saved {seller.savedOn}
                        </span>
                      </div>

                      {/* Notes */}
                      {seller.notes && (
                        <div className="bg-yellow-50 p-2 rounded text-xs text-gray-700">
                          <StickyNote className="w-3 h-3 inline mr-1" />
                          {seller.notes}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <Button size="sm" className="bg-[#1A2B4C] hover:bg-[#1A2B4C]/90">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          <Quote className="w-3 h-3 mr-1" />
                          Quote
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => removeSeller(seller.id)}
                        >
                          <Heart className="w-3 h-3 mr-1 fill-red-500" />
                          Unsave
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredSellers.length === 0 && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No saved sellers found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery || categoryFilter !== 'all' || availabilityFilter !== 'all' || ratingFilter !== 'all'
                    ? 'Try adjusting your filters or search criteria'
                    : 'Start building your network of trusted sellers'
                  }
                </p>
                <div className="flex gap-3 justify-center">
                  <Button className="bg-[#1A2B4C]" onClick={clearAllFilters}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                  <Button variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Browse Sellers
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Filters */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-[#1A2B4C]">Quick Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Sparkles className="w-4 h-4 mr-2" />
                Recently Added ({stats.newThisMonth})
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Star className="w-4 h-4 mr-2" />
                Highly Rated ({stats.topRated})
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Available Now ({stats.availableNow})
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Never Contacted
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Briefcase className="w-4 h-4 mr-2" />
                Previously Hired
              </Button>
            </CardContent>
          </Card>

          {/* Insights */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-[#1A2B4C]">Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Most Common Skills</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>React</span>
                    <span className="text-gray-500">60%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Node.js</span>
                    <span className="text-gray-500">40%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Design</span>
                    <span className="text-gray-500">20%</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Average Pricing</p>
                <p className="text-lg font-bold text-[#1A2B4C]">$95-$149/hr</p>
                <p className="text-xs text-gray-500">Based on your saved sellers</p>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-[#1A2B4C]">Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Users className="w-4 h-4 mr-2" />
                Similar Sellers
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending in Your Categories
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                <Zap className="w-4 h-4 mr-2" />
                New Sellers to Consider
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}