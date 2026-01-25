// File: client/src/components/Home/SuccessStories.jsx
// File: client/src/components/Home/SuccessStories.jsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Quote, Star, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const SuccessStories = () => {
    // ... (keep existing data or update if needed)
  const [activeStory, setActiveStory] = useState(0)
  const stories = [
    {
      id: 1,
      name: 'Sarah & Thomas Weber',
      role: 'First-time Buyers',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop',
      quote: "We thought buying in Munich was impossible. The team not only found us a hidden gem but negotiated a rate that saved us thousands.",
      property: {
        type: 'Penthouse Apartment',
        location: 'Munich, Schwabing',
        price: '€850,000',
        savings: '€12,400',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1974&auto=format&fit=crop'
      },
      stats: { roi: '+12%', equity: '€125k', time: '3 Weeks' }
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Investment Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
      quote: "Efficient, transparent, and incredibly knowledgeable. They structured my portfolio financing exactly how I needed it.",
      property: {
        type: 'Multi-family House',
        location: 'Berlin, Mitte',
        price: '€2.1M',
        savings: '€45,000',
        image: 'https://images.unsplash.com/photo-1605146769289-440113cc3d00?q=80&w=2053&auto=format&fit=crop'
      },
      stats: { roi: '+8.5%', equity: '€450k', time: '5 Weeks' }
    },
    {
        id: 3,
        name: 'Elena Rodriguez',
        role: 'Expat Engineer',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop', // Professional woman
        quote: "Navigate the German system as an expat was daunting. They handled all the paperwork and translated everything. Truly full-service.",
        property: {
            type: 'Modern Loft',
            location: 'Hamburg, HafenCity',
            price: '€620,000',
            savings: '€8,500',
            image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop' // Modern loft interior
        },
        stats: { roi: '+15%', equity: '€95k', time: '4 Weeks' }
    }
  ]
  
  // Custom Autoplay Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [stories.length])

  return (
    <section className='py-12 md:py-24 bg-background relative overflow-hidden transition-colors duration-300'>
       {/* Background Decoration */}
       <div className='absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none' />

      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='text-center mb-16'>
           <div className='inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-accent text-xs font-bold uppercase tracking-wider mb-4'>
             <Star className='w-4 h-4 fill-current text-accent' /> Success Stories
           </div>
           <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-foreground mb-6 tracking-tight'>
             Real Results, <span className="text-accent">Real Homes</span>
           </h2>
           <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-body'>
              Join hundreds of satisfied clients who found their dream property with our help.
           </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            {/* Left: Testimonial & Stats */}
            <div className="space-y-8">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeStory}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(e, { offset }) => {
                          const swipe = offset.x; // positive = right, negative = left
                          if (swipe < -50) {
                             setActiveStory((prev) => (prev + 1) % stories.length);
                          } else if (swipe > 50) {
                             setActiveStory((prev) => (prev - 1 + stories.length) % stories.length);
                          }
                        }}
                        className="space-y-8 touch-pan-y cursor-grab active:cursor-grabbing"
                    >
                         <div className="relative">
                             <Quote className="absolute -top-8 -left-2 md:-top-12 md:-left-12 w-16 h-16 md:w-24 md:h-24 text-accent/5 rotate-180 pointer-events-none" />
                              <h3 className="text-xl md:text-3xl lg:text-4xl font-medium leading-[1.4] text-foreground italic relative z-10 font-body">
                                  &ldquo;{stories[activeStory].quote}&rdquo;
                              </h3>
                         </div>
                         
                         <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                             <Avatar className="w-16 h-16 md:w-16 md:h-16 border-2 border-primary/10">
                                 <AvatarImage src={stories[activeStory].image} className="object-cover" />
                                 <AvatarFallback>U</AvatarFallback>
                             </Avatar>
                             <div>
                                 <p className="font-bold text-lg text-foreground">{stories[activeStory].name}</p>
                                 <p className="text-muted-foreground">{stories[activeStory].role}</p>
                             </div>
                         </div>
                         
                         <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 p-6 md:p-10 bg-card rounded-[2rem] md:rounded-[2.5rem] border border-border/50 shadow-inner mt-8 md:mt-12 backdrop-blur-sm">
                             <div className="space-y-1 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start border-b sm:border-b-0 border-border/10 pb-4 sm:pb-0 last:border-0 last:pb-0">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Time to Buy</p>
                                 <p className="text-xl md:text-2xl font-bold text-foreground">{stories[activeStory].stats.time}</p>
                             </div>
                             <div className="space-y-1 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start border-b sm:border-b-0 border-border/10 pb-4 sm:pb-0 last:border-0 last:pb-0">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Savings</p>
                                 <p className="text-xl md:text-2xl font-bold text-accent">{stories[activeStory].property.savings}</p>
                             </div>
                             <div className="space-y-1 flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start">
                                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Equity Built</p>
                                 <p className="text-xl md:text-2xl font-bold text-foreground">{stories[activeStory].stats.equity}</p>
                             </div>
                         </div>
                    </motion.div>
                </AnimatePresence>
                
                <div className="flex justify-center md:justify-start gap-3 pt-4">
                    {stories.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setActiveStory(idx)}
                            className={`h-2.5 md:h-2 rounded-full transition-all duration-300 ${activeStory === idx ? 'w-8 bg-primary' : 'w-2.5 md:w-2 bg-primary/20 hover:bg-primary/40'}`}
                            aria-label={`Go to story ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Property Image Card */}
            <div className="relative lg:h-[600px] w-full">
                 <AnimatePresence mode="wait">
                    <motion.div
                         key={activeStory}
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 1.05 }}
                         transition={{ duration: 0.7 }}
                         className="absolute inset-0"
                    >
                        <div className="relative h-full w-full rounded-[2rem] overflow-hidden shadow-lg shadow-primary/5 group">
                            <img 
                                src={stories[activeStory].property.image} 
                                alt={stories[activeStory].property.type}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                            
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                <Badge className="bg-accent text-accent-foreground mb-3 hover:bg-accent/90 border-0">
                                    {stories[activeStory].property.type}
                                </Badge>
                                <div className="flex items-center gap-2 mb-2">
                                    <MapPin className="w-5 h-5 text-accent" />
                                    <span className="text-lg font-medium">{stories[activeStory].property.location}</span>
                                </div>
                                <div className="text-3xl font-bold">{stories[activeStory].property.price}</div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                {/* Floating Decoration Card */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-6 -right-6 bg-white dark:bg-card p-6 rounded-2xl shadow-xl hidden md:block max-w-xs"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Market Value Increase</p>
                            <p className="text-2xl font-bold text-foreground">{stories[activeStory].stats.roi}</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>

      </div>
    </section>
  )
}

export default SuccessStories
