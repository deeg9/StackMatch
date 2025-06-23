'use client'

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { FileText } from 'lucide-react'

interface ESignaturePageNavigatorProps {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  fieldsPerPage: Record<number, number>
}

export function ESignaturePageNavigator({
  totalPages,
  currentPage,
  onPageChange,
  fieldsPerPage
}: ESignaturePageNavigatorProps) {
  return (
    <aside className="w-48 bg-white border-l border-slate-200 flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-stackmatch-navy">
          Page Navigator
        </h3>
        <p className="text-xs text-medium-gray mt-1">
          {totalPages} pages total
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1
            const fieldCount = fieldsPerPage[pageNumber] || 0
            const isActive = pageNumber === currentPage

            return (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`w-full relative group transition-all duration-200 ${
                  isActive ? 'ring-2 ring-stackmatch-blue' : ''
                }`}
              >
                {/* Page Thumbnail */}
                <div 
                  className={`relative bg-white border rounded-md overflow-hidden transition-all duration-200 ${
                    isActive 
                      ? 'border-stackmatch-blue shadow-md' 
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                  style={{ aspectRatio: '8.5 / 11' }}
                >
                  {/* Mock Page Content */}
                  <div className="absolute inset-0 p-2">
                    <div className="w-full h-full bg-slate-50 rounded flex items-center justify-center">
                      <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                  </div>

                  {/* Page Number Overlay */}
                  <div className={`absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t ${
                    isActive 
                      ? 'from-stackmatch-blue/90 to-transparent' 
                      : 'from-slate-900/50 to-transparent'
                  }`}>
                    <div className="text-white text-xs font-medium">
                      Page {pageNumber}
                    </div>
                  </div>

                  {/* Field Count Badge */}
                  {fieldCount > 0 && (
                    <Badge 
                      className="absolute top-2 right-2 text-xs"
                      variant={isActive ? 'default' : 'secondary'}
                    >
                      {fieldCount}
                    </Badge>
                  )}

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="absolute inset-0 ring-2 ring-stackmatch-blue rounded-md pointer-events-none" />
                  )}
                </div>

                {/* Page Label */}
                <div className={`mt-1 text-xs ${
                  isActive ? 'text-stackmatch-blue font-medium' : 'text-medium-gray'
                }`}>
                  {fieldCount > 0 ? `${fieldCount} field${fieldCount !== 1 ? 's' : ''}` : 'No fields'}
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>

      {/* Summary */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-medium-gray">Total Fields:</span>
            <span className="font-semibold text-stackmatch-navy">
              {Object.values(fieldsPerPage).reduce((sum, count) => sum + count, 0)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-medium-gray">Pages with Fields:</span>
            <span className="font-semibold text-stackmatch-navy">
              {Object.keys(fieldsPerPage).length}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}