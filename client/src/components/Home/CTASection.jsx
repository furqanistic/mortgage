// File: client/src/components/Home/CTASection.jsx
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, ShieldCheck, Star } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const CTASection = () => {
  return (
    <section className='py-24 relative overflow-hidden bg-secondary'>
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

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='max-w-4xl mx-auto text-center space-y-8'>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='inline-flex items-center gap-2 px-4 py-2 bg-background/50 backdrop-blur-sm rounded-full border border-border shadow-sm'
          >
            <ShieldCheck className='w-4 h-4 text-accent' />
            <span className='text-sm font-medium text-foreground/80'>
              Trusted by 5,000+ Homeowners
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className='text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-primary tracking-tight leading-tight'
          >
            Start Your Journey to <br />
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary'>
              Home Ownership
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className='text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed'
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
            <Link to='/auth'>
              <Button
                size='lg'
                className='h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-md hover:shadow-lg transition-all md:w-auto w-full'
              >
                Get Started Now <ArrowRight className='ml-2 w-5 h-5' />
              </Button>
            </Link>
            <Link to='/contact'>
               <Button
                 size='lg'
                 variant='outline'
                 className='h-14 px-8 text-lg border-primary/20 text-primary hover:bg-primary/5 rounded-full bg-transparent md:w-auto w-full'
               >
                 Schedule Call
               </Button>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className='grid sm:grid-cols-3 gap-8 pt-12 border-t border-border/50 mt-12'
          >
            <div className='text-center space-y-2'>
              <div className='flex justify-center mb-3'>
                 <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/50">
                    <CheckCircle className='w-6 h-6 text-accent' />
                 </div>
              </div>
              <h3 className='text-lg font-semibold text-foreground'>Free Consultation</h3>
              <p className='text-sm text-muted-foreground'>No obligation first call</p>
            </div>
            <div className='text-center space-y-2'>
               <div className='flex justify-center mb-3'>
                 <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/50">
                    <Star className='w-6 h-6 text-accent' />
                 </div>
              </div>
              <h3 className='text-lg font-semibold text-foreground'>Best Rate Guarantee</h3>
              <p className='text-sm text-muted-foreground'>We negotiate for you</p>
            </div>
            <div className='text-center space-y-2'>
               <div className='flex justify-center mb-3'>
                 <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/50">
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
