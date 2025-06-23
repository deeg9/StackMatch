'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ESignatureHeader } from './esignature-header'
import { ESignatureFieldsPalette } from './esignature-fields-palette'
import { ESignatureDocumentCanvas } from './esignature-document-canvas'
import { ESignaturePageNavigator } from './esignature-page-navigator'

export interface Recipient {
  id: string
  name: string
  email: string
  jobTitle: string
  color: string
  role: 'buyer' | 'seller'
}

export interface DocumentField {
  id: string
  type: 'signature' | 'initial' | 'date' | 'name' | 'text' | 'checkbox'
  recipientId: string
  page: number
  x: number
  y: number
  width: number
  height: number
}

interface ESignatureAddFieldsProps {
  dealRoomId: string
  document: {
    id: string
    title: string
    pages: number
    recipients: Recipient[]
  }
}

export function ESignatureAddFields({ dealRoomId, document }: ESignatureAddFieldsProps) {
  const router = useRouter()
  const [selectedRecipient, setSelectedRecipient] = useState<string>(document.recipients[0]?.id || '')
  const [placedFields, setPlacedFields] = useState<DocumentField[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedFieldType, setDraggedFieldType] = useState<DocumentField['type'] | null>(null)

  const handleBack = () => {
    router.back()
  }

  const handlePreview = () => {
    // In a real app, this would open a preview modal
    console.log('Preview document with fields:', placedFields)
  }

  const handleSend = () => {
    // In a real app, this would send the document for signature
    console.log('Sending document with fields:', placedFields)
    router.push(`/deal-rooms/${dealRoomId}?tab=proposals&sent=true`)
  }

  const handleFieldDrop = (field: Omit<DocumentField, 'id'>) => {
    const newField: DocumentField = {
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    setPlacedFields([...placedFields, newField])
  }

  const handleFieldUpdate = (fieldId: string, updates: Partial<DocumentField>) => {
    setPlacedFields(fields => 
      fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    )
  }

  const handleFieldDelete = (fieldId: string) => {
    setPlacedFields(fields => fields.filter(field => field.id !== fieldId))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <ESignatureHeader
        documentTitle={document.title}
        onBack={handleBack}
        onPreview={handlePreview}
        onSend={handleSend}
        canSend={placedFields.length > 0}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Fields Palette */}
        <ESignatureFieldsPalette
          recipients={document.recipients}
          selectedRecipient={selectedRecipient}
          onRecipientChange={setSelectedRecipient}
          onFieldDragStart={(type) => {
            setIsDragging(true)
            setDraggedFieldType(type)
          }}
          onFieldDragEnd={() => {
            setIsDragging(false)
            setDraggedFieldType(null)
          }}
        />

        {/* Center - Document Canvas */}
        <ESignatureDocumentCanvas
          document={document}
          currentPage={currentPage}
          placedFields={placedFields}
          selectedRecipient={selectedRecipient}
          isDragging={isDragging}
          draggedFieldType={draggedFieldType}
          onFieldDrop={handleFieldDrop}
          onFieldUpdate={handleFieldUpdate}
          onFieldDelete={handleFieldDelete}
        />

        {/* Right Sidebar - Page Navigator */}
        <ESignaturePageNavigator
          totalPages={document.pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          fieldsPerPage={placedFields.reduce((acc, field) => {
            acc[field.page] = (acc[field.page] || 0) + 1
            return acc
          }, {} as Record<number, number>)}
        />
      </div>
    </div>
  )
}