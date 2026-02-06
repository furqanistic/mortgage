// File: client/src/pages/Blog/BlogPage.jsx
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowRight,
    BookOpen,
    Calendar,
    Clock,
    Search,
    Zap,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const blogPosts = [
  {
    id: 1,
    title: 'German Mortgage Rates 2026',
    excerpt: 'Detailed analysis of current interest rate trajectories and how to lock in favorable conditions.',
    category: 'Analysis',
    date: 'Feb 18, 2025',
    readTime: '5 min',
    image: '/blog/berlin_altbau.png',
  },
  {
    id: 2,
    title: 'Strategic Home Buying Guide',
    excerpt: 'Navigate the complex German bidding process with our tactical roadmap for first-time owners.',
    category: 'Guides',
    date: 'Feb 10, 2025',
    readTime: '8 min',
    image: '/blog/berlin_modern.png',
  },
  {
    id: 3,
    title: 'Tax Optimization for Real Estate',
    excerpt: 'Leverage state-specific tax breaks and structural advantages for your next property investment.',
    category: 'Strategy',
    date: 'Feb 5, 2025',
    readTime: '6 min',
    image: '/blog/berlin_villa.png',
  },
  {
    id: 4,
    title: 'The Viewing Protocol',
    excerpt: 'What to look for beyond the surface. A masterclass in identifying property value and risk.',
    category: 'Evaluation',
    date: 'Jan 28, 2025',
    readTime: '4 min',
    image: '/blog/berlin_townhouse.png',
  },
  {
    id: 5,
    title: 'Modern Renovation Financing',
    excerpt: 'How to structure loans for energy-efficient upgrades that actually increase property equity.',
    category: 'Finance',
    date: 'Jan 20, 2025',
    readTime: '7 min',
    image: '/blog/berlin_loft.png',
  },
  {
    id: 6,
    title: 'ESG Impact on German Market',
    excerpt: 'Why energy ratings are becoming the primary driver of property liquidity and value.',
    category: 'Trends',
    date: 'Jan 15, 2025',
    readTime: '5 min',
    image: '/blog/berlin_lakehouse.png',
  },
]

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = ['all', ...new Set(blogPosts.map((post) => post.category))]

  useEffect(() => {
    let result = blogPosts
    if (searchQuery) {
      result = result.filter(
        (post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (activeCategory !== 'all') {
      result = result.filter((post) => post.category === activeCategory)
    }
    setFilteredPosts(result)
  }, [searchQuery, activeCategory])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeCategory])

  return (
    <div className="bg-background min-h-screen flex flex-col font-body text-foreground transition-colors duration-300">
      <Navbar />

      <main className="flex-grow">
        {/* Premium Blog Hero */}
        <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
             <div className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-[#FAC51C]/10 rounded-full blur-[80px]" />
             <div className="absolute top-[20%] -left-[10%] w-[300px] h-[300px] bg-[#155FA0]/5 rounded-full blur-[60px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155FA0]/10 text-[#155FA0] border border-[#155FA0]/20"
            >
              <BookOpen size={12} className="text-[#FAC51C]" />
              <span className="text-[10px] font-bold tracking-widest uppercase">Intelligence Reservoir</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tighter leading-tight text-foreground"
            >
              Market <span className="text-[#155FA0] underline decoration-[#FAC51C]/30 underline-offset-8">Perspectives</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Strategic insights on the German property landscape, engineering your path to smarter ownership.
            </motion.p>
          </div>
        </section>

        {/* Global Controls */}
        <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50 py-4 px-6">
           <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide w-full sm:w-auto p-1">
                 {categories.map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${
                      activeCategory === cat ? 'bg-[#155FA0] text-primary-foreground shadow-lg shadow-[#155FA0]/20' : 'text-muted-foreground hover:bg-[#155FA0]/5'
                    }`}
                   >
                    {cat}
                   </button>
                 ))}
              </div>

              <div className="relative w-full sm:w-64 group">
                 <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <input 
                  type="text" 
                  placeholder="Universal Research..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary rounded-full text-xs outline-none focus:ring-1 focus:ring-[#155FA0] transition-all font-medium"
                 />
              </div>
           </div>
        </div>

        {/* Blog Collective Grid */}
        <section className="py-16 sm:py-24 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative flex flex-col"
                >
                  <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-6 border border-border bg-muted">
                     <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest border border-border/50">
                          {post.category}
                        </span>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-2">
                     <span className="flex items-center gap-1.5 shrink-0"><Calendar size={12} className="text-[#FAC51C]" /> {post.date}</span>
                     <span className="flex items-center gap-1.5 shrink-0"><Clock size={12} className="text-[#FAC51C]" /> {post.readTime}</span>
                  </div>

                  <h3 className="text-2xl font-heading font-black text-foreground px-2 mb-3 leading-tight group-hover:text-accent transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm font-medium text-muted-foreground px-2 mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto px-2">
                    <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-tighter text-foreground hover:gap-4 transition-all">
                      Read Analysis <ArrowRight size={14} className="text-[#155FA0]" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Knowledge CTA */}
        <section className="py-20 px-6 sm:px-12">
          <div className="max-w-4xl mx-auto rounded-[3rem] bg-[#155FA0] text-primary-foreground p-12 sm:p-20 text-center space-y-8 relative overflow-hidden border border-border">
             <div className="relative z-10 space-y-4">
                <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-slate-50">
                   Stay <span className="text-[#FAC51C]">Tactical</span>
                </h2>
                <p className="text-base text-primary-foreground/70 font-medium max-w-md mx-auto">
                   Our bi-weekly dossier on the German mortgage landscape. Direct to your terminal.
                </p>
             </div>
             
             <form className="relative z-10 flex flex-col sm:flex-row gap-3 max-w-sm mx-auto" onSubmit={e => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email Protocol" 
                  className="flex-1 h-12 px-6 rounded-full bg-white/5 border border-white/10 text-xs outline-none focus:ring-1 focus:ring-[#FAC51C] transition-all"
                />
                <button className="h-12 px-8 rounded-full bg-[#FAC51C] text-[#155FA0] font-black text-[11px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-[#FAC51C]/10">
                  Deploy
                </button>
             </form>

             <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default BlogPage
