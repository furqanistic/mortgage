import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'
import AboutPage from './pages/About/AboutPage'
import AdminPage from './pages/Admin/AdminPage'
import Appointments from './pages/Admin/Appointments'
import BlogEdit from './pages/Admin/BlogEdit'
import UsersPage from './pages/Admin/UsersPage'
import Auth from './pages/Auth/Auth'
import BlogPage from './pages/Blog/BlogPage'
import ContactPage from './pages/Contact/ContactPage'
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
  // Redirect to login if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to='/auth' replace />
  }

  // Render outlet for nested routes
  return <Outlet />
}

/**
 * RedirectIfAuthenticated - Prevents authenticated users from accessing auth page
 * Redirects to homepage or admin page if already logged in
 */
const RedirectIfAuthenticated = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)

  // If user is logged in, redirect away from auth page
  if (isAuthenticated) {
    // Redirect admins to admin dashboard, regular users to homepage
    const redirectPath = isAdmin ? '/admin' : '/'
    return <Navigate to={redirectPath} replace />
  }

  // If not logged in, show the auth page
  return <Auth />
}

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/partners' element={<PartnersPage />} />
        <Route path='/properties' element={<PropertiesPage />} />
        <Route path='/blog' element={<BlogPage />} />

        {/* Auth route with redirect if already logged in */}
        <Route path='/auth' element={<RedirectIfAuthenticated />} />

        {/* Protected admin routes */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/admin/appointments' element={<Appointments />} />
          <Route path='/admin/users-data' element={<UsersPage />} />
          <Route path='/admin/blog-edit' element={<BlogEdit />} />
        </Route>

        {/* Catch-all route for any undefined routes - redirect to auth page */}
        <Route path='*' element={<Navigate to='/auth' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
