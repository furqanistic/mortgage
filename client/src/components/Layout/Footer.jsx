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
    <footer className='bg-white text-gray-800 border-t border-gray-100'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {/* Company Info */}
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            variants={fadeInUpVariants}
            transition={{ duration: 0.5 }}
            className='space-y-4'
          >
            <img src='/Logo.svg' alt='Baufiking Logo' className='h-12 mb-6' />
            <p className='text-sm text-gray-600'>
              Simplifying home buying in Germany with expert guidance and
              AI-powered solutions.
            </p>
            <div className='flex space-x-4 mt-6'>
              {[Globe, Twitter, Instagram, Github].map((Icon, index) => (
                <motion.a
                  key={index}
                  href='#'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className='p-2 bg-gray-50 rounded-full hover:bg-[#155FA0] hover:text-white 
                           transition-all duration-300'
                >
                  <Icon className='w-5 h-5' />
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
            className='space-y-4'
          >
            <h3 className='text-lg font-semibold mb-4 text-[#155FA0]'>
              Quick Links
            </h3>
            <ul className='space-y-3'>
              {navItems.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  className='flex items-center space-x-2'
                >
                  <item.icon className='w-4 h-4 text-[#51A0D0]' />
                  <a
                    href={item.href}
                    className='text-sm hover:text-[#155FA0] transition-colors'
                  >
                    {item.label}
                  </a>
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
            className='space-y-4'
          >
            <h3 className='text-lg font-semibold mb-4 text-[#155FA0]'>
              Contact Us
            </h3>
            <ul className='space-y-3'>
              <li className='flex items-center space-x-3'>
                <Phone className='w-4 h-4 text-[#51A0D0]' />
                <span className='text-sm text-gray-600'>+4915171618082</span>
              </li>
              <li className='flex items-center space-x-3'>
                <Mail className='w-4 h-4 text-[#51A0D0]' />
                <span className='text-sm text-gray-600'>
                  ravinder.singh@baufiking.de
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
            className='space-y-4'
          >
            <h3 className='text-lg font-semibold mb-4 text-[#155FA0]'>
              Stay Updated
            </h3>
            <p className='text-sm text-gray-600 mb-4'>
              Subscribe to our newsletter for the latest updates and insights.
            </p>
            <form className='space-y-3'>
              <input
                type='email'
                placeholder='Enter your email'
                className='w-full px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 
                         focus:outline-none focus:border-[#155FA0] transition-colors
                         placeholder-gray-400 text-sm'
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full px-4 py-2 bg-[#155FA0] text-white rounded-lg
                         hover:bg-[#51A0D0] transition-colors text-sm font-medium'
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
          className='border-t border-gray-100 mt-12 pt-8 text-center text-sm text-gray-500'
        >
          <p>© {new Date().getFullYear()} Baufiking. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
