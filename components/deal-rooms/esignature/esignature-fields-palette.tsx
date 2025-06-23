'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  FileSignature, 
  PenTool, 
  Calendar, 
  User, 
  Type, 
  CheckSquare,
  GripVertical 
} from 'lucide-react'
import { Recipient, DocumentField } from './esignature-add-fields'

interface ESignatureFieldsPaletteProps {
  recipients: Recipient[]
  selectedRecipient: string
  onRecipientChange: (recipientId: string) => void
  onFieldDragStart: (type: DocumentField['type']) => void
  onFieldDragEnd: () => void
}

const fieldTypes = [
  {
    type: 'signature' as const,
    label: 'Signature',
    icon: FileSignature,
    description: 'Recipient signature'
  },
  {
    type: 'initial' as const,
    label: 'Initial',
    icon: PenTool,
    description: 'Recipient initials'
  },
  {
    type: 'date' as const,
    label: 'Date Signed',
    icon: Calendar,
    description: 'Auto-populated date'
  },
  {
    type: 'name' as const,
    label: 'Name',
    icon: User,
    description: 'Auto-populated name'
  },
  {
    type: 'text' as const,
    label: 'Text Field',
    icon: Type,
    description: 'Custom text input'
  },
  {
    type: 'checkbox' as const,
    label: 'Checkbox',
    icon: CheckSquare,
    description: 'Yes/No checkbox'
  }
]

export function ESignatureFieldsPalette({
  recipients,
  selectedRecipient,
  onRecipientChange,
  onFieldDragStart,
  onFieldDragEnd
}: ESignatureFieldsPaletteProps) {
  const currentRecipient = recipients.find(r => r.id === selectedRecipient)

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col">
      {/* Recipient Selector */}
      <div className="p-4 border-b border-slate-200">
        <label className="text-sm font-medium text-medium-gray mb-2 block">
          Assign fields to:
        </label>
        
        <Select value={selectedRecipient} onValueChange={onRecipientChange}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {recipients.map((recipient) => (
              <SelectItem key={recipient.id} value={recipient.id}>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: recipient.color }}
                  />
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">{recipient.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">{recipient.name}</div>
                    <div className="text-xs text-medium-gray">{recipient.jobTitle}</div>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {currentRecipient && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
                style={{ backgroundColor: currentRecipient.color }}
              >
                {currentRecipient.name[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-stackmatch-navy">
                  {currentRecipient.name}
                </div>
                <div className="text-xs text-medium-gray">{currentRecipient.email}</div>
              </div>
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ 
                  borderColor: currentRecipient.color, 
                  color: currentRecipient.color 
                }}
              >
                {currentRecipient.role}
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Fields List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-sm font-semibold text-stackmatch-navy mb-3">
          Standard Fields
        </h3>
        <p className="text-xs text-medium-gray mb-4">
          Drag fields onto the document
        </p>

        <div className="space-y-2">
          {fieldTypes.map((field) => {
            const Icon = field.icon
            return (
              <div
                key={field.type}
                draggable
                onDragStart={() => onFieldDragStart(field.type)}
                onDragEnd={onFieldDragEnd}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg cursor-move hover:bg-slate-100 transition-colors duration-200 group"
                style={{
                  borderLeft: `3px solid ${currentRecipient?.color || '#6B7280'}`
                }}
              >
                <GripVertical className="w-4 h-4 text-medium-gray opacity-0 group-hover:opacity-100 transition-opacity" />
                <div 
                  className="w-8 h-8 rounded flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${currentRecipient?.color || '#6B7280'}20`,
                    color: currentRecipient?.color || '#6B7280'
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-stackmatch-navy">
                    {field.label}
                  </div>
                  <div className="text-xs text-medium-gray">
                    {field.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tips Section */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <h4 className="text-xs font-semibold text-stackmatch-navy mb-2">
          Quick Tips:
        </h4>
        <ul className="space-y-1 text-xs text-medium-gray">
          <li>• Drag fields onto the document</li>
          <li>• Resize fields by dragging corners</li>
          <li>• Double-click a field to configure</li>
          <li>• Each color represents a recipient</li>
        </ul>
      </div>
    </aside>
  )
}