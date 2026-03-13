// File: client/src/pages/Partners/PartnersPage.jsx
import ConsultationModal from '@/components/Home/ConsultationModal'
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { defaultPartners } from '@/data/contentDefaults'
import { getPartners } from '@/services/contentApi'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Briefcase,
  Building,
  CheckCircle,
  ExternalLink,
  MapPin,
  Search,
  Shield,
  Star,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const PartnersPage = ({ language = 'de', onLanguageChange }) => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const searchRef = useRef(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])

  // Partner categories
  const categories = [
    { id: 'all', label: 'All', icon: <Building size={16} /> },
    { id: 'finance', label: 'Banking', icon: <Briefcase size={16} /> },
    { id: 'brokers', label: 'Real Estate', icon: <Building size={16} /> },
    { id: 'legal', label: 'Legal', icon: <Shield size={16} /> },
    { id: 'inspection', label: 'Inspect', icon: <CheckCircle size={16} /> },
  ]

  const [allPartners, setAllPartners] = useState(defaultPartners)

  const filteredPartners = allPartners.filter((partner) => {
    const matchesCategory = activeCategory === 'all' || partner.category === activeCategory
    const matchesSearch =
      !searchTerm ||
      (partner.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (partner.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeCategory])

  useEffect(() => {
    const handleScroll = () => {
      setIsInView(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const loadPartners = async () => {
      try {
        const response = await getPartners()
        setAllPartners(response.length ? response : defaultPartners)
      } catch (error) {
        setAllPartners(defaultPartners)
      } finally {
        setIsLoading(false)
      }
    }

    loadPartners()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  }

  return (
    <div className='bg-background min-h-screen flex flex-col font-body text-foreground transition-colors duration-300'>
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main className='flex-grow'>
        {/* Compact Hero Section */}
        <section className='relative pt-8 pb-12 sm:pt-16 sm:pb-20 overflow-hidden border-b border-border/50'>
          <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40'>
            <motion.div style={{ y: y1 }} className='absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px]' />
            <motion.div style={{ y: y1 }} className='absolute top-[20%] -left-[10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[60px]' />
          </div>

          <div className='max-w-7xl mx-auto px-6 lg:px-8 relative z-10'>
            <div className='text-center space-y-4 sm:space-y-6'>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20'
              >
                <Zap size={12} className='text-accent fill-accent' />
                <span className='text-[10px] font-bold tracking-widest uppercase'>Trusted Partners</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className='text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight leading-tight text-foreground'
              >
                Strategic <span className='text-primary underline decoration-accent/30 underline-offset-8'>Ecosystem</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed'
              >
                Connecting you with Germany's top-tier financial and real estate institutions.
              </motion.p>
              
              {/* Compact Filter & Search Bar */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='max-w-3xl mx-auto mt-8 sm:mt-12 p-1.5 sm:p-2 bg-card border border-border rounded-2xl sm:rounded-full shadow-lg flex flex-col sm:flex-row items-center gap-2'
              >
                <div className='flex-1 w-full pl-4 flex items-center gap-2'>
                  <Search size={18} className='text-muted-foreground' />
                  <input
                    type='text'
                    placeholder='Filter by name or service...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='w-full py-2 bg-transparent outline-none text-sm placeholder:text-muted-foreground'
                  />
                </div>
                
                <div className='flex items-center gap-1.5 p-1 w-full sm:w-auto overflow-x-auto scrollbar-hide'>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] font-bold transition-all ${
                        activeCategory === category.id
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                          : 'hover:bg-primary/5 text-muted-foreground'
                      }`}
                    >
                      {category.icon}
                      {category.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partners Grid Section */}
        <section className='py-12 sm:py-20 px-6 lg:px-8 max-w-7xl mx-auto'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'
          >
            <AnimatePresence mode='popLayout'>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className='animate-pulse rounded-2xl border border-border bg-card p-6 sm:p-8'
                  >
                    <div className='h-12 w-12 rounded-lg bg-secondary/60' />
                    <div className='mt-5 h-6 w-2/3 rounded bg-secondary/60' />
                    <div className='mt-3 h-4 w-full rounded bg-secondary/50' />
                    <div className='mt-2 h-4 w-5/6 rounded bg-secondary/50' />
                    <div className='mt-5 h-8 w-full rounded bg-secondary/40' />
                  </div>
                ))
              ) : filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <motion.div
                    key={partner._id || partner.id}
                    layout
                    variants={cardVariants}
                    whileHover={{ y: -5 }}
                    className={`group relative bg-card rounded-2xl p-6 sm:p-8 border transition-all duration-300 ${
                      partner.featured ? 'border-accent/40 ring-1 ring-accent/10 shadow-md' : 'border-border hover:border-primary/30'
                    }`}
                  >
                    {partner.featured && (
                      <div className='absolute -top-3 right-4 z-10'>
                        <div className='flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full shadow-sm'>
                          <Star size={10} className='fill-accent text-accent' />
                          <span className='text-[9px] font-black uppercase tracking-wider'>Premium</span>
                        </div>
                      </div>
                    )}

                    <div className='space-y-6'>
                      <div className='flex items-start justify-between'>
                        <div className='w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-secondary p-3 flex items-center justify-center border border-border group-hover:scale-105 transition-transform duration-300'>
                          {partner.logoUrl ? (
                            <img src={partner.logoUrl} alt={partner.name} className='max-w-full max-h-full object-contain dark:brightness-110' />
                          ) : (
                            <span className='text-2xl font-black text-accent'>{partner.logo}</span>
                          )}
                        </div>
                        <div className='text-right'>
                          <div className='flex items-center justify-end gap-1 font-black text-xl text-foreground'>
                            <Star size={16} className='text-amber-500 fill-amber-500' />
                            {partner.rating}
                          </div>
                          <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>{partner.reviews} reviews</p>
                        </div>
                      </div>

                      <div className='space-y-2'>
                        <h3 className='text-xl sm:text-2xl font-heading font-black tracking-tight text-foreground group-hover:text-primary transition-colors'>
                          {partner.name}
                        </h3>
                        <p className='text-sm text-muted-foreground leading-relaxed line-clamp-3'>
                          {partner.description}
                        </p>
                      </div>

                      <div className='flex items-center gap-2 py-3 border-y border-border/50'>
                        <MapPin size={14} className='text-accent' />
                        <span className='text-[11px] font-bold text-muted-foreground uppercase tracking-wider'>{partner.location}</span>
                      </div>

                      <div className='pt-2 flex items-center justify-between'>
                         <div className='flex items-center -space-x-2'>
                            {[1,2,3].map(i => (
                              <div key={i} className='w-7 h-7 rounded-full border-2 border-card bg-secondary overflow-hidden'>
                                <img src={`https://i.pravatar.cc/100?u=${partner._id || partner.id || partner.name}-${i}`} alt="user" />
                              </div>
                            ))}
                            <div className='w-7 h-7 rounded-full border-2 border-card bg-primary flex items-center justify-center text-[8px] font-bold text-white'>
                              +10k
                            </div>
                         </div>
                        
                        <button className='flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors'>
                          Profile
                          <ExternalLink size={12} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className='col-span-full py-20 text-center space-y-4 bg-secondary/30 rounded-3xl border border-dashed border-border'>
                  <Search size={32} className='text-muted-foreground mx-auto' />
                  <div className='space-y-1'>
                    <h3 className='text-xl font-black text-foreground'>No results found</h3>
                    <p className='text-sm text-muted-foreground'>Try refining your search criteria.</p>
                  </div>
                   <button
                    onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
                    className='px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold text-xs uppercase tracking-widest transition-transform hover:scale-105'
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Compact Business Section */}
        <section className='bg-primary text-primary-foreground py-16 sm:py-24 px-6 overflow-hidden'>
          <div className='max-w-7xl mx-auto'>
            <div className='grid lg:grid-cols-2 gap-12 sm:gap-20 items-center'>
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className='space-y-8'>
                <div className='space-y-4'>
                  <h2 className='text-4xl sm:text-6xl font-heading font-black leading-tight tracking-tighter text-slate-50'>
                    Partner with <span className='text-accent'>Authority</span>
                  </h2>
                  <p className='text-base sm:text-lg text-primary-foreground/70 leading-relaxed max-w-xl font-medium'>
                    Join Germany's fastest growing mortgage ecosystem. Connect with high-intent homebuyers and scale your business.
                  </p>
                </div>

                <div className='grid gap-4 sm:gap-6'>
                  {[
                    { title: 'Market Exposure', desc: 'Direct access to verified homebuyer leads.', icon: <Users size={18} /> },
                    { title: 'Smart Integration', desc: 'Robust data protocols and security standards.', icon: <Zap size={18} /> },
                  ].map((feat, i) => (
                    <div key={i} className='flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10'>
                      <div className='flex-shrink-0 w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-primary'>{feat.icon}</div>
                      <div>
                        <h4 className='font-black text-slate-50 text-base'>{feat.title}</h4>
                        <p className='text-sm text-primary-foreground/60'>{feat.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className='group px-8 py-4 bg-accent text-primary font-black text-sm uppercase tracking-widest rounded-full flex items-center justify-center gap-3 transition-transform hover:scale-105 shadow-xl shadow-accent/10'
                >
                  Apply Now
                  <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                </button>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className='relative p-6 sm:p-10 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10'>
                <div className='space-y-8 text-center'>
                  <h3 className='text-2xl font-black text-slate-50 px-2'>Network Performance</h3>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='p-6 rounded-2xl bg-white/5 border border-white/10'>
                      <p className='text-3xl font-black text-accent'>€50M</p>
                      <p className='text-[10px] font-bold text-primary-foreground/50 uppercase tracing-widest'>Volume</p>
                    </div>
                    <div className='p-6 rounded-2xl bg-white/5 border border-white/10'>
                      <p className='text-3xl font-black text-[#66DE93]'>98%</p>
                      <p className='text-[10px] font-bold text-primary-foreground/50 uppercase tracing-widest'>Success</p>
                    </div>
                  </div>
                  <div className='p-6 rounded-2xl bg-white/5 border border-white/10 space-y-1.5'>
                    <p className='text-xs font-bold text-primary-foreground/50 uppercase tracking-widest'>Avg. Response Time</p>
                    <p className='text-4xl font-black text-slate-50 tracking-widest'>&lt; 24h</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer language={language} />

      <ConsultationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        language={language}
      />
    </div>
  )
}

export default PartnersPage
