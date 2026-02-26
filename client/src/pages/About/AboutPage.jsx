// File: client/src/pages/About/AboutPage.jsx
import ConsultationModal from '@/components/Home/ConsultationModal'
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { motion } from 'framer-motion'
import {
  Building,
  ChevronRight,
  Target,
  Users,
} from 'lucide-react'
import { useState } from 'react'

const AboutPage = ({ language = 'de', onLanguageChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
  const teamMembers = [
    { name: 'Ravinder Singh', title: 'Founder & Financing Architect', image: '/Ravinder.png' },
    { name: 'Satpal Singh', title: 'Sales and Marketing', image: 'https://cdn-icons-png.flaticon.com/512/180/180644.png' },
    { name: 'Clara', title: 'AI Assistant', image: 'https://img.freepik.com/premium-photo/friendly-looking-ai-agent-as-logo-white-background-style-raw-job-id-46affbb8a10a4e9196375b977bd1_343960-69668.jpg' },
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
        {/* Our Story */}
        <section className="py-20 sm:py-24 px-6 lg:px-8 max-w-4xl mx-auto border-b border-border/50">
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
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors"
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

        {/* Team Section - Minimal */}
        <section className="py-16 sm:py-20 bg-background border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
                <Users size={12} className="text-accent fill-accent" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Our Team</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-heading font-black tracking-tight text-foreground">
                Meet the people behind Baufiking
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                A focused team blending financing expertise, market strategy, and AI-driven support.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member, index) => (
                <motion.article
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.55 }}
                  className="rounded-2xl bg-card p-6 border border-border shadow-sm"
                >
                  <div className="aspect-square rounded-xl overflow-hidden bg-muted mb-5">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">{member.name}</h3>
                  <p className="text-primary text-sm font-semibold mt-1">{member.title}</p>
                </motion.article>
              ))}
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
