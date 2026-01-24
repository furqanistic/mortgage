// File: client/src/components/Home/Navbar.jsx
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
  Home,
  LogOut,
  Menu,
  MessageCircle,
  NotebookText,
  PersonStanding,
  ShieldPlus,
  User,
  Users,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

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

  const getUserInitials = () => {
    if (!currentUser || !currentUser.name) return 'U'
    const nameParts = currentUser.name.split(' ')
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`
    }
    return nameParts[0][0] || 'U'
  }

  const publicNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Partners', path: '/partners' },
    { icon: PersonStanding, label: 'About', path: '/about' },
    { icon: MessageCircle, label: 'Contact', path: '/contact' },
    { icon: NotebookText, label: 'Blog', path: '/blog' },
  ]

  const authNavItem = { icon: User, label: 'Signup/Login', path: '/auth' }
  const adminNavItem = { icon: ShieldPlus, label: 'Admin', path: '/admin' }

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
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top banner - Premium & Responsive */}
      <div className='bg-background/80 backdrop-blur-md border-b border-border/40 py-2'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-medium text-center sm:text-left'>
             
             <div className="hidden lg:flex items-center gap-4">
                <span className="text-muted-foreground whitespace-nowrap">Expert Mortgage Advice</span>
             </div>

             <div className="flex flex-wrap items-center justify-center sm:justify-end gap-x-4 gap-y-2 w-full sm:w-auto">
                <a href="tel:+4915171618082" className="flex items-center gap-1.5 sm:gap-2 group text-muted-foreground hover:text-primary transition-colors">
                  <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  </div>
                  <span className="whitespace-nowrap font-semibold">+49 151 71618082</span>
                </a>
                
                <a href="mailto:ravinder.singh@baufiking.de" className="flex items-center gap-1.5 sm:gap-2 group text-muted-foreground hover:text-primary transition-colors">
                  <div className="p-1 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <span className="whitespace-nowrap">ravinder.singh@baufiking.de</span>
                </a>
             </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`transition-all duration-500 border-b ${
          isScrolled
            ? 'glass  py-2'
            : 'bg-background/50 -transparent py-4 backdrop-blur-[2px]'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link to='/' className='flex-shrink-0 group'>
              <img
                src='/Logo.svg'
                alt='Baufiking Logo'
                className={`transition-all duration-500 ease-out transform group-hover:scale-105 ${
                  isScrolled ? 'h-10' : 'h-14'
                } group-hover:opacity-90`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-1'>
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`group relative flex items-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-300
                    ${
                      location.pathname === item.path
                        ? 'text-primary bg-primary/5'
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                >
                  <span className='z-10 relative'>{item.label}</span>
                  {/* Animated underline effect */}
                  <span className={`absolute bottom-1.5 left-4 right-4 h-0.5 bg-accent/50 rounded-full transition-all duration-300 origin-left
                      ${location.pathname === item.path ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50'}`} 
                  />
                </Link>
              ))}

              <div className="mx-2 h-6 w-px bg-border/60 " />

              <ThemeToggle />

              {/* User Profile Dropdown */}
              {isAuthenticated && (
                <DropdownMenu>
                  <DropdownMenuTrigger className='focus:outline-none ml-2'>
                    <div className='flex items-center space-x-2 px-2 py-1.5 rounded-full hover:bg-secondary transition-colors border border-transparent hover:border-border/40'>
                      <Avatar className='h-8 w-8 border border-border shadow-sm'>
                        <AvatarImage src='' />
                        <AvatarFallback className='bg-primary text-primary-foreground font-medium text-xs'>
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className='font-medium text-sm text-foreground pr-1 hidden lg:inline-block'>
                        {currentUser?.name || 'User'}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56 glass-card mt-2'>
                    <DropdownMenuLabel className="font-heading text-primary">
                      Hello, {currentUser?.name.split(' ')[0] || 'User'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem
                      className='cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10'
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
            <div className='md:hidden flex items-center gap-2'>
              <ThemeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className='p-2.5 rounded-full text-foreground hover:bg-secondary 
                      transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20'
                  >
                    <Menu className='h-6 w-6' />
                  </button>
                </SheetTrigger>
                <SheetContent side='right' className='w-[300px] glass-card border-l border-white/20 sm:w-[350px] p-0'>
                  <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl">
                    <div className="p-6 border-b border-border/40">
                      <Link to='/'>
                        <img
                          src='/Logo.svg'
                          alt='Baufiking'
                          className='h-10'
                        />
                      </Link>
                    </div>
                    
                    <div className='flex-1 overflow-y-auto py-6 px-4 space-y-2'>
                       {isAuthenticated && (
                        <div className='flex items-center space-x-3 px-4 py-4 mb-6 bg-secondary/50 rounded-2xl border border-border/50'>
                          <Avatar className='h-12 w-12 border-2 border-background shadow-sm'>
                            <AvatarImage src='' />
                            <AvatarFallback className='bg-primary text-primary-foreground'>
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className='overflow-hidden'>
                            <p className='font-heading font-semibold text-foreground truncate'>
                              {currentUser?.name || 'User'}
                            </p>
                            <p className='text-xs text-muted-foreground truncate'>
                              {currentUser?.email || ''}
                            </p>
                          </div>
                        </div>
                      )}

                      {navItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className={`flex items-center space-x-4 px-4 py-3.5 rounded-xl
                            transition-all duration-200 group ${
                              location.pathname === item.path
                                ? 'bg-primary/5 text-primary font-semibold'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                            }`}
                        >
                          <item.icon className={`w-5 h-5 ${location.pathname === item.path ? 'text-accent' : 'text-muted-foreground group-hover:text-primary'} transition-colors`} />
                          <span className='text-base'>
                            {item.label}
                          </span>
                        </Link>
                      ))}

                      {isAuthenticated && (
                        <button
                          onClick={handleLogout}
                          className='flex w-full items-center space-x-4 px-4 py-3.5 rounded-xl
                          text-destructive hover:bg-destructive/5 transition-all duration-200 mt-4'
                        >
                          <LogOut className='w-5 h-5' />
                          <span className='text-base font-medium'>Log out</span>
                        </button>
                      )}
                      
                      {!isAuthenticated && (
                         <div className="mt-8 px-4">
                           <Link
                             to='/auth'
                             className='flex items-center justify-center w-full py-3 bg-primary text-primary-foreground 
                             font-semibold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 
                             active:scale-[0.98] transition-all duration-200'
                           >
                             Get Started
                           </Link>
                         </div>
                      )}
                    </div>
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
