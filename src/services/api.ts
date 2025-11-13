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
      console.warn(
        'Network request failed, using in-memory cached data:',
        error
      )
      return cached.data as T
    }

    try {
      const swCache = await caches.open('api-cache')
      let cachedResponse = await swCache.match(url)

      if (!cachedResponse) {
        cachedResponse = await swCache.match(
          new Request(url, { method: 'GET' })
        )
      }

      if (!cachedResponse && url.includes('/products/')) {
        const productId = url.split('/products/')[1]?.split('?')[0]
        if (productId) {
          const allKeys = await swCache.keys()
          const matchingKey = allKeys.find((key) => {
            const keyUrl = typeof key === 'string' ? key : key.url
            return (
              keyUrl.includes(`/products/${productId}`) ||
              keyUrl.endsWith(`/products/${productId}`)
            )
          })
          if (matchingKey) {
            cachedResponse = await swCache.match(matchingKey)
          }
        }
      }

      if (cachedResponse) {
        const data = await cachedResponse.json()
        console.log('✅ Using service worker cache for offline request:', url)
        cache.set(cacheKey, { data, timestamp: now })
        return data as T
      } else {
        console.warn('⚠️ No cached response found for:', url)
        try {
          const allKeys = await swCache.keys()
          const keyUrls = allKeys
            .slice(0, 5)
            .map((k) => (typeof k === 'string' ? k : k.url))
          console.log('Sample cache keys:', keyUrls)
        } catch (e) {
          console.error('Failed to log cache keys:', e)
        }
      }
    } catch (cacheError) {
      console.error('Failed to access service worker cache:', cacheError)
    }

    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch'
    console.error('❌ All cache checks failed for:', url, errorMessage)
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

    const url = `${API_BASE_URL}/products${
      params.toString() ? `?${params.toString()}` : ''
    }`

    const cacheKey = url
    const cached = cache.get(cacheKey)
    const now = Date.now()

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data as PaginatedResponse<Product>
    }

    try {
      const response = await fetch(url)
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
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
      try {
        const swCache = await caches.open('api-cache')
        const cachedResponse = await swCache.match(url)
        if (cachedResponse) {
          const data = await cachedResponse.json()
          const totalHeader = cachedResponse.headers.get('X-Total-Count')
          const total = totalHeader ? parseInt(totalHeader, 10) : data.length
          const result: PaginatedResponse<Product> = { data, total }
          console.warn('Using service worker cache for offline request:', url)
          return result
        }
      } catch (cacheError) {
        console.error('Failed to access service worker cache:', cacheError)
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
