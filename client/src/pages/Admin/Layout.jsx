import { cn } from '@/lib/utils'
import { BookOpenText, Building2, Home, MessageSquareQuote, LogOut, ExternalLink, Users, CalendarCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Layout = ({ children }) => {
  const location = useLocation()
  const logoSrc = `${import.meta.env.BASE_URL}new-logo.svg`
  
  const navItems = [
    { name: 'Blogs', href: '/admin/blogs', icon: BookOpenText },
    { name: 'Partners', href: '/admin/partners', icon: Building2 },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
    // { name: 'Appointments', href: '/admin/appointments', icon: CalendarCheck },
    // { name: 'Users', href: '/admin/users', icon: Users },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className='admin-shell min-h-screen bg-[#f8faf7] font-admin text-slate-900 overflow-x-hidden'>
      {/* Background Decorative Elements */}
      <div className='fixed inset-0 pointer-events-none overflow-hidden'>
        <div className='absolute -top-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]' />
        <div className='absolute bottom-[10%] -left-[5%] w-[30%] h-[30%] rounded-full bg-accent/5 blur-[100px]' />
      </div>

      <div className='relative flex min-h-screen'>
        {/* Sidebar */}
        <aside className='fixed left-0 top-0 hidden h-screen w-72 lg:block p-6'>
          <div className='flex h-full flex-col rounded-[2.5rem] border border-slate-200 bg-white shadow-xl shadow-black/5'>
            {/* Branding */}
            <div className='p-8'>
              <div className='flex flex-col items-center text-center'>
                <img
                  src={logoSrc}
                  alt='Baufiking logo'
                  className='h-9 w-auto object-contain'
                />
              </div>
            </div>

            {/* Navigation */}
            <nav className='flex-1 space-y-1 px-4'>
              <div className='mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>
                Management Hub
              </div>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'group relative flex h-11 items-center gap-3 rounded-xl px-4 text-[11px] font-black uppercase tracking-widest transition-all duration-300 font-heading',
                    isActive(item.href)
                      ? 'bg-primary text-white shadow-lg'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-primary'
                  )}
                >
                  <item.icon 
                    size={16} 
                    className={cn(
                      'transition-transform duration-300 group-hover:scale-110',
                      isActive(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-primary'
                    )} 
                  />
                  {item.name}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white"
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Bottom Section */}
            <div className='mt-auto border-t border-slate-100 p-6'>
              <div className='space-y-1.5'>
                <Link
                  to='/'
                  className='flex h-11 items-center gap-3 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900 font-heading'
                >
                  <Home size={16} className='text-slate-400' />
                  Main Website
                  <ExternalLink size={12} className='ml-auto text-slate-300' />
                </Link>
                <button
                  type='button'
                  onClick={() => {/* handle logout */}}
                  className='flex w-full h-11 items-center gap-3 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-red-600 transition-all hover:bg-red-50 font-heading'
                >
                  <LogOut size={16} />
                  Terminate
                </button>
              </div>
              
              <div className='mt-6 rounded-2xl bg-slate-50 p-4 border border-slate-200'>
                <div className='flex items-center gap-3'>
                  <div className='h-9 w-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-[10px] font-black text-primary border border-slate-200'>AD</div>
                  <div className='overflow-hidden'>
                    <p className='truncate text-[10px] font-black text-slate-700 font-heading uppercase tracking-wider'>Admin User</p>
                    <p className='truncate text-[9px] text-slate-400 font-bold uppercase tracking-widest'>Control Suite</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className='lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-center px-6 z-50 shadow-sm'>
          <div className='flex items-center'>
            <img
              src={logoSrc}
              alt='Baufiking logo'
              className='h-8 w-auto object-contain'
            />
          </div>
        </div>

        {/* Main Content Area */}
        <main className='flex-1 lg:pl-72 pt-16 lg:pt-0'>
          <div className='mx-auto min-h-screen max-w-[1400px] p-4 sm:p-6 lg:p-8'>
            <AnimatePresence mode='wait'>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className='h-full'
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
