// File: client/src/pages/Properties/PropertiesPage.jsx
// PropertiesPage.js
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { AnimatePresence, motion } from 'framer-motion'
import { Euro, Filter, Home, MapPin, Search, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

// Mock data for properties
const mockProperties = [
  {
    id: 1,
    title: 'Modern Apartment in Munich',
    location: 'Munich, Bavaria',
    price: 450000,
    size: 85,
    bedrooms: 2,
    bathrooms: 1,
    type: 'Apartment',
    image:
      'https://images.unsplash.com/photo-1574362848149-11496d93e7c7?q=80&w=1260&auto=format&fit=crop',
    features: ['Balcony', 'Parking', 'Elevator'],
    yearBuilt: 2018,
  },
  {
    id: 2,
    title: 'Spacious Family Home',
    location: 'Hamburg, Hamburg',
    price: 670000,
    size: 145,
    bedrooms: 4,
    bathrooms: 2,
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1260&auto=format&fit=crop',
    features: ['Garden', 'Garage', 'Basement'],
    yearBuilt: 2012,
  },
  {
    id: 3,
    title: 'Lakeside Villa',
    location: 'Berlin, Berlin',
    price: 1250000,
    size: 220,
    bedrooms: 5,
    bathrooms: 3,
    type: 'Villa',
    image:
      'https://images.unsplash.com/photo-1600596542815-22b829377651?q=80&w=1476&auto=format&fit=crop',
    features: ['Garden', 'Pool', 'Terrace', 'Smart Home'],
    yearBuilt: 2020,
  },
  {
    id: 4,
    title: 'Urban Loft',
    location: 'Frankfurt, Hesse',
    price: 380000,
    size: 78,
    bedrooms: 1,
    bathrooms: 1,
    type: 'Apartment',
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1260&auto=format&fit=crop',
    features: ['Open Floor Plan', 'High Ceilings', 'City View'],
    yearBuilt: 2015,
  },
  {
    id: 5,
    title: 'Countryside Cottage',
    location: 'Dresden, Saxony',
    price: 320000,
    size: 110,
    bedrooms: 3,
    bathrooms: 1,
    type: 'House',
    image:
      'https://images.unsplash.com/photo-1480074568708-e7b720bb6fce?q=80&w=1592&auto=format&fit=crop',
    features: ['Garden', 'Fireplace', 'Wooden Floors'],
    yearBuilt: 1995,
  },
  {
    id: 6,
    title: 'Riverfront Apartment',
    location: 'Cologne, North Rhine-Westphalia',
    price: 520000,
    size: 95,
    bedrooms: 2,
    bathrooms: 2,
    type: 'Apartment',
    image:
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1260&auto=format&fit=crop',
    features: ['River View', 'Terrace', 'Underground Parking'],
    yearBuilt: 2017,
  },
]

// Locations for the filter
const locations = [
  'All',
  'Munich',
  'Hamburg',
  'Berlin',
  'Frankfurt',
  'Dresden',
  'Cologne',
]

// Property types for the filter
const propertyTypes = ['All', 'Apartment', 'House', 'Villa']

const PropertiesPage = ({ language = 'de', onLanguageChange }) => {
  const [properties, setProperties] = useState(mockProperties)
  const [filteredProperties, setFilteredProperties] = useState(mockProperties)
  const [searchTerm, setSearchTerm] = useState('')
  const [priceRange, setPriceRange] = useState([0, 2000000])
  const [sizeRange, setSizeRange] = useState([0, 300])
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [selectedType, setSelectedType] = useState('All')
  const [bedroomsFilter, setBedroomsFilter] = useState(0)
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  // Check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768)
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Apply filters whenever filter state changes
  useEffect(() => {
    applyFilters()
  }, [
    searchTerm,
    priceRange,
    sizeRange,
    selectedLocation,
    selectedType,
    bedroomsFilter,
  ])

  const applyFilters = () => {
    let filtered = [...properties]

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply price range filter
    filtered = filtered.filter(
      (property) =>
        property.price >= priceRange[0] && property.price <= priceRange[1]
    )

    // Apply size range filter
    filtered = filtered.filter(
      (property) =>
        property.size >= sizeRange[0] && property.size <= sizeRange[1]
    )

    // Apply location filter
    if (selectedLocation !== 'All') {
      filtered = filtered.filter((property) =>
        property.location.includes(selectedLocation)
      )
    }

    // Apply property type filter
    if (selectedType !== 'All') {
      filtered = filtered.filter((property) => property.type === selectedType)
    }

    // Apply bedrooms filter
    if (bedroomsFilter > 0) {
      filtered = filtered.filter(
        (property) => property.bedrooms >= bedroomsFilter
      )
    }

    setFilteredProperties(filtered)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setPriceRange([0, 2000000])
    setSizeRange([0, 300])
    setSelectedLocation('All')
    setSelectedType('All')
    setBedroomsFilter(0)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (
    <>
      <Navbar language={language} onLanguageChange={onLanguageChange} />
      <div className='min-h-screen bg-white'>
        {/* Header */}
        <header className='bg-gradient-to-r from-[#155FA0] to-[#0D3B66] py-10 px-4 md:px-8 relative overflow-hidden'>
          <div className="absolute top-0 right-0 w-[400px] h-full bg-[#FAC51C]/10 skew-x-[-20deg] translate-x-32" />
          <div className='container mx-auto relative z-10'>
            <h1 className='text-2xl md:text-3xl font-bold text-white'>
              Find Your Dream Home
            </h1>
            <p className='text-white/80 mt-2'>
              Discover properties across Germany that match your needs
            </p>
          </div>
        </header>

        <div className='container mx-auto px-4 py-8'>
          {/* Main search and filter toggle for mobile */}
          <div className='flex flex-col md:flex-row gap-4 mb-6'>
            <div className='relative flex-grow'>
              <Input
                type='text'
                placeholder='Search by property name or location'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-6 w-full border-none bg-secondary/50 rounded-2xl focus:ring-2 focus:ring-[#155FA0] transition-all'
              />
              <Search
                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-[#155FA0]/50'
                size={18}
              />
            </div>

            {isSmallScreen ? (
              <Button
                onClick={() => setFiltersVisible(!filtersVisible)}
                variant='outline'
                className='flex items-center gap-2 border-[#155FA0]/20 text-[#155FA0] rounded-full h-12'
              >
                <Filter size={18} />
                Filters
              </Button>
            ) : null}
          </div>

          <div className='flex flex-col md:flex-row gap-8'>
            {/* Filters Section */}
            <AnimatePresence>
              {(!isSmallScreen || filtersVisible) && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`${
                    isSmallScreen ? 'w-full' : 'w-64'
                  } bg-white rounded-lg shadow-md p-4`}
                >
                  <div className='flex justify-between items-center mb-4'>
                    <h2 className='text-lg font-semibold text-[#155FA0]'>
                      Filters
                    </h2>
                    {isSmallScreen && (
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setFiltersVisible(false)}
                        className='p-1'
                      >
                        <X size={18} />
                      </Button>
                    )}
                  </div>

                  <div className='space-y-6'>
                    {/* Price Range */}
                    <div>
                      <h3 className='text-sm font-medium mb-2 flex items-center gap-2'>
                        <Euro size={16} className='text-[#FAC51C]' />
                        Price Range
                      </h3>
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={2000000}
                        step={10000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className='my-4'
                      />
                      <div className='flex justify-between text-sm text-gray-600'>
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>

                    {/* Size Range */}
                    <div>
                      <h3 className='text-sm font-medium mb-2 flex items-center gap-2'>
                        <Home size={16} className='text-[#FAC51C]' />
                        Size (m²)
                      </h3>
                      <Slider
                        defaultValue={sizeRange}
                        min={0}
                        max={300}
                        step={5}
                        value={sizeRange}
                        onValueChange={setSizeRange}
                        className='my-4'
                      />
                      <div className='flex justify-between text-sm text-gray-600'>
                        <span>{sizeRange[0]} m²</span>
                        <span>{sizeRange[1]} m²</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div>
                      <h3 className='text-sm font-medium mb-2 flex items-center gap-2'>
                        <MapPin size={16} className='text-[#FAC51C]' />
                        Location
                      </h3>
                      <Select
                        value={selectedLocation}
                        onValueChange={setSelectedLocation}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select location' />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Property Type */}
                    <div>
                      <h3 className='text-sm font-medium mb-2'>
                        Property Type
                      </h3>
                      <Select
                        value={selectedType}
                        onValueChange={setSelectedType}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select type' />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <h3 className='text-sm font-medium mb-2'>
                        Min. Bedrooms
                      </h3>
                      <Select
                        value={bedroomsFilter.toString()}
                        onValueChange={(value) =>
                          setBedroomsFilter(Number(value))
                        }
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Min. bedrooms' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='0'>Any</SelectItem>
                          <SelectItem value='1'>1+</SelectItem>
                          <SelectItem value='2'>2+</SelectItem>
                          <SelectItem value='3'>3+</SelectItem>
                          <SelectItem value='4'>4+</SelectItem>
                          <SelectItem value='5'>5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reset button */}
                    <Button
                      onClick={resetFilters}
                      variant='outline'
                      className='w-full border-[#155FA0]/20 text-[#155FA0] hover:bg-[#155FA0]/5 rounded-xl h-12 font-bold uppercase tracking-widest text-[10px]'
                    >
                      Reset Filters
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Properties Grid */}
            <div className='flex-1'>
              <div className='mb-4 flex justify-between items-center'>
                <h2 className='text-lg font-semibold'>
                  {filteredProperties.length}{' '}
                  {filteredProperties.length === 1 ? 'Property' : 'Properties'}{' '}
                  Found
                </h2>
                <Select defaultValue='price-asc'>
                  <SelectTrigger className='w-40'>
                    <SelectValue placeholder='Sort by' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='price-asc'>
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value='price-desc'>
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value='newest'>Newest First</SelectItem>
                    <SelectItem value='size-desc'>
                      Size: Largest First
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredProperties.length === 0 ? (
                <div className='text-center py-12'>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Home size={64} className='mx-auto text-gray-300 mb-4' />
                    <h3 className='text-xl font-medium text-gray-700 mb-2'>
                      No properties found
                    </h3>
                    <p className='text-gray-500'>
                      Try adjusting your filters to see more results
                    </p>
                    <Button
                      onClick={resetFilters}
                      variant='outline'
                      className='mt-4 border-[#51A0D0] text-[#155FA0] hover:bg-[#71C8DC]/10'
                    >
                      Reset Filters
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial='hidden'
                  animate='visible'
                  className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                >
                  {filteredProperties.map((property) => (
                    <motion.div key={property.id} variants={itemVariants}>
                      <Card className='h-full overflow-hidden hover:shadow-lg transition-shadow duration-300'>
                        <div className='aspect-video overflow-hidden'>
                          <img
                            src={property.image}
                            alt={property.title}
                            className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                          />
                        </div>
                        <CardHeader className='pb-2'>
                          <CardTitle className='text-lg line-clamp-1'>
                            {property.title}
                          </CardTitle>
                          <div className='flex items-center text-gray-500 text-sm'>
                            <MapPin size={14} className='mr-1' />
                            {property.location}
                          </div>
                        </CardHeader>
                        <CardContent className='pb-2'>
                          <div className='flex justify-between mb-3'>
                            <div className='text-[#155FA0] font-semibold text-lg'>
                              {formatPrice(property.price)}
                            </div>
                            <div className='text-sm text-gray-500'>
                              {property.size} m²
                            </div>
                          </div>
                          <div className='flex gap-4 text-sm'>
                            <div className='flex items-center'>
                              <svg
                                className='w-4 h-4 mr-1 text-[#FAC51C]'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M3 21V8L12 4L21 8V21'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                                <path
                                  d='M9 21V15H15V21'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                              </svg>
                              {property.type}
                            </div>
                            <div className='flex items-center'>
                              <svg
                                className='w-4 h-4 mr-1 text-[#FAC51C]'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M4 16V4M4 16H2M4 16H20M20 16V4M20 16H22M19 4H5V10H19V4Z'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                                <path
                                  d='M8 15V18M16 15V18'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                              </svg>
                              {property.bedrooms}{' '}
                              {property.bedrooms === 1 ? 'Bed' : 'Beds'}
                            </div>
                            <div className='flex items-center'>
                              <svg
                                className='w-4 h-4 mr-1 text-[#FAC51C]'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                                <path
                                  d='M20 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V17C3 16.7348 3.10536 16.4804 3.29289 16.2929C3.48043 16.1054 3.73478 16 4 16H20C20.2652 16 20.5196 16.1054 20.7071 16.2929C20.8946 16.4804 21 16.7348 21 17V20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21Z'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                                <path
                                  d='M13 3H17V8L15 7L13 8V3Z'
                                  stroke='currentColor'
                                  strokeWidth='2'
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                />
                                <circle
                                  cx='9'
                                  cy='13'
                                  r='1'
                                  fill='currentColor'
                                />
                                <circle
                                  cx='15'
                                  cy='13'
                                  r='1'
                                  fill='currentColor'
                                />
                              </svg>
                              {property.bathrooms}{' '}
                              {property.bathrooms === 1 ? 'Bath' : 'Baths'}
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className='pt-0'>
                          <Button className='w-full bg-[#155FA0] hover:bg-[#155FA0]/90 rounded-xl h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-[#155FA0]/20'>
                            View Details
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer language={language} />
    </>
  )
}

export default PropertiesPage
