'use client'

import { useState } from 'react'
import { 
  ChevronDown, 
  Star, 
  MessageSquare, 
  Mail, 
  Building2,
  Download,
  Share2,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AIGeneratedProposal } from '@/types/ai-proposal'
import { ProposalEvaluation } from '@/lib/mock-data/proposal-evaluation-data'

interface ProposalEvaluationSidebarProps {
  proposal: AIGeneratedProposal
  evaluation: ProposalEvaluation
  onEvaluationUpdate: (evaluation: ProposalEvaluation) => void
}

interface ScoreCriteria {
  id: keyof ProposalEvaluation['internalScores']
  label: string
  description: string
}

const scoreCriteria: ScoreCriteria[] = [
  { 
    id: 'technicalFit', 
    label: 'Technical Fit',
    description: 'How well does the solution meet technical requirements?'
  },
  { 
    id: 'priceValue', 
    label: 'Price/Value',
    description: 'Is the pricing competitive and reasonable?'
  },
  { 
    id: 'vendorExperience', 
    label: 'Vendor Experience',
    description: 'Does the vendor have relevant experience?'
  },
  { 
    id: 'implementationApproach', 
    label: 'Implementation',
    description: 'Is the implementation timeline and approach sound?'
  },
  { 
    id: 'supportQuality', 
    label: 'Support Quality',
    description: 'How comprehensive is the support offering?'
  }
]

export function ProposalEvaluationSidebar({
  proposal,
  evaluation,
  onEvaluationUpdate
}: ProposalEvaluationSidebarProps) {
  const [newNote, setNewNote] = useState('')
  const [isNotesExpanded, setIsNotesExpanded] = useState(true)

  const handleStatusChange = (newStatus: ProposalEvaluation['status']) => {
    onEvaluationUpdate({
      ...evaluation,
      status: newStatus
    })
  }

  const handleScoreChange = (criteria: keyof ProposalEvaluation['internalScores'], score: number) => {
    const newScores = {
      ...evaluation.internalScores,
      [criteria]: score
    }
    
    // Recalculate overall score
    const scoreValues = Object.entries(newScores)
      .filter(([key]) => key !== 'overallScore')
      .map(([_, value]) => value as number)
    
    const overallScore = scoreValues.reduce((sum, score) => sum + score, 0) / scoreValues.length

    onEvaluationUpdate({
      ...evaluation,
      internalScores: {
        ...newScores,
        overallScore: Math.round(overallScore * 10) / 10
      }
    })
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const newNoteEntry = {
      id: `note-${Date.now()}`,
      author: 'Current User', // In real app, get from auth context
      role: 'Evaluator',
      content: newNote,
      timestamp: new Date(),
      isPrivate: true
    }

    onEvaluationUpdate({
      ...evaluation,
      teamNotes: [...evaluation.teamNotes, newNoteEntry]
    })

    setNewNote('')
  }

  const StarRating = ({ score, onChange }: { score: number; onChange: (score: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <Star
              className={cn(
                'w-5 h-5 transition-colors',
                star <= score
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status & Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Status & Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Proposal Status
            </label>
            <Select
              value={evaluation.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="awaiting-clarification">Awaiting Clarification</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Request Clarification
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <Star className="w-4 h-4 mr-2" />
              Shortlist this Proposal
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Archive
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Internal Scorecard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Internal Scorecard</span>
            <Badge className="bg-blue-100 text-blue-700">
              {evaluation.internalScores.overallScore}/5
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {scoreCriteria.map((criteria) => (
            <div key={criteria.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  {criteria.label}
                </label>
                <span className="text-sm text-gray-500">
                  {evaluation.internalScores[criteria.id]}/5
                </span>
              </div>
              <StarRating
                score={evaluation.internalScores[criteria.id] as number}
                onChange={(score) => handleScoreChange(criteria.id, score)}
              />
              <p className="text-xs text-gray-500">{criteria.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Internal Team Notes */}
      <Card>
        <CardHeader>
          <button
            onClick={() => setIsNotesExpanded(!isNotesExpanded)}
            className="w-full"
          >
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Internal Team Notes</span>
              <ChevronDown 
                className={cn(
                  'w-4 h-4 transition-transform',
                  isNotesExpanded ? 'rotate-180' : ''
                )}
              />
            </CardTitle>
          </button>
        </CardHeader>
        {isNotesExpanded && (
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {evaluation.teamNotes.map((note) => (
                <div key={note.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{note.author}</span>
                    <span className="text-xs text-gray-500">
                      {note.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{note.content}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Add a private note for your team..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="resize-none"
                rows={3}
              />
              <Button 
                onClick={handleAddNote}
                size="sm" 
                className="w-full"
                disabled={!newNote.trim()}
              >
                Add Note
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Seller Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Seller Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-900">
                {proposal.basicDetails.contactPerson.name}
              </p>
              <p className="text-sm text-gray-600">
                {proposal.basicDetails.contactPerson.role}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4" />
              {proposal.basicDetails.contactPerson.email}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
            >
              <Building2 className="w-4 h-4 mr-2" />
              View Company Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Export & Share</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" size="sm" className="w-full">
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Share with Team
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function - add this to your utils
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}