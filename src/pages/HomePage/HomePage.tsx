import CategoryFilter from '../../components/CategoryFilter'
import ProductList from '../../components/ProductList/ProductList'
import { useProducts } from '../../hooks/useProducts'

const HomePage = (): JSX.Element => {
  const {
    products,
    categories,
    selectedCategory,
    isLoading,
    error,
    currentPage,
    totalPages,
    handleCategoryChange,
    handlePageChange,
    loadProducts,
  } = useProducts()

  return (
    <>
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={loadProducts} className="retry-button">
            Retry
          </button>
        </div>
      )}
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        isLoading={isLoading}
      />
      <ProductList
        products={products}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  )
}

export default HomePage

