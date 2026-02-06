// File: client/src/components/layout/Footer.jsx
import { motion } from 'framer-motion'
import { Globe, Instagram, Mail, Phone, Twitter } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Calculators', href: '/properties' }, // Properties has the calc in this project structure
    { label: 'About', href: '/about' },
    { label: 'Partners', href: '/partners' },
    { label: 'Contact', href: '/contact' },
  ]

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <footer className='bg-background border-t border-border mt-auto'>
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-6'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            className='flex flex-col gap-3 max-w-md'
          >
            <div className='flex items-center gap-3'>
              <img src='/Logo.svg' alt='Baufiking' className='h-7 w-auto' />
              <div className='flex gap-2'>
                {[Globe, Twitter, Instagram].map((Icon, i) => (
                  <a
                    key={i}
                    href='#'
                    className='w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all'
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
            <p className='text-xs text-muted-foreground leading-relaxed'>
              Engineering the future of German homeownership through data-driven mortgage solutions.
            </p>
          </motion.div>

          <div className='grid grid-cols-2 sm:grid-cols-3 gap-6'>
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              transition={{ delay: 0.1 }}
              className='space-y-3'
            >
              <h4 className='text-xs font-black uppercase tracking-widest text-foreground'>Platform</h4>
              <ul className='space-y-2'>
                {navItems.map((item, i) => (
                  <li key={i}>
                    <Link to={item.href} className='text-xs text-muted-foreground hover:text-accent transition-colors font-medium'>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              transition={{ delay: 0.2 }}
              className='space-y-3'
            >
              <h4 className='text-xs font-black uppercase tracking-widest text-foreground'>Connection</h4>
              <ul className='space-y-2'>
                <li className='flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors'>
                  <Phone size={12} className='text-accent' />
                  <span className='text-xs font-medium'>+49 151 71618082</span>
                </li>
                <li className='flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors'>
                  <Mail size={12} className='text-accent' />
                  <span className='text-xs font-medium truncate'>ravinder.singh@baufiking.de</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              transition={{ delay: 0.3 }}
              className='space-y-3 sm:col-span-1 col-span-2'
            >
              <h4 className='text-xs font-black uppercase tracking-widest text-foreground'>Intelligence</h4>
              <form className='flex gap-2' onSubmit={e => e.preventDefault()}>
                <input
                  type='email'
                  placeholder='Email'
                  className='flex-1 h-9 px-3 rounded-lg bg-secondary border-none text-xs outline-none focus:ring-1 focus:ring-accent transition-all'
                />
                <button className='h-9 w-9 flex items-center justify-center bg-primary text-primary-foreground rounded-lg shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all'>
                  <ArrowRight size={14} />
                </button>
              </form>
            </motion.div>
          </div>
        </div>

        <div className='mt-6 pt-4 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4'>
          <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
            © {new Date().getFullYear()} Baufiking Ecosystem.
          </p>
          <div className='flex gap-6'>
            <Link to='/privacy' className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-accent transition-colors'>Privacy</Link>
            <Link to='/terms' className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-accent transition-colors'>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Arrow icon for the newsletter button since it's not imported
const ArrowRight = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14m-7-7 7 7-7 7" />
  </svg>
)

export default Footer
