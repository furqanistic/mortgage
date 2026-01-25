// File: client/src/components/Home/HeroSection.jsx
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, TrendingUp } from 'lucide-react'
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
    <section className='relative min-h-[95vh] flex items-center bg-background overflow-hidden pt-20 lg:pt-0'>
      {/* Dynamic Background */}
      <div className='absolute inset-0 pointer-events-none'>
        <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[100px]" />
        
        {/* Fine grid pattern for premium feel */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`, 
               backgroundSize: '48px 48px' 
             }} 
        />
      </div>

      <ConsultationForm isOpen={isFormOpen} onClose={closeForm} />

      <div className='container mx-auto px-6 lg:px-12 relative z-10'>
        <div className='grid lg:grid-cols-12 gap-12 lg:gap-8 items-center'>
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className='lg:col-span-7 space-y-12'
          >
            {/* Elegant Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='inline-flex items-center space-x-3 px-4 py-1.5 bg-secondary/30 backdrop-blur-sm rounded-full border border-border/40'
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className='text-[10px] sm:text-xs font-bold text-muted-foreground tracking-[0.2em] uppercase'>
                Premier Mortgage Expertise in Germany
              </span>
            </motion.div>

            {/* Master Heading */}
            <div className="space-y-4">
              <h1 className='text-6xl sm:text-7xl lg:text-8xl font-bold font-heading text-foreground leading-[0.95] tracking-tight'>
                Experience <br />
                <span className='text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-accent relative'>
                  True Ownership
                </span>
              </h1>
              <p className='text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl font-body'>
                From first-time buyers to seasoned investors, we provide the clarity and confidence you need to navigate the German real estate market.
              </p>
            </div>

            {/* Strategic CTAs */}
            <div className='flex flex-wrap gap-6 items-center'>
              <Link to='/auth' className="group relative">
                <Button
                  size='lg'
                  className='px-10 h-16 text-lg bg-primary text-primary-foreground hover:bg-primary/95 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-primary/20'
                >
                  Start Your Journey
                  <ArrowRight className='ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </Button>
              </Link>

              <Button
                variant='ghost'
                size='lg'
                onClick={openForm}
                className='px-8 h-16 text-lg text-foreground hover:bg-white/5 rounded-full font-semibold transition-all'
              >
                Free Consultation
              </Button>
            </div>

            <div className='pt-8 border-t border-border/20 flex flex-wrap gap-x-12 gap-y-6'>
              {[
                { label: 'Verified Process', icon: CheckCircle },
                { label: 'Instant Pre-approval', icon: TrendingUp },
                { label: 'Direct Advisor Access', icon: Star }
              ].map((item, i) => (
                <div key={i} className='flex items-center gap-2.5 group'>
                  <item.icon className='w-4 h-4 text-accent transition-transform group-hover:scale-110' />
                  <span className="text-xs font-bold text-muted-foreground tracking-wider uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Visual Compound */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className='lg:col-span-5 relative mt-16 lg:mt-0'
          >
             {/* Architectural Frame */}
             <div className="relative aspect-[4/5] w-full max-w-[480px] mx-auto group">
                {/* Decorative Elements */}
                <div className="absolute -top-6 -left-6 w-32 h-32 border-l-2 border-t-2 border-accent/20 rounded-tl-[3rem]" />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-primary/20 rounded-br-[3rem]" />
                
                <div className='relative z-10 w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(15,23,42,0.15)] bg-muted'>
                  <img
                    src='https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop'
                    alt='Modern Home Concept'
                    className='w-full h-full object-cover transform hover:scale-[1.03] transition-transform duration-[2s] ease-out'
                  />
                  
                  {/* Sophisticated Overlay */}
                  <div className='absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-40' />
                  
                  {/* Live Stats Card */}
                   <motion.div 
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 1, duration: 0.8 }}
                      className='absolute bottom-6 left-6 right-6 glass p-6 rounded-2xl border border-white/20 dark:border-white/5'
                   >
                      <div className='flex justify-between items-center'>
                          <div className="space-y-1">
                              <p className='text-[10px] text-foreground/40 font-bold uppercase tracking-widest'>Current Best Rate</p>
                              <p className='text-4xl font-bold text-foreground tracking-tighter'>3.42<span className="text-xl">%</span></p>
                          </div>
                          <div className="text-right space-y-1">
                               <p className='text-[10px] text-foreground/40 font-bold uppercase tracking-widest'>Avg. Saving</p>
                               <p className='text-3xl font-bold text-accent tracking-tighter'>€12.5k</p>
                          </div>
                      </div>
                   </motion.div>
                </div>

                {/* Floating Micro-Card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-8 glass-card border-accent/20 px-4 py-3 rounded-xl shadow-xl z-20 hidden sm:block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Applications</p>
                      <p className="text-sm font-bold text-foreground">+124 Today</p>
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
