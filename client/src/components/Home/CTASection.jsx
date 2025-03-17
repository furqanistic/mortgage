import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building,
  Calendar,
  CheckCircle,
  Star,
  Trophy,
} from 'lucide-react'
import React from 'react'

const PremiumCTA = () => {
  return (
    <section className='relative bg-[#155FA0] py-20 overflow-hidden'>
      {/* Abstract Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <svg
          className='w-full h-full'
          viewBox='0 0 100 100'
          preserveAspectRatio='none'
        >
          <path
            d='M0,0 L100,0 L100,100 L0,100 Z'
            fill='#71C8DC'
            fillRule='evenodd'
          />
          <path
            d='M0,50 Q25,0 50,50 T100,50'
            stroke='#51A0D0'
            strokeWidth='0.5'
            fill='none'
          />
          <path
            d='M0,60 Q25,10 50,60 T100,60'
            stroke='#51A0D0'
            strokeWidth='0.5'
            fill='none'
          />
          <path
            d='M0,70 Q25,20 50,70 T100,70'
            stroke='#51A0D0'
            strokeWidth='0.5'
            fill='none'
          />
        </svg>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        <div className='grid lg:grid-cols-2 gap-12 items-center'>
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='text-white space-y-8'
          >
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm'>
              <Star className='w-5 h-5 text-[#71C8DC]' />
              <span className='text-sm font-medium'>
                Rated 4.9/5 by our clients
              </span>
            </div>

            <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight'>
              Begin Your <br />
              <span className='text-[#71C8DC]'>Home Journey</span>
              <br /> Today
            </h2>

            <p className='text-lg text-white/80 max-w-lg'>
              Experience the future of home buying with our AI-powered platform.
              Smart decisions, seamless process, and expert guidance at every
              step.
            </p>

            {/* Trust Indicators */}
            <div className='grid grid-cols-3 gap-8 pt-8 border-t border-white/10'>
              {[
                { value: '15,000+', label: 'Happy Clients' },
                { value: '€40M+', label: 'Money Saved' },
                { value: '98%', label: 'Success Rate' },
              ].map((stat, index) => (
                <div key={index} className='text-center'>
                  <p className='text-2xl md:text-3xl font-bold text-[#71C8DC]'>
                    {stat.value}
                  </p>
                  <p className='text-sm text-white/70'>{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className='relative'
          >
            <div className='absolute top-0 right-0 w-72 h-72 bg-[#71C8DC] rounded-full blur-3xl opacity-20 -z-10' />

            <div className='grid gap-6'>
              {[
                {
                  icon: Building,
                  title: 'AI-Powered Property Matching',
                  description:
                    'Find your perfect home with our intelligent matching system',
                  highlight: '94% Match Rate',
                },
                {
                  icon: Trophy,
                  title: 'Expert Negotiation Support',
                  description:
                    'Get the best deal with our professional negotiation team',
                  highlight: '€45k Avg. Savings',
                },
                {
                  icon: CheckCircle,
                  title: 'End-to-End Support',
                  description:
                    'Guidance from property search to final handover',
                  highlight: '100% Coverage',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className='group'
                >
                  <div className='bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/15 transition-all duration-300'>
                    <div className='flex items-start gap-4'>
                      <div className='p-3 rounded-xl bg-[#71C8DC]/20'>
                        <feature.icon className='w-6 h-6 text-[#71C8DC]' />
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-xl font-semibold text-white mb-2'>
                          {feature.title}
                        </h3>
                        <p className='text-white/70 mb-3'>
                          {feature.description}
                        </p>
                        <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#71C8DC]/20 text-[#71C8DC] text-sm font-medium'>
                          {feature.highlight}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default PremiumCTA
