import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    Calendar,
    FileEdit,
    Home,
    LayoutDashboard,
    Menu,
    Users,
    X,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  useEffect(() => {
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.scrollTo(0, 0)
    }
  }, [location.pathname])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Blog', href: '/admin/blog-edit', icon: FileEdit },
  ]

  return (
    <div className='flex h-screen bg-blue-50'>
      {/* Mobile sidebar toggle */}
      <div className='fixed top-4 left-4 z-50 lg:hidden'>
        <Button
          variant='outline'
          size='icon'
          onClick={toggleSidebar}
          className='h-8 w-8 bg-white shadow-sm border-blue-200 rounded-md'
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 bg-black/10 z-40 lg:hidden'
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-56 bg-white border-r border-blue-100 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:w-56 flex flex-col',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className='flex items-center h-14 px-4 border-b border-blue-100 bg-blue-800'>
          <h1 className='text-lg font-medium text-white'>Baufiking</h1>
        </div>

        {/* Nav Items */}
        <nav className='mt-4 px-2'>
          <ul className='space-y-1'>
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center h-9 px-3 text-sm rounded-md transition-colors',
                    location.pathname === item.href
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'text-blue-700 hover:text-blue-900 hover:bg-blue-50'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-4 w-4 mr-3',
                      location.pathname === item.href
                        ? 'text-blue-600'
                        : 'text-blue-500'
                    )}
                  />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Spacer to push Home link to bottom */}
        <div className='flex-grow'></div>

        {/* Home link at the very bottom */}
        <div className='px-2 mb-4 mt-auto border-t border-blue-100 pt-4'>
          <Link
            to='/'
            className={cn(
              'flex items-center h-9 px-3 text-sm rounded-md transition-colors',
              location.pathname === '/'
                ? 'bg-blue-100 text-blue-900 font-medium'
                : 'text-blue-700 hover:text-blue-900 hover:bg-blue-50'
            )}
          >
            <Home
              className={cn(
                'h-4 w-4 mr-3',
                location.pathname === '/' ? 'text-blue-600' : 'text-blue-500'
              )}
            />
            Home
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        <div className='flex items-center justify-end px-6 py-4 bg-blue-50 border-b border-blue-100' />
        {/* Content area */}
        <main className='flex-1 overflow-auto p-6 bg-blue-50'>{children}</main>
      </div>
    </div>
  )
}

export default Layout
