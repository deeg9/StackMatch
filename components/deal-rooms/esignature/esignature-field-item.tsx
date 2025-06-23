'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DocumentField, Recipient } from './esignature-add-fields'
import { 
  FileSignature, 
  PenTool, 
  Calendar, 
  User, 
  Type, 
  CheckSquare,
  X,
  GripVertical
} from 'lucide-react'

interface ESignatureFieldItemProps {
  field: DocumentField
  recipient?: Recipient
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<DocumentField>) => void
  onDelete: () => void
}

const fieldIcons = {
  signature: FileSignature,
  initial: PenTool,
  date: Calendar,
  name: User,
  text: Type,
  checkbox: CheckSquare
}

const fieldLabels = {
  signature: 'Sign',
  initial: 'Initial',
  date: 'Date',
  name: 'Name',
  text: 'Text',
  checkbox: 'Check'
}

export function ESignatureFieldItem({
  field,
  recipient,
  isSelected,
  onSelect,
  onUpdate,
  onDelete
}: ESignatureFieldItemProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 })
  const fieldRef = useRef<HTMLDivElement>(null)

  const Icon = fieldIcons[field.type]
  const label = fieldLabels[field.type]

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && fieldRef.current && fieldRef.current.parentElement) {
        const parent = fieldRef.current.parentElement
        const rect = parent.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        
        onUpdate({
          x: Math.max(0, Math.min(100 - field.width, x - dragStart.x)),
          y: Math.max(0, Math.min(100 - field.height, y - dragStart.y))
        })
      } else if (isResizing && fieldRef.current && fieldRef.current.parentElement) {
        const parent = fieldRef.current.parentElement
        const rect = parent.getBoundingClientRect()
        const deltaX = ((e.clientX - resizeStart.x) / rect.width) * 100
        const deltaY = ((e.clientY - resizeStart.y) / rect.height) * 100
        
        onUpdate({
          width: Math.max(5, Math.min(100 - field.x, resizeStart.width + deltaX)),
          height: Math.max(3, Math.min(100 - field.y, resizeStart.height + deltaY))
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart, field, onUpdate])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    
    if (fieldRef.current && fieldRef.current.parentElement) {
      const parent = fieldRef.current.parentElement
      const rect = parent.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      
      setDragStart({ x: x - field.x, y: y - field.y })
      setIsDragging(true)
    }
  }

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect()
    
    setResizeStart({ 
      width: field.width, 
      height: field.height, 
      x: e.clientX, 
      y: e.clientY 
    })
    setIsResizing(true)
  }

  return (
    <div
      ref={fieldRef}
      className={`absolute group ${isSelected ? 'z-20' : 'z-10'}`}
      style={{
        left: `${field.x}%`,
        top: `${field.y}%`,
        width: `${field.width}%`,
        height: `${field.height}%`
      }}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      <div
        className={`relative w-full h-full rounded border-2 transition-all duration-150 ${
          isSelected 
            ? 'ring-2 ring-offset-2' 
            : 'hover:ring-1 hover:ring-offset-1'
        }`}
        style={{
          borderColor: recipient?.color || '#6B7280',
          backgroundColor: `${recipient?.color || '#6B7280'}10`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Field Content */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex items-center gap-1 text-xs font-medium" style={{ color: recipient?.color || '#6B7280' }}>
            <Icon className="w-3 h-3" />
            <span>{label}</span>
          </div>
        </div>

        {/* Drag Handle */}
        {isSelected && (
          <div className="absolute -top-1 -left-1 p-1 bg-white rounded shadow-sm cursor-move">
            <GripVertical className="w-3 h-3" style={{ color: recipient?.color || '#6B7280' }} />
          </div>
        )}

        {/* Delete Button */}
        {isSelected && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6 bg-white shadow-sm hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <X className="w-3 h-3 text-red-600" />
          </Button>
        )}

        {/* Resize Handle */}
        {isSelected && (
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-white border-2 rounded-sm cursor-se-resize"
            style={{ borderColor: recipient?.color || '#6B7280' }}
            onMouseDown={handleResizeMouseDown}
          />
        )}

        {/* Recipient Label */}
        <div 
          className="absolute -bottom-6 left-0 text-xs font-medium whitespace-nowrap"
          style={{ color: recipient?.color || '#6B7280' }}
        >
          {recipient?.name}
        </div>
      </div>
    </div>
  )
}