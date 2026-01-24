// File: client/src/components/layout/Footer.jsx
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
    { icon: Home, label: 'Home', href: '/' },
    { icon: Calculator, label: 'Calculate', href: '/calculate' },
    { icon: Building, label: 'Properties', href: '/properties' },
    { icon: Users, label: 'Partners', href: '/partners' },
    { icon: MessageCircle, label: 'Contact', href: '/contact' },
  ]

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <footer className='bg-white dark:bg-card border-t border-border'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12'>
          {/* Company Info */}
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.5 }}
            className='space-y-6'
          >
            <div className="flex items-center gap-2">
                <img src='/Logo.svg' alt='Baufiking Logo' className='h-10' />
            </div>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              Simplifying home buying in Germany with expert guidance and
              premium financial solutions.
            </p>
            <div className='flex space-x-3'>
              {[Globe, Twitter, Instagram, Github].map((Icon, index) => (
                <motion.a
                  key={index}
                  href='#'
                  whileHover={{ scale: 1.1, backgroundColor: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                  whileTap={{ scale: 0.95 }}
                  className='p-2 bg-secondary text-secondary-foreground rounded-full transition-all duration-300'
                >
                  <Icon className='w-4 h-4' />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='space-y-6'
          >
            <h3 className='text-lg font-bold font-heading text-primary'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              {navItems.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className='flex items-center'
                >
                  <Link
                    to={item.href}
                    className='text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2'
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent/50" />
                    {item.label}
                      </Link>
                </motion.li>
                  ))}
                </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='space-y-6'
          >
            <h3 className='text-lg font-bold font-heading text-primary'>
              Contact Us
            </h3>
            <ul className='space-y-4'>
              <li className='flex items-start space-x-3'>
                <Phone className='w-5 h-5 text-accent mt-0.5' />
                <span className='text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer'>
                    +49 151 7161 8082
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                <Mail className='w-5 h-5 text-accent mt-0.5' />
                <span className='text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer'>
                  ravinder.singh@baufiking.de
                </span>
              </li>
              <li className='flex items-start space-x-3'>
                 <Building className='w-5 h-5 text-accent mt-0.5' />
                 <span className='text-sm text-muted-foreground'>
                    München, Germany
                 </span>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.5, delay: 0.6 }}
            className='space-y-6'
          >
            <h3 className='text-lg font-bold font-heading text-primary'>
              Stay Updated
            </h3>
            <p className='text-sm text-muted-foreground'>
              Subscribe to our newsletter for the latest market insights.
            </p>
            <form className='space-y-3' onSubmit={(e) => e.preventDefault()}>
              <input
                type='email'
                placeholder='Enter your email'
                className='w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border 
                         focus:outline-none focus:ring-1 focus:ring-primary transition-all
                         placeholder-muted-foreground text-sm'
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl
                         hover:bg-primary/90 transition-colors text-sm font-semibold shadow-lg shadow-primary/20'
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
          </div>

        {/* Bottom Bar */}
        <motion.div
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          variants={fadeInUpVariants}
          transition={{ duration: 0.5, delay: 0.8 }}
          className='border-t border-border/60 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground'
        >
          <p>© {new Date().getFullYear()} Baufiking. All rights reserved.</p>
          <div className="flex items-center gap-6">
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
