import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Filter,
    MoreHorizontal,
    Search,
    UserPlus,
    Users as UsersIcon,
    Shield,
    Mail,
    Calendar,
    ArrowUpRight,
    Circle,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Layout from './Layout'
import { cn } from '@/lib/utils'

const UsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Scroll to top when page changes
  useEffect(() => {
    const mainElement = document.querySelector('main')
    if (mainElement) {
      mainElement.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [currentPage])

  // Sample user data
  const users = [
    {
      id: 'u1',
      name: 'Marie Schmidt',
      email: 'marie.s@example.com',
      status: 'Active',
      joinDate: '10 Mar 2025',
      initials: 'MS',
      role: 'Admin',
    },
    {
      id: 'u2',
      name: 'Jan Kowalski',
      email: 'jan.k@example.com',
      status: 'Pending',
      joinDate: '11 Mar 2025',
      initials: 'JK',
      role: 'Premium',
    },
    {
      id: 'u3',
      name: 'Anna Weber',
      email: 'anna.w@example.com',
      status: 'New',
      joinDate: '12 Mar 2025',
      initials: 'AW',
      role: 'User',
    },
    {
      id: 'u4',
      name: 'Lukas Pohl',
      email: 'lukas.p@example.com',
      status: 'Active',
      joinDate: '13 Mar 2025',
      initials: 'LP',
      role: 'User',
    },
    {
      id: 'u5',
      name: 'Brigitte Neumann',
      email: 'brigitte.n@example.com',
      status: 'Pending',
      joinDate: '14 Mar 2025',
      initials: 'BN',
      role: 'Premium',
    },
  ]

  const usersPerPage = 5
  const totalPages = 5

  const handlePreviousPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages))
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-primary/10 text-primary border-primary/20'
      case 'Pending':
        return 'bg-amber-100/50 text-amber-600 border-amber-200'
      case 'New':
        return 'bg-blue-100/50 text-blue-600 border-blue-200'
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200'
    }
  }

  return (
    <Layout>
      <div className='flex flex-col gap-10'>
        {/* Header Section */}
        <section className='flex flex-col lg:flex-row lg:items-center justify-between gap-6'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-slate-900 font-heading sm:text-4xl'>User Directory</h1>
            <p className='mt-2 text-slate-500 max-w-2xl'>Maintain high-level control over platform access, membership tiers, and user engagement metrics.</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className='flex items-center gap-3 p-1.5 bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-lg shadow-black/5'
          >
            <button className='flex h-12 px-6 items-center gap-2 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-xl shadow-slate-900/10 hover:brightness-110 transition-all'>
              <Download size={18} />
              Export Records
            </button>
            <button className='flex h-12 px-6 items-center gap-2 rounded-xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/20 hover:brightness-110 transition-all'>
              <UserPlus size={18} />
              Onboard User
            </button>
          </motion.div>
        </section>

        {/* Analytics Summary */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[
            { label: 'Active Members', value: '1,245', growth: '+12%', icon: UsersIcon, color: 'primary' },
            { label: 'Conversion Rate', value: '32.1%', growth: '+2.4%', icon: ArrowUpRight, color: 'accent' },
            { label: 'Pending Access', value: '48', growth: '-5%', icon: Shield, color: 'slate' },
            { label: 'New This Week', value: '186', growth: '+24%', icon: UserPlus, color: 'blue' },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className='rounded-[2.5rem] border border-white/40 bg-white/60 p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/5'
            >
              <div className='flex items-center gap-4 mb-3'>
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  stat.color === 'primary' ? 'bg-primary/10 text-primary' : 
                  stat.color === 'accent' ? 'bg-accent/10 text-accent' : 
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                )}>
                  <stat.icon size={20} />
                </div>
                <span className='text-[10px] font-black uppercase tracking-widest text-slate-400'>{stat.label}</span>
              </div>
              <div className='flex items-baseline justify-between'>
                <h3 className='text-2xl font-black text-slate-900 font-heading'>{stat.value}</h3>
                <span className={cn(
                  'text-[10px] font-bold px-2 py-0.5 rounded-full',
                  stat.growth.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                )}>{stat.growth}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Database Card */}
        <section className='relative rounded-[2.5rem] border border-white/40 bg-white/60 p-6 backdrop-blur-xl shadow-2xl shadow-black/5 sm:p-10'>
          <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6'>
            <div className='relative w-full md:w-96'>
              <Search className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400' size={18} />
              <input 
                type='text' 
                placeholder='Search by name or email...' 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='h-12 w-full rounded-2xl border border-slate-100 bg-slate-50/50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-primary/30 focus:bg-white focus:ring-4 focus:ring-primary/5'
              />
            </div>
            <div className='flex items-center gap-3'>
              <button className='flex h-12 items-center gap-2 rounded-2xl border border-slate-100 bg-white px-5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50'>
                <Filter size={16} />
                Advanced Filters
              </button>
            </div>
          </div>

          <div className='overflow-x-auto -mx-6 sm:mx-0'>
            <table className='w-full border-separate border-spacing-y-3 px-6 sm:px-0'>
              <thead>
                <tr className='text-left text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400'>
                  <th className='px-6 pb-2'>Member</th>
                  <th className='px-6 pb-2'>Security Tier</th>
                  <th className='px-6 pb-2'>Operational Status</th>
                  <th className='px-6 pb-2'>Acquisition Date</th>
                  <th className='px-6 pb-2 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='space-y-4'>
                {users.map((user) => (
                  <tr key={user.id} className='group'>
                    <td className='rounded-l-[2rem] bg-white p-6 transition-colors group-hover:bg-slate-50/50 border-y border-l border-slate-100'>
                      <div className='flex items-center gap-4'>
                        <Avatar className='h-12 w-12 rounded-2xl border-2 border-slate-50 shadow-sm'>
                          <AvatarFallback className='bg-primary/10 text-primary font-bold'>
                            {user.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <span className='font-bold text-slate-900 group-hover:text-primary transition-colors'>{user.name}</span>
                          <span className='text-xs text-slate-400 flex items-center gap-1.5'>
                            <Mail size={12} className='opacity-40' />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className='bg-white p-6 transition-colors group-hover:bg-slate-50/50 border-y border-slate-100'>
                      <span className={cn(
                        'inline-flex items-center gap-2 rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border',
                        user.role === 'Admin' ? 'bg-slate-900 text-white border-slate-900' : 
                        user.role === 'Premium' ? 'bg-accent/10 text-accent border-accent/20' : 
                        'bg-slate-100 text-slate-500 border-slate-200'
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className='bg-white p-6 transition-colors group-hover:bg-slate-50/50 border-y border-slate-100'>
                      <div className={cn(
                        'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border',
                        getStatusStyle(user.status)
                      )}>
                        <Circle size={8} className='fill-current' />
                        {user.status}
                      </div>
                    </td>
                    <td className='bg-white p-6 transition-colors group-hover:bg-slate-50/50 border-y border-slate-100'>
                      <div className='flex items-center gap-2 text-xs font-bold text-slate-500 font-heading'>
                        <Calendar size={14} className='opacity-40 text-primary' />
                        {user.joinDate}
                      </div>
                    </td>
                    <td className='rounded-r-[2rem] bg-white p-6 text-right transition-colors group-hover:bg-slate-50/50 border-y border-r border-slate-100'>
                      <div className='flex items-center justify-end gap-2'>
                        <button className='flex h-10 px-4 items-center justify-center rounded-xl bg-slate-50 text-slate-500 font-bold text-xs hover:bg-primary/10 hover:text-primary transition-all'>
                          Manage Profile
                        </button>
                        <button className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all'>
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-slate-100 pt-8'>
            <p className='text-sm text-slate-400 font-medium'>
              Displaying <span className='text-slate-900 font-bold'>{usersPerPage}</span> of <span className='text-slate-900 font-bold'>1,245</span> members
            </p>
            <div className='flex items-center gap-3'>
              <button 
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className='flex h-11 px-5 items-center gap-2 rounded-2xl border border-slate-100 bg-white text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-30'
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <div className='flex items-center gap-1'>
                {[1, 2, 3, '...', 5].map((p, i) => (
                  <button 
                    key={i}
                    className={cn(
                      'h-11 w-11 rounded-2xl flex items-center justify-center text-sm font-bold transition-all',
                      p === currentPage ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className='flex h-11 px-5 items-center gap-2 rounded-2xl border border-slate-100 bg-white text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 disabled:opacity-30'
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default UsersPage
