// File: client/src/components/Home/SuccessStories.jsx
import { motion } from 'framer-motion'
import { Heart, MapPin, Quote, Sparkles } from 'lucide-react'

const SuccessStories = () => {
    // Single real testimonial data
    const story = {
        name: 'The Family',
        role: 'Happy Homeowners',
        quote: "A big thank you from our whole family for helping us get our dream home! We had no idea about the German housing market, but you guided us through every step — from understanding the process to finding the right financing that fit our budget. What was once just a dream has now come true, thanks to your support and patience. We’ve finally moved in and couldn’t be happier! Thank you so much for everything!",
        location: 'Germany',
        image: '/Testimonials/testimonial_1.jpeg' // Using the provided image
    }

    return (
        <section className='py-24 bg-gradient-to-b from-background to-secondary/30 relative overflow-hidden'>
            {/* Background Decoration */}
            <div className='absolute top-0 right-0 w-[600px] h-[600px] bg-[#FAC51C]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 pointer-events-none' />
            <div className='absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#155FA0]/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2 pointer-events-none' />

            <div className='max-w-7xl mx-auto px-6 lg:px-8 relative z-10'>
                {/* Full Width Header */}
                <div className="mb-8 md:mb-12">
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4 max-w-5xl"
                    >
                        <div className='inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-accent text-[10px] font-bold uppercase tracking-widest border border-accent/20'>
                            <Heart className='w-3 h-3 fill-accent' /> Real Stories
                        </div>
                        <h2 className='text-3xl md:text-5xl lg:text-6xl font-heading font-black tracking-tighter text-foreground leading-none'>
                            Dreams turned into <span className='text-[#155FA0]'>Addresses.</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    
                    {/* Left: Content */}
                    <motion.div 
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-10"
                    >
                        {/* Quote & Details */}
                        <div className="relative pt-4">
                            <Quote className="absolute -top-6 -left-4 w-12 h-12 text-[#155FA0]/10 rotate-180 pointer-events-none" />
                            <blockquote className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-medium relative z-10 italic">
                                "{story.quote}"
                            </blockquote>
                        </div>

                        <div className="flex items-center gap-5 pt-4">
                            <div className="flex flex-col">
                                <span className="font-heading font-black text-xl text-foreground uppercase tracking-wide">{story.name}</span>
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{story.role}</span>
                            </div>
                             <div className="h-10 w-px bg-border/60 mx-2" />
                             <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="w-4 h-4 text-[#155FA0]" />
                                <span className="text-sm font-bold tracking-wide">{story.location}</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Image Card */}
                    {/* Right: Image Card */}
                    <div className="relative isolate px-4 md:px-0">
                        {/* Decorative Layers to Fill Space */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[#155FA0]/5 rounded-full blur-[100px] -z-20" />
                        
                        {/* Abstract Grid Pattern */}
                        <div className="absolute -top-12 -right-12 w-32 h-32 opacity-20 hidden md:block">
                             <div className="w-full h-full border-r-2 border-t-2 border-[#155FA0] rounded-tr-[2rem]" />
                        </div>
                        <div className="absolute -bottom-12 -left-12 w-32 h-32 opacity-20 hidden md:block">
                             <div className="w-full h-full border-l-2 border-b-2 border-[#FAC51C] rounded-bl-[2rem]" />
                        </div>

                        {/* Staggered Backing Cards */}
                        <motion.div 
                            initial={{ opacity: 0, rotate: -6, scale: 0.9 }}
                            whileInView={{ opacity: 1, rotate: -3, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="absolute inset-0 bg-[#FAC51C] rounded-[2.5rem] rotate-[-3deg] scale-[1.02] translate-y-4 -z-10 opacity-90"
                        />
                        <motion.div 
                            initial={{ opacity: 0, rotate: 6, scale: 0.9 }}
                            whileInView={{ opacity: 1, rotate: 2, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="absolute inset-0 bg-[#155FA0] rounded-[2.5rem] rotate-[2deg] translate-x-2 translate-y-2 -z-10 opacity-20"
                        />

                        {/* Main Image Container */}
                        <motion.div
                             initial={{ opacity: 0, scale: 0.95, y: 30 }}
                             whileInView={{ opacity: 1, scale: 1, y: 0 }}
                             viewport={{ once: true }}
                             transition={{ duration: 0.8 }}
                             className="relative z-10"
                        >
                            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white/10 group bg-card">
                                <img 
                                    src={story.image} 
                                    alt="Happy family home"
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                                />
                                
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                                {/* Floating "Dream Accomplished" Badge */}
                                <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-xl flex items-center gap-3 shadow-xl">
                                    <div>
                                        <div className="text-[8px] font-black uppercase tracking-widest text-[#FAC51C]">Mission</div>
                                        <div className="text-sm font-black text-white tracking-wide">Accomplished</div>
                                    </div>
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
