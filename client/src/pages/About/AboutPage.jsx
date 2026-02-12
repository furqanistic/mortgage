// File: client/src/pages/About/AboutPage.jsx
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Building,
  CheckCircle,
  ChevronRight,
  History,
  Lightbulb,
  MessageCircle,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react'
import { useRef } from 'react'

const AboutPage = ({ language = 'de', onLanguageChange }) => {
  const containerRef = useRef(null)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])

  const stats = [
    { value: '1,000+', label: 'Clients' },
    { value: '€10m+', label: 'Properties' },
    { value: '98%', label: 'Success' },
    { value: '4.9/5', label: 'Rating' },
  ]

  const values = [
    {
      icon: Target,
      title: 'Precision Matching',
      description: 'We use data-driven insights to match you with the perfect mortgage products.',
    },
    {
      icon: Users,
      title: 'Human-Centric',
      description: 'Behind our tech is a team of experts dedicated to your personal success.',
    },
    {
      icon: Building,
      title: 'Full Lifecycle',
      description: 'From the first search to the final set of keys, we are with you every step.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
  }

  return (
    <div className="bg-background min-h-screen flex flex-col font-body text-foreground transition-colors duration-300">
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main className="flex-grow">
        {/* Compact & High-Impact Hero */}
        <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-28 overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
            <motion.div style={{ y: y1 }} className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-[#FAC51C]/10 rounded-full blur-[80px]" />
            <motion.div style={{ y: y1 }} className="absolute top-[20%] -left-[10%] w-[300px] h-[300px] bg-[#155FA0]/5 rounded-full blur-[60px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155FA0]/10 text-[#155FA0] border border-[#155FA0]/20">
                  <Zap size={12} className="text-[#FAC51C] fill-[#FAC51C]" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">The Baufiking Mission</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tighter leading-tight text-foreground">
                  Transforming <br />
                  <span className="text-[#155FA0] underline decoration-[#FAC51C]/30 underline-offset-8">Property</span> Ownership
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-medium">
                  We combine digital intelligence with German market expertise to make home buying accessible, transparent, and completely stress-free.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button asChild className="h-12 px-8 rounded-full bg-[#155FA0] text-primary-foreground font-black text-sm uppercase tracking-widest shadow-xl shadow-[#155FA0]/20 hover:scale-105 transition-transform">
                    <a 
                      href="https://www.vermittlerregister.info/recherche?a=suche&registernummer=D-W-134-W29F-37" 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      View Portfolio
                      <ArrowRight size={16} className="ml-2" />
                    </a>
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="relative group"
              >
                <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-[2rem] overflow-hidden border border-border bg-muted shadow-2xl">
                  <img
                    src="/Ravinder.png"
                    alt="Ravinder Singh"
                    className="w-full h-full object-cover"
                  />

                </div>
                
                {/* Floating Badge removed per request */}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dynamic Stats Section */}
        <section className="py-12 sm:py-20 bg-secondary/30 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
               {stats.map((stat, idx) => (
                 <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center space-y-2"
                 >
                   <p className="text-3xl sm:text-5xl font-heading font-black text-[#155FA0]">{stat.value}</p>
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">{stat.label}</p>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* About Our Team */}
        <section className="py-16 sm:py-24 px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-foreground">
              About Our Team
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              We are a team dedicated to guiding clients through the complete home-buying journey—from the first dream to the moment you receive your keys.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              Our process is led by a certified mortgage consultant with nearly five years of experience, supported by a network of trusted partners including real estate agents, legal professionals, and service providers. With a foundation in engineering and an MBA-level understanding of finance and strategy, we combine technical expertise with practical, client-first advice.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              We believe the mortgage process should be clear, structured, and stress-free. That’s why we provide transparent guidance, step-by-step support, and the right connections at every stage of the journey.
            </p>
            <a
              href="https://www.vermittlerregister.info/recherche?a=suche&registernummer=D-W-134-W29F-37"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#155FA0] hover:text-[#0f4e83] transition-colors"
            >
              View Portfolio
              <ChevronRight size={14} />
            </a>
          </div>
        </section>

        {/* Values Section - Premium Cards */}
        <section className="py-20 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-foreground">Core <span className="text-[#155FA0]">Principles</span></h2>
            <div className="w-16 h-1 bg-[#FAC51C] mx-auto rounded-full" />
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {values.map((value, idx) => (
              <motion.div 
                key={idx}
                variants={cardVariants}
                className="group relative bg-card rounded-[2.5rem] p-10 border border-border hover:border-accent/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-accent/5"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#155FA0]/5 flex items-center justify-center mb-8 border border-border group-hover:scale-110 group-hover:bg-[#155FA0] group-hover:text-white transition-all duration-500">
                  <value.icon size={24} />
                </div>
                <h3 className="text-2xl font-heading font-black text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed italic border-l-2 border-border/50 pl-4">
                  "{value.description}"
                </p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Our Approach Section */}
        <section className="py-20 sm:py-32 bg-[#155FA0] text-primary-foreground overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
             <div className="grid lg:grid-cols-2 gap-20 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-10"
                >
                  <div className="space-y-6">
                    <h2 className="text-4xl sm:text-6xl font-heading font-black leading-tight tracking-tighter text-slate-50">Expertise Meets <br /><span className="text-[#FAC51C]">Empathy</span></h2>
                    <p className="text-lg text-primary-foreground/70 leading-relaxed font-medium">
                      The German mortgage market is complex. Our approach simplifies the math while respecting the emotional gravity of buying a home.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {[
                      { icon: History, title: 'Deep Roots', desc: 'Over a decade of navigating local banking frameworks.' },
                      { icon: Lightbulb, title: 'Smart Tech', desc: 'Proprietary platform that finds hidden rate opportunities.' },
                      { icon: MessageCircle, title: 'Always Open', desc: 'Communication is our top priority, ensuring zero blind spots.' }
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-6 group">
                         <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FAC51C] group-hover:bg-[#FAC51C] group-hover:text-[#155FA0] transition-all duration-300">
                           <item.icon size={20} />
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-xl font-black text-slate-50">{item.title}</h4>
                            <p className="text-primary-foreground/50 text-sm">{item.desc}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="relative p-6 sm:p-10 bg-white/5 backdrop-blur-xl rounded-[3rem] border border-white/10"
                >
                  <div className="grid grid-cols-2 gap-6 relative z-10">
                     <div className="space-y-6">
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                           <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000" alt="team" className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-700" />
                        </div>
                        <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                           <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000" alt="property" className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-700" />
                        </div>
                     </div>
                     <div className="space-y-6 pt-12">
                        <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                           <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000" alt="design" className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-700" />
                        </div>
                        <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                           <img src="https://images.unsplash.com/photo-1575908539614-0d196fa53506?q=80&w=1000" alt="happy family" className="w-full h-full object-cover filter brightness-75 hover:brightness-100 transition-all duration-700" />
                        </div>
                     </div>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[60px]" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px]" />
                </motion.div>
             </div>
          </div>
        </section>

        {/* Streamlined CTA Section */}
        <section className="py-24 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[3rem] bg-secondary p-12 sm:p-24 text-center space-y-8 sm:space-y-12 relative overflow-hidden border border-border"
          >
            <div className="space-y-4 sm:space-y-6 relative z-10 text-center">
              <h2 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-foreground">
                Ready to Find Your <br />
                <span className="text-[#155FA0]">Future Home?</span>
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
                Connect with our expert team today and discover how simple home ownership in Germany can be with Baufiking.
              </p>
            </div>
            

            
            {/* Visual Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--color-accent),transparent_50%)] opacity-5" />
          </motion.div>
        </section>
      </main>

      <Footer language={language} />
    </div>
  )
}

export default AboutPage
