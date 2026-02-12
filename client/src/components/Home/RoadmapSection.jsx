// File: client/src/components/Home/RoadmapSection.jsx
import { FileText, Phone, BarChart, Key } from 'lucide-react'
import { motion } from 'framer-motion'

const RoadmapSection = ({ language = 'de' }) => {
  const steps = language === 'en'
    ? [
        {
          icon: FileText,
          title: "Free Consultation",
          description: "30-45 minute personal conversation. We analyze your situation and wishes."
        },
        {
          icon: Phone,
          title: "Compare Offers",
          description: "Over 100 banks compared. We find the best conditions for you."
        },
        {
          icon: BarChart,
          title: "Secure Financing",
          description: "Best rate guarantee. Fast approval through our expertise."
        },
        {
          icon: Key,
          title: "Sign & Move In",
          description: "We accompany you until key handover. Your dream becomes reality!"
        }
      ]
    : [
        {
          icon: FileText,
          title: "1. Antrag stellen",
          description: "Füllen Sie unser einfaches Online-Formular in nur 2 Minuten aus. Unverbindlich & kostenlos."
        },
        {
          icon: Phone,
          title: "2. Beratung erhalten",
          description: "Ein Finanzierungsexperte meldet sich bei Ihnen, um Ihre Wünsche und Möglichkeiten zu besprechen."
        },
        {
          icon: BarChart,
          title: "3. Angebote vergleichen",
          description: "Wir vergleichen Angebote von über 500 Banken und finden die besten Zinsen für Sie."
        },
        {
          icon: Key,
          title: "4. Abschluss & Einzug",
          description: "Wir begleiten Sie bis zum Notartermin und zur Schlüsselübergabe. Willkommen zuhause!"
        }
      ]

  return (
    <section id="how-it-works" className="py-24 bg-secondary/30 dark:bg-secondary/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary dark:text-white mb-4">
            {language === 'en' ? 'Your Path to' : 'Ihr Weg zum'}
            <span className="block sm:inline"> </span>
            {language === 'en' ? 'Homeownership' : 'Eigenheim'}
          </h2>
          <p className="text-muted-foreground text-lg text-primary/80 dark:text-muted-foreground">
            {language === 'en'
              ? 'Four simple steps to your dream home – we guide you every step of the way'
              : 'In 4 einfachen Schritten zur perfekten Finanzierung'}
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-accent/20 via-accent to-accent/20 -z-10" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-full bg-background border-4 border-accent/20 flex items-center justify-center mb-6 shadow-lg relative group-hover:scale-110 transition-transform duration-300">
                <div className="absolute inset-2 bg-accent/10 rounded-full" />
                <step.icon className="w-10 h-10 text-accent relative z-10" />
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md">
                  {index + 1}
                </div>
              </div>
              <h3 className="font-heading text-xl font-bold text-primary dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RoadmapSection
