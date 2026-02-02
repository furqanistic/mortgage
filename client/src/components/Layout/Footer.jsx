// File: client/src/components/layout/Footer.jsx
import { motion } from 'framer-motion'
import {
  Building,
  Calculator,
  Github,
  Globe,
  Home,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Twitter,
  Users,
} from 'lucide-react'
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
      <div className='max-w-7xl mx-auto px-6 lg:px-8 py-8 sm:py-12'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12'>
          {/* Brand Column */}
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            className='space-y-6'
          >
            <img src='/Logo.svg' alt='Baufiking' className='h-8 w-auto' />
            <p className='text-sm text-muted-foreground leading-relaxed max-w-xs'>
              Engineering the future of German homeownership through data-driven mortgage solutions.
            </p>
            <div className='flex gap-3'>
              {[Globe, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href='#' className='w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all'>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Links & Contact - Grid on Mobile to stay compact */}
          <div className='grid grid-cols-2 lg:grid-cols-2 gap-8 lg:col-span-2'>
            <motion.div
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              variants={fadeInUpVariants}
              transition={{ delay: 0.1 }}
              className='space-y-4'
            >
              <h4 className='text-sm font-black uppercase tracking-widest text-foreground'>Platform</h4>
              <ul className='space-y-2.5'>
                {navItems.map((item, i) => (
                  <li key={i}>
                    <Link to={item.href} className='text-sm text-muted-foreground hover:text-accent transition-colors font-medium'>
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
              className='space-y-4'
            >
              <h4 className='text-sm font-black uppercase tracking-widest text-foreground'>Connection</h4>
              <ul className='space-y-3'>
                <li className='flex items-center gap-2 group cursor-pointer text-muted-foreground hover:text-accent transition-colors'>
                  <Phone size={14} className='text-accent' />
                  <span className='text-sm font-medium'>+49 151 71618082</span>
                </li>
                <li className='flex items-center gap-2 group cursor-pointer text-muted-foreground hover:text-accent transition-colors'>
                  <Mail size={14} className='text-accent' />
                  <span className='text-sm font-medium truncate'>ravinder.singh@baufiking.de</span>
                </li>
                {/* <li className='flex items-center gap-2 text-muted-foreground'>
                  <Building size={14} className='text-accent' />
                  <span className='text-sm font-medium'>Munich, DE</span>
                </li> */}
              </ul>
            </motion.div>
          </div>

          {/* Newsletter - Stacked or hidden on very small if needed, but keeping it compact */}
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            transition={{ delay: 0.3 }}
            className='space-y-4'
          >
            <h4 className='text-sm font-black uppercase tracking-widest text-foreground'>Intelligence</h4>
            <p className='text-sm text-muted-foreground font-medium'>Monthly market reports & rate alerts.</p>
            <form className='flex gap-2' onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email" 
                className='flex-1 h-10 px-4 rounded-xl bg-secondary border-none text-xs outline-none focus:ring-1 focus:ring-accent transition-all'
              />
              <button className='h-10 w-10 flex items-center justify-center bg-primary text-primary-foreground rounded-xl shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all'>
                <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className='mt-12 sm:mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-6'>
          <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-widest'>
            © {new Date().getFullYear()} Baufiking Ecosystem.
          </p>
          <div className='flex gap-8'>
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
