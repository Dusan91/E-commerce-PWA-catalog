/**
 * Creates a local placeholder image using data URI
 * This avoids external dependencies and security concerns
 */
export const createPlaceholderImage = (
  width: number,
  height: number,
  text: string
): string => {
  // Create a simple SVG placeholder as data URI
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text 
        x="50%" 
        y="50%" 
        font-family="Arial, sans-serif" 
        font-size="16" 
        fill="#9ca3af" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${text}
      </text>
    </svg>
  `.trim()

  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Gets placeholder image for product
 */
export const getProductPlaceholder = (productName: string): string => {
  return createPlaceholderImage(500, 375, productName)
}

