import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Home,
  Search,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: 'Understanding Mortgage Rates in Germany',
    excerpt:
      'Learn how mortgage rates work in Germany and what factors influence them in the current market.',
    category: 'Financing',
    date: 'Feb 18, 2025',
    readTime: '5 min',
    image:
      'https://images.pexels.com/photos/534220/pexels-photo-534220.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    featured: true,
  },
  {
    id: 2,
    title: 'First-Time Home Buyer Guide',
    excerpt:
      'Everything you need to know about buying your first home in Germany, from preparation to closing.',
    category: 'Guides',
    date: 'Feb 10, 2025',
    readTime: '8 min',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1373&q=80',
    featured: true,
  },
  {
    id: 3,
    title: 'Navigating Property Taxes in Different German States',
    excerpt:
      "A comprehensive overview of property tax structures across Germany's federal states.",
    category: 'Taxes',
    date: 'Feb 5, 2025',
    readTime: '6 min',
    image:
      'https://images.pexels.com/photos/2098405/pexels-photo-2098405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    featured: false,
  },
  {
    id: 4,
    title: 'Tips for a Successful Property Viewing',
    excerpt:
      'How to make the most of your property viewings and what to look for in your potential new home.',
    category: 'Buying',
    date: 'Jan 28, 2025',
    readTime: '4 min',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    featured: false,
  },
  {
    id: 5,
    title: 'Renovation Loans: What You Need to Know',
    excerpt:
      'Explore financing options for renovating your new property and maximizing its value.',
    category: 'Financing',
    date: 'Jan 20, 2025',
    readTime: '7 min',
    image:
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    featured: false,
  },
  {
    id: 6,
    title: 'The Impact of Energy Efficiency on Property Value',
    excerpt:
      'How energy standards affect property prices and long-term investment potential in Germany.',
    category: 'Market Trends',
    date: 'Jan 15, 2025',
    readTime: '5 min',
    image:
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
    featured: false,
  },
]

// Category icons mapping
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Financing':
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className='bg-blue-100 p-2 rounded-full'
        >
          <BookOpen size={16} className='text-blue-600' />
        </motion.div>
      )
    case 'Guides':
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className='bg-green-100 p-2 rounded-full'
        >
          <BookOpen size={16} className='text-green-600' />
        </motion.div>
      )
    case 'Taxes':
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className='bg-red-100 p-2 rounded-full'
        >
          <BookOpen size={16} className='text-red-600' />
        </motion.div>
      )
    case 'Buying':
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className='bg-purple-100 p-2 rounded-full'
        >
          <Home size={16} className='text-purple-600' />
        </motion.div>
      )
    case 'Market Trends':
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className='bg-yellow-100 p-2 rounded-full'
        >
          <BookOpen size={16} className='text-yellow-600' />
        </motion.div>
      )
    default:
      return (
        <motion.div
          whileHover={{ scale: 1.1 }}
          className='bg-gray-100 p-2 rounded-full'
        >
          <BookOpen size={16} className='text-gray-600' />
        </motion.div>
      )
  }
}

// Featured blog card component
const FeaturedBlogCard = ({ post }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className='col-span-1 md:col-span-2'
  >
    <Card className='overflow-hidden h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='relative'>
        <img
          src={post.image}
          alt={post.title}
          className='w-full h-64 object-cover'
        />
        <div className='absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full'>
          <span className='text-sm font-medium text-blue-600'>
            {post.category}
          </span>
        </div>
      </div>
      <CardHeader>
        <CardTitle className='text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors'>
          {post.title}
        </CardTitle>
        <CardDescription className='flex items-center gap-4 text-sm text-gray-500'>
          <span className='flex items-center gap-1'>
            <Calendar size={14} />
            {post.date}
          </span>
          <span className='flex items-center gap-1'>
            <Clock size={14} />
            {post.readTime}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-gray-600'>{post.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant='link'
          className='px-0 text-blue-600 hover:text-blue-800'
        >
          Read More <ArrowRight size={16} className='ml-2' />
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
)

