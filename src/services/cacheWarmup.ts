import { api } from './api'

export const warmupCache = async (): Promise<void> => {
  try {
    console.log('🔥 Starting cache warmup...')
    try {
      await api.getCategories()
      console.log('✅ Categories cached')
    } catch (error) {
      console.warn('⚠️ Failed to cache categories:', error)
    }

    try {
      const firstPage = await api.getProducts(undefined, 1, 12)
      const totalProducts = firstPage.total
      const itemsPerPage = 12
      const totalPages = Math.ceil(totalProducts / itemsPerPage)

      console.log(
        `📦 Found ${totalProducts} products across ${totalPages} pages`
      )

      const pagePromises: Promise<unknown>[] = []
      const maxConcurrent = 5

      for (let page = 1; page <= totalPages; page++) {
        if (pagePromises.length >= maxConcurrent) {
          await Promise.all(pagePromises)
          pagePromises.length = 0
        }
        pagePromises.push(
          api.getProducts(undefined, page, itemsPerPage).catch((err) => {
            console.warn(`⚠️ Failed to cache page ${page}:`, err)
          })
        )
      }

      if (pagePromises.length > 0) await Promise.all(pagePromises)
      console.log('✅ All product pages cached')

      console.log('🔄 Caching individual product details...')
      const allProducts: Array<{ productId: string }> = []

      for (let page = 1; page <= totalPages; page++) {
        try {
          const pageData = await api.getProducts(undefined, page, itemsPerPage)
          allProducts.push(...pageData.data)
        } catch (err) {
          console.warn(`⚠️ Failed to get products from page ${page}:`, err)
        }
      }

      const productPromises: Promise<unknown>[] = []
      const maxProductConcurrent = 10

      for (const product of allProducts) {
        if (productPromises.length >= maxProductConcurrent) {
          await Promise.all(productPromises)
          productPromises.length = 0
        }
        productPromises.push(
          api.getProduct(product.productId).catch((err) => {
            console.warn(
              `⚠️ Failed to cache product ${product.productId}:`,
              err
            )
          })
        )
      }

      if (productPromises.length > 0) await Promise.all(productPromises)
      console.log(
        `✅ All ${allProducts.length} individual product details cached`
      )
    } catch (error) {
      console.warn('⚠️ Failed to cache products:', error)
    }

    try {
      const categories = await api.getCategories()
      const itemsPerPage = 12
      console.log(`🏷️ Caching all pages for ${categories.length} categories...`)

      for (const category of categories) {
        try {
          const firstPage = await api.getProducts(
            category.name,
            1,
            itemsPerPage
          )
          const totalProducts = firstPage.total
          const totalPages = Math.ceil(totalProducts / itemsPerPage)

          if (totalPages > 0) {
            console.log(
              `  📄 Category "${category.name}": ${totalProducts} products, ${totalPages} pages`
            )

            const categoryPagePromises: Promise<unknown>[] = []
            const maxConcurrent = 5

            for (let page = 1; page <= totalPages; page++) {
              if (categoryPagePromises.length >= maxConcurrent) {
                await Promise.all(categoryPagePromises)
                categoryPagePromises.length = 0
              }
              categoryPagePromises.push(
                api
                  .getProducts(category.name, page, itemsPerPage)
                  .catch((err) => {
                    console.warn(
                      `⚠️ Failed to cache category ${category.name} page ${page}:`,
                      err
                    )
                  })
              )
            }

            if (categoryPagePromises.length > 0) {
              await Promise.all(categoryPagePromises)
            }
          }
        } catch (err) {
          console.warn(`⚠️ Failed to cache category ${category.name}:`, err)
        }
      }

      console.log('✅ All category filter pages cached')
    } catch (error) {
      console.warn('⚠️ Failed to cache category filters:', error)
    }

    console.log('🎉 Cache warmup completed!')
  } catch (error) {
    console.error('❌ Cache warmup failed:', error)
  }
}

export const warmupCacheInBackground = (): void => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        warmupCache()
      },
      { timeout: 5000 }
    )
  } else {
    setTimeout(() => {
      warmupCache()
    }, 2000)
  }
}
