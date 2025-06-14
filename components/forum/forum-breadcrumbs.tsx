"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"

export function ForumBreadcrumbs() {
  const pathname = usePathname()
  const pathSegments = pathname.split("/").filter((segment) => segment)

  // Remove 'forum' as the base segment for breadcrumbs display
  const relevantSegments = pathSegments[0] === "forum" ? pathSegments.slice(1) : pathSegments

  if (relevantSegments.length === 0 || (relevantSegments.length === 1 && relevantSegments[0] === "forum")) {
    // Don't show breadcrumbs on the main /forum page or if path is just /forum
    return null
  }

  const breadcrumbs = relevantSegments.map((segment, index) => {
    const href = "/forum/" + relevantSegments.slice(0, index + 1).join("/")
    const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    const isLast = index === relevantSegments.length - 1
    return { href, name, isLast }
  })

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
      <ol className="flex items-center space-x-1.5">
        <li>
          <Link href="/forum" className="hover:text-primary">
            Forum
          </Link>
        </li>
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            <ChevronRight className="h-4 w-4" />
            {crumb.isLast ? (
              <span className="font-medium text-foreground ml-1.5">{crumb.name}</span>
            ) : (
              <Link href={crumb.href} className="hover:text-primary ml-1.5">
                {crumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
