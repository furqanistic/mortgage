// File: client/src/components/Home/Navbar.jsx
import { Button } from '@/components/ui/button'
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
  Menu,
  Phone,
  LogOut,
  User
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
      setIsScrolled(window.scrollY > 10)
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

  const navItems = [
    { label: 'Dienstleistungen', path: '#services' },
    { label: 'Für wen?', path: '#for-whom' },
    { label: 'Wissen', path: '#knowledge' },
    { label: 'Tools', path: '#tools' },
    { label: 'Über uns', path: '#about' },
    { label: 'Kontakt', path: '#contact' },
  ]

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/98 dark:bg-slate-950/98 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="relative group">
            <span className="font-heading text-2xl md:text-3xl font-bold text-primary dark:text-white tracking-tight">
              Traumhaus
            </span>
            <span className="absolute -bottom-1 left-0 w-3/5 h-[3px] bg-gradient-to-r from-accent to-transparent transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.path}
                className="relative text-sm font-medium text-foreground/80 hover:text-primary dark:hover:text-white transition-colors group py-2"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
              </a>
            ))}

            <ThemeToggle />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className='focus:outline-none ml-2'>
                  <div className='flex items-center space-x-2 px-1 py-1 rounded-full bg-secondary hover:bg-secondary/80 transition-all border border-border/40'>
                    <Avatar className='h-8 w-8 border border-border text-xs'>
                      <AvatarImage src='' />
                      <AvatarFallback className='bg-primary text-primary-foreground font-bold'>
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56 mt-2'>
                  <DropdownMenuLabel>
                    <p className="text-xs font-normal text-muted-foreground">Angemeldet als</p>
                    <p className="font-bold truncate">{currentUser?.name || 'User'}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className='text-destructive focus:text-destructive'
                    onClick={handleLogout}
                  >
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Abmelden</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                Kostenlose Beratung
              </Button>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center gap-4">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full pt-10">
                  <div className="mb-8">
                    <span className="font-heading text-2xl font-bold text-primary dark:text-white">
                      Baufiking
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.path}
                        className="text-lg font-medium text-foreground/80 hover:text-primary dark:hover:text-accent transition-colors py-2 border-b border-border/50"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>

                  <div className="mt-auto pb-8">
                    {isAuthenticated ? (
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/50">
                        <Avatar>
                          <AvatarFallback>{getUserInitials()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-bold">{currentUser?.name}</p>
                          <button onClick={handleLogout} className="text-xs text-destructive hover:underline">Abmelden</button>
                        </div>
                      </div>
                    ) : (
                      <Button className="w-full bg-primary text-white font-bold py-6">
                        Kostenlose Beratung
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
