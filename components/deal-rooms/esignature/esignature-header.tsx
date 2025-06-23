'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Eye, Send } from 'lucide-react'

interface ESignatureHeaderProps {
  documentTitle: string
  onBack: () => void
  onPreview: () => void
  onSend: () => void
  canSend: boolean
}

export function ESignatureHeader({
  documentTitle,
  onBack,
  onPreview,
  onSend,
  canSend
}: ESignatureHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-slate-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <Separator orientation="vertical" className="h-8" />
          
          <div>
            <h1 className="text-lg font-semibold text-stackmatch-navy">
              Add Fields to Document
            </h1>
            <p className="text-sm text-medium-gray">{documentTitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onPreview}
            className="hover:bg-slate-50"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          
          <Button
            onClick={onSend}
            disabled={!canSend}
            className="bg-trust-green hover:bg-success-green disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </header>
  )
}