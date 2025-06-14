"use client"

import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { setLoading, setError, setSearchResults } from "@/store/slices/sellerProfilesSlice"
import { useDebounce } from "./use-debounce"

interface SearchFilters {
  query: string
  location: string
  services: string[]
  technologies: string[]
  minRating: number
  availability: boolean
  verified: boolean
  sortBy: "rating" | "projects" | "response_time" | "created_at"
  sortOrder: "asc" | "desc"
}

export function useSellerSearch() {
  const dispatch = useDispatch()
  const { searchResults, isLoading, error } = useSelector((state: RootState) => state.sellerProfiles)

  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    location: "",
    services: [],
    technologies: [],
    minRating: 0,
    availability: false,
    verified: false,
    sortBy: "rating",
    sortOrder: "desc",
  })

  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const debouncedQuery = useDebounce(filters.query, 300)

  const searchSellers = useCallback(
    async (resetPage = false) => {
      const currentPage = resetPage ? 1 : page
      if (resetPage) {
        setPage(1)
      }

      dispatch(setLoading(true))
      dispatch(setError(null))

      try {
        const searchParams = new URLSearchParams({
          q: debouncedQuery,
          location: filters.location,
          services: filters.services.join(","),
          technologies: filters.technologies.join(","),
          minRating: filters.minRating.toString(),
          availability: filters.availability.toString(),
          verified: filters.verified.toString(),
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder,
          page: currentPage.toString(),
          limit: "20",
        })

        const response = await fetch(`/api/sellers/search?${searchParams}`)
        if (!response.ok) {
          throw new Error("Failed to search sellers")
        }

        const data = await response.json()

        if (resetPage) {
          dispatch(setSearchResults(data.sellers))
        } else {
          // Append to existing results for pagination
          dispatch(setSearchResults([...searchResults, ...data.sellers]))
        }

        setHasMore(data.pagination.page < data.pagination.totalPages)
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : "Search failed"))
      } finally {
        dispatch(setLoading(false))
      }
    },
    [dispatch, debouncedQuery, filters, page, searchResults],
  )

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }, [])

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }, [isLoading, hasMore])

  const resetSearch = useCallback(() => {
    setFilters({
      query: "",
      location: "",
      services: [],
      technologies: [],
      minRating: 0,
      availability: false,
      verified: false,
      sortBy: "rating",
      sortOrder: "desc",
    })
    setPage(1)
    setHasMore(true)
    dispatch(setSearchResults([]))
  }, [dispatch])

  // Trigger search when filters change
  useEffect(() => {
    searchSellers(true)
  }, [
    debouncedQuery,
    filters.location,
    filters.services,
    filters.technologies,
    filters.minRating,
    filters.availability,
    filters.verified,
    filters.sortBy,
    filters.sortOrder,
  ])

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      searchSellers(false)
    }
  }, [page])

  return {
    searchResults,
    isLoading,
    error,
    filters,
    hasMore,
    updateFilters,
    loadMore,
    resetSearch,
    searchSellers: () => searchSellers(true),
  }
}
