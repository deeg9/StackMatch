'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Send, 
  Paperclip, 
  Smile, 
  Search, 
  MoreVertical,
  Reply,
  ThumbsUp,
  CheckCheck,
  Clock,
  FileText,
  Image as ImageIcon,
  Video,
  Calendar,
  Download,
  Copy,
  Edit,
  Quote,
  Eye,
  Star
} from 'lucide-react'

interface DealRoomDiscussionProps {
  dealRoom: any
}

export function DealRoomDiscussion({ dealRoom }: DealRoomDiscussionProps) {
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null)

  // Enhanced mock messages data
  const messages = [
    {
      id: 1,
      sender: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40',
        role: 'buyer',
        company: 'HealthTech Solutions',
        isOnline: true
      },
      content: 'Hi Michael! Thanks for submitting your proposal. I have a few questions about the implementation timeline.',
      timestamp: '2024-01-22 10:30 AM',
      reactions: [
        { emoji: '👍', count: 2, users: ['Michael Chen', 'David Kim'] }
      ],
      isRead: true,
      hasAttachment: false,
      isEdited: false,
      isStarred: false,
      repliedTo: null
    },
    {
      id: 2,
      sender: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/40/40',
        role: 'seller',
        company: 'CRM Experts Inc',
        isOnline: false
      },
      content: 'Hi Sarah! I am happy to answer any questions. What specific aspects of the timeline would you like to discuss?',
      timestamp: '2024-01-22 10:45 AM',
      reactions: [],
      isRead: true,
      hasAttachment: false,
      isEdited: false,
      isStarred: true,
      repliedTo: 1
    },
    {
      id: 3,
      sender: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40',
        role: 'buyer',
        company: 'HealthTech Solutions',
        isOnline: true
      },
      content: 'I am particularly interested in the data migration phase. How long do you estimate that will take? This is critical for our go-live timeline.',
      timestamp: '2024-01-22 11:00 AM',
      reactions: [
        { emoji: '❓', count: 1, users: ['David Kim'] }
      ],
      isRead: true,
      hasAttachment: false,
      isEdited: true,
      isStarred: false,
      repliedTo: null
    },
    {
      id: 4,
      sender: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/40/40',
        role: 'seller',
        company: 'CRM Experts Inc',
        isOnline: false
      },
      content: 'Great question! Based on your current data volume of ~2.5M records, I estimate 2-3 weeks for the data migration. I have attached a detailed breakdown of the process with timelines and risk mitigation strategies.',
      timestamp: '2024-01-22 11:15 AM',
      reactions: [
        { emoji: '📋', count: 1, users: ['Sarah Johnson'] },
        { emoji: '💡', count: 2, users: ['Sarah Johnson', 'David Kim'] }
      ],
      isRead: false,
      hasAttachment: true,
      attachments: [
        { name: 'Data_Migration_Plan_v2.1.pdf', size: '2.4 MB', type: 'pdf' },
        { name: 'Timeline_Breakdown.xlsx', size: '1.2 MB', type: 'excel' }
      ],
      isEdited: false,
      isStarred: false,
      repliedTo: 3
    },
    {
      id: 5,
      sender: {
        name: 'David Kim',
        avatar: '/api/placeholder/40/40',
        role: 'buyer',
        company: 'HealthTech Solutions',
        isOnline: true
      },
      content: 'This looks comprehensive, Michael. One concern is the downtime during migration. Can we discuss minimizing that? We can only afford 4-6 hours of downtime maximum.',
      timestamp: '2024-01-22 2:30 PM',
      reactions: [],
      isRead: false,
      hasAttachment: false,
      isEdited: false,
      isStarred: false,
      repliedTo: 4
    },
    {
      id: 6,
      sender: {
        name: 'Elena Rodriguez',
        avatar: '/api/placeholder/40/40',
        role: 'seller',
        company: 'CRM Experts Inc',
        isOnline: true
      },
      content: 'Absolutely David! We can implement a phased migration approach with minimal downtime. Let me schedule a technical deep-dive session to walk through our zero-downtime migration strategy.',
      timestamp: '2024-01-22 3:15 PM',
      reactions: [
        { emoji: '🚀', count: 3, users: ['Sarah Johnson', 'David Kim', 'Michael Chen'] }
      ],
      isRead: false,
      hasAttachment: false,
      isEdited: false,
      isStarred: false,
      repliedTo: 5
    }
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      console.log('Sending message:', message)
      setMessage('')
      setIsTyping(false)
    }
  }


  return (
    <div className="space-y-6 animate-fade-in">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
      </div>

      {/* Main Chat Interface */}
      <div className="w-full">
        <Card className="h-[700px] flex flex-col border-slate-200 shadow-sm">
          {/* Messages Container */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => {
              const isRepliedMessage = messages.find(m => m.id === msg.repliedTo)
              
              return (
                <div key={msg.id} className="group animate-slide-up">
                    {/* Reply indicator */}
                    {msg.repliedTo && isRepliedMessage && (
                      <div className="ml-12 mb-2 p-2 bg-slate-100 rounded-lg border-l-4 border-stackmatch-blue">
                        <div className="flex items-center gap-2 text-xs text-medium-gray mb-1">
                          <Quote className="w-3 h-3" />
                          Replying to {isRepliedMessage.sender.name}
                        </div>
                        <p className="text-sm text-charcoal truncate">
                          {isRepliedMessage.content}
                        </p>
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                          <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
                        </Avatar>
                        {msg.sender.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-trust-green rounded-full border-2 border-white" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-stackmatch-navy">
                            {msg.sender.name}
                          </span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              msg.sender.role === 'buyer' 
                                ? 'text-stackmatch-blue border-stackmatch-blue bg-stackmatch-blue/5' 
                                : 'text-trust-green border-trust-green bg-trust-green/5'
                            }`}
                          >
                            {msg.sender.role}
                          </Badge>
                          <span className="text-xs text-medium-gray">
                            {msg.timestamp}
                          </span>
                          {msg.isEdited && (
                            <Badge variant="outline" className="text-xs">
                              <Edit className="w-2 h-2 mr-1" />
                              edited
                            </Badge>
                          )}
                          {msg.isStarred && (
                            <Star className="w-3 h-3 text-attention-orange fill-current" />
                          )}
                          {!msg.isRead && (
                            <Badge className="text-xs bg-stackmatch-blue text-white">
                              New
                            </Badge>
                          )}
                        </div>
                        
                        <div className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-colors duration-200">
                          <p className="text-charcoal leading-relaxed">{msg.content}</p>
                          
                          {/* Attachments */}
                          {msg.hasAttachment && msg.attachments && (
                            <div className="mt-4 space-y-3">
                              {msg.attachments.map((attachment, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow duration-200">
                                  <div className="p-2 bg-stackmatch-blue/10 rounded-lg">
                                    <FileText className="w-4 h-4 text-stackmatch-blue" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-stackmatch-navy truncate">
                                      {attachment.name}
                                    </div>
                                    <div className="text-xs text-medium-gray">
                                      {attachment.size} • {attachment.type.toUpperCase()}
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="sm" className="hover:bg-stackmatch-blue hover:text-white">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Message Actions */}
                        <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
                          <Button variant="ghost" size="sm" className="h-8 px-3 hover:bg-stackmatch-blue hover:text-white">
                            <Reply className="w-3 h-3 mr-1" />
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3 hover:bg-trust-green hover:text-white">
                            <ThumbsUp className="w-3 h-3 mr-1" />
                            Like
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3 hover:bg-attention-orange hover:text-white">
                            <Smile className="w-3 h-3 mr-1" />
                            React
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <Star className="w-3 h-3 mr-1" />
                            Star
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        {/* Reactions */}
                        {msg.reactions.length > 0 && (
                          <div className="flex items-center gap-2 mt-3">
                            {msg.reactions.map((reaction, index) => (
                              <Button 
                                key={index}
                                variant="outline" 
                                size="sm" 
                                className="h-8 px-3 text-sm bg-white hover:bg-slate-50"
                              >
                                {reaction.emoji} {reaction.count}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Read Status */}
                      <div className="flex flex-col items-center gap-1">
                        {msg.isRead ? (
                          <CheckCheck className="w-4 h-4 text-trust-green" />
                        ) : (
                          <Clock className="w-4 h-4 text-medium-gray" />
                        )}
                      </div>
                    </div>
                  </div>
                )
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 text-medium-gray animate-pulse">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>??</AvatarFallback>
                </Avatar>
                <div className="text-sm">Someone is typing...</div>
              </div>
            )}

            {/* Load Earlier Messages */}
            <div className="text-center py-4">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                Load Earlier Messages
              </Button>
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <div className="flex items-end gap-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <div className="relative">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value)
                      setIsTyping(e.target.value.length > 0)
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="pr-32 py-3 bg-white border-slate-300 focus:border-stackmatch-blue focus:ring-stackmatch-blue"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-stackmatch-blue hover:text-white">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-attention-orange hover:text-white">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-trust-green hover:text-white">
                      <ImageIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-medium-gray">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Save Draft
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-stackmatch-blue hover:bg-stackmatch-navy"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}