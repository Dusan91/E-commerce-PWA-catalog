import { useState, useEffect, useCallback } from 'react'
import type { Product, Category, SelectedCategory } from '../types/product'
import { api } from '../services/api'

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] =
    useState<SelectedCategory>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadCategories = useCallback(async (): Promise<void> => {
    try {
      // Try to load categories from API
      const data = await api.getCategories()
      setCategories(data)
    } catch (err: unknown) {
      console.error('Failed to load categories:', err)
      try {
        // Fallback: extract categories from products if API fails
        const products = await api.getProducts()
        const uniqueCategories = Array.from(
          new Set(products.map((p: Product) => p.category))
        ).map((name: string, index: number) => ({
          id: String(index + 1),
          name,
        }))
        setCategories(uniqueCategories)
      } catch (fallbackErr: unknown) {
        // Fallback failed
        console.error('Fallback also failed:', fallbackErr)
      }
    }
  }, [])

  const loadProducts = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.getProducts(selectedCategory || undefined)
      setProducts(data)
      // Update categories based on products
      setCategories((prevCategories: Category[]) => {
        if (prevCategories.length === 0 && data.length > 0) {
          const uniqueCategories = Array.from(
            new Set(data.map((p: Product) => p.category))
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
  }, [selectedCategory])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])


  const handleCategoryChange = (category: SelectedCategory): void =>
    setSelectedCategory(category)

  return {
    products,
    categories,
    selectedCategory,
    isLoading,
    error,
    handleCategoryChange,
    loadProducts,
  }
}
