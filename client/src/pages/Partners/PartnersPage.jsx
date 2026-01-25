// File: client/src/pages/Partners/PartnersPage.jsx
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
import { useEffect, useRef, useState } from 'react'

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
        staggerChildren: 0.08,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
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
      } else {
        setIsInView(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-background min-h-screen flex flex-col font-body text-foreground transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-8 lg:px-12 mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 tracking-tight">
                Our Trusted Partners
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Discover the experts who make homeownership dreams come true. 
                We collaborate with industry leaders to bring you the best rates and services.
              </p>
            </motion.div>

            <div className="flex items-center gap-4">
              <div ref={searchRef} className="relative z-20">
                <AnimatePresence>
                  {showSearch ? (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 300, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      className="relative"
                    >
                      <input
                        type="text"
                        placeholder="Search partners..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                        className="w-full py-3 pl-12 pr-10 bg-card border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-card-foreground placeholder:text-muted-foreground"
                      />
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <button
                        onClick={() => {
                          setSearchTerm('')
                          setShowSearch(false)
                        }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted/50 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      layoutId="search-button"
                      onClick={() => setShowSearch(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 bg-card border border-border rounded-xl hover:border-accent/40 transition-all group"
                    >
                      <Search className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 bg-card border border-border rounded-xl text-sm font-medium text-foreground hover:border-accent/40 transition-all"
              >
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span>Filters</span>
              </motion.button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-10 overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`whitespace-nowrap flex items-center gap-2.5 px-5 py-2.5 md:px-8 md:py-3.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    activeCategory === category.id
                      ? 'bg-accent text-accent-foreground border-accent shadow-lg shadow-accent/20'
                      : 'bg-card text-muted-foreground border-border hover:border-accent/40 hover:bg-muted/30 hover:text-foreground'
                  }`}
                >
                  <span className={activeCategory === category.id ? 'text-accent dark:text-accent-foreground' : 'text-muted-foreground/70'}>
                    {category.icon}
                  </span>
                  {category.label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <motion.div
                  key={partner.id}
                  variants={cardVariants}
                  whileHover={{ y: -8 }}
                  className={`group relative bg-card rounded-2xl overflow-hidden border shadow-none transition-all duration-300 ${
                    partner.featured 
                      ? 'border-accent/60 dark:border-accent/40' 
                      : 'border-border hover:border-accent/30'
                  }`}
                >
                  {partner.featured && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1.5 bg-accent/10 px-3 py-1.5 rounded-full backdrop-blur-sm border border-accent/20">
                        <Star className="h-3.5 w-3.5 text-accent fill-accent" />
                        <span className="text-xs font-semibold text-accent-foreground dark:text-accent tracking-wide">Featured</span>
                      </div>
                    </div>
                  )}

                  <div className="p-10">
                    <div className="flex items-start mb-6">
                      <div className="relative">
                        <div className={`w-16 h-16 rounded-2xl overflow-hidden border border-border flex items-center justify-center ${partner.logoUrl ? 'bg-white' : 'bg-muted'}`}>
                          {partner.logoUrl ? (
                            <img
                              src={partner.logoUrl}
                              alt={`${partner.name} logo`}
                              className="w-14 h-14 object-contain"
                            />
                          ) : (
                            <span className="text-2xl font-bold text-foreground">{partner.logo}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="ml-5 pt-1">
                        <h3 className="text-xl font-heading font-bold text-card-foreground group-hover:text-accent transition-colors duration-300">
                          {partner.name}
                        </h3>
                        <div className="flex items-center mt-2 text-sm">
                          <div className="flex items-center gap-1 text-foreground font-semibold">
                            <Star className="h-4 w-4 text-accent fill-accent" />
                            <span>{partner.rating}</span>
                          </div>
                          <span className="mx-2 text-border">•</span>
                          <span className="text-muted-foreground">{partner.reviews} reviews</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">
                      {partner.description}
                    </p>

                    <div className="pt-6 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {partner.location}
                      </div>

                      <motion.button
                        whileHover={{ x: 4 }}
                        className="flex items-center text-sm font-semibold text-foreground hover:text-accent transition-colors"
                      >
                        View Profile
                        <ExternalLink className="ml-2 h-3.5 w-3.5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-24 text-center"
              >
                <div className="bg-card inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 border border-border">
                  <Search className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                  No partners found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                  We couldn&apos;t find any partners matching your search. Try broadening your criteria or selecting a different category.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setActiveCategory('all')
                  }}
                  className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Become a Partner CTA */}
      <section className="relative overflow-hidden bg-background text-foreground border-t border-border/50">
        <div className="absolute inset-0 bg-background"></div>
        
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/20 to-transparent opacity-10 dark:opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-foreground text-sm font-semibold mb-8">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                Partner Network
              </div>
              
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
                Join Our Elite Network of <span className="text-accent">Financial Leaders</span>
              </h2>
              
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-xl">
                We&apos;re already working with Germany&apos;s top institutions including Commerzbank, Deutsche Bank, and ING. 
                Expand your reach and connect with qualified homebuyers ready for financing.
              </p>

              <div className="grid gap-6 mb-10">
                {[
                  {
                    title: 'Strategic Growth',
                    description: 'Access a curated stream of high-intent clients.',
                    icon: <Users className="h-5 w-5 text-accent" />,
                  },
                  {
                    title: 'Seamless Integration',
                    description: 'Modern API infrastructure for effortless connection.',
                    icon: <CheckCircle className="h-5 w-5 text-accent" />,
                  },
                  {
                    title: 'Brand Amplification',
                    description: 'Premium positioning alongside industry giants.',
                    icon: <Award className="h-5 w-5 text-accent" />,
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex-shrink-0 p-3 bg-card rounded-xl border border-border hover:bg-muted/50 transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground text-lg">{item.title}</h3>
                      <p className="text-muted-foreground/80">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => (window.location.href = '/auth')}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
                className="group px-6 py-4 md:px-10 md:py-5 bg-accent text-accent-foreground font-bold rounded-xl flex items-center gap-3 hover:shadow-xl hover:shadow-accent/20 transition-all w-full md:w-auto justify-center md:justify-start"
              >
                Apply for Partnership
                <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
            
            <div className="hidden lg:block relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-accent/20 to-transparent blur-2xl opacity-30"></div>
                <div className="relative bg-card backdrop-blur-md rounded-3xl border border-border p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-accent rounded-2xl">
                      <Building className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-2xl text-foreground">
                        Application Process
                      </h3>
                      <p className="text-muted-foreground/80">Simple 3-step onboarding</p>
                    </div>
                  </div>

                  <div className="space-y-8 relative">
                    <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-accent/40 to-transparent"></div>
                    
                    {[
                      {
                        title: 'Submit Credentials',
                        desc: 'Company details and compliance check',
                      },
                      {
                        title: 'Validation',
                        desc: 'Team review and approval within 48h',
                      },
                      {
                        title: 'Initialization',
                        desc: 'Technical setup and go-live',
                      },
                    ].map((step, idx) => (
                      <div key={idx} className="relative flex items-center gap-6">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-card border-2 border-accent flex items-center justify-center text-accent font-bold text-sm z-10">
                          0{idx + 1}
                        </div>
                        <div className="flex-grow p-4 rounded-xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors">
                          <h4 className="font-semibold text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground/80">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-10 pt-6 border-t border-border text-center">
                    <p className="text-muted-foreground/80 text-sm">
                      Need assistance? <a href="/contact" className="text-accent hover:underline font-medium">Contact Support</a>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <AnimatePresence>
        {isInView && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 p-4 bg-primary text-primary-foreground rounded-full shadow-xl shadow-primary/30 z-50 border border-accent/20 hover:bg-primary/90 transition-all"
          >
           <ArrowRight className="h-6 w-6 transform -rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  )
}

export default PartnersPage
