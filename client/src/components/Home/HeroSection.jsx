import { motion } from 'framer-motion'
import {
  ArrowRight,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Key,
  Shield,
  Star,
  Target,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

// shadcn UI components
import { Button } from '@/components/ui/button'
import ConsultationForm from '../AddOns/ConsultationForm'

// Custom components

const BackgroundPattern = () => (
  <div className='absolute inset-0 pointer-events-none overflow-hidden'>
    <div
      className='absolute inset-0'
      style={{
        backgroundImage:
          'radial-gradient(circle at 4px 4px, #155FA0 1px, transparent 0)',
        backgroundSize: '48px 48px',
        opacity: 0.03,
      }}
    />
    <svg
      className='absolute top-0 right-0 w-1/3 h-1/3 text-[#71C8DC] opacity-5'
      viewBox='0 0 200 200'
    >
      <path
        fill='currentColor'
        d='M43.5,-67.2C57.3,-61.3,70.1,-51.1,77.8,-37.5C85.5,-23.9,88.1,-7,85.5,9.2C82.9,25.4,75,40.8,63.5,51.7C52,62.6,36.8,69,21.4,72.1C6,75.2,-9.7,75,-24.7,71.2C-39.7,67.4,-54,60,-65.1,48.3C-76.2,36.6,-84.1,20.6,-85.1,3.9C-86.1,-12.8,-80.2,-30.2,-69.4,-43.5C-58.6,-56.8,-42.8,-66,-27.8,-70.9C-12.8,-75.8,1.4,-76.4,14.8,-73.2C28.2,-70,41.7,-63,43.5,-67.2Z'
        transform='translate(100 100)'
      />
    </svg>
    <svg
      className='absolute bottom-0 left-0 w-1/4 h-1/4 text-[#51A0D0] opacity-5'
      viewBox='0 0 200 200'
    >
      <path
        fill='currentColor'
        d='M39.9,-65.7C51.5,-58.5,60.8,-47.8,67.8,-35.2C74.9,-22.7,79.7,-8.3,78.3,5.4C76.9,19.1,69.3,32.1,59.8,44.4C50.3,56.7,38.9,68.4,24.8,74.6C10.7,80.8,-6.2,81.6,-20.9,76.7C-35.6,71.7,-48.2,61,-58.3,48.2C-68.4,35.4,-76,20.5,-78.1,4.5C-80.2,-11.5,-76.7,-28.7,-67.8,-42.8C-58.9,-56.9,-44.6,-67.9,-30.2,-74C-15.7,-80.1,-1,-81.3,12.1,-77.5C25.1,-73.7,38.1,-65,50.2,-57.4C62.3,-49.8,73.5,-43.4,77.9,-33.8C82.3,-24.2,79.9,-11.4,75.7,-0.2C71.5,11,65.5,20.7,58.4,29.5C51.4,38.2,43.2,46.1,33.2,51.4C23.1,56.8,11.3,59.7,-1.4,61.9C-14.1,64.1,-27.8,65.6,-39.8,62C-51.7,58.3,-61.9,49.4,-69.7,38.1C-77.5,26.8,-82.9,13.1,-82.1,0C-81.4,-13.1,-74.6,-26.6,-67.1,-40.4C-59.6,-54.2,-51.5,-68.3,-39.7,-75.6C-28,-83,-14,-83.5,-0.3,-83C13.3,-82.6,26.5,-81.3,37.7,-74.2C48.9,-67.2,58,-54.4,65.5,-41.1C73,-27.8,78.9,-14.3,79.5,-0.3C80,-14.8,75.3,-29.1,66.6,-39.8C57.9,-50.5,45.2,-57.5,32.7,-63.9C20.2,-70.3,7.8,-76.1,-4.3,-81.1C-16.4,-86.2,-31.9,-90.5,-43.8,-85.8C-55.7,-81.1,-64,-67.4,-69.8,-53.3C-75.7,-39.2,-79.1,-24.8,-77.3,-11.5C-75.5,1.8,-68.5,14,-62.9,27.6C-57.3,41.1,-53.1,56,-43.8,67.1C-34.5,78.3,-20.1,85.9,-5.3,89.7C9.6,93.4,24.8,93.2,35.5,85.8C46.2,78.5,52.3,63.9,61.1,51.3C69.9,38.7,81.3,28,84.5,15.4C87.6,2.7,82.4,-11.9,74.1,-22.8C65.8,-33.7,54.3,-40.9,44.3,-51.7C34.2,-62.6,25.5,-77.1,13.6,-82.4C1.7,-87.7,-13.4,-83.9,-25.4,-76.5C-37.4,-69.1,-46.3,-58.2,-53.7,-46.6C-61.2,-35,-67.3,-22.8,-69.7,-9.9C-72.1,2.9,-70.9,16.4,-65.5,27.5C-60.1,38.6,-50.4,47.4,-39.3,52C-28.1,56.6,-15.4,56.9,-1.8,58.9C11.9,60.9,25.9,64.5,37.7,61.5C49.5,58.5,59.1,48.8,67.1,37.4C75.2,26.1,81.7,13,81.3,0.2C80.9,-12.5,73.5,-25,64.5,-35.1C55.5,-45.1,44.7,-52.7,33.8,-59.9C22.8,-67.1,11.4,-73.8,-0.9,-75.1C-13.2,-76.5,-26.3,-72.6,-39.3,-66.6C-52.3,-60.5,-65.1,-52.5,-72.7,-40.6C-80.3,-28.8,-82.7,-13.2,-78.4,-0.2C-74.1,12.9,-63.1,23.2,-53.2,34.3C-43.2,45.4,-34.4,57.3,-23.3,65C-12.1,72.7,1.3,76.2,15.1,75C28.9,73.7,43,67.7,52.8,58.1C62.6,48.4,68.2,35.1,67.2,22.4C66.3,9.7,58.8,-2.4,51.9,-12C45,-21.7,38.6,-28.9,31.5,-40.2C24.3,-51.5,16.2,-66.8,3.9,-71.8C-8.4,-76.8,-24.9,-71.6,-41.5,-66.6C-58.1,-61.5,-74.9,-56.7,-82.8,-45.6C-90.8,-34.4,-89.9,-17,-86.1,-1.8C-82.3,13.4,-75.6,27,-66.4,37.8C-57.2,48.7,-45.5,56.8,-33.6,67.4C-21.7,78,-10.6,91,3.5,95.9C17.6,100.7,34.7,97.4,49.7,89.9C64.6,82.4,77.5,70.7,78.9,56.9C80.4,43.1,70.3,27.2,63,13.8C55.7,0.4,51.2,-10.5,47.4,-21.8C43.6,-33.1,40.5,-44.7,33.1,-55.5C25.7,-66.3,13.8,-76.2,0.8,-77.3C-12.2,-78.3,-25.5,-70.5,-39.8,-63.1C-54.1,-55.8,-69.6,-48.9,-78.2,-37.3C-86.7,-25.6,-88.3,-9.1,-82.9,4.5C-77.5,18.1,-65.1,28.8,-56.7,43.7C-48.2,58.6,-43.7,77.7,-32.2,85.8C-20.7,93.9,-2.3,91.1,16.1,88.1C34.5,85.1,53,82,62.8,70.7C72.7,59.4,73.8,40,74.7,23.1C75.5,6.3,76,8,-15.8,-52.8Z'
        transform='translate(100 100)'
      />
    </svg>
  </div>
)

const FloatingAnimation = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      delay,
      duration: 0.8,
      y: {
        duration: 2.5,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    }}
  >
    {children}
  </motion.div>
)

