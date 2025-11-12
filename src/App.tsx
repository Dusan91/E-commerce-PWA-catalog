import { Routes, Route } from 'react-router-dom'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary'
import Footer from './components/Footer'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'

const App = (): JSX.Element => {
  return (
    <ErrorBoundary>
      <div className="app">
        <Header />
        <main className="app-main">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:productId" element={<ProductPage />} />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  )
}

export default App
