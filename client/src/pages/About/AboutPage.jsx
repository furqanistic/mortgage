// File: client/src/pages/About/AboutPage.jsx
import ConsultationModal from '@/components/Home/ConsultationModal'
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
import { useRef, useState } from 'react'

const AboutPage = ({ language = 'de', onLanguageChange }) => {
  const containerRef = useRef(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])



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
            <motion.div style={{ y: y1 }} className="absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px]" />
            <motion.div style={{ y: y1 }} className="absolute top-[20%] -left-[10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[60px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 sm:space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Zap size={12} className="text-accent fill-accent" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">The Baufiking Mission</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tighter leading-tight text-foreground">
                  Transforming <br />
                  <span className="text-primary underline decoration-accent/30 underline-offset-8">Property</span> Ownership
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl font-medium">
                  We combine digital intelligence with German market expertise to make home buying accessible, transparent, and completely stress-free.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button asChild className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-transform">
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

        {/* Team Section - Redesigned & Moved Above Story */}
        <section className="py-24 relative overflow-hidden bg-background">
          {/* Decorative Background Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15rem] font-black text-primary/5 pointer-events-none select-none uppercase tracking-tighter hidden lg:block">
            Team
          </div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <Users size={12} className="text-accent fill-accent" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">The Minds Behind Baufiking</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-heading font-black tracking-tight text-foreground leading-[1.1]">
                  First our <span className="text-primary italic">team</span>
                </h2>
              </div>
              <p className="text-muted-foreground text-lg font-medium max-w-md lg:text-right pb-2">
                Merging elite financial expertise with cutting-edge AI to redefine the German mortgage landscape.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
              {[
                { name: 'Ravinder Singh', title: 'Founder & Financing Architect', image: '/Ravinder.png', delay: 0 },
                { name: 'Satpal Singh', title: 'Sales and Marketing', image: '/Satpal.png', delay: 0.15 },
                { name: 'Clara', title: 'AI Assistant', image: '/clara.jpg', delay: 0.3 }
              ].map((member, idx) => (
                <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: member.delay, duration: 0.8 }}
                  className={`group relative ${idx === 1 ? 'md:mt-12' : ''} ${idx === 2 ? 'md:mt-24' : ''}`}
                >
                  <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-muted shadow-2xl transition-transform duration-700 group-hover:-translate-y-4">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-all duration-700 grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100" 
                    />
                    
                    {/* Glass Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    
                    {/* Floating Info Card */}
                    <div className="absolute bottom-6 left-6 right-6 p-6 rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <h3 className="text-xl font-heading font-bold text-white mb-1">{member.name}</h3>
                      <p className="text-primary-foreground/80 text-xs font-bold uppercase tracking-widest">{member.title}</p>
                    </div>
                  </div>
                  
                  {/* Static Info for Mobile/Non-hover */}
                  <div className="mt-8 group-hover:opacity-0 transition-opacity duration-300">
                    <h3 className="text-2xl font-heading font-black text-foreground">{member.name}</h3>
                    <p className="text-primary font-bold text-sm uppercase tracking-widest mt-1">{member.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 sm:py-32 px-6 lg:px-8 max-w-4xl mx-auto border-t border-border/50">
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-foreground">
              Our Story: Beyond the Interest Rate
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              Most people view buying property in Germany as a transaction. At Baufiking, we see it as a design challenge.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              The idea for Baufiking was born from a simple observation: the German mortgage market is efficient at providing numbers, but remarkably poor at providing vision. We watched first-time buyers and expats navigate 30-year commitments guided by nothing more than a spreadsheet and a temporary interest rate.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              We knew there was a better way.
            </p>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              We believe that a property decision shouldn’t just clear a bank’s checklist; it should be the foundation of your long-term wealth. You shouldn’t have to choose between a “dream home” and a “smart investment.” With the right structure, they are the same thing.
            </p>

            <h3 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-foreground pt-4">
              The Baufiking Philosophy
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              We moved away from the “broker” model to become Financing Architects. Whether you are settling in Germany for the first time or expanding a professional portfolio, our approach is built on three pillars:
            </p>
            <ul className="space-y-3 text-base sm:text-lg text-muted-foreground leading-relaxed font-medium list-disc list-inside">
              <li>
                <span className="font-semibold text-foreground">Foresight:</span> We look 10, 20, and 30 years ahead to ensure your “now” doesn’t compromise your “later.”
              </li>
              <li>
                <span className="font-semibold text-foreground">Structure:</span> We design financing architecture that optimizes tax benefits and repayment flexibility.
              </li>
              <li>
                <span className="font-semibold text-foreground">Care:</span> We act as your advocate, coordinating the chaos of evaluations and approvals so you don’t have to.
              </li>
            </ul>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              From the first sparked “Dream” to the moment you turn the “Key,” we provide the clarity that a life-changing decision deserves.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <a
                href="https://www.vermittlerregister.info/recherche?a=suche&registernummer=D-W-134-W29F-37"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
              >
                View Portfolio
                <ChevronRight size={14} />
              </a>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
              >
                Book Your Strategic Discovery Session
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>



        {/* Values Section - Premium Cards */}

        <section className="py-20 sm:py-32 px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-foreground">Core <span className="text-primary">Principles</span></h2>
            <div className="w-16 h-1 bg-accent mx-auto rounded-full" />
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
                <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-8 border border-border group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
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

      </main>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
      />
      <Footer language={language} />
    </div>
  )
}

export default AboutPage
