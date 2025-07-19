'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: LucideIcon
  }
  className?: string
}

export function PageHeader({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("text-center mb-8 animate-fade-in", className)}>
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-stackmatch-blue/10 rounded-lg">
          <Icon className="w-8 h-8 text-stackmatch-blue" />
        </div>
      </div>
      <h1 className="text-4xl font-bold text-stackmatch-dark mb-2">
        {title}
      </h1>
      <p className="text-lg text-medium-gray max-w-2xl mx-auto">
        {description}
      </p>
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link href={action.href}>
              <Button className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white">
                {action.icon && <action.icon className="w-4 h-4 mr-2" />}
                {action.label}
              </Button>
            </Link>
          ) : (
            <Button 
              onClick={action.onClick}
              className="bg-stackmatch-blue hover:bg-stackmatch-navy text-white"
            >
              {action.icon && <action.icon className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}