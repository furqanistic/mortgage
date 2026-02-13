// File: client/src/components/Home/ValueProps.jsx
import { motion } from 'framer-motion'

const ValueProps = ({ language = 'de' }) => {
    const values = language === 'en'
        ? [
            {
                icon: "⚡",
                title: "Fast & Easy",
                description: "Pre-approval in 24 hours. Digital process without paperwork. Transparent communication at every step."
            },
            {
                icon: "💰",
                title: "Best Rates",
                description: "Compare over 100 banks. We negotiate the best interest rates for you. Guaranteed independent advice."
            },
            {
                icon: "🤝",
                title: "Personal Support",
                description: "Expert advice in German and English. Complete support from start to finish. Your success is our success."
            }
        ]
        : [
            {
                icon: "⚡",
                title: "Schnell & Einfach",
                description: "Vorabgenehmigung in 24 Stunden. Digitaler Prozess ohne Papierkram. Transparente Kommunikation in jedem Schritt."
            },
            {
                icon: "💰",
                title: "Beste Konditionen",
                description: "Vergleich von über 100 Banken. Wir verhandeln die besten Zinssätze für Sie. Garantiert unabhängige Beratung."
            },
            {
                icon: "🤝",
                title: "Persönliche Betreuung",
                description: "Expertenberatung auf Deutsch und Englisch. Vollständige Unterstützung von Anfang bis Ende. Ihr Erfolg ist unser Erfolg."
            }
        ]

    return (
        <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="font-heading text-4xl font-bold text-primary dark:text-white mb-4">
                        {language === 'en' ? 'Why Choose Baufiking?' : 'Warum Baufiking wählen?'}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {language === 'en'
                            ? 'Your advantages at a glance – we make home financing simple, transparent, and successful.'
                            : 'Ihre Vorteile auf einen Blick – wir machen Hausfinanzierung einfach, transparent und erfolgreich.'}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {values.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            viewport={{ once: true }}
                            className="bg-secondary/30 dark:bg-secondary/10 p-8 rounded-2xl hover:-translate-y-2 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-accent/20 group"
                        >
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-6 mx-auto shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500 text-4xl">
                                {item.icon}
                            </div>
                            <h3 className="font-heading text-xl font-bold text-primary dark:text-white mb-4 text-center">
                                {item.title}
                            </h3>
                            <p className="text-muted-foreground text-center leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default ValueProps
