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
  Phone,
  Mail,
  ChevronRight
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

  const adminNavItem = { icon: ShieldPlus, label: 'Admin', path: '/admin' }

  const getNavItems = () => {
    let items = [...publicNavItems]
    if (isAdmin) {
      items.push(adminNavItem)
    }
    return items
  }

  const navItems = getNavItems()

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 font-body">
      {/* Top Banner - Premium & Compact */}
      <div className='bg-background text-foreground py-2 overflow-hidden border-b border-border/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center text-[10px] sm:text-xs tracking-wide'>
             
             <div className="hidden lg:flex items-center gap-4">
                <span className="text-primary-foreground/70 uppercase tracking-widest font-bold">Expert Mortgage Advice</span>
             </div>

             <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-2 w-full lg:w-auto">
                <a href="tel:+4915171618082" className="flex items-center gap-2 group text-muted-foreground hover:text-accent transition-colors">
                  <Phone className="w-3 h-3 text-accent" />
                  <span className="font-semibold font-heading">+49 151 71618082</span>
                </a>
                
                <a href="mailto:ravinder.singh@baufiking.de" className="flex items-center gap-2 group text-muted-foreground hover:text-accent transition-colors">
                  <Mail className="w-3 h-3 text-accent" />
                  <span>ravinder.singh@baufiking.de</span>
                </a>
             </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        className={`transition-all duration-500 ${
          isScrolled
            ? 'glass border-none shadow-lg py-2'
            : 'border-b border-border/40 bg-background/80 backdrop-blur-md'
        }`}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <Link to='/' className='flex-shrink-0 group relative z-50'>
              <img
                src='/Logo.svg'
                alt='Baufiking Logo'
                className={`transition-all duration-500 ease-out transform group-hover:scale-105 ${
                  isScrolled ? 'h-9' : 'h-11'
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center space-x-1'>
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className={`group relative flex items-center px-4 py-2 text-sm font-bold font-heading transition-all duration-300
                      ${
                      location.pathname === item.path
                        ? 'text-primary dark:text-accent'
                        : 'text-muted-foreground hover:text-accent dark:hover:text-accent'
                    }`}
                >
                  <span className='z-10 relative'>{item.label}</span>
                  {/* Active Indicator */}
                  {location.pathname === item.path && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full" />
                  )}
                </Link>
              ))}

              <div className="mx-3 h-6 w-px bg-slate-200 dark:bg-slate-700" />

              <ThemeToggle />

              {/* Authentication Actions */}
              {!isAuthenticated ? (
                <Link
                  to='/auth'
                  className='ml-4 px-6 py-2.5 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full font-bold text-sm shadow-lg shadow-accent/20 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center gap-2'
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger className='focus:outline-none ml-2'>
                    <div className='flex items-center space-x-2 px-1.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-transparent'>
                      <Avatar className='h-8 w-8 border border-white dark:border-slate-600 shadow-sm'>
                        <AvatarImage src='' />
                        <AvatarFallback className='bg-primary text-accent font-bold text-xs'>
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className='font-bold font-heading text-sm text-primary dark:text-foreground pr-2 hidden lg:inline-block max-w-[100px] truncate'>
                        {currentUser?.name || 'User'}
                      </span>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end' className='w-56 glass-card mt-2 p-2'>
                    <DropdownMenuLabel className="font-heading text-primary dark:text-accent">
                      Hello, {currentUser?.name.split(' ')[0] || 'User'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-200 dark:bg-slate-700" />
                    <DropdownMenuItem
                      className='cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/10 font-medium'
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
            <div className='md:hidden flex items-center gap-3'>
              <ThemeToggle />
              <Sheet>
                <SheetTrigger asChild>
                  <button
                    className='p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-primary dark:text-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent dark:hover:text-accent-foreground transition-all duration-300 border border-transparent'
                  >
                    <Menu className='h-5 w-5' />
                  </button>
                </SheetTrigger>
                <SheetContent side='right' className='w-[300px] sm:w-[350px] p-0 border-l border-border bg-background'>
                  <div className="flex flex-col h-full">
                    <div className="p-8 border-b border-border bg-muted/50">
                      <Link to='/'>
                        <img src='/Logo.svg' alt='Baufiking' className='h-10 mb-6' />
                      </Link>
                      
                      {isAuthenticated ? (
                        <div className='flex items-center gap-4 bg-background p-4 rounded-2xl shadow-sm border border-border'>
                          <Avatar className='h-12 w-12 border-2 border-accent'>
                            <AvatarFallback className='bg-primary text-accent font-bold'>
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className='overflow-hidden'>
                            <p className='font-heading font-bold text-foreground truncate'>
                              {currentUser?.name || 'User'}
                            </p>
                            <button onClick={handleLogout} className="text-xs font-medium text-red-500 hover:underline">
                              Sign out
                            </button>
                          </div>
                        </div>
                      ) : (
                         <div className="bg-primary rounded-2xl p-6 text-center space-y-4 relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-20 h-20 bg-accent/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
                           <h3 className="text-primary-foreground font-heading font-bold text-lg relative z-10">Start Your Journey</h3>
                           <Link to='/auth' className="block w-full py-3 bg-accent text-accent-foreground font-bold rounded-xl shadow-lg shadow-accent/20 relative z-10 active:scale-95 transition-all">
                             Login / Register
                           </Link>
                         </div>
                      )}
                    </div>
                    
                    <div className='flex-1 overflow-y-auto py-8 px-6 space-y-2'>
                      {navItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className={`flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 group
                            ${location.pathname === item.path
                                ? 'bg-primary text-accent font-bold shadow-lg shadow-primary/10'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            }`}
                        >
                          <div className="flex items-center gap-4">
                            <item.icon className="w-5 h-5" />
                            <span className='font-heading text-sm'>{item.label}</span>
                          </div>
                          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${location.pathname === item.path ? 'opacity-100 text-accent' : ''}`} />
                        </Link>
                      ))}
                    </div>
                    
                    <div className="p-8 border-t border-slate-100 dark:border-slate-800 text-center">
                      <p className="text-xs text-slate-400 dark:text-slate-600 font-medium">
                        © 2025 Baufiking v2.0
                      </p>
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
