# E-commerce Product Catalog with PWA Features

A modern e-commerce product catalog application built with React, TypeScript, and Progressive Web App (PWA) capabilities. This application demonstrates offline support, caching strategies, and the ability to be installed as a native-like app on mobile devices.

## Features

- **Product Catalog**: Browse products with detailed information including images, prices, ratings, and availability
- **Product Detail Pages**: Individual product pages with image galleries, detailed descriptions, and metadata
- **Category Filtering**: Filter products by category with a dedicated API endpoint
- **Routing**: Client-side routing with React Router for seamless navigation
- **PWA Features**:
  - Offline support with service worker caching
  - Automatic cache pre-warming for complete offline access
  - Add to home screen capability
  - Fast loading with optimized caching strategies
  - Works reliably in poor network conditions
  - Supports up to 500 cached API responses (7-day expiration)
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **TypeScript**: Full type safety throughout the application
- **Custom Hooks**: Reusable business logic encapsulated in custom React hooks
- **Error Boundaries**: React error boundaries for graceful error handling
- **Image Zoom**: Click to zoom images with keyboard navigation support

## Technology Stack

- **React 18**: Modern React with hooks
- **React Router DOM**: Client-side routing and navigation
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Vite PWA Plugin**: PWA configuration and service worker management
- **json-server**: Mock REST API server for development
- **Workbox**: Service worker caching strategies

## Project Structure

```text
dualSoft/
├── src/
│   ├── components/          # React components
│   │   ├── CategoryFilter/  # Category filter component
│   │   │   ├── CategoryFilter.tsx
│   │   │   ├── CategoryFilter.css
│   │   │   └── index.ts
│   │   ├── Footer/         # Footer component
│   │   │   ├── Footer.tsx
│   │   │   ├── Footer.css
│   │   │   └── index.ts
│   │   ├── Header/         # Header component
│   │   │   ├── Header.tsx
│   │   │   ├── Header.css
│   │   │   └── index.ts
│   │   ├── ProductCard/    # Product card component
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductCard.css
│   │   │   └── index.ts
│   │   └── ProductList/     # Product list component
│   │       ├── ProductList.tsx
│   │       ├── ProductList.css
│   │       └── index.ts
│   ├── pages/              # Page components
│   │   ├── HomePage/       # Home page with product catalog
│   │   │   ├── HomePage.tsx
│   │   │   └── index.ts
│   │   └── ProductPage/    # Individual product detail page
│   │       ├── ProductPage.tsx
│   │       ├── ProductPage.css
│   │       └── index.ts
│   ├── hooks/              # Custom React hooks
│   │   └── useProducts.ts  # Products data management hook
│   ├── services/           # API service layer
│   │   ├── api.ts          # API client with caching
│   │   └── cacheWarmup.ts  # Cache pre-warming utility
│   ├── types/              # TypeScript type definitions
│   │   └── product.ts      # Product and category types
│   ├── constants/          # Application constants
│   │   └── index.ts        # Cache, image, and app constants
│   ├── App.tsx             # Main application component with routing
│   ├── App.css             # Application styles
│   ├── main.tsx            # Application entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── db.json                 # json-server database
├── json-server.json        # json-server configuration
├── package.json
├── vite.config.ts          # Vite and PWA configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

1. Start the json-server (mock API) in one terminal:

```bash
npm run server
```

This will start the API server on `http://localhost:3001`

1. Start the development server in another terminal:

```bash
npm run dev
```

This will start the application on `http://localhost:3000`

**Note**: Make sure both servers are running simultaneously. The frontend (port 3000) depends on the API server (port 3001) to fetch product data.

### Building for Production

```bash
npm run build
```

The production build will be in the `dist` directory. To preview the production build:

```bash
npm run preview
```

### Testing Offline Features

1. **Build and serve the production version**:
   ```bash
   npm run build
   npm run preview
   ```

