// File: client/src/components/Home/HeroSection.jsx
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Home, Landmark, Star, ArrowRight } from 'lucide-react'

const HeroSection = () => {
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
              className="font-heading text-5xl lg:text-7xl font-bold text-primary dark:text-white leading-[1.1] mb-6"
            >
              Ihr Weg zum <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/80">
                Eigenheim
              </span> beginnt hier
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="text-lg lg:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl"
            >
              <span className="font-semibold text-accent">Unabhängige Beratung</span> • <span className="font-semibold text-accent">Beste Konditionen</span> • <span className="font-semibold text-accent">Persönliche Betreuung</span> – Wir begleiten Sie Schritt für Schritt auf Ihrer Reise zum Traumhaus.
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-8 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all">
                Kostenlose Beratung vereinbaren
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-primary font-bold h-14 px-8 text-lg transition-all whitespace-nowrap">
                Finanzierung berechnen
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-8 lg:gap-12 pt-4 border-t border-border/50"
            >
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-xl text-primary dark:text-white">500+</div>
                  <div className="text-sm text-muted-foreground">Zufriedene Kunden</div>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-xl text-primary dark:text-white">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Kundenbewertung</div>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold text-xl text-primary dark:text-white">100+</div>
                  <div className="text-sm text-muted-foreground">Banken Partner</div>
                </div>
              </div>
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

              {/* Image Placeholder */}
              <div className="w-full h-full bg-secondary dark:bg-slate-800 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
                {/* Abstract shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <Home className="w-24 h-24 text-primary/20 dark:text-white/20 mb-6" />
                <h3 className="font-heading text-2xl font-bold text-primary dark:text-white mb-2 z-20">
                  Glückliche Familie mit Hausschlüsseln
                </h3>
                <p className="text-muted-foreground z-20">
                  (Image Placeholder)
                </p>
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
                    <div className="text-sm text-muted-foreground font-medium">Durchschnittliche Ersparnis</div>
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
