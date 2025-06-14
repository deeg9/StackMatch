"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  subcategories?: string[]
  popular?: boolean
}

interface CategorySelectionGridProps {
  categories: Category[]
  selectedCategoryId: string | null
  onSelectCategory: (categoryId: string) => void
  layout?: "grid" | "list"
  size?: "sm" | "md" | "lg"
}

function CategorySelectionGrid({
  categories,
  selectedCategoryId,
  onSelectCategory,
  layout = "grid",
  size = "md",
}: CategorySelectionGridProps) {
  // Get size-specific classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return {
          card: "p-3",
          icon: "h-6 w-6 mb-2",
          title: "text-sm font-medium",
          description: "text-xs",
          badge: "text-xs px-1.5 py-0.5",
        }
      case "lg":
        return {
          card: "p-6",
          icon: "h-12 w-12 mb-4",
          title: "text-lg font-semibold",
          description: "text-sm",
          badge: "text-sm px-2.5 py-1",
        }
      default: // md
        return {
          card: "p-4",
          icon: "h-8 w-8 mb-3",
          title: "text-base font-medium",
          description: "text-xs",
          badge: "text-xs px-2 py-0.5",
        }
    }
  }

  const sizeClasses = getSizeClasses()

  return (
    <div
      className={cn(
        "grid gap-4",
        layout === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1",
      )}
    >
      {categories.map((category) => {
        const isSelected = category.id === selectedCategoryId

        return (
          <Card
            key={category.id}
            className={cn(
              sizeClasses.card,
              "relative cursor-pointer transition-all",
              isSelected
                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                : "hover:border-primary/50 hover:bg-gray-50",
            )}
            onClick={() => onSelectCategory(category.id)}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-0.5">
                <Check className="h-3 w-3" />
              </div>
            )}

            {category.popular && (
              <Badge
                variant="secondary"
                className={cn("absolute top-2 right-2", sizeClasses.badge, isSelected && "right-8")}
              >
                Popular
              </Badge>
            )}

            <div className={cn("text-primary", sizeClasses.icon)}>{category.icon}</div>

            <h3 className={sizeClasses.title}>{category.name}</h3>

            <p className={cn("text-gray-500 mt-1", sizeClasses.description)}>{category.description}</p>

            {category.subcategories && category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {category.subcategories.slice(0, 3).map((subcategory) => (
                  <Badge key={subcategory} variant="outline" className={sizeClasses.badge}>
                    {subcategory}
                  </Badge>
                ))}
                {category.subcategories.length > 3 && (
                  <Badge variant="outline" className={sizeClasses.badge}>
                    +{category.subcategories.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}

export default CategorySelectionGrid
