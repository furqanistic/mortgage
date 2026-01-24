import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Calendar,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react'
import React, { useState } from 'react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <>
      <Navbar />
      <div className='bg-background min-h-screen transition-colors duration-300'>
        {/* Hero Section */}
        <section className='relative pt-32 pb-24 overflow-hidden'>
          {/* Subtle decoration */}
          <div className='absolute inset-0 pointer-events-none'>
            <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[100px]" />
            <div className="absolute inset-0 opacity-[0.02]" 
                 style={{ backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`, backgroundSize: '48px 48px' }} 
            />
          </div>
          
          <div className='max-w-7xl mx-auto px-6 lg:px-12 relative z-10'>
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='text-center max-w-4xl mx-auto space-y-8'
            >
              <motion.div variants={itemVariants} className='space-y-8'>
                <div className='inline-flex items-center gap-3 px-4 py-2 bg-secondary/40 backdrop-blur-sm rounded-full border border-border/40 shadow-sm'>
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className='text-xs font-bold text-primary/70 tracking-[0.2em] uppercase font-body'>
                    Global Support & Guidance
                  </span>
                </div>

                <h1 className='text-6xl md:text-7xl lg:text-8xl font-bold font-heading text-primary leading-[0.95] tracking-tight'>
                   Let&apos;s Start Your <br />
                   <span className='text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary to-accent relative'>
                     Journey Home
                   </span>
                </h1>

                <p className='text-xl md:text-2xl text-muted-foreground/80 max-w-3xl mx-auto leading-relaxed font-body'>
                  Have questions about your mortgage possibilities in Germany? Our elite team of advisors is standing by to provide the clarity you deserve.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Options */}
        <section className='py-24 bg-background relative border-y border-border/20'>
          <div className='max-w-7xl mx-auto px-6 lg:px-12'>
            <motion.div
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              className='grid md:grid-cols-3 gap-10'
            >
              {[
                {
                  icon: Phone,
                  title: 'Direct Call',
                  info: '+49 151 71618082',
                  action: 'Speak with an Expert',
                  color: 'primary'
                },
                {
                  icon: Mail,
                  title: 'Email Advice',
                  info: 'ravinder.singh@baufiking.de',
                  action: 'Guaranteed 24h Response',
                  color: 'accent'
                },
                {
                  icon: MapPin,
                  title: 'Visit Studio',
                  info: 'Berlin, Germany',
                  action: 'Schedule a Visit',
                  color: 'primary'
                },
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className='group bg-card p-10 rounded-[2.5rem] border border-border hover:border-accent/40 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500'
                >
                  <div className={`p-4 rounded-2xl bg-secondary/50 inline-block mb-8 group-hover:bg-accent/10 transition-colors`}>
                    <contact.icon className={`w-8 h-8 text-primary group-hover:text-accent font-bold`} />
                  </div>
                  <h3 className='text-2xl font-bold font-heading text-primary mb-4'>
                    {contact.title}
                  </h3>
                  <p className='text-lg font-medium text-foreground/80 mb-2 truncate group-hover:text-primary transition-colors'>{contact.info}</p>
                  <p className='text-sm font-bold text-accent uppercase tracking-[0.15em]'>{contact.action}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className='py-20'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              className='grid md:grid-cols-2 gap-16'
            >
              {/* Form */}
              <motion.div variants={itemVariants}>
                <h2 className='text-3xl font-bold text-gray-900 mb-8'>
                  Send Us a Message
                </h2>
                <form onSubmit={handleSubmit} className='space-y-6'>
                  <div className='grid grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Name
                      </label>
                      <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#155FA0] focus:border-transparent outline-none transition-all'
                        required
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Email
                      </label>
                      <input
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#155FA0] focus:border-transparent outline-none transition-all'
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Phone
                    </label>
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#155FA0] focus:border-transparent outline-none transition-all'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Subject
                    </label>
                    <input
                      type='text'
                      name='subject'
                      value={formData.subject}
                      onChange={handleChange}
                      className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#155FA0] focus:border-transparent outline-none transition-all'
                      required
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Message
                    </label>
                    <textarea
                      name='message'
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#155FA0] focus:border-transparent outline-none transition-all'
                      required
                    />
                  </div>
                  <Button
                    type='submit'
                    className='bg-[#155FA0] text-white hover:bg-[#51A0D0] h-12 px-6 rounded-full w-full'
                  >
                    Send Message
                    <Send className='w-4 h-4 ml-2' />
                  </Button>
                </form>
              </motion.div>

              {/* Info */}
              <motion.div variants={itemVariants} className='space-y-8'>
                <div className='bg-[#155FA0]/5 p-8 rounded-2xl'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                    Office Hours
                  </h3>
                  <div className='space-y-4'>
                    {[
                      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                      { day: 'Sunday', hours: 'Closed' },
                    ].map((schedule, index) => (
                      <div key={index} className='flex items-center gap-4'>
                        <Clock className='w-5 h-5 text-[#155FA0]' />
                        <div>
                          <p className='font-medium text-gray-900'>
                            {schedule.day}
                          </p>
                          <p className='text-gray-600'>{schedule.hours}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='bg-[#155FA0]/5 p-8 rounded-2xl'>
                  <h3 className='text-xl font-semibold text-gray-900 mb-4'>
                    Book a Consultation
                  </h3>
                  <p className='text-gray-600 mb-6'>
                    Schedule a one-on-one consultation with our property experts
                    to discuss your home buying journey.
                  </p>
                  <Button
                    className='bg-[#155FA0] text-white hover:bg-[#51A0D0] h-12 px-6 rounded-full w-full'
                    onClick={() => {}}
                  >
                    Schedule Now
                    <Calendar className='w-4 h-4 ml-2' />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Map Section */}
        <section className='py-16 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='rounded-2xl overflow-hidden shadow-lg'
            >
              <div className='aspect-[21/9] w-full'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.7433372844675!2d13.5842685!3d52.3569402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a838af000eba8b%3A0x8db91df7ade18b76!2sKr%C3%A4uterpl.%205%2C%2015732%20Schulzendorf%2C%20Germany!5e0!3m2!1sen!2s!4v1740498946518!5m2!1sen!2s'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen=''
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  className='w-full h-full'
                ></iframe>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='py-20 bg-[#155FA0]'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <motion.div className='max-w-2xl mx-auto'>
              <h2 className='text-3xl font-bold text-white mb-6'>
                Ready to Start Your Journey?
              </h2>
              <p className='text-white/80 mb-8'>
                Take the first step towards your dream home today.
              </p>
              <Button
                className='bg-white text-[#155FA0] hover:bg-gray-100 h-12 px-6 rounded-full'
                onClick={() => {}}
              >
                Get Started Now
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  )
}

export default ContactPage