const HeroSection = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const openForm = () => setIsFormOpen(true)
  const closeForm = () => setIsFormOpen(false)

  return (
    <section className='relative min-h-screen bg-gradient-to-br from-white via-[#71C8DC]/5 to-[#51A0D0]/10 overflow-hidden'>
      <BackgroundPattern />
      <ConsultationForm isOpen={isFormOpen} onClose={closeForm} />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10'>
        <div className='grid lg:grid-cols-2 gap-16 items-center'>
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='space-y-8'
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='inline-flex items-center px-4 py-2 bg-[#155FA0]/10 text-[#155FA0] rounded-full'
            >
              <Key className='w-4 h-4 mr-2' />
              <span className='font-medium'>Your Path to Home Ownership</span>
              <div className='w-2 h-2 rounded-full bg-[#155FA0] ml-3 animate-pulse' />
            </motion.div>

            {/* Heading */}
            <motion.h1
              className='text-5xl sm:text-6xl lg:text-7xl font-bold'
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              initial='hidden'
              animate='visible'
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className='block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700'>
                Simplifying
              </span>
              <span className='block text-[#155FA0] mt-2'>Homeownership</span>
              <span className='block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 mt-2'>
                in Germany
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='text-xl text-gray-600 max-w-xl leading-relaxed'
            >
              Navigate the German property market with confidence. Our expert
              team handles everything from property search to financing, making
              your homeownership journey seamless and stress-free.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className='flex flex-col sm:flex-row gap-6 pt-6'
            >
              <Link to='/auth' className='group'>
                <Button
                  className='relative bg-[#155FA0] text-white px-8 py-6 rounded-lg 
        flex items-center justify-center text-lg font-medium
        overflow-hidden transition-all duration-300 shadow-md
        hover:shadow-xl group-hover:bg-[#51A0D0]'
                >
                  <span className='relative z-10 flex items-center'>
                    Get Started
                    <span className='ml-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-1'>
                      <ArrowRight className='w-4 h-4' />
                    </span>
                  </span>
                  <span className='absolute bottom-0 left-0 w-full h-1 bg-[#71C8DC] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left'></span>
                </Button>
              </Link>

              {/* Consultation button */}
              <Button
                variant='outline'
                onClick={openForm}
                className='group relative border-2 border-[#155FA0] text-[#155FA0] bg-white/80 backdrop-blur-sm
      px-8 py-6 rounded-lg flex items-center justify-center text-lg font-medium
      transition-all duration-300 shadow-sm hover:shadow-md hover:bg-[#EDF7FC]'
              >
                <span className='absolute inset-0 bg-[#71C8DC] opacity-0 group-hover:opacity-5 rounded-lg transition-opacity'></span>
                <Calendar className='mr-3 w-5 h-5 transition-transform group-hover:scale-110' />
                <span className='relative'>Book a Free Consultation</span>
                <span className='absolute -bottom-0.5 left-1/4 right-1/4 h-0.5 bg-[#155FA0] transform scale-x-0 group-hover:scale-x-100 transition-transform'></span>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className='pt-8 border-t border-gray-200'
            >
              <div className='grid grid-cols-3 gap-4'>
                <div className='flex flex-col items-center bg-white rounded-xl p-4 shadow-sm'>
                  <div className='p-2 bg-[#155FA0]/10 rounded-lg'>
                    <Users className='w-5 h-5 text-[#155FA0]' />
                  </div>
                  <div className='mt-2 text-center'>
                    <div className='font-semibold text-gray-900'>10,000+</div>
                    <div className='text-xs text-gray-600'>Happy Families</div>
                  </div>
                </div>
                <div className='flex flex-col items-center bg-white rounded-xl p-4 shadow-sm'>
                  <div className='p-2 bg-[#155FA0]/10 rounded-lg'>
                    <Shield className='w-5 h-5 text-[#155FA0]' />
                  </div>
                  <div className='mt-2 text-center'>
                    <div className='font-semibold text-gray-900'>100%</div>
                    <div className='text-xs text-gray-600'>Secure Process</div>
                  </div>
                </div>
                <div className='flex flex-col items-center bg-white rounded-xl p-4 shadow-sm'>
                  <div className='p-2 bg-[#155FA0]/10 rounded-lg'>
                    <Target className='w-5 h-5 text-[#155FA0]' />
                  </div>
                  <div className='mt-2 text-center'>
                    <div className='font-semibold text-gray-900'>
                      All Germany
                    </div>
                    <div className='text-xs text-gray-600'>Coverage</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Image & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='relative'
          >
            {/* Main Image Container */}
            <div className='relative h-[600px] rounded-3xl overflow-hidden shadow-2xl'>
              <div className='absolute inset-0 bg-gradient-to-t from-[#155FA0]/30 to-transparent' />
              <img
                src='https://images.pexels.com/photos/3933084/pexels-photo-3933084.jpeg?auto=compress&cs=tinysrgb&w=1200'
                alt='Happy family with new home'
                className='w-full h-full object-cover'
              />

              {/* Floating Elements */}
              <FloatingAnimation delay={0.2}>
                <div className='absolute top-8 left-8 bg-white rounded-2xl p-4 shadow-lg'>
                  <div className='flex items-center'>
                    <Star className='w-5 h-5 text-yellow-400 fill-current' />
                    <span className='ml-2 font-medium text-gray-900'>
                      4.9/5 Rating
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 mt-1'>
                    From 2,000+ Reviews
                  </p>
                </div>
              </FloatingAnimation>

              <FloatingAnimation delay={0.4}>
                <div className='absolute top-8 right-8 bg-white rounded-2xl p-4 shadow-lg'>
                  <div className='flex items-center'>
                    <CheckCircle className='w-5 h-5 text-[#155FA0]' />
                    <span className='ml-2 font-medium text-gray-900'>
                      Verified by
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 mt-1'>German Standards</p>
                </div>
              </FloatingAnimation>

              {/* Stats Card */}
              <div className='absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl'>
                <div className='grid grid-cols-3 gap-6'>
                  <div className='text-center'>
                    <div className='flex items-center justify-center mb-2'>
                      <Building className='w-6 h-6 text-[#155FA0]' />
                    </div>
                    <div className='text-2xl font-bold text-[#155FA0]'>95%</div>
                    <div className='text-sm text-gray-600'>Success Rate</div>
                  </div>
                  <div className='text-center border-x border-gray-200'>
                    <div className='flex items-center justify-center mb-2'>
                      <Users className='w-6 h-6 text-[#155FA0]' />
                    </div>
                    <div className='text-2xl font-bold text-[#155FA0]'>
                      15k+
                    </div>
                    <div className='text-sm text-gray-600'>
                      Properties Listed
                    </div>
                  </div>
                  <div className='text-center'>
                    <div className='flex items-center justify-center mb-2'>
                      <Clock className='w-6 h-6 text-[#155FA0]' />
                    </div>
                    <div className='text-2xl font-bold text-[#155FA0]'>
                      24/7
                    </div>
                    <div className='text-sm text-gray-600'>Expert Support</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
