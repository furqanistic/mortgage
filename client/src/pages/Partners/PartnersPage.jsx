import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Briefcase,
  Building,
  CheckCircle,
  ExternalLink,
  Filter,
  MapPin,
  Search,
  Shield,
  Star,
  Users,
  X,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const PartnersPage = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const searchRef = useRef(null)
  const [isInView, setIsInView] = useState(false)

  // Partner categories
  const categories = [
    { id: 'all', label: 'All Partners', icon: <Building size={18} /> },
    { id: 'finance', label: 'Banking', icon: <Briefcase size={18} /> },
    { id: 'brokers', label: 'Real Estate', icon: <Building size={18} /> },
    { id: 'legal', label: 'Legal Services', icon: <Shield size={18} /> },
    { id: 'inspection', label: 'Inspection', icon: <CheckCircle size={18} /> },
  ]

  // Featured partners
  const featuredPartners = [
    {
      id: 1,
      name: 'Deutsche Bank',
      category: 'finance',
      description:
        "Germany's leading bank offering competitive mortgage solutions with exclusive Baufiking rates.",
      logo: 'DB',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Deutsche_Bank_logo_without_wordmark.svg/1024px-Deutsche_Bank_logo_without_wordmark.svg.png',
      rating: 4.8,
      reviews: 426,
      featured: true,
      location: 'Nationwide',
    },
    {
      id: 2,
      name: 'Commerzbank',
      category: 'finance',
      description:
        'Established financial institution with diverse mortgage products tailored for first-time buyers.',
      logo: 'CB',
      logoUrl:
        'https://companieslogo.com/img/orig/CBK.F-2e335f15.png?t=1720244491',
      rating: 4.7,
      reviews: 385,
      featured: true,
      location: 'Nationwide',
    },
    {
      id: 3,
      name: 'Sparkasse',
      category: 'finance',
      description:
        'Local banking network with deep understanding of regional property markets across Germany.',
      logo: 'SP',
      logoUrl:
        'https://images.seeklogo.com/logo-png/13/1/sparkasse-logo-png_seeklogo-130014.png',
      rating: 4.9,
      reviews: 512,
      featured: true,
      location: 'Nationwide',
    },
  ]

  // All partners
  const allPartners = [
    ...featuredPartners,
    {
      id: 4,
      name: 'DKB',
      category: 'finance',
      description:
        'Digital banking leader offering competitive mortgage rates with a streamlined online application process.',
      logo: 'DKB',
      logoUrl:
        'https://play-lh.googleusercontent.com/Ks2wR3vsbHjM-qVLGOWrTAvpCSQbExc0_RJvt0JXHesqJGIhHR6d5iSwVrkifs49oA',
      rating: 4.6,
      reviews: 318,
      featured: false,
      location: 'Nationwide',
    },
    {
      id: 5,
      name: 'Volksbank',
      category: 'finance',
      description:
        'Cooperative banking group with personalized mortgage solutions and local market expertise.',
      logo: 'VB',
      logoUrl:
        'https://images.seeklogo.com/logo-png/15/2/volksbank-logo-png_seeklogo-150519.png',
      rating: 4.7,
      reviews: 429,
      featured: false,
      location: 'Nationwide',
    },
    {
      id: 6,
      name: 'ING',
      category: 'finance',
      description:
        'Digital-first bank offering straightforward mortgage products with competitive interest rates.',
      logo: 'ING',
      logoUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLTTTxWusLsdnDetJgPtmKHSEkpBwZYXKz8w&s',
      rating: 4.7,
      reviews: 375,
      featured: false,
      location: 'Nationwide',
    },
    {
      id: 7,
      name: 'PSD Bank',
      category: 'finance',
      description:
        'Regional banking group with tailored mortgage solutions for various property types.',
      logo: 'PSD',
      logoUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ8eJXfc82ez7frzvrV3beSSN7PKiCEHq1Kg&s',
      rating: 4.5,
      reviews: 215,
      featured: false,
      location: 'Regional',
    },
    {
      id: 8,
      name: 'Bausparkasse Schwäbisch Hall',
      category: 'finance',
      description:
        "Germany's largest building society specializing in home savings contracts and financing.",
      logo: 'BSH',
      logoUrl:
        'https://play-lh.googleusercontent.com/a_8TkLz33oblA2NFoOdF72xqZE5qxzSY-jf-yJ6NJC3XchFABhKAA8GzKpSsW6wsf5s',
      rating: 4.8,
      reviews: 356,
      featured: false,
      location: 'Nationwide',
    },
    {
      id: 9,
      name: 'ImmoScout24',
      category: 'brokers',
      description:
        "Germany's largest real estate marketplace connecting buyers with property listings.",
      logo: 'IS',
      logoUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/ImmoScout24_Logo_2020.svg/2560px-ImmoScout24_Logo_2020.svg.png',
      rating: 4.7,
      reviews: 892,
      featured: false,
      location: 'Nationwide',
    },
  ]

  // Filter partners based on active category and search term
  const filteredPartners = allPartners.filter((partner) => {
    const matchesCategory =
      activeCategory === 'all' || partner.category === activeCategory
    const matchesSearch =
      !searchTerm ||
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  }

  // Close search when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchRef])

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition > 100) {
        setIsInView(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Navbar />
      <div className='min-h-screen mt-5 bg-gray-50 font-sans'>
        {/* Partner Search and Filter */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16'>
          <div className='flex flex-col md:flex-row md:items-center justify-between mb-8'>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className='mb-6 md:mb-0'
            >
              <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                Our Trusted Partners
              </h2>
              <p className='text-gray-600'>
                Discover the experts who make homeownership dreams come true
              </p>
            </motion.div>

            <div className='flex items-center space-x-3'>
              <div ref={searchRef} className='relative'>
                <AnimatePresence>
                  {showSearch ? (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 250, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                      className='relative'
                    >
                      <input
                        type='text'
                        placeholder='Search partners...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full py-2 pl-10 pr-8 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#51A0D0] focus:border-transparent shadow-sm'
                      />
                      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                      <button
                        onClick={() => {
                          setSearchTerm('')
                          setShowSearch(false)
                        }}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2'
                      >
                        <X className='h-4 w-4 text-gray-400 hover:text-gray-600' />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowSearch(true)}
                      className='p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50'
                    >
                      <Search className='h-5 w-5 text-gray-500' />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='p-2 bg-[#155FA0] rounded-lg shadow-sm text-white cursor-pointer'
              >
                <Filter className='h-5 w-5' />
              </motion.div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className='mb-8'>
            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-[#155FA0] text-white shadow-md shadow-[#155FA0]/20'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-[#71C8DC]'
                  }`}
                >
                  <span className='mr-2'>{category.icon}</span>
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Partners Grid */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16'>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <motion.div
                  key={partner.id}
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border ${
                    partner.featured ? 'border-[#71C8DC]' : 'border-gray-100'
                  }`}
                >
                  <div
                    className={`p-6 ${
                      partner.featured
                        ? 'bg-gradient-to-r from-[#E1F3FA] to-white'
                        : ''
                    }`}
                  >
                    <div className='flex items-start mb-4'>
                      {partner.logoUrl ? (
                        <div className='w-12 h-12 mr-4 rounded-xl overflow-hidden'>
                          <img
                            src={partner.logoUrl}
                            alt={`${partner.name} logo`}
                            className='w-full h-full object-cover'
                          />
                        </div>
                      ) : (
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-xl text-white font-bold text-lg mr-4 ${
                            partner.featured ? 'bg-[#155FA0]' : 'bg-[#51A0D0]'
                          }`}
                        >
                          {partner.logo}
                        </div>
                      )}
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-gray-900'>
                          {partner.name}
                        </h3>
                        <div className='flex items-center mt-1'>
                          <div className='flex items-center mr-3'>
                            <Star className='h-4 w-4 text-yellow-400 fill-current' />
                            <span className='ml-1 text-sm font-medium text-gray-700'>
                              {partner.rating}
                            </span>
                            <span className='ml-1 text-xs text-gray-500'>
                              ({partner.reviews})
                            </span>
                          </div>
                          <div className='flex items-center text-xs text-gray-500'>
                            <MapPin className='h-3 w-3 mr-1' />
                            {partner.location}
                          </div>
                        </div>
                      </div>
                      {partner.featured && (
                        <div className='flex items-center bg-[#71C8DC]/10 px-2 py-1 rounded text-xs font-medium text-[#155FA0]'>
                          <Star className='h-3 w-3 mr-1' />
                          Featured
                        </div>
                      )}
                    </div>

                    <p className='text-gray-600 text-sm mb-5 line-clamp-2'>
                      {partner.description}
                    </p>

                    <div className='flex items-center'>
                      <span className='text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded'>
                        {
                          categories.find((cat) => cat.id === partner.category)
                            ?.label
                        }
                      </span>
                      <div className='ml-auto'>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center text-sm font-medium ${
                            partner.featured
                              ? 'text-[#155FA0]'
                              : 'text-[#51A0D0]'
                          }`}
                        >
                          View Details
                          <ExternalLink className='ml-1 h-3 w-3' />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='col-span-full py-16 text-center'
              >
                <div className='bg-gray-50 inline-flex items-center justify-center w-20 h-20 rounded-full mb-4'>
                  <Search className='h-8 w-8 text-gray-400' />
                </div>
                <h3 className='text-xl font-medium text-gray-700 mb-2'>
                  No partners found
                </h3>
                <p className='text-gray-500 max-w-md mx-auto'>
                  We couldn't find any partners matching your search criteria.
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setActiveCategory('all')
                  }}
                  className='mt-4 text-[#155FA0] font-medium hover:underline'
                >
                  Reset filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Become a Partner */}
        <div className='bg-gradient-to-br from-[#155FA0] to-[#0D3B61] text-white'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20'>
            <div className='grid lg:grid-cols-2 gap-12 items-center'>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className='text-3xl font-bold mb-4'>
                  Join Our Network of 100+ Banks
                </h2>
                <p className='text-white/80 mb-8 text-lg'>
                  We're already working with Germany's top financial
                  institutions like Commerzbank, Deutsche Bank, DKB, Volksbank,
                  Sparkasse, ING, and more. Join our platform to connect with
                  qualified homebuyers looking for financing.
                </p>

                <div className='space-y-4 mb-8'>
                  {[
                    {
                      title: 'Qualified Leads',
                      description:
                        'Connect with buyers actively looking for your services',
                      icon: <Users className='h-5 w-5' />,
                    },
                    {
                      title: 'Digital Integration',
                      description:
                        'Seamless API integration with your existing systems',
                      icon: <Shield className='h-5 w-5' />,
                    },
                    {
                      title: 'Marketing Support',
                      description: 'Enhanced visibility through our platform',
                      icon: <Award className='h-5 w-5' />,
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className='flex items-start'
                    >
                      <div className='flex-shrink-0 p-2 bg-white/10 rounded-lg mr-4'>
                        {item.icon}
                      </div>
                      <div>
                        <h3 className='font-medium text-white'>{item.title}</h3>
                        <p className='text-white/70 text-sm'>
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={() => (window.location.href = '/auth')}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className='px-6 py-3 bg-white text-[#155FA0] font-medium rounded-lg shadow-lg flex items-center'
                >
                  Apply to Join <ArrowRight className='ml-2 h-5 w-5' />
                </motion.button>
              </motion.div>

              <div className='hidden lg:block relative'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7 }}
                  className='absolute -top-32 -right-16 w-64 h-64 bg-[#71C8DC]/20 rounded-full blur-3xl z-0'
                ></motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className='relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 z-10'
                >
                  <div className='flex items-center mb-6'>
                    <div className='p-3 bg-white/10 rounded-lg'>
                      <Building className='h-6 w-6' />
                    </div>
                    <div className='ml-4'>
                      <h3 className='font-semibold text-xl'>
                        Partner Application
                      </h3>
                      <p className='text-white/70 text-sm'>
                        Join our network in 3 simple steps
                      </p>
                    </div>
                  </div>

                  <div className='space-y-5'>
                    {[
                      {
                        number: '01',
                        title: 'Submit Application',
                        description:
                          'Complete our simple form with your company details',
                      },
                      {
                        number: '02',
                        title: 'Verification Process',
                        description:
                          'Our team reviews your credentials and service quality',
                      },
                      {
                        number: '03',
                        title: 'Integration & Onboarding',
                        description:
                          'Set up your profile and technical integration',
                      },
                    ].map((step, index) => (
                      <div key={index} className='flex items-start'>
                        <div className='flex-shrink-0 w-10 h-10 rounded-lg bg-[#71C8DC]/20 flex items-center justify-center text-[#71C8DC] font-bold'>
                          {step.number}
                        </div>
                        <div className='ml-4'>
                          <h4 className='font-medium text-white'>
                            {step.title}
                          </h4>
                          <p className='text-white/70 text-sm'>
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className='mt-8 pt-6 border-t border-white/10'>
                    <div className='text-center text-white/80 text-sm'>
                      Questions about joining?{' '}
                      <a href='/auth' className='text-white underline'>
                        Contact our partner team
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Button */}
        <AnimatePresence>
          {isInView && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className='fixed bottom-8 right-8 p-4 bg-[#155FA0] text-white rounded-full shadow-lg z-50'
            >
              <ArrowRight className='h-6 w-6' />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </>
  )
}

export default PartnersPage
