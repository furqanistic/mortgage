import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
  logout,
  selectCurrentUser,
  selectIsAdmin,
  selectIsAuthenticated,
} from '@/redux/userSlice'
import {
  Building,
  Home,
  LogOut,
  Menu,
  MessageCircle,
  NotebookText,
  PersonStanding,
  Settings,
  ShieldPlus,
  User,
  Users,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get authentication status and user data from Redux
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser || !currentUser.name) return 'U'

    const nameParts = currentUser.name.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`
    }
    return nameParts[0][0] || 'U'
  }

  // Public navigation items - always visible
  const publicNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Partners', path: '/partners' },
    { icon: PersonStanding, label: 'About', path: '/about' },
    { icon: MessageCircle, label: 'Contact', path: '/contact' },
    { icon: NotebookText, label: 'Blog', path: '/blog' },
  ]

  // Authentication navigation item - only visible when not logged in
  const authNavItem = { icon: User, label: 'Signup/Login', path: '/auth' }

  // Admin navigation item - only visible for admin users
  const adminNavItem = { icon: ShieldPlus, label: 'Admin', path: '/admin' }

  // Combine all navigation items based on authentication state
  const getNavItems = () => {
    let items = [...publicNavItems]

    if (!isAuthenticated) {
      items.push(authNavItem)
    }

    if (isAdmin) {
      items.push(adminNavItem)
    }

    return items
  }

  const navItems = getNavItems()

  return (
    <header>
      {/* Top banner */}
      <div className='bg-[#155FA0] text-white py-2'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-end text-sm'>
            <span className='mr-4'>📞 +4915171618082</span>
            <span>✉️ ravinder.singh@baufiking.de</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 border-b ${
          isScrolled
            ? 'bg-white shadow-md py-3'
            : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link to='/' className='flex-shrink-0'>
              <img
                src='/Logo.svg'
                alt='Baufiking Logo'
                className={`transition-all duration-300 ${
                  isScrolled ? 'h-12' : 'h-16'
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-1'>
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`group flex items-center space-x-2 px-4 py-2 rounded-full
                    transition-all duration-200 ${
                      location.pathname === item.path
                        ? 'text-[#155FA0] bg-blue-50'
                        : 'text-gray-600 hover:text-[#155FA0] hover:bg-blue-50'
                    }`}
                >
                  <item.icon className='w-5 h-5' />
                  <span className='font-medium'>{item.label}</span>
                </Link>
              ))}

              {/* User Profile Dropdown - Only show when logged in */}
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger className='focus:outline-none'>
                    <div className='flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-blue-50 transition-all duration-200'>
                      <Avatar className='h-8 w-8 border border-gray-200'>
                        <AvatarImage src='' />
                        <AvatarFallback className='bg-[#155FA0] text-white'>
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className='font-medium text-gray-700'>
                        {currentUser?.name || 'User'}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56'>
                    <DropdownMenuLabel>
                      Hello, {currentUser?.name.split(' ')[0] || 'User'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className='cursor-pointer text-red-600'
                      onClick={handleLogout}
                    >
                      <LogOut className='mr-2 h-4 w-4' />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className='md:hidden'>
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className='p-2 rounded-lg text-gray-600 hover:text-[#155FA0] 
                      hover:bg-blue-50 transition-colors'
                  >
                    <Menu className='h-6 w-6' />
                  </button>
                </SheetTrigger>
                <SheetContent side='right' className='bg-white border-l'>
                  <div className='flex flex-col space-y-6 mt-6'>
                    <Link to='/'>
                      <img
                        src='/Logo.svg'
                        alt='Baufiking Logo'
                        className='h-12 mb-6'
                      />
                    </Link>

                    {/* User profile section for mobile - only when logged in */}
                    {isAuthenticated && (
                      <div className='flex items-center space-x-3 px-4 py-3 bg-blue-50 rounded-lg'>
                        <Avatar className='h-10 w-10 border border-gray-200'>
                          <AvatarImage src='' />
                          <AvatarFallback className='bg-[#155FA0] text-white'>
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className='font-medium text-[#155FA0]'>
                            {currentUser?.name || 'User'}
                          </p>
                          <p className='text-sm text-gray-500'>
                            {currentUser?.email || ''}
                          </p>
                        </div>
                      </div>
                    )}

                    {navItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg
                          transition-all duration-200 ${
                            location.pathname === item.path
                              ? 'text-[#155FA0] bg-blue-50'
                              : 'text-gray-600 hover:text-[#155FA0] hover:bg-blue-50'
                          }`}
                      >
                        <item.icon className='w-6 h-6' />
                        <span className='text-lg font-medium'>
                          {item.label}
                        </span>
                      </Link>
                    ))}

                    {/* Logout button - only when logged in */}
                    {isAuthenticated && (
                      <button
                        onClick={handleLogout}
                        className='flex items-center space-x-3 px-4 py-3 rounded-lg
                        text-red-600 hover:bg-red-50 transition-all duration-200'
                      >
                        <LogOut className='w-6 h-6' />
                        <span className='text-lg font-medium'>Log out</span>
                      </button>
                    )}

                    <Link
                      to='/get-started'
                      className='mt-4 px-6 py-3 bg-[#155FA0] text-white rounded-lg
                      hover:bg-[#71C8DC] transition-colors duration-200 w-full text-center'
                    >
                      Get Started
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
