// File: client/src/components/Home/Navbar.jsx
import ConsultationModal from '@/components/Home/ConsultationModal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
  Globe,
  LogOut,
  Mail,
  Menu,
  Phone,
  User
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = ({ language = 'de', onLanguageChange }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
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

  const isEnglish = language === 'en'
  const navItems = isEnglish
    ? [
        { label: 'Home', path: '/' },
        { label: 'Partners', path: '/partners' },
        { label: 'Tools', path: '/tools' },
        { label: 'Our Team', path: '/about' },
        { label: 'Contact', path: '/contact' },
      ]
    : [
        { label: 'Startseite', path: '/' },
        { label: 'Partner', path: '/partners' },
        { label: 'Tools', path: '/tools' },
        { label: 'Über uns', path: '/about' },
        { label: 'Kontakt', path: '/contact' },
      ]

  const ctaLabel = isEnglish ? 'Free Consultation' : 'Kostenlose Beratung'
  const logoutLabel = isEnglish ? 'Sign out' : 'Abmelden'
  const signedInLabel = isEnglish ? 'Signed in as' : 'Angemeldet als'

  const showLanguageToggle = typeof onLanguageChange === 'function'
  const contact = {
    phoneDisplay: '+49 151 71618082',
    phoneE164: '+4915171618082',
    email: 'ravinder.singh@baufiking.de',
  }

  const handlePhoneClick = (event) => {
    event.preventDefault()
    setIsContactModalOpen(true)
  }

  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-primary text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 sm:h-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
          <div className="text-white/70 text-[10px] sm:text-xs">
            {isEnglish ? 'Fast response via WhatsApp or email.' : 'Schnelle Antwort per WhatsApp oder E-Mail.'}
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${contact.phoneE164}`}
              onClick={handlePhoneClick}
              className="font-semibold hover:text-white/80 transition-colors inline-flex items-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" />
              {contact.phoneDisplay}
            </a>
            <span className="hidden sm:inline text-white/60">•</span>
            <a
              href={`mailto:${contact.email}`}
              className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <Mail className="h-3.5 w-3.5" />
              {contact.email}
            </a>
          </div>
        </div>
      </div>
      <header
        className={`fixed top-9 sm:top-10 w-full z-40 transition-all duration-300 ${isScrolled
          ? 'bg-white/98 dark:bg-slate-950/98 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">

          {/* Logo */}
          <Link to="/" className="relative group flex items-center gap-2 sm:gap-3">
            <img
              src="/logo.jpeg"
              alt="Baufiking logo"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover shadow-sm ring-1 ring-border/40"
            />
            <span className="font-logo text-lg sm:text-2xl md:text-3xl font-bold text-primary dark:text-white max-w-[140px] sm:max-w-none truncate">
              Baufiking
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

            {showLanguageToggle && (
              <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-white/90 dark:bg-slate-900/70 px-1.5 py-1 shadow-sm">
                <Globe className="h-3.5 w-3.5 text-accent" />
                <div className="flex items-center gap-1">
                  {['de', 'en'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onLanguageChange(code)}
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded-full transition-colors ${language === code
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-foreground/70 hover:text-primary'
                        }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}


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
                    <p className="text-xs font-normal text-muted-foreground">{signedInLabel}</p>
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
                    <span>{logoutLabel}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                className="bg-primary hover:bg-primary/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                onClick={() => setIsModalOpen(true)}
              >
                {ctaLabel}
              </Button>
            )}
          </nav>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex items-center gap-4">
            {showLanguageToggle && (
              <div className="flex items-center gap-1.5 rounded-full border border-border/60 bg-white/90 dark:bg-slate-900/70 px-1.5 py-1 shadow-sm">
                <Globe className="h-4 w-4 text-accent" />
                <div className="flex items-center gap-1">
                  {['de', 'en'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => onLanguageChange(code)}
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded-full transition-colors ${language === code
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-foreground/70 hover:text-primary'
                        }`}
                    >
                      {code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full pt-10">
                  <div className="mb-8">
                    <div className="flex items-center gap-3">
                      <img
                        src="/logo.jpeg"
                        alt="Baufiking logo"
                        className="h-9 w-9 rounded-full object-cover shadow-sm ring-1 ring-border/40"
                      />
                      <span className="font-logo text-2xl font-bold text-primary dark:text-white">
                        Baufiking
                      </span>
                    </div>
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
                          <button onClick={handleLogout} className="text-xs text-destructive hover:underline">{logoutLabel}</button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="w-full bg-primary text-white font-bold py-6"
                        onClick={() => setIsModalOpen(true)}
                      >
                        {ctaLabel}
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
      <div className="h-[120px] sm:h-[132px]" aria-hidden="true" />

      {isContactModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-heading text-lg font-bold text-primary">
              {isEnglish ? 'Contact Us' : 'Kontakt'}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {isEnglish
                ? 'How would you like to reach us?'
                : 'Wie möchten Sie uns erreichen?'}
            </p>
            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsContactModalOpen(false)
                  window.open(`https://wa.me/${contact.phoneE164.replace('+', '')}`, '_blank', 'noopener')
                }}
                className="w-full rounded-xl bg-primary px-4 py-2.5 text-white font-semibold shadow hover:bg-primary/90 transition"
              >
                {isEnglish ? 'WhatsApp' : 'WhatsApp'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsContactModalOpen(false)
                  window.location.href = `tel:${contact.phoneE164}`
                }}
                className="w-full rounded-xl border border-primary/30 px-4 py-2.5 text-primary font-semibold hover:border-primary/60 hover:bg-primary/5 transition"
              >
                {isEnglish ? 'Call Now' : 'Jetzt anrufen'}
              </button>
              <button
                type="button"
                onClick={() => setIsContactModalOpen(false)}
                className="w-full rounded-xl px-4 py-2 text-sm text-muted-foreground hover:text-primary transition"
              >
                {isEnglish ? 'Cancel' : 'Abbrechen'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
      />
    </>
  )
}

export default Navbar
