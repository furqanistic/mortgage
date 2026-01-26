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
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
    logout,
    selectCurrentUser,
    selectIsAdmin,
    selectIsAuthenticated,
} from '@/redux/userSlice'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowRight,
    Home,
    LogOut,
    Mail,
    Menu,
    MessageCircle,
    NotebookText,
    PersonStanding,
    Phone,
    ShieldPlus,
    User,
    Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [hoveredPath, setHoveredPath] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = useSelector(selectIsAdmin)
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
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
    <header className="sticky top-0 z-50 w-full transition-all duration-500 font-body bg-transparent">
      {/* Top Banner - Animates out on scroll */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            initial={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='bg-primary/5 dark:bg-accent/5 backdrop-blur-sm text-foreground overflow-hidden border-b border-border/10'
          >
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
              <div className='flex justify-between items-center text-[10px] sm:text-xs tracking-wide'>
                 <div className="hidden lg:flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
                    <span className="text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-80">Expert Mortgage Advice in Germany</span>
                 </div>

                 <div className="flex flex-wrap items-center justify-center lg:justify-end gap-x-8 gap-y-2 w-full lg:w-auto">
                    <a href="tel:+4915171618082" className="flex items-center gap-2.5 group text-muted-foreground hover:text-accent transition-all duration-300">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                        <Phone className="w-3 h-3" />
                      </div>
                      <span className="font-bold font-heading">+49 151 71618082</span>
                    </a>
                    
                    <a href="mailto:ravinder.singh@baufiking.de" className="flex items-center gap-2.5 group text-muted-foreground hover:text-accent transition-all duration-300">
                      <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                        <Mail className="w-3 h-3" />
                      </div>
                      <span className="font-medium">ravinder.singh@baufiking.de</span>
                    </a>
                 </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Navbar Wrapper */}
      <div className={`w-full transition-all duration-500 ease-in-out ${
        isScrolled ? 'pt-4 px-4' : 'pt-0 px-0'
      }`}>
        <nav
          className={`mx-auto transition-all duration-500 ease-in-out relative
            ${isScrolled 
              ? 'max-w-5xl rounded-full glass shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/40 dark:border-white/10 py-2' 
              : 'max-w-full border-b border-border/40 bg-background/80 backdrop-blur-md py-4'
            }`}
        >
          <div className={`${isScrolled ? 'px-6' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
            <div className='flex items-center justify-between'>
              {/* Logo */}
              <Link to='/' className='flex-shrink-0 group relative z-50 flex items-center gap-2'>
                <div className="relative">
                  <img
                    src='/Logo.svg'
                    alt='Baufiking Logo'
                    className={`transition-all duration-500 ease-out transform group-hover:scale-105 ${
                      isScrolled ? 'h-8' : 'h-10'
                    }`}
                  />
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className='hidden md:flex items-center gap-1 relative'>
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    onMouseEnter={() => setHoveredPath(item.path)}
                    onMouseLeave={() => setHoveredPath(null)}
                    className={`relative px-4 py-2 text-sm font-bold font-heading transition-colors duration-300 z-10
                        ${location.pathname === item.path
                          ? 'text-primary dark:text-accent'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    <span>{item.label}</span>
                    
                    {/* Active/Hover Background Pill */}
                    <AnimatePresence>
                      {hoveredPath === item.path && (
                        <motion.div
                          layoutId="nav-hover"
                          className="absolute inset-0 bg-accent/10 dark:bg-accent/20 rounded-full -z-10"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </AnimatePresence>

                    {location.pathname === item.path && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                ))}

                <div className="mx-3 h-4 w-px bg-border/40" />

                <ThemeToggle />

                {/* Authentication Actions */}
                {!isAuthenticated ? (
                  <Link
                    to='/auth'
                    className={`ml-4 px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 dark:bg-accent dark:text-accent-foreground dark:hover:bg-accent/90 rounded-full font-bold text-sm shadow-lg shadow-primary/10 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95 flex items-center gap-2 group/btn ${isScrolled ? 'py-1.5' : 'py-2.5'}`}
                  >
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger className='focus:outline-none ml-2'>
                      <div className='flex items-center space-x-2 px-1 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-all border border-border/40'>
                        <Avatar className='h-7 w-7 border border-white dark:border-slate-600 shadow-sm'>
                          <AvatarImage src='' />
                          <AvatarFallback className='bg-accent text-accent-foreground font-bold text-[10px]'>
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <span className='font-bold font-heading text-xs text-foreground pr-2 hidden lg:inline-block max-w-[80px] truncate'>
                          {currentUser?.name || 'User'}
                        </span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-56 glass-card mt-4 p-2 rounded-2xl animate-in fade-in zoom-in-95 duration-200'>
                      <DropdownMenuLabel className="font-heading text-primary dark:text-accent px-3 py-2">
                        <p className="text-xs text-muted-foreground font-normal">Signed in as</p>
                        <p className="font-bold truncate">{currentUser?.name || 'User'}</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-border/40 my-1" />
                      <DropdownMenuItem
                        className='cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 font-medium rounded-xl p-2.5'
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
                      className='p-2 rounded-full bg-secondary text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300'
                    >
                      <Menu className='h-5 w-5' />
                    </button>
                  </SheetTrigger>
                  <SheetContent side='right' className='w-[300px] p-0 border-l border-border bg-background flex flex-col'>
                    <div className="p-8 border-b border-border bg-accent/5 relative overflow-hidden">
                      {isAuthenticated ? (
                        <div className='relative z-10 flex items-center gap-4 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-border/40 shadow-sm'>
                          <Avatar className='h-12 w-12 border-2 border-accent/20'>
                            <AvatarFallback className='bg-accent text-accent-foreground font-bold text-lg'>
                              {getUserInitials()}
                            </AvatarFallback>
                          </Avatar>
                          <div className='overflow-hidden flex-1'>
                            <p className='font-heading font-extrabold text-foreground truncate'>
                              {currentUser?.name || 'User'}
                            </p>
                            <button onClick={handleLogout} className="text-xs font-bold text-destructive hover:underline flex items-center gap-1 mt-1">
                              <LogOut className="w-3 h-3" />
                              Sign out
                            </button>
                          </div>
                        </div>
                      ) : (
                         <Link to='/auth' className="relative z-10 flex items-center justify-center w-full py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/10 hover:bg-primary/95 transition-all gap-2">
                           <User className="w-4 h-4 text-white" />
                           Get Started
                         </Link>
                      )}
                    </div>
                    
                    <div className='flex-1 overflow-y-auto py-8 px-6 space-y-2'>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4 px-4">Menu</p>
                      {navItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                            ${location.pathname === item.path
                                ? 'bg-accent/10 text-accent font-bold'
                                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                            }`}
                        >
                          <span className='font-heading text-sm'>{item.label}</span>
                          {location.pathname === item.path && (
                             <motion.div layoutId="mobile-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                          )}
                        </Link>
                      ))}
                    </div>
                    
                    <div className="p-8 border-t border-border mt-auto bg-secondary/30">
                       <div className="flex flex-col gap-4">
                         <a href="tel:+4915171618082" className="flex items-center gap-3 text-sm font-bold text-foreground">
                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                               <Phone className="w-4 h-4" />
                            </div>
                            +49 15 1716 18082
                         </a>
                         <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold mt-2">
                           © 2026 Baufiking
                         </p>
                       </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
