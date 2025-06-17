'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Heart,
  ThumbsUp,
  CheckCheck,
  Clock,
  FileText,
  Image as ImageIcon
} from 'lucide-react'

interface DealRoomDiscussionProps {
  dealRoom: any
}

export function DealRoomDiscussion({ dealRoom }: DealRoomDiscussionProps) {
  const [message, setMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Mock messages data
  const messages = [
    {
      id: 1,
      sender: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40',
        role: 'buyer',
        company: 'HealthTech Solutions'
      },
      content: 'Hi Michael! Thanks for submitting your proposal. I have a few questions about the implementation timeline.',
      timestamp: '2024-01-22 10:30 AM',
      reactions: [
        { emoji: '👍', count: 2, users: ['Michael Chen', 'David Kim'] }
      ],
      isRead: true,
      hasAttachment: false
    },
    {
      id: 2,
      sender: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/40/40',
        role: 'seller',
        company: 'CRM Experts Inc'
      },
      content: 'Hi Sarah! I am happy to answer any questions. What specific aspects of the timeline would you like to discuss?',
      timestamp: '2024-01-22 10:45 AM',
      reactions: [],
      isRead: true,
      hasAttachment: false
    },
    {
      id: 3,
      sender: {
        name: 'Sarah Johnson',
        avatar: '/api/placeholder/40/40',
        role: 'buyer',
        company: 'HealthTech Solutions'
      },
      content: 'I am particularly interested in the data migration phase. How long do you estimate that will take?',
      timestamp: '2024-01-22 11:00 AM',
      reactions: [],
      isRead: true,
      hasAttachment: false
    },
    {
      id: 4,
      sender: {
        name: 'Michael Chen',
        avatar: '/api/placeholder/40/40',
        role: 'seller',
        company: 'CRM Experts Inc'
      },
      content: 'Great question! Based on your current data volume, I estimate 2-3 weeks for the data migration. I have attached a detailed breakdown of the process.',
      timestamp: '2024-01-22 11:15 AM',
      reactions: [
        { emoji: '📋', count: 1, users: ['Sarah Johnson'] }
      ],
      isRead: false,
      hasAttachment: true,
      attachments: [
        { name: 'Data_Migration_Plan.pdf', size: '2.4 MB', type: 'pdf' }
      ]
    },
    {
      id: 5,
      sender: {
        name: 'David Kim',
        avatar: '/api/placeholder/40/40',
        role: 'buyer',
        company: 'HealthTech Solutions'
      },
      content: 'This looks comprehensive, Michael. One concern is the downtime during migration. Can we discuss minimizing that?',
      timestamp: '2024-01-22 2:30 PM',
      reactions: [],
      isRead: false,
      hasAttachment: false
    }
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Chat Area */}
      <div className="lg:col-span-3">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span>Discussion</span>
                <Badge variant="secondary">{messages.length} messages</Badge>
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-4 h-4" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto space-y-4 px-6">
            {messages.map((msg) => (
              <div key={msg.id} className="group">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={msg.sender.avatar} alt={msg.sender.name} />
                    <AvatarFallback>{msg.sender.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-stackmatch-navy">
                        {msg.sender.name}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          msg.sender.role === 'buyer' 
                            ? 'text-stackmatch-blue border-stackmatch-blue' 
                            : 'text-trust-green border-trust-green'
                        }`}
                      >
                        {msg.sender.role}
                      </Badge>
                      <span className="text-xs text-medium-gray">
                        {msg.timestamp}
                      </span>
                      {!msg.isRead && (
                        <Badge variant="secondary" className="text-xs bg-stackmatch-blue text-white">
                          New
                        </Badge>
                      )}
                    </div>
                    
                    <div className="bg-slate-50 rounded-lg p-3 mb-2">
                      <p className="text-charcoal">{msg.content}</p>
                      
                      {msg.hasAttachment && msg.attachments && (
                        <div className="mt-3 space-y-2">
                          {msg.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                              <FileText className="w-4 h-4 text-stackmatch-blue" />
                              <span className="text-sm font-medium text-stackmatch-navy">
                                {attachment.name}
                              </span>
                              <span className="text-xs text-medium-gray">
                                {attachment.size}
                              </span>
                              <Button variant="ghost" size="sm" className="ml-auto">
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Message Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Reply className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <ThumbsUp className="w-3 h-3 mr-1" />
                        Like
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        <Smile className="w-3 h-3 mr-1" />
                        React
                      </Button>
                    </div>
                    
                    {/* Reactions */}
                    {msg.reactions.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        {msg.reactions.map((reaction, index) => (
                          <Button 
                            key={index}
                            variant="outline" 
                            size="sm" 
                            className="h-7 px-2 text-xs"
                          >
                            {reaction.emoji} {reaction.count}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-medium-gray">
                    {msg.isRead ? (
                      <CheckCheck className="w-4 h-4 text-trust-green" />
                    ) : (
                      <Clock className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>

          {/* Message Input */}
          <div className="p-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="pr-24"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <Smile className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-stackmatch-blue hover:bg-stackmatch-navy"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Chat Info Sidebar */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Chat Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-medium-gray">Total Messages</span>
                <span className="font-medium">{messages.length}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-medium-gray">Unread</span>
                <span className="font-medium text-stackmatch-blue">
                  {messages.filter(m => !m.isRead).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-medium-gray">Files Shared</span>
                <span className="font-medium">3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Share Document
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <ImageIcon className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm">
              <Search className="w-4 h-4 mr-2" />
              Search History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}