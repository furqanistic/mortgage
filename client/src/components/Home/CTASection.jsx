// File: client/src/components/Home/CTASection.jsx
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, ShieldCheck, Star } from 'lucide-react'

import { Link } from 'react-router-dom'

const CTASection = () => {
  return (
    <section className='py-16 md:py-32 relative overflow-hidden bg-background'>
      {/* Background decorations */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3' />
        <div className='absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4' />
        
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-[0.03]" 
             style={{ 
               backgroundImage: 'linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px)', 
               backgroundSize: '60px 60px' 
             }} 
        />
      </div>

      <div className='container mx-auto px-6 lg:px-12 relative z-10'>
        <div className='max-w-5xl mx-auto text-center space-y-12'>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='inline-flex items-center gap-2 px-4 py-2 bg-accent/10 backdrop-blur-sm rounded-full border border-accent/20 shadow-sm'
          >
            <ShieldCheck className='w-4 h-4 text-accent' />
            <span className='text-sm font-medium text-accent'>
              Trusted by 5,000+ Homeowners
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-foreground tracking-tight leading-[1.1]'
          >
            Start Your Journey to <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/90 to-accent relative'>
              Home Ownership
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className='text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed font-body'
          >
            Get a comprehensive mortgage plan tailored to your needs. No hidden fees, just clear guidance.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-4'
          >
            <Link to='/auth' className="group relative">
              <Button
                size='lg'
                className='h-16 px-10 text-lg bg-primary text-primary-foreground hover:bg-primary/95 rounded-full shadow-2xl shadow-primary/20 transition-all hover:scale-[1.05] active:scale-[0.98] w-full sm:w-auto font-bold'
              >
                Get Started Now <ArrowRight className='ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform' />
              </Button>
            </Link>
            <Button
              size='lg'
              variant='ghost'
              onClick={() => window.location.href = '/contact'}
              className='h-16 px-10 text-lg text-foreground hover:bg-primary hover:text-primary-foreground rounded-full font-semibold transition-all w-full sm:w-auto'
            >
              Schedule Call
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className='grid sm:grid-cols-3 gap-12 pt-16 border-t border-border/20 mt-16'
          >
            <div className='text-center space-y-2'>
              <div className='flex justify-center mb-3'>
                 <div className="p-4 bg-secondary/50 rounded-2xl border border-border/40 group-hover:bg-accent/10 transition-colors">
                    <CheckCircle className='w-6 h-6 text-accent' />
                 </div>
              </div>
              <h3 className='text-lg font-semibold text-foreground'>Free Consultation</h3>
              <p className='text-sm text-muted-foreground'>No obligation first call</p>
            </div>
            <div className='text-center space-y-2'>
               <div className='flex justify-center mb-3'>
                 <div className="p-4 bg-secondary/50 rounded-2xl border border-border/40 group-hover:bg-accent/10 transition-colors">
                    <Star className='w-6 h-6 text-accent' />
                 </div>
              </div>
              <h3 className='text-lg font-semibold text-foreground'>Best Rate Guarantee</h3>
              <p className='text-sm text-muted-foreground'>We negotiate for you</p>
            </div>
            <div className='text-center space-y-2'>
               <div className='flex justify-center mb-3'>
                 <div className="p-4 bg-secondary/50 rounded-2xl border border-border/40 group-hover:bg-accent/10 transition-colors">
                    <ShieldCheck className='w-6 h-6 text-accent' />
                 </div>
              </div>
              <h3 className='text-lg font-semibold text-foreground'>Fully Digital</h3>
              <p className='text-sm text-muted-foreground'>Paperless process</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default CTASection
