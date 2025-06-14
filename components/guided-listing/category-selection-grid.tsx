"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, CheckIcon } from "lucide-react"

export interface Category {
  id: string
  name: string
  description: string
  icon?: string
  subcategories?: Category[]
}

interface CategorySelectionGridProps {
  categories: Category[]
  selectedCategoryId: string | null
  onCategorySelect: (categoryId: string) => void
  onNext: () => void
  onBack: () => void
}

export function CategorySelectionGrid({
  categories,
  selectedCategoryId,
  onCategorySelect,
  onNext,
  onBack,
}: CategorySelectionGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCategories, setFilteredCategories] = useState<Category[]>(categories)
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)

  // Filter categories based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCategories(categories)
      return
    }

    const lowerSearchTerm = searchTerm.toLowerCase()
    const filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(lowerSearchTerm) ||
        category.description.toLowerCase().includes(lowerSearchTerm) ||
        (category.subcategories &&
          category.subcategories.some(
            (sub) =>
              sub.name.toLowerCase().includes(lowerSearchTerm) ||
              sub.description.toLowerCase().includes(lowerSearchTerm),
          )),
    )
    setFilteredCategories(filtered)
  }, [searchTerm, categories])

  // Set active category when selected category changes
  useEffect(() => {
    if (selectedCategoryId) {
      const selected = categories.find((cat) => cat.id === selectedCategoryId) || null
      setActiveCategory(selected)
      setSelectedSubcategories([])
    } else {
      setActiveCategory(null)
      setSelectedSubcategories([])
    }
  }, [selectedCategoryId, categories])

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId)
  }

  const toggleSubcategory = (subcategoryId: string) => {
    setSelectedSubcategories((prev) => {
      if (prev.includes(subcategoryId)) {
        return prev.filter((id) => id !== subcategoryId)
      } else {
        return [...prev, subcategoryId]
      }
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Project Category</CardTitle>
          <CardDescription>Choose the category that best describes your project</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedCategoryId === category.id ? "border-primary bg-primary/5" : "hover:border-primary/50"
                }`}
                onClick={() => handleCategorySelect(category.id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </div>
                  {selectedCategoryId === category.id && <CheckIcon className="h-5 w-5 text-primary" />}
                </div>
              </div>
            ))}
          </div>

          {activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-3">Select Relevant Subcategories (Optional)</h3>
              <div className="flex flex-wrap gap-2">
                {activeCategory.subcategories.map((subcategory) => {
                  const isSelected = selectedSubcategories.includes(subcategory.id)
                  return (
                    <Badge
                      key={subcategory.id}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer ${isSelected ? "" : "hover:border-primary/50"}`}
                      onClick={() => toggleSubcategory(subcategory.id)}
                    >
                      {subcategory.name}
                      {isSelected && <CheckIcon className="ml-1 h-3 w-3" />}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No categories found matching "{searchTerm}". Try a different search term.
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!selectedCategoryId}>
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
