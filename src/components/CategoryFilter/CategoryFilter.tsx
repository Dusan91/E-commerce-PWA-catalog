import type { Category, SelectedCategory } from '../../types/product'
import './CategoryFilter.css'

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: SelectedCategory
  onCategoryChange: (category: SelectedCategory) => void
  isLoading?: boolean
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading = false,
}: CategoryFilterProps): JSX.Element => {
  return (
    <div className="category-filter">
      <h2 className="filter-title">Filter by Category</h2>
      <div className="filter-buttons">
        <button
          className={`filter-button ${
            selectedCategory === null ? 'active' : ''
          }`}
          onClick={() => onCategoryChange(null)}
          disabled={isLoading}
        >
          All Products
        </button>
        {categories.length > 0 ? (
          categories.map((category: Category) => (
            <button
              key={category.id}
              className={`filter-button ${
                selectedCategory === category.name ? 'active' : ''
              }`}
              onClick={() => onCategoryChange(category.name)}
              disabled={isLoading}
            >
              {category.name}
            </button>
          ))
        ) : (
          <div style={{ padding: '10px', color: '#6b7280', fontSize: '14px' }}>
            Loading categories...
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryFilter
