'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Clock,
  CheckCircle2,
  Users,
  FileText,
  Plus,
  TrendingUp,
  Flag,
  Briefcase,
  Zap,
  Edit,
  Filter,
  CalendarDays,
  Activity,
  ArrowRight,
  BarChart3,
  Eye,
  CheckSquare,
  PlayCircle,
  Construction,
  Rocket,
  Building,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DealRoomTimelineProps {
  dealRoom?: any
}

export function DealRoomTimeline({ }: DealRoomTimelineProps) {
  const [activeView, setActiveView] = useState<'timeline' | 'milestones' | 'gantt'>('timeline')

  // Enhanced timeline and milestones data
  const projectPhases = [
    {
      id: 'discovery',
      name: 'Discovery & Planning',
      description: 'Initial project setup, requirements gathering, and planning phase',
      startDate: '2024-01-15',
      endDate: '2024-01-31',
      duration: '2 weeks',
      progress: 100,
      status: 'completed',
      budget: 25000,
      lead: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/32/32',
        role: 'buyer'
      },
      milestones: [
        {
          id: 1,
          title: 'Deal Room Created',
          description: 'Initial setup and participant invitations',
          date: '2024-01-15',
          time: '9:00 AM',
          status: 'completed',
          priority: 'high',
          type: 'setup',
          actor: { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32' },
          deliverables: ['Deal room configuration', 'User access setup', 'Initial documentation']
        },
        {
          id: 2,
          title: 'NDA Signed',
          description: 'Legal agreements executed by all parties',
          date: '2024-01-16',
          time: '2:30 PM',
          status: 'completed',
          priority: 'critical',
          type: 'legal',
          actor: { name: 'Michael Chen', avatar: '/api/placeholder/32/32' },
          deliverables: ['Fully executed NDA', 'Legal compliance verification']
        },
        {
          id: 3,
          title: 'Requirements Analysis Complete',
          description: 'Comprehensive analysis of project requirements and scope',
          date: '2024-01-22',
          time: '4:00 PM',
          status: 'completed',
          priority: 'high',
          type: 'analysis',
          actor: { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32' },
          deliverables: ['Requirements document', 'Scope definition', 'Risk assessment']
        }
      ]
    },
    {
      id: 'proposal',
      name: 'Proposal & Negotiation',
      description: 'Proposal submission, review, and contract negotiation',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      duration: '2 weeks',
      progress: 75,
      status: 'in-progress',
      budget: 0, // No budget allocated for this phase
      lead: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/32/32',
        role: 'seller'
      },
      milestones: [
        {
          id: 4,
          title: 'Initial Proposal Submitted',
          description: 'Comprehensive project proposal with timeline and pricing',
          date: '2024-02-01',
          time: '11:15 AM',
          status: 'completed',
          priority: 'critical',
          type: 'proposal',
          actor: { name: 'Michael Chen', avatar: '/api/placeholder/32/32' },
          deliverables: ['Technical proposal', 'Timeline breakdown', 'Cost analysis']
        },
        {
          id: 5,
          title: 'Proposal Review Meeting',
          description: 'Detailed review session with stakeholders',
          date: '2024-02-05',
          time: '2:00 PM',
          status: 'completed',
          priority: 'high',
          type: 'meeting',
          actor: { name: 'Sarah Johnson', avatar: '/api/placeholder/32/32' },
          deliverables: ['Meeting minutes', 'Feedback compilation', 'Action items']
        },
        {
          id: 6,
          title: 'Contract Negotiation',
          description: 'Final contract terms and conditions negotiation',
          date: '2024-02-10',
          time: '10:00 AM',
          status: 'in-progress',
          priority: 'critical',
          type: 'negotiation',
          actor: { name: 'Elena Rodriguez', avatar: '/api/placeholder/32/32' },
          deliverables: ['Contract draft', 'Terms sheet', 'Legal review']
        },
        {
          id: 7,
          title: 'Final Agreement Signing',
          description: 'Execute final service agreement',
          date: '2024-02-15',
          time: 'TBD',
          status: 'pending',
          priority: 'critical',
          type: 'legal',
          actor: null,
          deliverables: ['Signed contract', 'Payment schedule', 'Project charter']
        }
      ]
    },
    {
      id: 'implementation',
      name: 'Implementation Phase',
      description: 'Core project execution including development, testing, and deployment',
      startDate: '2024-02-16',
      endDate: '2024-05-15',
      duration: '12 weeks',
      progress: 0,
      status: 'upcoming',
      budget: 125000,
      lead: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/32/32',
        role: 'seller'
      },
      milestones: [
        {
          id: 8,
          title: 'Project Kickoff',
          description: 'Official project start and team introductions',
          date: '2024-02-16',
          time: '9:00 AM',
          status: 'upcoming',
          priority: 'high',
          type: 'meeting',
          actor: null,
          deliverables: ['Project plan', 'Team assignments', 'Communication protocols']
        },
        {
          id: 9,
          title: 'System Architecture Review',
          description: 'Technical architecture validation and approval',
          date: '2024-02-23',
          time: 'TBD',
          status: 'upcoming',
          priority: 'high',
          type: 'technical',
          actor: null,
          deliverables: ['Architecture document', 'Security review', 'Performance specifications']
        },
        {
          id: 10,
          title: 'Development Milestone 1',
          description: 'Core system functionality development complete',
          date: '2024-03-15',
          time: 'TBD',
          status: 'upcoming',
          priority: 'medium',
          type: 'development',
          actor: null,
          deliverables: ['Core modules', 'Unit tests', 'Integration tests']
        },
        {
          id: 11,
          title: 'User Acceptance Testing',
          description: 'Comprehensive user testing and feedback collection',
          date: '2024-04-15',
          time: 'TBD',
          status: 'upcoming',
          priority: 'high',
          type: 'testing',
          actor: null,
          deliverables: ['Test results', 'User feedback', 'Bug reports']
        },
        {
          id: 12,
          title: 'Go-Live Deployment',
          description: 'Production deployment and system activation',
          date: '2024-05-15',
          time: 'TBD',
          status: 'upcoming',
          priority: 'critical',
          type: 'deployment',
          actor: null,
          deliverables: ['Production system', 'User training', 'Support documentation']
        }
      ]
    },
    {
      id: 'support',
      name: 'Support & Maintenance',
      description: 'Ongoing support, maintenance, and optimization',
      startDate: '2024-05-16',
      endDate: '2025-05-15',
      duration: '12 months',
      progress: 0,
      status: 'upcoming',
      budget: 25000,
      lead: {
        name: 'Elena Rodriguez',
        avatar: '/api/placeholder/32/32',
        role: 'seller'
      },
      milestones: [
        {
          id: 13,
          title: 'Support Transition',
          description: 'Handoff to support team and knowledge transfer',
          date: '2024-05-16',
          time: 'TBD',
          status: 'upcoming',
          priority: 'medium',
          type: 'transition',
          actor: null,
          deliverables: ['Support procedures', 'Knowledge base', 'Contact protocols']
        },
        {
          id: 14,
          title: '3-Month Review',
          description: 'Quarterly performance review and optimization',
          date: '2024-08-15',
          time: 'TBD',
          status: 'upcoming',
          priority: 'medium',
          type: 'review',
          actor: null,
          deliverables: ['Performance report', 'Optimization recommendations', 'User satisfaction survey']
        }
      ]
    }
  ]

  const allMilestones = projectPhases.flatMap(phase => 
    phase.milestones.map(milestone => ({
      ...milestone,
      phase: phase.name,
      phaseId: phase.id
    }))
  )

  const getEventIcon = (type: string, status: string, size = "w-5 h-5") => {
    const baseClasses = size
    
    switch (type) {
      case 'setup':
        return <Rocket className={`${baseClasses} ${status === 'completed' ? 'text-trust-green' : 'text-slate-400'}`} />
      case 'legal':
        return <Shield className={`${baseClasses} ${status === 'completed' ? 'text-trust-green' : status === 'in-progress' ? 'text-attention-orange' : 'text-slate-400'}`} />
      case 'analysis':
        return <BarChart3 className={`${baseClasses} ${status === 'completed' ? 'text-trust-green' : 'text-slate-400'}`} />
      case 'proposal':
        return <FileText className={`${baseClasses} ${status === 'completed' ? 'text-information-blue' : 'text-slate-400'}`} />
      case 'meeting':
        return <Users className={`${baseClasses} ${status === 'completed' ? 'text-purple-500' : status === 'in-progress' ? 'text-attention-orange' : 'text-slate-400'}`} />
      case 'negotiation':
        return <Briefcase className={`${baseClasses} ${status === 'in-progress' ? 'text-attention-orange' : 'text-slate-400'}`} />
      case 'technical':
        return <Construction className={`${baseClasses} text-slate-400`} />
      case 'development':
        return <Building className={`${baseClasses} text-slate-400`} />
      case 'testing':
        return <CheckSquare className={`${baseClasses} text-slate-400`} />
      case 'deployment':
        return <Zap className={`${baseClasses} text-slate-400`} />
      case 'transition':
        return <ArrowRight className={`${baseClasses} text-slate-400`} />
      case 'review':
        return <Eye className={`${baseClasses} text-slate-400`} />
      default:
        return <Flag className={`${baseClasses} text-slate-400`} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-trust-green text-white'
      case 'in-progress':
        return 'bg-attention-orange text-white'
      case 'pending':
        return 'bg-yellow-500 text-white'
      case 'upcoming':
        return 'bg-slate-500 text-white'
      case 'delayed':
        return 'bg-red-500 text-white'
      default:
        return 'bg-slate-400 text-white'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200'
    }
  }

  const getPhaseStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-trust-green bg-trust-green/5'
      case 'in-progress':
        return 'border-attention-orange bg-attention-orange/5'
      case 'upcoming':
        return 'border-slate-300 bg-slate-50'
      default:
        return 'border-slate-200 bg-white'
    }
  }

  const overallProgress = projectPhases.reduce((acc, phase) => acc + phase.progress, 0) / projectPhases.length
  const completedMilestones = allMilestones.filter(m => m.status === 'completed').length
  const totalMilestones = allMilestones.length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Timeline Header */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex items-center justify-end gap-3 mb-4">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            
            <Button size="sm" className="bg-stackmatch-blue hover:bg-stackmatch-navy">
              <Plus className="w-4 h-4 mr-2" />
              Add Milestone
            </Button>
          </div>

          {/* Overall Progress */}
          <div className="p-4 bg-gradient-to-r from-stackmatch-blue/5 to-trust-green/5 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-stackmatch-navy">Overall Project Progress</span>
              <span className="text-sm font-bold text-stackmatch-blue">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3 mb-3" />
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-stackmatch-blue">{totalMilestones}</div>
                <div className="text-medium-gray">Total Milestones</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-trust-green">{completedMilestones}</div>
                <div className="text-medium-gray">Completed Milestones</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-attention-orange">{allMilestones.filter(m => m.status !== 'completed').length}</div>
                <div className="text-medium-gray">Open Tasks</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-information-blue">89</div>
                <div className="text-medium-gray">Days Remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-slate-200 p-1">
          <TabsTrigger 
            value="timeline" 
            className="data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white"
          >
            <Activity className="w-4 h-4 mr-2" />
            Timeline View
          </TabsTrigger>
          <TabsTrigger 
            value="gantt" 
            className="data-[state=active]:bg-stackmatch-blue data-[state=active]:text-white"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Gantt Chart
          </TabsTrigger>
        </TabsList>

        {/* Timeline View */}
        <TabsContent value="timeline" className="mt-6">
          <div className="space-y-6">
            {projectPhases.map((phase, phaseIndex) => (
              <Card 
                key={phase.id} 
                className={`border-2 transition-all duration-200 hover:shadow-md ${getPhaseStatusColor(phase.status)}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-white border-2 border-slate-200 rounded-full">
                          <span className="text-lg font-bold text-stackmatch-navy">{phaseIndex + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-stackmatch-navy">{phase.name}</h3>
                          <p className="text-sm text-medium-gray">{phase.description}</p>
                        </div>
                      </div>
                      
                      <Badge className={getStatusColor(phase.status)}>
                        {phase.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-medium text-stackmatch-navy">{phase.duration}</div>
                        <div className="text-xs text-medium-gray">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-information-blue">{phase.progress}%</div>
                        <div className="text-xs text-medium-gray">Progress</div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="bg-white hover:bg-slate-50">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Progress value={phase.progress} className="h-2" />
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Phase Timeline */}
                  <div className="relative">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                    
                    <div className="space-y-6">
                      {phase.milestones.map((milestone) => (
                        <div key={milestone.id} className="relative flex items-start gap-4">
                          {/* Milestone Marker */}
                          <div className="relative z-10 flex items-center justify-center w-12 h-12 bg-white border-4 border-slate-200 rounded-full">
                            {getEventIcon(milestone.type, milestone.status)}
                          </div>
                          
                          {/* Milestone Content */}
                          <div className="flex-1 min-w-0">
                            <Card className={`border transition-all duration-200 hover:shadow-sm ${
                              milestone.status === 'in-progress' ? 'border-attention-orange' : 
                              milestone.status === 'completed' ? 'border-trust-green' :
                              'border-slate-200'
                            }`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold text-stackmatch-navy">{milestone.title}</h4>
                                      <Badge className={getStatusColor(milestone.status)}>
                                        {milestone.status}
                                      </Badge>
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${getPriorityColor(milestone.priority)}`}
                                      >
                                        {milestone.priority}
                                      </Badge>
                                    </div>
                                    
                                    <p className="text-sm text-medium-gray mb-2">{milestone.description}</p>
                                    
                                    <div className="flex items-center gap-4 text-xs text-medium-gray">
                                      <span className="flex items-center gap-1">
                                        <CalendarDays className="w-3 h-3" />
                                        {milestone.date}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {milestone.time}
                                      </span>
                                      {milestone.actor && (
                                        <div className="flex items-center gap-1">
                                          <Avatar className="w-4 h-4">
                                            <AvatarImage src={milestone.actor.avatar} />
                                            <AvatarFallback className="text-xs">{milestone.actor.name[0]}</AvatarFallback>
                                          </Avatar>
                                          <span>{milestone.actor.name}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Deliverables */}
                                {milestone.deliverables && milestone.deliverables.length > 0 && (
                                  <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                                    <h5 className="text-xs font-semibold text-stackmatch-navy mb-2">Deliverables:</h5>
                                    <ul className="text-xs text-medium-gray space-y-1">
                                      {milestone.deliverables.map((deliverable, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                          <CheckCircle2 className="w-3 h-3 text-trust-green" />
                                          {deliverable}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                
                                {/* Actions */}
                                <div className="flex gap-2 mt-3">
                                  {milestone.status === 'pending' && (
                                    <Button size="sm" className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                                      <PlayCircle className="w-3 h-3 mr-1" />
                                      Start
                                    </Button>
                                  )}
                                  {milestone.status === 'in-progress' && (
                                    <Button size="sm" className="bg-trust-green hover:bg-success-green">
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      Complete
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>


        {/* Gantt Chart View */}
        <TabsContent value="gantt" className="mt-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-medium-gray mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-stackmatch-navy mb-2">
                  Gantt Chart View
                </h3>
                <p className="text-medium-gray mb-4">
                  Interactive Gantt chart for detailed timeline visualization
                </p>
                <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Open Advanced View
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}