// Regular blog card component
const BlogCard = ({ post, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
  >
    <Card className='overflow-hidden h-full border-none shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='relative'>
        <img
          src={post.image}
          alt={post.title}
          className='w-full h-48 object-cover'
        />
        <div className='absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-1 rounded-full flex items-center gap-2'>
          {getCategoryIcon(post.category)}
          <span className='text-sm font-medium text-gray-700'>
            {post.category}
          </span>
        </div>
      </div>
      <CardHeader>
        <CardTitle className='text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors'>
          {post.title}
        </CardTitle>
        <CardDescription className='flex items-center gap-4 text-sm text-gray-500'>
          <span className='flex items-center gap-1'>
            <Calendar size={14} />
            {post.date}
          </span>
          <span className='flex items-center gap-1'>
            <Clock size={14} />
            {post.readTime}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className='text-gray-600 line-clamp-3'>{post.excerpt}</p>
      </CardContent>
      <CardFooter>
        <Button
          variant='link'
          className='px-0 text-blue-600 hover:text-blue-800'
        >
          Read More <ArrowRight size={16} className='ml-2' />
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
)

// Main Blog Page Component
// Custom CSS for white placeholder
const searchInputStyle = {
  '::placeholder': { color: 'white !important' },
}

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)
  const [activeCategory, setActiveCategory] = useState('all')

  const featuredPosts = blogPosts.filter((post) => post.featured)
  const categories = ['all', ...new Set(blogPosts.map((post) => post.category))]

  useEffect(() => {
    let result = blogPosts

    // Filter by search
    if (searchQuery) {
      result = result.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter((post) => post.category === activeCategory)
    }

    setFilteredPosts(result)
  }, [searchQuery, activeCategory])

  // Hero animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: 'beforeChildren',
        staggerChildren: 0.2,
      },
    },
  }

  const heroItemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <>
      <Navbar />
      <div className='min-h-screen bg-gray-50'>
        {/* Categories / Tabs */}
        <section className='py-8 container mx-auto px-4'>
          <Tabs
            defaultValue='all'
            value={activeCategory}
            onValueChange={setActiveCategory}
          >
            <TabsList className='grid grid-flow-col auto-cols-max gap-2 overflow-x-auto pb-2 w-full justify-start'>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className='capitalize'
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </section>

        {/* Featured Posts */}
        {featuredPosts.length > 0 &&
          activeCategory === 'all' &&
          !searchQuery && (
            <section className='py-8 container mx-auto px-4'>
              <h2 className='text-2xl font-bold mb-6 text-gray-800'>
                Featured Articles
              </h2>
              <div className='grid md:grid-cols-2 gap-6'>
                {featuredPosts.map((post) => (
                  <FeaturedBlogCard key={post.id} post={post} />
                ))}
              </div>
            </section>
          )}

        {/* All Posts Grid */}
        <section className='py-8 container mx-auto px-4 mb-16'>
          <h2 className='text-2xl font-bold mb-6 text-gray-800'>
            {searchQuery
              ? 'Search Results'
              : activeCategory !== 'all'
              ? `${activeCategory} Articles`
              : 'All Articles'}
          </h2>

          {filteredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-center py-16'
            >
              <p className='text-xl text-gray-500'>
                No articles found matching your criteria.
              </p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('all')
                }}
              >
                Reset Filters
              </Button>
            </motion.div>
          ) : (
            <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {/* {filteredPosts.length > 0 && (
            <div className='flex justify-center mt-12'>
              <div className='flex gap-2'>
                <Button variant='outline' size='sm' disabled>
                  Previous
                </Button>
                <Button className='bg-blue-600 hover:bg-blue-700' size='sm'>
                  1
                </Button>
                <Button variant='outline' size='sm'>
                  2
                </Button>
                <Button variant='outline' size='sm'>
                  3
                </Button>
                <Button variant='outline' size='sm'>
                  Next
                </Button>
              </div>
            </div>
          )} */}
        </section>
      </div>
      <Footer />
    </>
  )
}

export default BlogPage
