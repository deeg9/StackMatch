'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  Filter,
  BookOpen,
  Video,
  Headphones,
  Code,
  Users,
  Calendar
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: 'documentation' | 'whitepaper' | 'case-study' | 'video' | 'webinar' | 'api-docs' | 'training'
  category: string
  downloadUrl?: string
  externalUrl?: string
  fileSize?: string
  duration?: string
  publishDate: string
  featured: boolean
}

interface ResourcesProps {
  companyId: string
}

export function Resources({ companyId }: ResourcesProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock resources data
  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'Implementation Best Practices Guide',
      description: 'Comprehensive guide covering deployment strategies, configuration best practices, and optimization techniques for enterprise implementations.',
      type: 'documentation',
      category: 'Implementation',
      downloadUrl: '/resources/implementation-guide.pdf',
      fileSize: '2.4 MB',
      publishDate: '2024-01-20',
      featured: true
    },
    {
      id: '2',
      title: 'ROI Calculator and Business Case Template',
      description: 'Interactive calculator and template to help build compelling business cases and calculate expected return on investment.',
      type: 'whitepaper',
      category: 'Business Case',
      downloadUrl: '/resources/roi-calculator.xlsx',
      fileSize: '1.2 MB',
      publishDate: '2024-01-15',
      featured: true
    },
    {
      id: '3',
      title: 'API Developer Documentation',
      description: 'Complete API reference with code examples, authentication guides, and integration patterns for developers.',
      type: 'api-docs',
      category: 'Developer Resources',
      externalUrl: 'https://developer.salesforce.com',
      publishDate: '2024-01-10',
      featured: false
    },
    {
      id: '4',
      title: 'Platform Administration Training Series',
      description: '8-hour video training series covering platform administration, user management, and security configuration.',
      type: 'training',
      category: 'Training',
      externalUrl: 'https://trailhead.salesforce.com',
      duration: '8 hours',
      publishDate: '2024-01-05',
      featured: true
    },
    {
      id: '5',
      title: 'Digital Transformation in Healthcare',
      description: 'Webinar discussing digital transformation strategies specifically for healthcare organizations.',
      type: 'webinar',
      category: 'Industry Solutions',
      externalUrl: 'https://webinar-link.com',
      duration: '45 minutes',
      publishDate: '2023-12-20',
      featured: false
    },
    {
      id: '6',
      title: 'Security and Compliance Whitepaper',
      description: 'Detailed overview of security features, compliance certifications, and data protection capabilities.',
      type: 'whitepaper',
      category: 'Security',
      downloadUrl: '/resources/security-compliance.pdf',
      fileSize: '3.1 MB',
      publishDate: '2023-12-15',
      featured: false
    }
  ]

  const resourceTypes = [
    { value: 'documentation', label: 'Documentation' },
    { value: 'whitepaper', label: 'Whitepapers' },
    { value: 'case-study', label: 'Case Studies' },
    { value: 'video', label: 'Videos' },
    { value: 'webinar', label: 'Webinars' },
    { value: 'api-docs', label: 'API Docs' },
    { value: 'training', label: 'Training' }
  ]

  const categories = [
    'Implementation',
    'Business Case',
    'Developer Resources',
    'Training',
    'Industry Solutions',
    'Security',
    'Integration',
    'Best Practices'
  ]

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/companies/${companyId}/resources`)
        if (response.ok) {
          const data = await response.json()
          setResources(data.resources)
          setFilteredResources(data.resources)
        } else {
          // Fallback to mock data
          setResources(mockResources)
          setFilteredResources(mockResources)
        }
      } catch (error) {
        console.error('Error fetching resources:', error)
        // Fallback to mock data
        setResources(mockResources)
        setFilteredResources(mockResources)
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [companyId])

  // Filter resources
  useEffect(() => {
    let filtered = resources

    if (searchQuery) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(resource => resource.type === selectedType)
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory)
    }

    setFilteredResources(filtered)
  }, [resources, searchQuery, selectedType, selectedCategory])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'documentation': return FileText
      case 'whitepaper': return BookOpen
      case 'case-study': return Users
      case 'video': return Video
      case 'webinar': return Calendar
      case 'api-docs': return Code
      case 'training': return Headphones
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'documentation': return 'text-stackmatch-blue bg-stackmatch-blue/10'
      case 'whitepaper': return 'text-trust-green bg-trust-green/10'
      case 'case-study': return 'text-attention-orange bg-attention-orange/10'
      case 'video': return 'text-purple-600 bg-purple-600/10'
      case 'webinar': return 'text-pink-600 bg-pink-600/10'
      case 'api-docs': return 'text-indigo-600 bg-indigo-600/10'
      case 'training': return 'text-emerald-600 bg-emerald-600/10'
      default: return 'text-medium-gray bg-medium-gray/10'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-slate-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-5 h-5" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base border-slate-200 focus:border-stackmatch-blue"
            />
          </div>
          
          <div className="lg:w-48">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-12 border-slate-200 focus:border-stackmatch-blue">
                <Filter className="w-4 h-4 mr-2 text-medium-gray" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="lg:w-48">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="h-12 border-slate-200 focus:border-stackmatch-blue">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-medium-gray">
          Showing <span className="font-semibold text-stackmatch-navy">{filteredResources.length}</span> resources
        </div>
      </div>

      {/* Featured Resources */}
      {filteredResources.some(r => r.featured) && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-stackmatch-navy">Featured Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.filter(r => r.featured).map((resource) => {
              const IconComponent = getTypeIcon(resource.type)
              const typeColors = getTypeColor(resource.type)
              
              return (
                <Card key={resource.id} className="border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${typeColors} flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <Badge className="bg-trust-green text-white text-xs mb-2">Featured</Badge>
                          <h4 className="font-bold text-stackmatch-navy group-hover:text-stackmatch-blue transition-colors leading-tight">
                            {resource.title}
                          </h4>
                          <Badge variant="secondary" className="bg-slate-100 text-charcoal text-xs mt-1">
                            {resource.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-charcoal leading-relaxed line-clamp-3">
                        {resource.description}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-xs text-medium-gray">
                        {resource.fileSize && (
                          <span>{resource.fileSize}</span>
                        )}
                        {resource.duration && (
                          <span>{resource.duration}</span>
                        )}
                        <span>{resource.publishDate}</span>
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
                        onClick={() => {
                          if (resource.downloadUrl) {
                            window.open(resource.downloadUrl, '_blank')
                          } else if (resource.externalUrl) {
                            window.open(resource.externalUrl, '_blank')
                          }
                        }}
                      >
                        {resource.downloadUrl ? (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Access Resource
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* All Resources */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-stackmatch-navy">All Resources</h3>
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const IconComponent = getTypeIcon(resource.type)
              const typeColors = getTypeColor(resource.type)
              
              return (
                <Card key={resource.id} className="border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg ${typeColors} flex items-center justify-center`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-stackmatch-navy group-hover:text-stackmatch-blue transition-colors leading-tight">
                            {resource.title}
                          </h4>
                          <Badge variant="secondary" className="bg-slate-100 text-charcoal text-xs mt-1">
                            {resource.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-charcoal leading-relaxed line-clamp-3">
                        {resource.description}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center gap-4 text-xs text-medium-gray">
                        {resource.fileSize && (
                          <span>{resource.fileSize}</span>
                        )}
                        {resource.duration && (
                          <span>{resource.duration}</span>
                        )}
                        <span>{resource.publishDate}</span>
                      </div>

                      {/* Action Button */}
                      <Button 
                        variant="outline"
                        className="w-full border-stackmatch-blue text-stackmatch-blue hover:bg-stackmatch-blue hover:text-white"
                        onClick={() => {
                          if (resource.downloadUrl) {
                            window.open(resource.downloadUrl, '_blank')
                          } else if (resource.externalUrl) {
                            window.open(resource.externalUrl, '_blank')
                          }
                        }}
                      >
                        {resource.downloadUrl ? (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Access Resource
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-medium-gray mx-auto mb-4" />
            <div className="text-medium-gray text-lg mb-2">No resources found</div>
            <div className="text-sm text-medium-gray">
              Try adjusting your search or filter criteria
            </div>
          </div>
        )}
      </div>
    </div>
  )
}