'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Activity, 
  MessageSquare, 
  Plus, 
  Clock,
  Edit3,
  FileText,
  Send,
  MessageCircle,
  CheckCircle,
  User,
  Building2
} from 'lucide-react'

interface ListingActivityQATabProps {
  listing: any
  userType: 'buyer' | 'seller' | null
}

export function ListingActivityQATab({ listing, userType }: ListingActivityQATabProps) {
  const [newQuestion, setNewQuestion] = useState('')
  const [showQuestionForm, setShowQuestionForm] = useState(false)

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'created':
        return <Plus className="h-4 w-4" />
      case 'edited':
        return <Edit3 className="h-4 w-4" />
      case 'question':
        return <MessageCircle className="h-4 w-4" />
      case 'answer':
        return <CheckCircle className="h-4 w-4" />
      case 'proposal':
        return <FileText className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch(type) {
      case 'created':
        return 'bg-trust-green text-white'
      case 'edited':
        return 'bg-stackmatch-blue text-white'
      case 'question':
        return 'bg-attention-orange text-white'
      case 'answer':
        return 'bg-trust-green text-white'
      case 'proposal':
        return 'bg-stackmatch-blue text-white'
      default:
        return 'bg-medium-gray text-white'
    }
  }

  return (
    <div className="space-y-6">
      {/* Activity Timeline */}
      <Card className="border-2 hover:border-stackmatch-blue transition-all duration-300">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-stackmatch-blue" />
            <CardTitle className="text-xl font-semibold text-stackmatch-navy">
              Activity Timeline
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listing.activity?.map((activity: any) => (
              <div key={activity.id} className="flex gap-4">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  {/* Timeline line */}
                  <div className="absolute top-10 left-5 w-0.5 h-full bg-light-gray -z-10"></div>
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-charcoal">{activity.description}</p>
                      <p className="text-sm text-medium-gray">
                        by {activity.user} • {new Date(activity.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Public Q&A */}
      <Card className="border-2 hover:border-trust-green transition-all duration-300">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-trust-green" />
              <CardTitle className="text-xl font-semibold text-stackmatch-navy">
                Public Q&A
              </CardTitle>
            </div>
            {userType === 'seller' && (
              <Button
                onClick={() => setShowQuestionForm(!showQuestionForm)}
                className="bg-trust-green hover:bg-success-green text-white"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ask Question
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Question Form */}
          {showQuestionForm && userType === 'seller' && (
            <div className="p-4 bg-light-gray/20 rounded-lg space-y-4">
              <Textarea
                placeholder="Type your question here..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowQuestionForm(false)
                    setNewQuestion('')
                  }}
                >
                  Cancel
                </Button>
                <Button className="bg-trust-green hover:bg-success-green text-white">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Question
                </Button>
              </div>
            </div>
          )}

          {/* Q&A List */}
          {listing.qa?.length > 0 ? (
            <div className="space-y-6">
              {listing.qa.map((item: any) => (
                <div key={item.id} className="space-y-4">
                  {/* Question */}
                  <div className="p-4 bg-attention-orange/5 rounded-lg border border-attention-orange/20">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 border border-attention-orange/20">
                        <AvatarFallback className="bg-attention-orange text-white text-xs">
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-charcoal">{item.askedBy}</p>
                          <span className="text-xs text-medium-gray">
                            {new Date(item.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <Badge className="bg-attention-orange/10 text-attention-orange text-xs">
                            Question
                          </Badge>
                        </div>
                        <p className="text-charcoal">{item.question}</p>
                      </div>
                    </div>
                  </div>

                  {/* Answer */}
                  {item.answer && (
                    <div className="ml-8 p-4 bg-trust-green/5 rounded-lg border border-trust-green/20">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border border-trust-green/20">
                          <AvatarFallback className="bg-trust-green text-white text-xs">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-semibold text-charcoal">{item.answeredBy}</p>
                            <span className="text-xs text-medium-gray">
                              {new Date(item.answerTimestamp).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <Badge className="bg-trust-green/10 text-trust-green text-xs">
                              Answer
                            </Badge>
                          </div>
                          <p className="text-charcoal">{item.answer}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-light-gray mx-auto mb-4" />
              <p className="text-medium-gray mb-2">No questions asked yet</p>
              {userType === 'seller' && (
                <p className="text-sm text-medium-gray">
                  Be the first to ask a question about this RFQ
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <Card className="border-2 border-light-gray bg-gradient-to-r from-stackmatch-blue/5 to-trust-green/5">
        <CardContent className="py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-stackmatch-blue">
                {listing.activity?.length || 0}
              </p>
              <p className="text-sm text-medium-gray">Total Activities</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-trust-green">
                {listing.qa?.length || 0}
              </p>
              <p className="text-sm text-medium-gray">Questions Asked</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-attention-orange">
                {listing.qa?.filter((q: any) => q.answer).length || 0}
              </p>
              <p className="text-sm text-medium-gray">Questions Answered</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-charcoal">
                {listing.activity?.filter((a: any) => a.type === 'edited').length || 0}
              </p>
              <p className="text-sm text-medium-gray">Updates Made</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}