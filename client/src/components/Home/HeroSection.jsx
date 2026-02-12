// File: client/src/components/Home/HeroSection.jsx
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Home, Landmark, Star, ArrowRight } from 'lucide-react'

const HeroSection = ({ language = 'de' }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  }

  const copy = language === 'en'
    ? {
        title: {
          lead: 'Your Path to',
          highlight: 'Homeownership',
          tail: 'Starts Here',
        },
        subheadline:
          'Independent Advice • Best Rates • Personal Support – We guide you step by step on your journey to your dream home.',
        ctaPrimary: 'Book Free Consultation',
        ctaSecondary: 'Calculate Financing',
        trust: [
          { value: '500+', label: 'Happy Clients' },
          { value: '4.9/5', label: 'Client Rating' },
          { value: '100+', label: 'Bank Partners' },
        ],
        placeholderTitle: 'Happy Family with House Keys',
        placeholderSubtitle: '(Image Placeholder)',
        savingsLabel: 'Average Savings',
      }
    : {
        title: {
          lead: 'Ihr Weg zum',
          highlight: 'Eigenheim',
          tail: 'beginnt hier',
        },
        subheadline:
          'Unabhängige Beratung • Beste Konditionen • Persönliche Betreuung – Wir begleiten Sie Schritt für Schritt auf Ihrer Reise zum Traumhaus.',
        ctaPrimary: 'Kostenlose Beratung vereinbaren',
        ctaSecondary: 'Finanzierung berechnen',
        trust: [
          { value: '500+', label: 'Zufriedene Kunden' },
          { value: '4.9/5', label: 'Kundenbewertung' },
          { value: '100+', label: 'Banken Partner' },
        ],
        placeholderTitle: 'Glückliche Familie mit Hausschlüsseln',
        placeholderSubtitle: '(Image Placeholder)',
        savingsLabel: 'Durchschnittliche Ersparnis',
      }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#faf8f5] to-white dark:from-slate-950 dark:to-slate-900 pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Background Decorative Element */}
      <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl animate-float opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-left relative z-30"
          >
            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl sm:text-5xl lg:text-7xl font-bold text-primary dark:text-white leading-[1.1] mb-6"
            >
              {copy.title.lead} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/80">
                {copy.title.highlight}
              </span>{' '}
              {copy.title.tail}
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl"
            >
              {copy.subheadline}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 mb-12"
            >
              <Button
                size="lg"
                className="w-full sm:flex-1 min-w-0 bg-primary hover:bg-primary/90 text-white font-semibold h-11 sm:h-13 px-3 sm:px-6 text-sm sm:text-sm md:text-base leading-tight text-center shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                {copy.ctaPrimary}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:flex-1 min-w-0 border-primary text-primary hover:bg-primary hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primary font-semibold h-11 sm:h-13 px-3 sm:px-6 text-sm sm:text-sm md:text-base leading-tight text-center transition-all"
              >
                {copy.ctaSecondary}
              </Button>
            </motion.div>

          </motion.div>

          {/* Right Column: Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="relative z-10"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/10 border border-white/20 dark:border-white/10 aspect-[4/5] lg:aspect-square group">
              {/* Background overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/20 z-10 pointer-events-none" />

              {/* Hero Image */}
              <div className="w-full h-full bg-secondary dark:bg-slate-800 relative overflow-hidden">
                <img
                  src="/family-in-berlin.png"
                  alt={copy.placeholderTitle}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="absolute bottom-8 left-8 right-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl shadow-xl z-30 border border-white/50 dark:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <span className="font-bold text-lg">€</span>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground font-medium">{copy.savingsLabel}</div>
                    <div className="text-2xl font-bold text-primary dark:text-white">€24.500</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default HeroSection
