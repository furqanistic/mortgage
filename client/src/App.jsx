// File: client/src/App.jsx
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import AboutPage from './pages/About/AboutPage'
import AdminPage from './pages/Admin/AdminPage'
import PartnersAdminPage from './pages/Admin/PartnersAdminPage'
import TestimonialsAdminPage from './pages/Admin/TestimonialsAdminPage'
import Auth from './pages/Auth/Auth'
import BlogPage from './pages/Blog/BlogPage'
import ToolsPage from './pages/Calculators/ToolsPage'
import ContactPage from './pages/Contact/ContactPage'
import GlossaryPage from './pages/Glossary/GlossaryPage'
import HomePage from './pages/HomePage'
import PartnersPage from './pages/Partners/PartnersPage'
import PropertiesPage from './pages/Properties/PropertiesPage'
import { selectIsAdmin, selectIsAuthenticated } from './redux/userSlice'

/**
 * ProtectedAdminRoute - A component that restricts access to admin routes
 * Redirects to login page if:
 * 1. User is not logged in
 * 2. User is logged in but doesn't have admin role
 */
const ProtectedAdminRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to='/auth' replace />
  }
  // Authenticated but not admin should not loop between /auth and /admin
  if (!isAdmin) {
    return <Navigate to='/' replace />
  }

  // Render outlet for nested routes
  return <Outlet />
}

/**
 * RedirectIfAuthenticated - Prevents authenticated users from accessing auth page
 * Redirects to homepage or admin page if already logged in
 */
const RedirectIfAuthenticated = ({ language, onLanguageChange }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)

  // If user is logged in, redirect away from auth page
  if (isAuthenticated) {
    const redirectPath = isAdmin ? '/admin' : '/'
    return <Navigate to={redirectPath} replace />
  }

  // If not logged in, show the auth page
  return <Auth language={language} onLanguageChange={onLanguageChange} />
}

const App = () => {
  const location = useLocation()
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem('language') || 'de'
    } catch (error) {
      return 'de'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem('language', language)
    } catch (error) {
      // Ignore write errors (privacy mode, etc.)
    }
  }, [language])

  return (
    <>
      <ScrollToTop />
      <Toaster position='top-center' />
      <Routes key={location.pathname}>
        {/* Public routes */}
        <Route path='/' element={<HomePage language={language} onLanguageChange={setLanguage} />} />
        <Route path='/about' element={<AboutPage language={language} onLanguageChange={setLanguage} />} />
        <Route path='/contact' element={<ContactPage language={language} onLanguageChange={setLanguage} />} />
        <Route path='/partners' element={<PartnersPage language={language} onLanguageChange={setLanguage} />} />
        <Route path='/properties' element={<PropertiesPage language={language} onLanguageChange={setLanguage} />} />
        <Route path='/blogs' element={<BlogPage language={language} onLanguageChange={setLanguage} />} />
        <Route path='/blogs/:slug' element={<BlogPage language={language} onLanguageChange={setLanguage} />} />
        <Route path='/tools' element={<ToolsPage language={language} onLanguageChange={setLanguage} />} />
        <Route path='/glossary' element={<GlossaryPage language={language} onLanguageChange={setLanguage} />} />

        {/* Auth route with redirect if already logged in */}
        <Route path='/auth' element={<RedirectIfAuthenticated language={language} onLanguageChange={setLanguage} />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/admin/partners' element={<PartnersAdminPage />} />
          <Route path='/admin/testimonials' element={<TestimonialsAdminPage />} />
        </Route>

        {/* Catch-all route for any undefined routes - redirect to homepage */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  )
}

export default App
