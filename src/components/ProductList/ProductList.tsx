import type { Product } from '../../types/product'
import ProductCard from '../ProductCard'
import './ProductList.css'

interface ProductListProps {
  products: Product[]
  isLoading?: boolean
}

const ProductList = ({
  products,
  isLoading,
}: ProductListProps): JSX.Element => {
  if (isLoading)
    return (
      <div className="product-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    )

  if (!products.length)
    return (
      <div className="product-list-empty">
        <p>No products found.</p>
      </div>
    )

  return (
    <div className="product-list">
      {products.map((product: Product) => (
        <ProductCard key={product.productId} product={product} />
      ))}
    </div>
  )
}

export default ProductList
