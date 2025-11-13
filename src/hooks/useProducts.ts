import { useState, useEffect, useCallback } from 'react'
import type { Product, Category, SelectedCategory } from '../types/product'
import { api } from '../services/api'

const ITEMS_PER_PAGE = 12

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [itemsPerPage] = useState(ITEMS_PER_PAGE)

  const loadCategories = useCallback(async (): Promise<void> => {
    try {
      const data = await api.getCategories()
      setCategories(data)
    } catch (err: unknown) {
      console.error('Failed to load categories:', err)
      try {
        const response = await api.getProducts()
        const uniqueCategories = Array.from(
          new Set(response.data.map((p: Product) => p.category))
        ).map((name: string, index: number) => ({
          id: String(index + 1),
          name,
        }))
        setCategories(uniqueCategories)
      } catch (fallbackErr: unknown) {
        console.error('Fallback also failed:', fallbackErr)
      }
    }
  }, [])

  const loadProducts = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.getProducts(
        selectedCategory || undefined,
        currentPage,
        itemsPerPage
      )
      setProducts(response.data)
      setTotalCount(response.total)
      setCategories((prevCategories: Category[]) => {
        if (prevCategories.length === 0 && response.data.length > 0) {
          const uniqueCategories = Array.from(
            new Set(response.data.map((p: Product) => p.category))
          ).map((name: string, index: number) => ({
            id: String(index + 1),
            name,
          }))
          return uniqueCategories
        }
        return prevCategories
      })
    } catch (err: unknown) {
      console.error('Failed to load products:', err)
      setError('Failed to load products. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, currentPage, itemsPerPage])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory])

  const handleCategoryChange = (category: SelectedCategory): void =>
    setSelectedCategory(category)

  const handlePageChange = (page: number): void => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return {
    products,
    categories,
    selectedCategory,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCount,
    itemsPerPage,
    handleCategoryChange,
    handlePageChange,
    loadProducts,
  }
}
