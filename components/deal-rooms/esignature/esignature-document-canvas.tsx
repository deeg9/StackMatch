'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DocumentField, Recipient } from './esignature-add-fields'
import { ESignatureFieldItem } from './esignature-field-item'
import { AlertCircle, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

interface ESignatureDocumentCanvasProps {
  document: {
    id: string
    title: string
    pages: number
    recipients: Recipient[]
  }
  currentPage: number
  placedFields: DocumentField[]
  selectedRecipient: string
  isDragging: boolean
  draggedFieldType: DocumentField['type'] | null
  onFieldDrop: (field: Omit<DocumentField, 'id'>) => void
  onFieldUpdate: (fieldId: string, updates: Partial<DocumentField>) => void
  onFieldDelete: (fieldId: string) => void
}

export function ESignatureDocumentCanvas({
  document,
  currentPage,
  placedFields,
  selectedRecipient,
  isDragging,
  draggedFieldType,
  onFieldDrop,
  onFieldUpdate,
  onFieldDelete
}: ESignatureDocumentCanvasProps) {
  const [zoom, setZoom] = useState(100)
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLDivElement>(null)

  const pageFields = placedFields.filter(field => field.page === currentPage)
  const currentRecipient = document.recipients.find(r => r.id === selectedRecipient)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    
    if (!draggedFieldType || !pageRef.current) return

    const rect = pageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Default sizes for different field types
    const defaultSizes = {
      signature: { width: 25, height: 8 },
      initial: { width: 10, height: 8 },
      date: { width: 20, height: 5 },
      name: { width: 25, height: 5 },
      text: { width: 30, height: 5 },
      checkbox: { width: 5, height: 5 }
    }

    const size = defaultSizes[draggedFieldType]

    onFieldDrop({
      type: draggedFieldType,
      recipientId: selectedRecipient,
      page: currentPage,
      x: Math.max(0, Math.min(100 - size.width, x)),
      y: Math.max(0, Math.min(100 - size.height, y)),
      width: size.width,
      height: size.height
    })
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 25))
  }

  const handleZoomReset = () => {
    setZoom(100)
  }

  return (
    <div className="flex-1 bg-slate-100 overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-medium-gray">
            Page {currentPage} of {document.pages}
          </div>
          <Badge variant="outline" className="text-xs">
            {pageFields.length} field{pageFields.length !== 1 ? 's' : ''} on this page
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 50}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-sm text-medium-gray w-12 text-center">
            {zoom}%
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 200}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleZoomReset}
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="flex-1 overflow-auto p-8"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="max-w-4xl mx-auto">
          {/* Document Page */}
          <div
            ref={pageRef}
            className="relative bg-white shadow-lg mx-auto transition-transform duration-200"
            style={{
              width: `${8.5 * (zoom / 100)}in`,
              height: `${11 * (zoom / 100)}in`,
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center'
            }}
          >
            {/* Mock PDF Content */}
            <div className="absolute inset-0 p-16 text-slate-300">
              <div className="space-y-4">
                <div className="text-3xl font-bold">Master Service Agreement</div>
                <div className="h-px bg-slate-200" />
                <div className="space-y-2">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="flex gap-2">
                      <div className="h-2 bg-slate-100 rounded" style={{ width: `${Math.random() * 40 + 60}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Placed Fields */}
            {pageFields.map((field) => {
              const recipient = document.recipients.find(r => r.id === field.recipientId)
              return (
                <ESignatureFieldItem
                  key={field.id}
                  field={field}
                  recipient={recipient}
                  isSelected={selectedFieldId === field.id}
                  onSelect={() => setSelectedFieldId(field.id)}
                  onUpdate={(updates) => onFieldUpdate(field.id, updates)}
                  onDelete={() => onFieldDelete(field.id)}
                />
              )
            })}

            {/* Drop Zone Indicator */}
            {isDragging && (
              <div className="absolute inset-0 bg-stackmatch-blue/5 border-2 border-dashed border-stackmatch-blue pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Card className="p-4 bg-white shadow-lg">
                    <div className="flex items-center gap-2 text-stackmatch-blue">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Drop field here</span>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* Page Number */}
          <div className="text-center mt-4 text-sm text-medium-gray">
            Page {currentPage}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-slate-200 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-medium-gray">
          <div className="flex items-center gap-4">
            {currentRecipient && (
              <>
                <span>Assigning fields to:</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: currentRecipient.color }}
                  />
                  <span className="font-medium">{currentRecipient.name}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span>{placedFields.length} total fields</span>
            <span>•</span>
            <span>{document.recipients.length} recipients</span>
          </div>
        </div>
      </div>
    </div>
  )
}