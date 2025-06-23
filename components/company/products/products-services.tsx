'use client'

import { useState, useEffect } from 'react'
import { ProductFilters } from './product-filters'
import { ProductCard } from './product-card'

interface Product {
  id: string
  name: string
  category: string
  description: string
  keyFeatures: string[]
  pricing: {
    model: string
    startingPrice: string
  }
  rating: number
  userCount: string
  icon: string
  color: string
  bgColor: string
  featured: boolean
}

interface ProductsServicesProps {
  companyId: string
}

export function ProductsServices({ companyId }: ProductsServicesProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/companies/${companyId}/products`)
        if (response.ok) {
          const data = await response.json()
          setProducts(data.products)
          setFilteredProducts(data.products)
        } else {
          // Mock fallback data would go here
          setProducts([])
          setFilteredProducts([])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
        setFilteredProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [companyId])

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.keyFeatures.some(feature => 
          feature.toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [products, searchQuery, selectedCategory])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-slate-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        totalProducts={filteredProducts.length}
      />
      
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-medium-gray text-lg mb-2">No products found</div>
          <div className="text-sm text-medium-gray">
            Try adjusting your search or filter criteria
          </div>
        </div>
      )}
    </div>
  )
}