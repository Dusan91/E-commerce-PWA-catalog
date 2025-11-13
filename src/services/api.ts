import type { Product, Category } from '../types/product'
import { CACHE_DURATION, MAX_CACHE_SIZE } from '../constants'

const API_BASE_URL = 'http://localhost:3001'

const cache = new Map<string, { data: unknown; timestamp: number }>()

const cleanupCache = (): void => {
  const now = Date.now()
  const entries = Array.from(cache.entries())

  entries.forEach(([key, value]) => {
    if (now - value.timestamp >= CACHE_DURATION) cache.delete(key)
  })

  if (cache.size > MAX_CACHE_SIZE) {
    const sortedEntries = Array.from(cache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp
    )
    const toRemove = sortedEntries.slice(0, cache.size - MAX_CACHE_SIZE)
    toRemove.forEach(([key]) => cache.delete(key))
  }
}

async function fetchWithCache<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const cacheKey = url
  const cached = cache.get(cacheKey)
  const now = Date.now()

  if (cached && now - cached.timestamp < CACHE_DURATION) return cached.data as T

  try {
    const response = await fetch(url, options)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    cache.set(cacheKey, { data, timestamp: now })
    cleanupCache()
    return data as T
  } catch (error: unknown) {
    if (cached) {
      console.warn('Network request failed, using cached data:', error)
      return cached.data as T
    }
    throw error
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}

export const api = {
  async getProducts(
    category?: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Product>> {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (page) params.append('_page', String(page))
    if (limit) params.append('_limit', String(limit))

    const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ''}`
    
    const cacheKey = url
    const cached = cache.get(cacheKey)
    const now = Date.now()

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data as PaginatedResponse<Product>
    }

    try {
      const response = await fetch(url)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      const total = parseInt(response.headers.get('X-Total-Count') || '0', 10)
      const result: PaginatedResponse<Product> = { data, total }
      cache.set(cacheKey, { data: result, timestamp: now })
      cleanupCache()
      return result
    } catch (error: unknown) {
      if (cached) {
        console.warn('Network request failed, using cached data:', error)
        return cached.data as PaginatedResponse<Product>
      }
      throw error
    }
  },

  async getProduct(productId: string): Promise<Product> {
    const url = `${API_BASE_URL}/products/${productId}`
    return fetchWithCache<Product>(url)
  },

  async getCategories(): Promise<Category[]> {
    const url = `${API_BASE_URL}/categories`
    return fetchWithCache<Category[]>(url)
  },
}
