import { Link } from 'react-router-dom'
import type { Product } from '../../types/product'
import './ProductCard.css'

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps): JSX.Element => {
  const isOutOfStock = product.availability === 'Out of Stock'
  const imageSrc = product.images[0] || ''

  return (
    <Link
      to={`/product/${product.productId}`}
      className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}
    >
      <div className="product-image-container">
        <img
          src={imageSrc}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
        {isOutOfStock && <div className="out-of-stock-badge">Out of Stock</div>}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-rating">
          <span className="rating-stars">
            {'★'.repeat(Math.floor(product.rating))}
            {'☆'.repeat(5 - Math.floor(product.rating))}
          </span>
          <span className="rating-value">{product.rating}</span>
          <span className="reviews-count">
            ({product.reviewsCount} reviews)
          </span>
        </div>
        {product.tags.length > 0 && (
          <div className="product-tags">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="product-tag">
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="product-tag product-tag-more">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}
        <div className="product-footer">
          <div className="product-price">
            <span className="currency">{product.currency}</span>
            <span className="amount">{product.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard
