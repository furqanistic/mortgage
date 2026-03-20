import { cn } from '@/lib/utils'
import { BookOpenText, Building2, Home, MessageSquareQuote } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Layout = ({ children }) => {
  const location = useLocation()

  const navItems = [
    { name: 'Blogs', href: '/admin/blogs', icon: BookOpenText },
    { name: 'Partners', href: '/admin/partners', icon: Building2 },
    { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
  ]

  return (
    <div className='min-h-screen bg-[#f4f6f3] text-slate-900'>
      <div className='mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-6 sm:px-6 lg:gap-8 lg:px-8 lg:py-8'>
        <aside className='sticky top-6 h-[calc(100vh-3rem)] w-64 shrink-0 rounded-2xl border border-[#e2e7df] bg-white p-5 shadow-sm'>
          <div className='mb-6 rounded-xl bg-gradient-to-br from-[#0f8a4a] to-[#0b6f3e] px-4 py-3.5 text-white shadow-md'>
            <p className='text-xs font-medium uppercase tracking-wider text-white/80'>Admin</p>
            <p className='font-heading text-lg font-bold tracking-tight'>Content Studio</p>
          </div>

          <nav className='space-y-1.5'>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium transition',
                  location.pathname === item.href
                    ? 'bg-[#eef7f0] text-[#0f7c45]'
                    : 'text-slate-600 hover:bg-[#f3f6f1] hover:text-slate-900'
                )}
              >
                <item.icon className='h-4 w-4' />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className='mt-6 border-t border-[#e6eade] pt-4'>
            <Link
              to='/'
              className='flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-[#f3f6f1] hover:text-slate-900'
            >
              <Home className='h-4 w-4' />
              Back to Website
            </Link>
          </div>
        </aside>

        <main className='min-w-0 flex-1'>{children}</main>
      </div>
    </div>
  )
}

export default Layout
