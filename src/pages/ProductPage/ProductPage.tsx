import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Product } from '../../types/product'
import { api } from '../../services/api'
import './ProductPage.css'

const ProductPage = (): JSX.Element => {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    const loadProduct = async (): Promise<void> => {
      if (!productId) {
        setError('Product ID is required')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const productData = await api.getProduct(productId)
        setProduct(productData)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load product'
        )
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const goToNextImage = useCallback((): void => {
    if (!product) return
    setCurrentImageIndex((prev) =>
      prev < product.images.length - 1 ? prev + 1 : 0
    )
  }, [product])

  const goToPreviousImage = useCallback((): void => {
    if (!product) return
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : (product?.images.length ?? 1) - 1
    )
  }, [product])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!product) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPreviousImage()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNextImage()
      } else if (e.key === 'Escape' && isZoomed) {
        setIsZoomed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [product, isZoomed, goToNextImage, goToPreviousImage])

  const getImageSrc = (): string => {
    if (!product) return ''
    return product.images[currentImageIndex] || ''
  }

  if (isLoading) {
    return (
      <div className="product-page">
        <div className="product-page-loading">
          <div className="loading-spinner"></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-page">
        <div className="product-page-error">
          <p>{error || 'Product not found'}</p>
          <button onClick={() => navigate('/')} className="back-button">
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.availability === 'Out of Stock'

  return (
    <div className="product-page">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="product-detail">
        <div className="product-detail-images">
          <div className="product-main-image">
            <img
              src={getImageSrc()}
              alt={product.name}
              className="product-detail-image"
              onClick={() => setIsZoomed(true)}
              style={{ cursor: 'zoom-in' }}
            />
            {isOutOfStock && (
              <div className="out-of-stock-badge">Out of Stock</div>
            )}
            {product.images.length > 1 && (
              <>
                <button
                  className="image-nav-button image-nav-prev"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPreviousImage()
                  }}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="image-nav-button image-nav-next"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNextImage()
                  }}
                  aria-label="Next image"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="product-thumbnails">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`thumbnail ${
                    index === currentImageIndex ? 'active' : ''
                  }`}
                  onClick={() => {
                    setCurrentImageIndex(index)
                  }}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Zoom Modal */}
        {isZoomed && (
          <div
            className="zoom-overlay"
            onClick={() => setIsZoomed(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsZoomed(false)
            }}
          >
            <div className="zoom-container" onClick={(e) => e.stopPropagation()}>
              <button
                className="zoom-close"
                onClick={() => setIsZoomed(false)}
                aria-label="Close zoom"
              >
                ×
              </button>
              {product.images.length > 1 && (
                <>
                  <button
                    className="zoom-nav-button zoom-nav-prev"
                    onClick={goToPreviousImage}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    className="zoom-nav-button zoom-nav-next"
                    onClick={goToNextImage}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
              <img
                src={getImageSrc()}
                alt={product.name}
                className="zoom-image"
                onClick={() => setIsZoomed(false)}
              />
            </div>
          </div>
        )}

        <div className="product-detail-info">
          <div className="product-detail-header">
            <h1 className="product-detail-name">{product.name}</h1>
            <p className="product-detail-brand">{product.brand}</p>
          </div>

          <div className="product-detail-rating">
            <span className="rating-stars">
              {'★'.repeat(Math.floor(product.rating))}
              {'☆'.repeat(5 - Math.floor(product.rating))}
            </span>
            <span className="rating-value">{product.rating}</span>
            <span className="reviews-count">
              ({product.reviewsCount} reviews)
            </span>
          </div>

          <div className="product-detail-price">
            <span className="currency">{product.currency}</span>
            <span className="amount">{product.price.toFixed(2)}</span>
          </div>

          <div className="product-detail-availability">
            <span
              className={`availability-badge ${
                isOutOfStock ? 'out-of-stock' : 'in-stock'
              }`}
            >
              {product.availability}
            </span>
          </div>

          <div className="product-detail-description">
            <h2>Description</h2>
            <p>{product.description}</p>
          </div>

          {product.tags.length > 0 && (
            <div className="product-detail-tags">
              <h3>Tags</h3>
              <div className="tags-list">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="product-detail-meta">
            <p>
              <strong>Category:</strong> {product.category}
            </p>
            <p>
              <strong>Added:</strong>{' '}
              {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage

