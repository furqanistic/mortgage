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
      <div className='bg-white min-h-screen'>
        {/* Hero Section */}
        <section className='relative pt-24 pb-16 overflow-hidden'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#155FA0]/5 to-transparent'
          />

          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='text-center max-w-3xl mx-auto'
            >
              <motion.div variants={itemVariants} className='space-y-6'>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#155FA0]/5 mb-6'
                >
                  <MessageSquare className='w-4 h-4 text-[#155FA0]' />
                  <span className='text-sm font-medium text-[#155FA0]'>
                    We're Here to Help
                  </span>
                </motion.div>

                <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
                  Let's Start Your
                  <span className='text-[#155FA0]'> Journey</span>
                </h1>

                <p className='text-lg text-gray-600'>
                  Have questions about buying a home in Germany? Our team of
                  experts is here to guide you every step of the way.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Contact Options */}
        <section className='py-16 bg-gray-50'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              className='grid md:grid-cols-3 gap-8'
            >
              {[
                {
                  icon: Phone,
                  title: 'Call Us',
                  info: '+4915171618082',
                  action: 'Available 24/7',
                },
                {
                  icon: Mail,
                  title: 'Email Us',
                  info: 'ravinder.singh@baufiking.de',
                  action: 'We reply within 24 hours',
                },
                {
                  icon: MapPin,
                  title: 'Visit Us',
                  info: 'Berlin, Germany',
                  action: 'Book an appointment',
                },
              ].map((contact, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className='bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all'
                >
                  <div className='p-3 rounded-xl bg-[#155FA0]/10 inline-block mb-4'>
                    <contact.icon className='w-6 h-6 text-[#155FA0]' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-2'>
                    {contact.title}
                  </h3>
                  <p className='text-gray-600 mb-2'>{contact.info}</p>
                  <p className='text-sm text-[#155FA0]'>{contact.action}</p>
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
