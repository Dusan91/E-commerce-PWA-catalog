import './Pagination.css'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  isLoading = false,
}: PaginationProps): JSX.Element | null => {
  if (totalPages <= 1) return null

  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePrevious = (): void => {
    if (currentPage > 1 && !isLoading) onPageChange(currentPage - 1)
  }

  const handleNext = (): void => {
    if (currentPage < totalPages && !isLoading) onPageChange(currentPage + 1)
  }

  const handlePageClick = (page: number): void => {
    if (page !== currentPage && !isLoading) onPageChange(page)
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="pagination" aria-label="Product pagination">
      <button
        className="pagination-button pagination-prev"
        onClick={handlePrevious}
        disabled={currentPage === 1 || isLoading}
        aria-label="Previous page"
      >
        Previous
      </button>

      <div className="pagination-pages">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                ...
              </span>
            )
          }

          const pageNumber = page as number
          const isActive = pageNumber === currentPage

          return (
            <button
              key={pageNumber}
              className={`pagination-button pagination-page ${
                isActive ? 'pagination-page-active' : ''
              }`}
              onClick={() => handlePageClick(pageNumber)}
              disabled={isLoading}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {pageNumber}
            </button>
          )
        })}
      </div>

      <button
        className="pagination-button pagination-next"
        onClick={handleNext}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  )
}

export default Pagination
