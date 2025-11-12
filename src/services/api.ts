import type { Product, Category } from '../types/product'
import { CACHE_DURATION, MAX_CACHE_SIZE } from '../constants'

const API_BASE_URL = 'http://localhost:3001'

// Cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number }>()

/**
 * Cleans up expired cache entries and limits cache size
 */
const cleanupCache = (): void => {
  const now = Date.now()
  const entries = Array.from(cache.entries())

  // Remove expired entries
  entries.forEach(([key, value]) => {
    if (now - value.timestamp >= CACHE_DURATION) cache.delete(key)
  })

  // If still too large, remove oldest entries
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

  // Return cached data if still valid
  if (cached && now - cached.timestamp < CACHE_DURATION) return cached.data as T

  try {
    const response = await fetch(url, options)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const data = await response.json()
    // Store in cache
    cache.set(cacheKey, { data, timestamp: now })
    // Cleanup cache periodically
    cleanupCache()
    return data as T
  } catch (error: unknown) {
    // If network fails, try to return cached data
    if (cached) {
      console.warn('Network request failed, using cached data:', error)
      return cached.data as T
    }
    throw error
  }
}

export const api = {
  async getProducts(category?: string): Promise<Product[]> {
    const url = category
      ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
      : `${API_BASE_URL}/products`
    return fetchWithCache<Product[]>(url)
  },

  async getProduct(productId: string): Promise<Product> {
    const url = `${API_BASE_URL}/products/${productId}`
    return fetchWithCache<Product>(url)
  },

  async getCategories(): Promise<Category[]> {
    const url = `${API_BASE_URL}/categories`
    return fetchWithCache<Category[]>(url)
  },

  /**
   * Clears the API cache
   */
  clearCache: (): void => cache.clear(),
}
