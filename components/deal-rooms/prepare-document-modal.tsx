'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Upload,
  X,
  Plus,
  Trash2,
  ChevronDown,
  FileText,
  CloudUpload,
} from 'lucide-react'

interface Recipient {
  id: string
  name: string
  email: string
  action: 'needs-to-sign' | 'receives-copy'
  signingOrder?: number
}

interface PrepareDocumentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PrepareDocumentModal({ open, onOpenChange }: PrepareDocumentModalProps) {
  const router = useRouter()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: '1', name: '', email: '', action: 'needs-to-sign' }
  ])
  const [setSigningOrder, setSetSigningOrder] = useState(false)
  const [emailSubject, setEmailSubject] = useState('Signature requested for: ')
  const [emailMessage, setEmailMessage] = useState('')

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0 && files[0].type === 'application/pdf') {
      setUploadedFile(files[0])
      // Update email subject with document name
      setEmailSubject(`Signature requested for: ${files[0].name}`)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0 && files[0].type === 'application/pdf') {
      setUploadedFile(files[0])
      // Update email subject with document name
      setEmailSubject(`Signature requested for: ${files[0].name}`)
    }
  }

  const addRecipient = () => {
    const newRecipient: Recipient = {
      id: Date.now().toString(),
      name: '',
      email: '',
      action: 'needs-to-sign'
    }
    setRecipients([...recipients, newRecipient])
  }

  const removeRecipient = (id: string) => {
    setRecipients(recipients.filter(r => r.id !== id))
  }

  const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
    setRecipients(recipients.map(r => 
      r.id === id ? { ...r, [field]: value } : r
    ))
  }

  const getActionLabel = (action: string) => {
    return action === 'needs-to-sign' ? 'Needs to Sign' : 'Receives a Copy'
  }

  const handleNextAddFields = () => {
    // In a real app, you would save the document and recipients data
    // For now, we'll navigate to the add fields page with a test document ID
    const documentId = uploadedFile ? Date.now().toString() : 'test-document'
    
    // Navigate to the add fields page
    // Using window.location.pathname to get the current deal room ID
    const currentPath = window.location.pathname
    const dealRoomMatch = currentPath.match(/deal-rooms\/(\d+)/)
    const dealRoomId = dealRoomMatch ? dealRoomMatch[1] : '1'
    
    router.push(`/deal-rooms/${dealRoomId}/esignature/add-fields?documentId=${documentId}`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-stackmatch-navy">
            Prepare Document for Signature
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {/* Section 1: Add Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-stackmatch-navy">1. Add Documents</h3>
            
            <div 
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragging 
                  ? 'border-stackmatch-blue bg-stackmatch-blue/5' 
                  : 'border-slate-300 hover:border-stackmatch-blue hover:bg-slate-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {uploadedFile ? (
                <div className="flex items-center justify-center gap-4">
                  <FileText className="w-12 h-12 text-red-500" />
                  <div className="text-left">
                    <p className="font-medium text-stackmatch-navy">{uploadedFile.name}</p>
                    <p className="text-sm text-medium-gray">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setUploadedFile(null)}
                    className="ml-auto"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <CloudUpload className="w-12 h-12 text-medium-gray mx-auto mb-4" />
                  <p className="text-medium-gray mb-4">
                    Drop your PDF here or click to upload
                  </p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload from Computer
                      </span>
                    </Button>
                  </label>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Add Recipients */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-stackmatch-navy">2. Add Recipients</h3>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="signing-order"
                checked={setSigningOrder}
                onCheckedChange={(checked) => setSetSigningOrder(checked as boolean)}
              />
              <Label htmlFor="signing-order" className="font-normal cursor-pointer">
                Set signing order
              </Label>
            </div>

            <div className="space-y-3">
              {recipients.map((recipient, index) => (
                <Card key={recipient.id} className="p-4 border-slate-200">
                  <div className="flex items-start gap-3">
                    {setSigningOrder && (
                      <div className="w-8 h-8 bg-stackmatch-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                    )}
                    
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Name"
                        value={recipient.name}
                        onChange={(e) => updateRecipient(recipient.id, 'name', e.target.value)}
                      />
                      <Input
                        type="email"
                        placeholder="Email"
                        value={recipient.email}
                        onChange={(e) => updateRecipient(recipient.id, 'email', e.target.value)}
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="min-w-[160px]">
                          {getActionLabel(recipient.action)}
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={() => updateRecipient(recipient.id, 'action', 'needs-to-sign')}
                        >
                          Needs to Sign
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => updateRecipient(recipient.id, 'action', 'receives-copy')}
                        >
                          Receives a Copy
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRecipient(recipient.id)}
                      disabled={recipients.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            <Button 
              variant="outline" 
              onClick={addRecipient}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Recipient
            </Button>
          </div>

          {/* Section 3: Customize Message */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-stackmatch-navy">3. Customize Message</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input
                  id="email-subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email-message">Email Message</Label>
                <Textarea
                  id="email-message"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  placeholder="Add a personalized message to your recipients..."
                  className="mt-1 min-h-[120px]"
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline">
            Save as Draft
          </Button>
          <Button 
            className="bg-stackmatch-blue hover:bg-stackmatch-navy"
            onClick={handleNextAddFields}
            disabled={!uploadedFile || recipients.some(r => !r.name || !r.email)}
          >
            Next: Add Fields
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}