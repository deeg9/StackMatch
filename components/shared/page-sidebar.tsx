'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface PageSidebarProps {
  children: ReactNode
  className?: string
}

export function PageSidebar({ children, className }: PageSidebarProps) {
  return (
    <aside className={cn(
      "space-y-6",
      "lg:sticky lg:top-8",
      className
    )}>
      {children}
    </aside>
  )
}