'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Mail, 
  Phone, 
  Building2, 
  Calendar,
  Star,
  MessageSquare
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Contact } from './client-contacts'

interface ContactCardProps {
  contact: Contact
}

export function ContactCard({ contact }: ContactCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  }

  const formatLastContact = (dateString?: string) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const today = new Date()
    const diffTime = today.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="border-2 hover:border-stackmatch-blue/50 transition-all duration-200">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header with Avatar and Primary Badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={contact.photo} alt={contact.name} />
                  <AvatarFallback className="bg-stackmatch-blue text-white text-sm font-medium">
                    {getInitials(contact.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-stackmatch-navy flex items-center gap-2">
                    {contact.name}
                    {contact.isPrimary && (
                      <Badge className="bg-trust-green/10 text-trust-green border-trust-green/20 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Primary
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-medium-gray">{contact.title}</p>
                </div>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-center text-sm text-medium-gray">
              <Building2 className="h-4 w-4 mr-2" />
              {contact.department}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 py-3 border-t border-b">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center text-sm text-stackmatch-blue hover:text-stackmatch-navy transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                {contact.email}
              </a>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center text-sm text-stackmatch-blue hover:text-stackmatch-navy transition-colors"
              >
                <Phone className="h-4 w-4 mr-2" />
                {contact.phone}
              </a>
            </div>

            {/* Last Contact */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-medium-gray">
                <Calendar className="h-4 w-4 mr-2" />
                Last contact: {formatLastContact(contact.lastContact)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-stackmatch-blue/10 hover:text-stackmatch-blue"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="hover:bg-stackmatch-blue/10 hover:text-stackmatch-blue"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}