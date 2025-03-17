import { Button } from '@/components/ui/button'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Euro,
  Heart,
  Home,
  MapPin,
  Star,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

const testimonials = [
  {
    id: 1,
    name: 'Sophie & Marc',
    role: 'First-time Buyers',
    location: 'Berlin',
    image:
      'https://images.pexels.com/photos/30778766/pexels-photo-30778766/free-photo-of-portrait-of-elderly-man-smiling.jpeg?auto=compress&cs=tinysrgb&w=1200',
    quote: 'Found our dream home in record time',
    story:
      'The AI-powered search understood exactly what we were looking for. We saved €45,000 on our purchase!',
    rating: 5,
    timeline: '3 weeks',
    propertyDetails: {
      type: 'Modern Loft',
      size: '120m²',
      savings: '€45,000',
      price: '€480,000',
      image:
        'https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  },
  {
    id: 2,
    name: 'Andreas & Lisa',
    role: 'Property Investors',
    location: 'Munich',
    image:
      'https://images.pexels.com/photos/13100116/pexels-photo-13100116.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load',
    quote: 'Simplified our investment journey',
    story:
      "Baufiking's market analysis helped us make an informed decision. The ROI has been exceptional.",
    rating: 5,
    timeline: '4 weeks',
    propertyDetails: {
      type: 'Luxury Apartment',
      size: '150m²',
      savings: '€62,000',
      price: '€750,000',
      image:
        'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  },
  {
    id: 3,
    name: 'Julia Weber',
    role: 'Single Homeowner',
    location: 'Hamburg',
    image:
      'https://images.pexels.com/photos/3783348/pexels-photo-3783348.jpeg?auto=compress&cs=tinysrgb&w=1200',
    quote: 'From dream to reality in weeks',
    story:
      'The mortgage calculator and AI advisor made everything crystal clear. Best decision ever!',
    rating: 5,
    timeline: '5 weeks',
    propertyDetails: {
      type: 'Garden House',
      size: '95m²',
      savings: '€38,000',
      price: '€420,000',
      image:
        'https://images.pexels.com/photos/206172/pexels-photo-206172.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  },
  {
    id: 4,
    name: 'Thomas Müller',
    role: 'Relocating Family',
    location: 'Frankfurt',
    image:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1200',
    quote: 'Perfect home for our growing family',
    story:
      'The platform helped us find a spacious home near schools and parks. The process was seamless!',
    rating: 5,
    timeline: '6 weeks',
    propertyDetails: {
      type: 'Family House',
      size: '200m²',
      savings: '€55,000',
      price: '€850,000',
      image:
        'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  },
  {
    id: 5,
    name: 'Elena Schmidt',
    role: 'Retiree',
    location: 'Stuttgart',
    image:
      'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1200',
    quote: 'Downsized with ease and comfort',
    story:
      'The AI recommendations matched my needs perfectly. I found a cozy apartment in a quiet neighborhood.',
    rating: 5,
    timeline: '2 weeks',
    propertyDetails: {
      type: 'Cozy Apartment',
      size: '75m²',
      savings: '€28,000',
      price: '€320,000',
      image:
        'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  },
  {
    id: 6,
    name: 'Lukas & Nina',
    role: 'Young Professionals',
    location: 'Cologne',
    image:
      'https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1200',
    quote: 'A modern home for our busy lives',
    story:
      'The platform’s filters and AI suggestions made it easy to find a stylish apartment close to work.',
    rating: 5,
    timeline: '3 weeks',
    propertyDetails: {
      type: 'City Apartment',
      size: '85m²',
      savings: '€30,000',
      price: '€380,000',
      image:
        'https://images.pexels.com/photos/439391/pexels-photo-439391.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  },
  {
    id: 7,
    name: 'Fatima Al-Mansoori',
    role: 'Expat',
    location: 'Düsseldorf',
    image:
      'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1200',
    quote: 'Settled into Germany with ease',
    story:
      'The platform guided me through the entire process, even as a foreigner. I feel at home now!',
    rating: 5,
    timeline: '4 weeks',
    propertyDetails: {
      type: 'Penthouse',
      size: '180m²',
      savings: '€70,000',
      price: '€920,000',
      image:
        'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  },
  {
    id: 8,
    name: 'Hans & Greta',
    role: 'Retired Couple',
    location: 'Bremen',
    image:
      'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg?auto=compress&cs=tinysrgb&w=1200',
    quote: 'Found our peaceful retirement home',
    story:
      'The AI system understood our need for a quiet, accessible home. We couldn’t be happier!',
    rating: 5,
    timeline: '5 weeks',
    propertyDetails: {
      type: 'Bungalow',
      size: '110m²',
      savings: '€40,000',
      price: '€450,000',
      image:
        'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  },
]

const BackgroundPattern = () => (
  <svg
    className='absolute inset-0 w-full h-full opacity-[0.03]'
    viewBox='0 0 100 100'
    preserveAspectRatio='none'
  >
    <pattern id='grid' width='10' height='10' patternUnits='userSpaceOnUse'>
      <path
        d='M 10 0 L 0 0 0 10'
        fill='none'
        stroke='currentColor'
        strokeWidth='0.5'
      />
    </pattern>
    <rect width='100' height='100' fill='url(#grid)' />
  </svg>
)

const SuccessStories = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isHovered) {
      const timer = setInterval(() => {
        paginate(1)
      }, 5000)
      return () => clearInterval(timer)
    }
  }, [isHovered])

  const paginate = (newDirection) => {
    setDirection(newDirection)
    setActiveIndex(
      (prevIndex) =>
        (prevIndex + newDirection + testimonials.length) % testimonials.length
    )
  }

  const current = testimonials[activeIndex]

  return (
    <div className='relative bg-gradient-to-br from-white via-[#71C8DC]/5 to-[#51A0D0]/10 py-24 overflow-hidden'>
      <BackgroundPattern />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-20'
        >
          <span className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#155FA0]/10 text-[#155FA0] font-medium mb-6'>
            <Heart className='w-4 h-4' /> Success Stories
          </span>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-[#155FA0] mb-6'>
            Dream Homes Found
          </h2>
          <p className='text-lg text-slate-600 max-w-2xl mx-auto'>
            Join our community of satisfied homeowners who discovered their
            perfect match
          </p>
        </motion.div>

        {/* Main Content */}
        <div
          className='relative'
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='grid lg:grid-cols-12 gap-8 lg:gap-12 items-center'
            >
              {/* Left Column - Property Image & Details */}
              <div className='lg:col-span-7 relative'>
                <motion.div
                  className='relative rounded-3xl overflow-hidden aspect-[4/3]'
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={current.propertyDetails.image}
                    alt='Property'
                    className='w-full h-full object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent' />

                  {/* Property Stats */}
                  <div className='absolute bottom-0 left-0 right-0 p-8'>
                    <div className='grid grid-cols-3 gap-4 text-white mb-4'>
                      <div className='bg-black/30 backdrop-blur-sm rounded-xl p-4'>
                        <Home className='w-5 h-5 mb-2' />
                        <p className='text-sm opacity-80'>Size</p>
                        <p className='font-semibold'>
                          {current.propertyDetails.size}
                        </p>
                      </div>
                      <div className='bg-black/30 backdrop-blur-sm rounded-xl p-4'>
                        <Euro className='w-5 h-5 mb-2' />
                        <p className='text-sm opacity-80'>Price</p>
                        <p className='font-semibold'>
                          {current.propertyDetails.price}
                        </p>
                      </div>
                      <div className='bg-black/30 backdrop-blur-sm rounded-xl p-4'>
                        <Clock className='w-5 h-5 mb-2' />
                        <p className='text-sm opacity-80'>Timeline</p>
                        <p className='font-semibold'>{current.timeline}</p>
                      </div>
                    </div>
                    <div className='inline-flex items-center bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 text-sm font-medium text-[#155FA0]'>
                      {current.propertyDetails.type} • {current.location}
                    </div>
                  </div>
                </motion.div>

                {/* Floating Achievement Badge */}
                <motion.div
                  className='absolute -top-6 -right-6 bg-[#155FA0] text-white p-4 rounded-2xl shadow-lg'
                  initial={{ rotate: -10 }}
                  animate={{ rotate: [0, -3, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Award className='w-6 h-6 mb-1' />
                  <p className='text-sm font-medium'>Saved</p>
                  <p className='text-xl font-bold'>
                    {current.propertyDetails.savings}
                  </p>
                </motion.div>
              </div>

              {/* Right Column - Testimonial */}
              <div className='lg:col-span-5'>
                <motion.div
                  className='bg-white rounded-3xl shadow-2xl p-8 lg:p-10'
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Profile */}
                  <div className='flex items-center gap-4 mb-8'>
                    <div className='relative'>
                      <img
                        src={current.image}
                        alt={current.name}
                        className='w-16 h-16 rounded-full object-cover ring-4 ring-[#71C8DC]/20'
                      />
                      <div className='absolute -bottom-2 -right-2 bg-[#155FA0] rounded-full p-1'>
                        <Star className='w-4 h-4 text-white fill-current' />
                      </div>
                    </div>
                    <div>
                      <h3 className='text-xl font-semibold text-slate-900'>
                        {current.name}
                      </h3>
                      <p className='text-[#51A0D0] font-medium'>
                        {current.role}
                      </p>
                      <p className='text-slate-500 flex items-center gap-1 text-sm'>
                        <MapPin className='w-4 h-4' /> {current.location}
                      </p>
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className='mb-8'>
                    <p className='text-3xl font-medium text-slate-900 mb-4'>
                      "{current.quote}"
                    </p>
                    <p className='text-slate-600 leading-relaxed'>
                      {current.story}
                    </p>
                  </blockquote>

                  {/* Rating */}
                  <div className='flex items-center gap-1 mb-8'>
                    {[...Array(current.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className='w-5 h-5 text-yellow-400 fill-current'
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className='flex items-center justify-center gap-6 mt-12'>
            <button
              onClick={() => paginate(-1)}
              className='p-3 rounded-full bg-white shadow-lg hover:bg-[#71C8DC]/10 transition-colors'
            >
              <ChevronLeft className='w-6 h-6 text-[#155FA0]' />
            </button>
            <div className='flex gap-3'>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-12 bg-[#155FA0]'
                      : 'w-2 bg-[#71C8DC]/30 hover:bg-[#71C8DC]/50'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => paginate(1)}
              className='p-3 rounded-full bg-white shadow-lg hover:bg-[#71C8DC]/10 transition-colors'
            >
              <ChevronRight className='w-6 h-6 text-[#155FA0]' />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='grid grid-cols-2 md:grid-cols-4 gap-8 mt-24'
        >
          {[
            { label: 'Happy Homeowners', value: '2,500+' },
            { label: 'Cities Covered', value: '50+' },
            { label: 'Average Savings', value: '€42,000' },
            { label: 'Success Rate', value: '98%' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className='relative bg-white rounded-2xl p-6 shadow-lg text-center'
            >
              <div className='absolute -top-2 -right-2'>
                <div className='w-4 h-4 rounded-full bg-[#71C8DC]' />
              </div>
              <p className='text-3xl font-bold text-[#155FA0] mb-2'>
                {stat.value}
              </p>
              <p className='text-slate-600'>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export default SuccessStories
