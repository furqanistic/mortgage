// File: client/src/pages/Blog/BlogPage.jsx
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Search,
} from 'lucide-react'
import { useEffect, useState } from 'react'

// Sample blog data (Preserved)
const blogPosts = [
  {
    id: 1,
    title: 'Understanding Mortgage Rates in Germany',
    excerpt: 'Learn how mortgage rates work in Germany and what factors influence them in the current market.',
    category: 'Financing',
    date: 'Feb 18, 2025',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2011&auto=format&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'First-Time Home Buyer Guide',
    excerpt: 'Everything you need to know about buying your first home in Germany, from preparation to closing.',
    category: 'Guides',
    date: 'Feb 10, 2025',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1373&q=80',
    featured: true,
  },
  {
    id: 3,
    title: 'Navigating Property Taxes in Different German States',
    excerpt: "A comprehensive overview of property tax structures across Germany's federal states.",
    category: 'Taxes',
    date: 'Feb 5, 2025',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1554224155-169641357599?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 4,
    title: 'Tips for a Successful Property Viewing',
    excerpt: 'How to make the most of your property viewings and what to look for in your potential new home.',
    category: 'Buying',
    date: 'Jan 28, 2025',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    featured: false,
  },
  {
    id: 5,
    title: 'Renovation Loans: What You Need to Know',
    excerpt: 'Explore financing options for renovating your new property and maximizing its value.',
    category: 'Financing',
    date: 'Jan 20, 2025',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1581578731522-745d05ad9a2d?q=80&w=2070&auto=format&fit=crop',
    featured: false,
  },
  {
    id: 6,
    title: 'The Impact of Energy Efficiency on Property Value',
    excerpt: 'How energy standards affect property prices and long-term investment potential in Germany.',
    category: 'Market Trends',
    date: 'Jan 15, 2025',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80',
    featured: false,
  },
]



const BlogCard = ({ post, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="group"
  >
    <Card className="h-full bg-card dark:bg-[#080808] backdrop-blur-xl border border-border/50 rounded-[32px] overflow-hidden shadow-xl hover:border-accent/50 transition-all duration-500">
      <div className="relative overflow-hidden h-60">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute top-4 left-4">
          <span className="px-4 py-1.5 rounded-full bg-background/90 backdrop-blur-md text-foreground text-xs font-bold uppercase tracking-widest border border-accent/20">
            {post.category}
          </span>
        </div>
      </div>
      <CardHeader className="space-y-4 px-8 pt-8">
        <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime} read</span>
        </div>
        <CardTitle className="text-2xl font-bold font-heading text-foreground leading-tight group-hover:text-accent transition-colors">
          {post.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-8 flex-1">
        <CardDescription className="text-muted-foreground font-body leading-relaxed line-clamp-3">
          {post.excerpt}
        </CardDescription>
      </CardContent>
      <CardFooter className="px-8 pb-8 pt-4">
        <Button variant="link" className="px-0 text-foreground font-bold text-sm tracking-wide group/btn hover:text-accent">
          READ MORE <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
)

const BlogPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredPosts, setFilteredPosts] = useState(blogPosts)
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = ['all', ...new Set(blogPosts.map((post) => post.category))]

  useEffect(() => {
    let result = blogPosts
    if (searchQuery) {
      result = result.filter(
        (post) => post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    if (activeCategory !== 'all') {
      result = result.filter((post) => post.category === activeCategory)
    }
    setFilteredPosts(result)
  }, [searchQuery, activeCategory])

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-muted border border-border"
          >
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Baufiking Insights
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-heading text-foreground leading-tight"
          >
            Knowledge for Your <span className="text-accent">Next Chapter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto font-body"
          >
            Expert advice and market insights on the German mortgage landscape.
          </motion.p>
        </div>
      </section>

      {/* Filters & Search - Premium Styling */}
      <section className="sticky top-20 z-30 py-6 bg-background/80 backdrop-blur-xl border-y border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
            <TabsList className="h-auto flex flex-wrap p-1 gap-2 bg-muted rounded-2xl border border-border">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="rounded-xl px-6 py-2.5 font-bold text-sm capitalize data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-lg transition-all"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-muted border-transparent focus:border-accent focus:ring-1 focus:ring-accent transition-all outline-none text-sm"
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 px-6 md:px-10 max-w-7xl mx-auto">
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold font-heading text-foreground">
              {searchQuery ? 'Search Results' : activeCategory !== 'all' ? `${activeCategory} Articles` : 'Featured Insights'}
            </h2>
            <div className="h-px flex-1 mx-8 bg-border hidden md:block" />
          </div>

          <AnimatePresence mode="wait">
            {filteredPosts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-32 space-y-6"
              >
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                  <Search className="w-10 h-10" />
                </div>
                <p className="text-xl text-muted-foreground font-body">No articles found matching your criteria.</p>
                <Button 
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }} 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-2xl px-8 h-12 font-bold"
                >
                  Reset Filters
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {filteredPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination Placeholder (Updated Style) */}
          {filteredPosts.length > 0 && (
            <div className="flex justify-center mt-20 pt-10 border-t border-border">
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-xl border-border text-muted-foreground" disabled>
                  Previous
                </Button>
                {[1, 2, 3].map(p => (
                  <Button key={p} className={`w-10 h-10 rounded-xl font-bold ${p === 1 ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20' : 'bg-transparent text-muted-foreground hover:text-accent'}`}>
                    {p}
                  </Button>
                ))}
                <Button variant="outline" className="rounded-xl border-border font-bold hover:text-accent">
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-32 px-6 md:px-10 bg-background"
      >
        <div className="max-w-4xl mx-auto rounded-[48px] bg-[#0A0A0A] p-12 md:p-20 text-center space-y-10 relative overflow-hidden border border-border/20 shadow-2xl">
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] translate-x-1/2 translate-y-1/2" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white">Subscribe to Our Market Insights</h2>
            <p className="text-muted-foreground text-lg font-body max-w-lg mx-auto leading-relaxed">
              Stay ahead with the latest property trends and mortgage updates in Germany. 
              Delivered straight to your inbox.
            </p>
          </div>

          <form className="relative z-10 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-8 py-5 rounded-3xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 outline-none focus:border-accent transition-all"
            />
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground h-[66px] px-10 rounded-3xl font-bold text-lg shadow-xl shadow-accent/20 transition-all active:scale-95">
              Subscribe
            </Button>
          </form>
        </div>
      </motion.section>

      <Footer />
    </div>
  )
}

export default BlogPage
