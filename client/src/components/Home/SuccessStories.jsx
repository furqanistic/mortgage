// File: client/src/components/Home/SuccessStories.jsx
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, MapPin, Quote, Sparkles, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const SuccessStories = () => {
  const [activeStory, setActiveStory] = useState(0)
  const stories = [
    {
      id: 1,
      name: 'Sarah & Thomas',
      role: 'First-time Buyers',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop',
      quote: "Baufiking didn't just find us a loan, they engineered a financing structure that saved us €12k upfront.",
      property: {
        type: 'Penthouse',
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
      role: 'Investor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
      quote: "The speed of execution was unmatched. We closed on a multi-family unit in Berlin in record time.",
      property: {
        type: 'Multi-family',
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
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
        quote: "As an expat, the German system was terrifying. They made it transparent, logical, and surprisingly easy.",
        property: {
            type: 'Modern Loft',
            location: 'Hamburg, HafenCity',
            price: '€620,000',
            savings: '€8,500',
            image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop'
        },
        stats: { roi: '+15%', equity: '€95k', time: '4 Weeks' }
    }
  ]
  
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStory((prev) => (prev + 1) % stories.length)
    }, 8000)
    return () => clearInterval(timer)
  }, [stories.length])

  return (
    <section className='py-24 bg-background relative overflow-hidden'>
       {/* Background Decoration */}
       <div className='absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none' />

      <div className='max-w-7xl mx-auto px-6 lg:px-8 relative z-10'>
        <div className='flex flex-col md:flex-row items-end justify-between gap-8 mb-20'>
           <div className='space-y-4'>
               <div className='inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-accent text-[10px] font-bold uppercase tracking-widest border border-accent/20'>
                 <Sparkles className='w-3 h-3' /> Success Stories
               </div>
               <h2 className='text-4xl md:text-6xl font-heading font-black tracking-tighter text-foreground leading-[0.9]'>
                 Real Results <br /><span className='text-accent'>Realized</span>
               </h2>
           </div>
           
           <div className='flex gap-2'>
               {stories.map((_, idx) => (
                   <button 
                       key={idx}
                       onClick={() => setActiveStory(idx)}
                       className={`h-1.5 rounded-full transition-all duration-300 ${activeStory === idx ? 'w-8 bg-accent' : 'w-4 bg-secondary hover:bg-accent/50'}`}
                   />
               ))}
           </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            {/* Left: Testimonial & Stats */}
            <div className="lg:col-span-5 space-y-10">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeStory}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-10"
                    >
                         <div className="relative">
                              <Quote className="absolute -top-8 -left-6 w-16 h-16 text-foreground/5 rotate-180 pointer-events-none" />
                              <h3 className="text-2xl md:text-3xl font-bold leading-tight text-foreground indent-8">
                                  "{stories[activeStory].quote}"
                              </h3>
                         </div>
                         
                         <div className="flex items-center gap-4">
                             <Avatar className="w-14 h-14 border-2 border-accent">
                                 <AvatarImage src={stories[activeStory].image} className="object-cover" />
                                 <AvatarFallback>U</AvatarFallback>
                             </Avatar>
                             <div>
                                 <p className="font-black text-lg text-foreground uppercase tracking-wide">{stories[activeStory].name}</p>
                                 <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{stories[activeStory].role}</p>
                             </div>
                         </div>
                         
                         <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                             <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Timeline</p>
                                 <p className="text-xl font-black text-foreground">{stories[activeStory].stats.time}</p>
                             </div>
                             <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Equity</p>
                                 <p className="text-xl font-black text-foreground">{stories[activeStory].stats.equity}</p>
                             </div>
                             <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">ROI</p>
                                 <p className="text-xl font-black text-green-500 flex items-center gap-1">
                                     {stories[activeStory].stats.roi} <ArrowUpRight className="w-4 h-4" />
                                 </p>
                             </div>
                         </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Right: Property Image Card */}
            <div className="lg:col-span-7 relative h-[500px] w-full">
                 <AnimatePresence mode="wait">
                    <motion.div
                         key={activeStory}
                         initial={{ opacity: 0, scale: 0.95 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 1.05 }}
                         transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                         className="absolute inset-0"
                    >
                        <div className="relative h-full w-full rounded-[3rem] overflow-hidden shadow-2xl group">
                            <img 
                                src={stories[activeStory].property.image} 
                                alt={stories[activeStory].property.type}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            
                            {/* Glassmorphism Info Card */}
                            <div className="absolute bottom-8 left-8 right-8 glass rounded-3xl p-6 border border-white/20 backdrop-blur-md flex items-center justify-between">
                                <div>
                                    <div className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-[10px] font-black uppercase tracking-widest mb-2">
                                        {stories[activeStory].property.type}
                                    </div>
                                    <div className="flex items-center gap-2 text-white/90">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm font-bold uppercase tracking-wide">{stories[activeStory].property.location}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Acquired For</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">{stories[activeStory].property.price}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
      </div>
    </section>
  )
}

export default SuccessStories
