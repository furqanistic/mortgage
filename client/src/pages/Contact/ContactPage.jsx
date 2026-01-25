// File: client/src/pages/Contact/ContactPage.jsx
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
import { useState } from 'react'

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
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className='min-h-screen bg-background transition-colors duration-500'>
      <Navbar />
      
      {/* Hero Section */}
      <section className='pt-24 pb-16 md:pt-32 md:pb-24 px-6 md:px-10'>
        <div className='max-w-7xl mx-auto'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='text-center space-y-10'
          >
            <motion.div variants={itemVariants} className='inline-flex items-center gap-3 px-6 py-2 rounded-full bg-accent/10 border border-accent/20'>
              <MessageSquare className='w-4 h-4 text-accent' />
              <span className='text-sm font-semibold tracking-wide text-accent uppercase'>
                We&apos;re Here to Help
              </span>
            </motion.div>

            <motion.h1 variants={itemVariants} className='text-4xl sm:text-5xl md:text-7xl font-bold font-heading text-foreground leading-tight'>
              Let&apos;s Start Your{' '}
              <span className='text-accent'>Journey</span>
            </motion.h1>

            <motion.p variants={itemVariants} className='text-xl text-muted-foreground max-w-2xl mx-auto font-body leading-relaxed'>
              Have questions about buying a home in Germany? Our team of
              experts is here to guide you every step of the way.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Options */}
      <section className='py-16 md:py-24 px-6 md:px-10 bg-background'>
        <div className='max-w-7xl mx-auto'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='grid md:grid-cols-3 gap-6 md:gap-10'
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
                className='bg-card dark:bg-[#080808] p-6 md:p-10 rounded-3xl border border-border/50 shadow-xl hover:border-accent/40 transition-all duration-300 group'
              >
                <div className='p-3 md:p-4 rounded-2xl bg-accent/10 inline-block mb-4 md:mb-8 transform group-hover:scale-110 transition-transform'>
                  <contact.icon className='w-6 h-6 md:w-8 md:h-8 text-accent' />
                </div>
                <h3 className='text-2xl font-bold font-heading text-foreground dark:text-white mb-2 md:mb-4'>
                  {contact.title}
                </h3>
                <p className='text-lg text-muted-foreground dark:text-gray-400 mb-2 md:mb-4 font-body'>
                  {contact.info}
                </p>
                <p className='text-sm font-semibold text-accent uppercase tracking-wider font-body'>
                  {contact.action}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Form & Info Section */}
      <section className='py-16 md:py-32 px-6 md:px-10 bg-background'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-24'>
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='space-y-12'
            >
              <h2 className='text-4xl font-bold font-heading text-foreground'>
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className='space-y-8'>
                <div className='grid md:grid-cols-2 gap-8'>
                  <div className='space-y-3'>
                    <label className='text-sm font-semibold text-muted-foreground ml-1'>
                      Name
                    </label>
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      placeholder='Your name'
                      className='w-full px-6 py-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-accent transition-all outline-none'
                      required
                    />
                  </div>
                  <div className='space-y-3'>
                    <label className='text-sm font-semibold text-muted-foreground ml-1'>
                      Email
                    </label>
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='your@email.com'
                      className='w-full px-6 py-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-accent transition-all outline-none'
                      required
                    />
                  </div>
                </div>
                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-muted-foreground ml-1'>
                    Phone
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder='+49 ...'
                    className='w-full px-6 py-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-accent transition-all outline-none'
                  />
                </div>
                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-muted-foreground ml-1'>
                    Subject
                  </label>
                  <input
                    type='text'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder='How can we help?'
                    className='w-full px-6 py-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-accent transition-all outline-none'
                    required
                  />
                </div>
                <div className='space-y-3'>
                  <label className='text-sm font-semibold text-muted-foreground ml-1'>
                    Message
                  </label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    placeholder='Tell us more about your requirements...'
                    rows={6}
                    className='w-full px-6 py-4 rounded-2xl bg-muted border-none focus:ring-2 focus:ring-accent transition-all outline-none resize-none'
                    required
                  />
                </div>
                <Button
                  type='submit'
                  className='bg-accent hover:bg-accent/90 text-accent-foreground h-12 md:h-16 px-6 md:px-10 rounded-2xl w-full text-base md:text-lg font-bold shadow-lg shadow-accent/20 transition-all hover:scale-[1.02]'
                >
                  Send Message
                  <Send className='w-5 h-5 ml-3' />
                </Button>
              </form>
            </motion.div>

            {/* Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className='space-y-10'
            >
              <div className='bg-card dark:bg-[#080808] p-10 rounded-3xl border border-border/50 shadow-xl'>
                <h3 className='text-2xl font-bold font-heading text-foreground dark:text-white mb-8'>
                  Office Hours
                </h3>
                <div className='space-y-8'>
                  {[
                    { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                    { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                    { day: 'Sunday', hours: 'Closed' },
                  ].map((schedule, index) => (
                    <div key={index} className='flex items-start gap-6'>
                      <div className='p-3 rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20'>
                        <Clock className='w-6 h-6 text-accent' />
                      </div>
                      <div>
                        <p className='text-lg font-bold text-foreground dark:text-white'>
                          {schedule.day}
                        </p>
                        <p className='text-muted-foreground dark:text-gray-400 font-body'>
                          {schedule.hours}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='bg-primary/5 p-10 rounded-3xl border border-border shadow-2xl relative overflow-hidden group'>
                <div className='absolute right-0 top-0 w-32 h-32 bg-accent/10 blur-3xl rounded-full' />
                <h3 className='text-2xl font-bold font-heading text-foreground mb-6'>
                  Book a Consultation
                </h3>
                <p className='text-muted-foreground mb-10 text-lg font-body leading-relaxed'>
                  Schedule a one-on-one consultation with our property experts
                  to discuss your home buying journey.
                </p>
                <Button
                  className='bg-accent hover:bg-accent/90 text-accent-foreground h-14 px-8 rounded-2xl w-full text-base font-bold transition-all'
                  onClick={() => {}}
                >
                  Schedule Now
                  <Calendar className='w-5 h-5 ml-3' />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className='py-16 md:py-24 px-6 md:px-10 bg-background'>
        <div className='max-w-7xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='rounded-[40px] overflow-hidden shadow-2xl border border-border/20'
          >
            <div className='aspect-square sm:aspect-video md:aspect-[21/9] w-full'>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.7433372844675!2d13.5842685!3d52.3569402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a838af000eba8b%3A0x8db91df7ade18b76!2sKr%C3%A4uterpl.%205%2C%2015732%20Schulzendorf%2C%20Germany!5e0!3m2!1sen!2s!4v1740498946518!5m2!1sen!2s'
                width='100%'
                height='100%'
                style={{ border: 0 }}
                allowFullScreen=''
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                className='w-full h-full grayscale dark:invert-[0.9] dark:hue-rotate-180 transition-all duration-700 hover:grayscale-0'
              ></iframe>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className='py-16 md:py-32 px-6 md:px-10 bg-background text-center'
      >
        <div className='max-w-4xl mx-auto space-y-10'>
          <h2 className='text-4xl md:text-6xl font-bold font-heading text-foreground'>
            Ready to Start Your Journey?
          </h2>
          <p className='text-xl text-muted-foreground font-body max-w-2xl mx-auto'>
            Take the first step towards your dream home today.
          </p>
          <Button
            className='bg-accent text-accent-foreground h-12 md:h-16 w-full sm:w-auto px-6 md:px-12 rounded-2xl text-base md:text-lg font-bold hover:scale-105 transition-all shadow-xl dark:shadow-accent/20'
            onClick={() => {}}
          >
            Get Started Now
            <ArrowRight className='w-5 h-5 ml-3' />
          </Button>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}

export default ContactPage
