import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Building,
  ChevronRight,
  Sparkles,
  Star,
  Target,
  Users,
} from 'lucide-react'
import React from 'react'

const AboutPage = () => {
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
              className='grid md:grid-cols-2 gap-12 items-center'
            >
              <motion.div variants={itemVariants} className='space-y-6'>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#155FA0]/5'
                >
                  <Star className='w-4 h-4 text-[#155FA0]' />
                  <span className='text-sm font-medium text-[#155FA0]'>
                    Trusted by 15,000+ Homebuyers
                  </span>
                </motion.div>

                <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900'>
                  Making Home
                  <span className='text-[#155FA0]'> Ownership</span>
                  <br />
                  Simple
                </h1>

                <p className='text-lg text-gray-600 max-w-lg'>
                  We combine AI innovation with expert guidance to transform
                  your German home buying journey into a seamless experience.
                </p>

                <motion.div
                  variants={itemVariants}
                  className='flex flex-col sm:flex-row gap-4'
                >
                  <Button
                    className='bg-[#155FA0] text-white hover:bg-[#51A0D0] h-12 px-6 rounded-full'
                    onClick={() => {}}
                  >
                    Start Your Journey
                    <ChevronRight className='w-4 h-4 ml-2' />
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants} className='relative'>
                <div className='aspect-square rounded-3xl overflow-hidden bg-[#155FA0]/5 p-8'>
                  <img
                    src='/Logo.svg'
                    alt='About Baufiking'
                    className='w-full h-full object-cover rounded-2xl'
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className='absolute -bottom-6 -right-6 bg-white shadow-lg p-6 rounded-2xl'
                  >
                    <div className='flex items-center gap-3'>
                      <Award className='w-10 h-10 text-[#155FA0]' />
                      <div>
                        <p className='text-sm font-semibold text-gray-900'>
                          Top Rated
                        </p>
                        <p className='text-xs text-gray-500'>
                          in Property Tech
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='py-16 bg-gray-50'
        >
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
              {[
                { value: '1,000+', label: 'Happy Clients' },
                { value: '€10m+', label: 'Properties Handled' },
                { value: '98%', label: 'Success Rate' },
                { value: '4.9/5', label: 'Client Rating' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className='text-center'
                >
                  <p className='text-3xl font-bold text-[#155FA0]'>
                    {stat.value}
                  </p>
                  <p className='text-sm text-gray-600'>{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Mission Section */}
        <section className='py-20'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <motion.div
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              className='grid md:grid-cols-2 gap-16 items-center'
            >
              <motion.div variants={itemVariants} className='space-y-6'>
                <h2 className='text-3xl font-bold text-gray-900'>
                  Our Mission
                </h2>
                <p className='text-gray-600'>
                  We believe that everyone deserves their dream home in Germany.
                  Through our AI-powered platform and expert guidance, we're
                  making the complex journey of home buying accessible and
                  stress-free for all.
                </p>
                <div className='space-y-4'>
                  {[
                    {
                      icon: Target,
                      title: 'Smart Matching',
                      description: 'AI-powered property recommendations',
                    },
                    {
                      icon: Users,
                      title: 'Expert Support',
                      description: '24/7 guidance throughout your journey',
                    },
                    {
                      icon: Building,
                      title: 'Complete Coverage',
                      description: 'From search to final handover',
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className='flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-all'
                    >
                      <div className='p-2 rounded-lg bg-[#155FA0]/10'>
                        <feature.icon className='w-5 h-5 text-[#155FA0]' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900'>
                          {feature.title}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className='relative'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-4'>
                    <div className='aspect-square rounded-2xl overflow-hidden'>
                      <img
                        src='https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1200'
                        alt='Feature 1'
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='aspect-square rounded-2xl overflow-hidden'>
                      <img
                        src='https://images.pexels.com/photos/8082319/pexels-photo-8082319.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load'
                        alt='Feature 2'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                  <div className='space-y-4 pt-8'>
                    <div className='aspect-square rounded-2xl overflow-hidden'>
                      <img
                        src='https://images.pexels.com/photos/5644337/pexels-photo-5644337.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load'
                        alt='Feature 3'
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div className='aspect-square rounded-2xl overflow-hidden'>
                      <img
                        src='https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1200'
                        alt='Feature 4'
                        className='w-full h-full object-cover'
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
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
            <motion.div
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
              className='max-w-2xl mx-auto'
            >
              <motion.h2
                variants={itemVariants}
                className='text-3xl font-bold text-white mb-6'
              >
                Ready to Find Your Dream Home?
              </motion.h2>
              <motion.p variants={itemVariants} className='text-white/80 mb-8'>
                Let's start your journey to homeownership together.
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button
                  className='bg-white text-[#155FA0] hover:bg-gray-100 h-12 px-6 rounded-full'
                  onClick={() => {}}
                >
                  Schedule a Consultation
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      </div>
      <Footer />
    </>
  )
}

export default AboutPage
