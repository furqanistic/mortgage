// File: client/src/components/Home/HeroSection.jsx
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, TrendingUp, Zap } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

// shadcn UI components
import { Button } from '@/components/ui/button'
import ConsultationForm from '../AddOns/ConsultationForm'

const HeroSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openForm = () => setIsFormOpen(true)
  const closeForm = () => setIsFormOpen(false)

  return (
    <section className='relative min-h-[85vh] flex items-center bg-background overflow-hidden pt-12 md:pt-0'>
      {/* Dynamic Background */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className="absolute top-[-10%] right-[-5%] w-[80vw] h-[80vw] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-accent/5 rounded-full blur-[100px]" />
        
        {/* Fine grid pattern for premium feel */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: `radial-gradient(circle, var(--color-foreground) 1px, transparent 1px)`, 
               backgroundSize: '48px 48px' 
             }} 
        />
      </div>

      <ConsultationForm isOpen={isFormOpen} onClose={closeForm} />

      <div className='container mx-auto px-6 lg:px-12 relative z-10'>
        <div className='grid lg:grid-cols-12 gap-12 lg:gap-16 items-center'>
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className='lg:col-span-7 space-y-8 md:space-y-10'
          >
            {/* Elegant Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='inline-flex items-center space-x-2 px-3 py-1 bg-accent/10 backdrop-blur-sm rounded-full border border-accent/20'
            >
              <Zap size={12} className="text-accent fill-accent" />
              <span className='text-[10px] font-bold text-accent tracking-widest font-heading uppercase'>
                The New Standard
              </span>
            </motion.div>

            {/* Master Heading */}
            <div className="space-y-4">
              <h1 className='text-5xl sm:text-7xl lg:text-8xl font-black font-heading text-foreground leading-[0.95] tracking-tighter'>
                Experience <br />
                <span className='text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-accent relative'>
                  True Ownership
                </span>
              </h1>
              <p className='text-base sm:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl font-body'>
                We combine deep market intelligence with precision financing to navigate the German real estate landscape.
              </p>
            </div>

            {/* Strategic CTAs */}
            <div className='flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto'>
              <Link to='/contact' className="w-full sm:w-auto">
                <Button
                  size='lg'
                  className='w-full sm:w-auto px-10 h-16 text-sm font-black uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/95 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/20'
                >
                  Start Journey
                  <ArrowRight className='ml-3 w-4 h-4' />
                </Button>
              </Link>

              <Button
                variant='outline'
                size='lg'
                onClick={openForm}
                className='w-full sm:w-auto px-8 h-16 text-xs font-black uppercase tracking-widest text-foreground border-border hover:bg-secondary rounded-full transition-all'
              >
                Consult Free
              </Button>
            </div>

            <div className='pt-8 border-t border-border/40 grid grid-cols-2 sm:flex sm:flex-wrap gap-6'>
              {[
                { label: 'Data Driven', icon: CheckCircle },
                { label: 'Instant Pre-approval', icon: TrendingUp },
                { label: 'Verified Partners', icon: Star }
              ].map((item, i) => (
                <div key={i} className='flex items-center gap-2.5 group cursor-default'>
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                     <item.icon className='w-3 h-3 text-accent group-hover:text-accent-foreground transition-colors' />
                  </div>
                  <span className="text-[10px] font-black text-muted-foreground tracking-widest uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual Compound */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className='lg:col-span-5 relative mt-8 lg:mt-0'
          >
             {/* Architectural Frame */}
             <div className="relative aspect-[4/5] w-full max-w-[500px] mx-auto group">
                {/* Decorative Elements */}
                <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-accent/20 rounded-tl-[3rem]" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-primary/20 rounded-br-[3rem]" />
                
                <div className='relative z-10 w-full h-full rounded-[3rem] overflow-hidden shadow-2xl bg-muted'>
                  <img
                    src='https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop'
                    alt='Modern German Penthouse'
                    className='w-full h-full object-cover transform hover:scale-[1.03] transition-transform duration-[2s] ease-out grayscale hover:grayscale-0'
                  />
                  
                  {/* Sophisticated Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60' />
                    
                  <motion.div 
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className='absolute bottom-6 left-6 right-6 p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl'
                   >
                      <div className='flex justify-between items-center'>
                          <div className="space-y-1">
                              <p className='text-[9px] text-white/60 font-black uppercase tracking-widest'>Current Best Rate</p>
                              <p className='text-4xl font-black text-white tracking-tighter'>3.42<span className="text-xl">%</span></p>
                          </div>
                          <div className="text-right space-y-1">
                               <p className='text-[9px] text-white/60 font-black uppercase tracking-widest'>Avg. Saving</p>
                               <p className='text-3xl font-black text-accent tracking-tighter'>€12.5k</p>
                          </div>
                      </div>
                   </motion.div>
                </div>

                {/* Floating Micro-Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 bg-card border border-border px-5 py-4 rounded-2xl shadow-xl z-20 hidden sm:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Applications</p>
                      <p className="text-sm font-black text-foreground">+124 Today</p>
                    </div>
                  </div>
                </motion.div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
