import type { Product } from '../../types/product'
import ProductCard from '../ProductCard'
import Pagination from '../Pagination'
import './ProductList.css'

interface ProductListProps {
  products: Product[]
  isLoading?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

const ProductList = ({
  products,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
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
    <>
      <div className="product-list">
        {products.map((product: Product) => (
          <ProductCard key={product.productId} product={product} />
        ))}
      </div>
      {currentPage !== undefined &&
        totalPages !== undefined &&
        onPageChange && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            isLoading={isLoading}
          />
        )}
    </>
  )
}

export default ProductList
