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
  Mail
} from 'lucide-react'
import { useEffect, useState } from 'react'
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
                <span className="text-muted-foreground uppercase tracking-widest font-extrabold opacity-70">Expert Mortgage Advice</span>
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
                <SheetContent side='right' className='w-[300px] sm:w-[350px] p-0 border-l border-border bg-background flex flex-col'>
                  <div className="p-6 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between mb-8">
                       <Link to='/'>
                         <img src='/Logo.svg' alt='Baufiking' className='h-8' />
                       </Link>
                    </div>
                    
                    {isAuthenticated ? (
                      <div className='flex items-center gap-3 bg-background p-3 rounded-xl shadow-sm border border-border'>
                        <Avatar className='h-10 w-10 border-2 border-accent'>
                          <AvatarFallback className='bg-primary text-accent font-bold'>
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='overflow-hidden flex-1'>
                          <p className='font-heading font-bold text-foreground truncate text-sm'>
                            {currentUser?.name || 'User'}
                          </p>
                          <button onClick={handleLogout} className="text-xs font-medium text-red-500 hover:underline">
                            Sign out
                          </button>
                        </div>
                      </div>
                    ) : (
                       <Link to='/auth' className="flex items-center justify-center w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-all text-sm gap-2">
                         <User className="w-4 h-4 text-accent" />
                         Login / Register
                       </Link>
                    )}
                  </div>
                  
                  <div className='flex-1 overflow-y-auto py-6 px-4 space-y-1'>
                    {navItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group
                          ${location.pathname === item.path
                              ? 'text-foreground font-bold bg-accent/5'
                              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-4 h-4 ${location.pathname === item.path ? 'text-accent' : 'text-muted-foreground group-hover:text-foreground'}`} />
                          <span className='font-heading text-sm'>{item.label}</span>
                        </div>
                        {location.pathname === item.path && (
                           <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        )}
                      </Link>
                    ))}
                  </div>
                  
                  <div className="p-6 border-t border-border mt-auto">
                     <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-semibold">
                       Expert Mortgage Advice
                     </p>
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
