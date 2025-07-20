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
  FileText,
  Users,
  Target,
  StickyNote
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarWidget } from '@/components/ui/sidebar-widget'
import { AIGeneratedProposal } from '@/types/ai-proposal'
import { ProposalEvaluation } from '@/lib/mock-data/proposal-evaluation-data'
import { cn } from '@/lib/utils'

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
                  ? 'fill-attention-orange text-attention-orange'
                  : 'text-medium-gray/40'
              )}
            />
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Export & Share - Now at the top */}
      <SidebarWidget
        title="Export & Share"
        icon={Share2}
        className="border-2 border-light-gray shadow-sm"
      >
        <Button variant="outline" className="w-full">
          <Share2 className="w-4 h-4 mr-2" />
          Share to Socials
        </Button>
        <Button variant="outline" className="w-full">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </SidebarWidget>

      {/* Seller Contact */}
      <SidebarWidget
        title="Seller Contact"
        icon={Users}
        className="border-2 border-light-gray shadow-sm"
      >
        <div className="space-y-3">
          <div>
            <p className="font-medium text-stackmatch-navy">
              {proposal.basicDetails.contactPerson.name}
            </p>
            <p className="text-sm text-charcoal">
              {proposal.basicDetails.contactPerson.role}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-medium-gray">
            <Mail className="w-4 h-4" />
            {proposal.basicDetails.contactPerson.email}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-medium-gray/30 hover:bg-light-gray/50"
          >
            <Building2 className="w-4 h-4 mr-2" />
            View Company Profile
          </Button>
        </div>
      </SidebarWidget>

      {/* Internal Scorecard */}
      <SidebarWidget
        title="Internal Scorecard"
        icon={Target}
        className="border-2 border-light-gray shadow-sm"
      >
        <div className="mb-4 flex justify-end">
          <Badge className="bg-stackmatch-blue text-white px-3 py-1">
            {evaluation.internalScores.overallScore}/5
          </Badge>
        </div>
        <div className="space-y-4">
          {scoreCriteria.map((criteria) => (
            <div key={criteria.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-charcoal">
                  {criteria.label}
                </label>
                <span className="text-sm text-medium-gray">
                  {evaluation.internalScores[criteria.id]}/5
                </span>
              </div>
              <StarRating
                score={evaluation.internalScores[criteria.id] as number}
                onChange={(score) => handleScoreChange(criteria.id, score)}
              />
              <p className="text-xs text-medium-gray">{criteria.description}</p>
            </div>
          ))}
        </div>
      </SidebarWidget>

      {/* Internal Team Notes */}
      <SidebarWidget
        title="Internal Team Notes"
        icon={StickyNote}
        className="border-2 border-light-gray shadow-sm"
      >
        {isNotesExpanded && (
          <div className="space-y-4">
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {evaluation.teamNotes.map((note) => (
                <div key={note.id} className="bg-light-gray/30 rounded-lg p-3 text-sm border border-light-gray">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-stackmatch-navy">{note.author}</span>
                    <span className="text-xs text-medium-gray">
                      {note.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-charcoal">{note.content}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <Textarea
                placeholder="Add a private note for your team..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="resize-none border-medium-gray/30 focus:border-stackmatch-blue"
                rows={3}
              />
              <Button 
                onClick={handleAddNote}
                size="sm" 
                className="w-full bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
                disabled={!newNote.trim()}
              >
                Add Note
              </Button>
            </div>
          </div>
        )}
      </SidebarWidget>

    </div>
  )
}