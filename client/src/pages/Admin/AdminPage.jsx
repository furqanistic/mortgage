import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users as UsersIcon, 
  MessageSquareQuote, 
  BookOpenText, 
  ArrowUpRight, 
  Calendar,
  Activity,
  Layers
} from 'lucide-react'
import Layout from './Layout'
import { getBlogs, getPartners, getTestimonials } from '@/services/contentApi'
import { cn } from '@/lib/utils'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const AdminPage = () => {
  const [data, setData] = useState({ blogs: [], partners: [], testimonials: [] })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [blogs, partners, testimonials] = await Promise.all([
          getBlogs(true),
          getPartners(true),
          getTestimonials(true)
        ])
        setData({ blogs, partners, testimonials })
      } catch (error) {
        console.error('Overview load failed', error)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => [
    { label: 'Articles', value: data.blogs.length, icon: BookOpenText, color: 'primary' },
    { label: 'Partners', value: data.partners.length, icon: Layers, color: 'accent' },
    { label: 'Feedback', value: data.testimonials.length, icon: MessageSquareQuote, color: 'blue' },
    { label: 'Traffic', value: '1.2k', icon: Activity, color: 'orange' },
  ], [data])

  const chartData = [
    { name: 'Jan', value: 400 }, { name: 'Feb', value: 300 }, { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 }, { name: 'May', value: 500 }, { name: 'Jun', value: 900 },
    { name: 'Jul', value: 1100 },
  ]

  return (
    <Layout>
      <div className='flex flex-col gap-6'>
        <section className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
          <motion.div initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className='text-3xl font-bold tracking-tight text-slate-900 font-heading uppercase tracking-wide'>Admin Insights</h1>
            <p className='mt-1 text-sm text-slate-500'>Real-time platform performance monitoring.</p>
          </motion.div>
          <div className='flex items-center gap-1.5 p-1 rounded-xl bg-white border border-slate-200 shadow-sm'>
            <button className='h-8 px-4 rounded-lg font-black text-[10px] bg-primary text-white shadow shadow-primary/20 font-heading uppercase tracking-wider'>Metrics</button>
            <button className='h-8 px-4 rounded-lg font-black text-[10px] text-slate-400 hover:text-slate-900 transition-colors font-heading uppercase tracking-wider'>Reports</button>
          </div>
        </section>

        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={stat.label}
              className='group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all'
            >
              <div className={cn(
                'flex h-10 w-10 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110',
                stat.color === 'primary' ? 'bg-primary/10 text-primary' : 
                stat.color === 'accent' ? 'bg-accent/10 text-accent' : 
                stat.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'
              )}>
                <stat.icon size={18} />
              </div>
              <p className='text-[9px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5'>{stat.label}</p>
              <h3 className='text-2xl font-black text-slate-900 font-heading'>{isLoading ? '...' : stat.value}</h3>
            </motion.div>
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className='lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <div className='mb-6'><h4 className='font-bold text-slate-900 text-sm font-heading tracking-widest uppercase'>Audience Density</h4></div>
            <div className='h-[200px] w-full'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={chartData}>
                  <defs><linearGradient id='colorValue' x1='0' y1='0' x2='0' y2='1'><stop offset='5%' stopColor='var(--primary)' stopOpacity={0.1}/><stop offset='95%' stopColor='var(--primary)' stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray='3 3' vertical={false} stroke='#f1f5f9' />
                  <XAxis dataKey='name' axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '10px', fontWeight: 'bold' }} />
                  <Area type='monotone' dataKey='value' stroke='#0f8a4a' strokeWidth={3} fill='url(#colorValue)' />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h4 className='font-bold text-slate-900 text-sm font-heading tracking-widest uppercase mb-6'>Activity Stream</h4>
            <div className='space-y-5'>
              {[
                { user: 'Admin', action: 'Published Guide', time: '2m ago', icon: BookOpenText },
                { user: 'System', action: 'Partner Sync', time: '1h ago', icon: Layers },
                { user: 'Editor', action: 'Updated Story', time: '4h ago', icon: MessageSquareQuote },
                { user: 'Admin', action: 'Access Review', time: '1d ago', icon: UsersIcon },
              ].map((item, i) => (
                <div key={i} className='flex items-center gap-3 group'>
                  <div className='h-9 w-9 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-primary group-hover:scale-110 transition-transform'><item.icon size={16} /></div>
                  <div className='flex-1'><p className='text-xs font-bold text-slate-800 leading-tight uppercase font-heading tracking-wider'>{item.action}</p><p className='text-[10px] text-slate-400 font-bold mt-0.5'>{item.user} • {item.time}</p></div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  )
}

export default AdminPage