2. **Load the app while online**:
   - Open the app in your browser
   - Check the browser console for cache warmup logs (🔥 Starting cache warmup...)
   - Wait for the warmup to complete (you'll see ✅ messages)

3. **Test offline mode**:
   - Open browser DevTools → Network tab
   - Check "Offline" checkbox
   - Refresh the page
   - All previously cached data should load:
     - Product list pages
     - Individual product detail pages
     - Category filters
     - Images

**Note**: The cache warmup runs automatically in the background when the app loads. You can monitor its progress in the browser console.

## API Endpoints

The json-server provides the following endpoints:

- `GET /products` - Get all products
- `GET /products/:id` - Get a single product by ID
- `GET /products?category=Electronics` - Get products filtered by category
- `GET /categories` - Get all available categories

## PWA Features Implementation

### Service Worker & Caching

The application uses Workbox (via vite-plugin-pwa) to implement service worker caching:

1. **Static Assets Caching**: All JS, CSS, HTML, and image files are precached during build for instant offline access
2. **API Response Caching**: API responses are cached using NetworkFirst strategy:
   - Attempts to fetch from network first
   - Falls back to cache if network fails
   - Cache expires after 7 days (service worker) or 5 minutes (client cache)
   - Maximum 500 cached entries (service worker) or 100 entries (client cache)
   - Automatic cache cleanup to prevent memory leaks
3. **Cache Pre-warming**: Automatic background cache pre-warming on app load:
   - Fetches all categories
   - Caches all product list pages (pagination)
   - Caches all individual product detail pages
   - Caches all category filter pages
   - Ensures complete offline access after first visit

### Manifest Configuration

The web app manifest enables:

- **Add to Home Screen**: Users can install the app on their devices
- **Standalone Display**: App runs in standalone mode when installed
- **Theme Colors**: Custom theme color for better integration

### Offline Support

- **Precached Assets**: All static assets (JS, CSS, HTML, images) are precached during build
- **Automatic Cache Pre-warming**: On first app load, the app automatically pre-warms the cache in the background:
  - All product list pages
  - All individual product detail pages
  - All category filter pages
  - All categories
- **Complete Offline Access**: After the initial cache warmup, users can:
  - Browse all products offline
  - View individual product details offline
  - Filter by category offline
  - Navigate through pagination offline
- **Smart Cache Matching**: Improved cache matching ensures products are found even with URL variations
- **Service Worker Fallback**: If network fails, the service worker automatically serves cached responses

## Solution Concept

This e-commerce product catalog application is designed as a Progressive Web App (PWA) that provides a seamless browsing experience with offline capabilities. The solution emphasizes:

1. **Modular Architecture**: Components, pages, hooks, and services are organized in a clear, scalable structure
2. **Separation of Concerns**: Business logic is separated from UI components through custom hooks and service layers
3. **Offline-First Approach**: Multi-layer caching strategy ensures the app works reliably even without internet connection
4. **Type Safety**: Full TypeScript implementation prevents runtime errors and improves developer experience
5. **User Experience**: Fast loading, smooth navigation, and responsive design across all devices

## Important Design Decisions

### 1. Component Organization: Folder-Based Structure

**Decision**: Organized components in individual folders with their own CSS files and index.ts exports.

**Rationale**:

- Better code organization and maintainability
- Each component is self-contained with its styles
- Easier to locate and modify component files
- Follows modern React best practices

**Pros**:

- Clear component boundaries
- Easy to find and modify components
- Scalable structure for large applications
- Better code splitting opportunities

**Cons**:

- More files to manage
- Slightly more verbose imports (though index.ts helps)

### 2. Custom Hooks for Business Logic

**Decision**: Extracted product data management logic into a custom `useProducts` hook.

**Rationale**:

- Separates business logic from UI components
- Reusable across different components
- Easier to test and maintain
- Follows React hooks best practices

**Pros**:

- Clean separation of concerns
- Reusable logic across components
- Easier unit testing
- Better code organization

**Cons**:

- Additional abstraction layer
- Requires understanding of React hooks

### 3. Client-Side Routing with React Router

**Decision**: Implemented client-side routing for navigation between product list and detail pages.

**Rationale**:

- Enables direct URL access to product pages
- Better user experience with browser back/forward buttons
- SEO-friendly URLs
- Standard web application pattern

**Pros**:

- Bookmarkable URLs
- Browser history support
- Better user navigation experience
- Shareable product links

**Cons**:

- Additional dependency
- Requires server configuration for production (SPA routing)

### 4. Caching Strategy: NetworkFirst

**Decision**: Used NetworkFirst caching strategy for API calls instead of CacheFirst.

**Rationale**:

- Ensures users always see the most up-to-date product information when online
- Provides fallback to cached data when offline
- Balances freshness with offline capability

**Pros**:

- Always shows latest data when network is available
- Graceful degradation to cached data when offline
- Good user experience in poor network conditions

**Cons**:

- Slightly slower initial load compared to CacheFirst
- Requires network request on every page load (when online)

### 5. Multi-Layer Caching

**Decision**: Implemented both service worker caching (Workbox) and in-memory client-side caching with automatic cleanup.

**Rationale**:

- Service worker cache provides offline support
- In-memory cache reduces redundant API calls within the same session
- Automatic cleanup prevents memory leaks
- Works in conjunction for optimal performance

**Pros**:

- Faster response times for repeated requests
- Reduces server load
- Better performance during navigation
- Offline capability
- Automatic cache cleanup prevents memory issues
- Cache size limits prevent unbounded growth

**Cons**:

- Uses browser memory (minimal impact for this use case)
- Cache duration is fixed (7 days for service worker, 5 minutes for client cache)
- Manual cache invalidation requires API call
- Cache pre-warming runs automatically in background on app load

### 6. TypeScript for Type Safety

**Decision**: Used TypeScript throughout the application.

**Rationale**:

- Catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code through types
- Easier refactoring

**Pros**:

- Reduced runtime errors
- Better developer experience
- Easier refactoring
- Self-documenting code

**Cons**:

- Slightly more verbose code
- Requires type definitions
- Initial setup overhead

### 7. Error Boundaries

**Decision**: Implemented React Error Boundaries to catch and handle component errors gracefully.

**Rationale**:

- Prevents entire app from crashing on component errors
- Provides user-friendly error messages
- Allows app to continue functioning despite errors in specific components
- Better error recovery options

**Pros**:

- Graceful error handling
- Better user experience during errors
- Error details in development mode
- Recovery options (retry, reload)

**Cons**:

- Only catches errors in render phase, not in event handlers
- Requires class component (React limitation)

### 8. json-server for Mock API

**Decision**: Used json-server instead of a real backend.

**Rationale**:

- Quick setup for development
- Simulates REST API behavior
- Easy to modify data structure
- No backend dependencies

**Pros**:

- Fast development setup
- No backend dependencies
- Easy to test different data scenarios
- Perfect for prototyping

**Cons**:

- Not suitable for production
- Limited functionality compared to real backend
- No authentication or complex business logic

## Pros and Cons of the Solution

### Pros

1. **Fast Performance**:

   - Vite provides extremely fast development and build times
   - Optimized multi-layer caching strategies ensure quick load times
   - In-memory cache eliminates redundant API calls

2. **Offline Capability**:

   - Users can browse products even without internet
   - Service worker ensures app works in poor network conditions
   - Previously viewed products remain accessible offline

3. **Modern Architecture**:

   - Uses latest React patterns (hooks, functional components)
   - Custom hooks for reusable business logic
   - Clean separation of concerns (components, pages, hooks, services)
   - TypeScript for type safety

4. **User Experience**:

   - Responsive design works on all devices
   - Smooth client-side routing with React Router
   - Individual product detail pages with image galleries
   - Image zoom functionality with full-screen modal
   - Keyboard navigation (arrow keys) for image browsing
   - Loading states and error handling with retry functionality

5. **Developer Experience**:

   - TypeScript provides compile-time error checking
   - Clear, organized folder structure
   - Easy to extend and maintain
   - Component-based architecture enables code reuse
   - Self-documenting code through types

6. **Scalability**:
   - Modular structure allows easy addition of new features
   - Component isolation enables independent development
   - Service layer abstraction simplifies API changes

### Cons

1. **Limited Offline Functionality**:

   - All products are automatically cached on first visit (via cache pre-warming)
   - Can view all cached products, categories, and filters offline
   - Cannot add new products or perform mutations offline
   - No background sync for offline actions
   - Cache must be warmed up while online first

2. **Cache Management**:

   - Cache expiration is fixed (7 days for service worker, 5 minutes for client cache)
   - Automatic cache cleanup prevents memory leaks
   - Cache size limits enforced (500 entries for service worker, 100 for client cache)
   - Automatic cache pre-warming ensures all data is cached on first visit
   - Manual cache clearing available via API

3. **No Real Backend**:

   - json-server is only for development
   - Would need real backend for production
   - No authentication, authorization, or user management

4. **PWA Limitations**:

   - Requires proper icon files (192x192 and 512x512 PNG) for full PWA support
   - Icons need to be added to the `public` directory
   - Limited push notification support (not implemented)

5. **Limited Search and Filtering**:

   - Only category filtering is implemented
   - No text search functionality
   - No advanced filtering (price range, rating, etc.)

6. **Image Handling**:

   - Images are served locally from public folder
   - No image optimization or lazy loading (except native lazy loading)
   - No responsive image sizes
   - Image zoom functionality with keyboard navigation

7. **Error Handling**:
   - Error boundaries implemented for component-level error catching
   - Basic error handling with retry functionality
   - User-friendly error messages
   - Error details shown in development mode

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

Note: PWA features require browsers that support service workers and web app manifests.

## License

This project is created for educational purposes.

## Contact

For questions or issues, please refer to the project documentation or create an issue in the repository.
