// File: client/src/components/Home/FAQ.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null)

    const faqs = [
        {
            question: "Wie viel Eigenkapital benötige ich?",
            answer: "In der Regel empfehlen wir mindestens 10-20% des Kaufpreises als Eigenkapital, um die Nebenkosten zu decken und bessere Zinsen zu erhalten. Es sind jedoch auch 100%-Finanzierungen möglich, abhängig von Ihrer Bonität."
        },
        {
            question: "Wie lange dauert eine Finanzierungszusage?",
            answer: "Mit Baufiking erhalten Sie eine erste Einschätzung oft schon innerhalb von 24 Stunden. Eine verbindliche Bankzusage dauert in der Regel 3-7 Werktage, je nach Vollständigkeit Ihrer Unterlagen."
        },
        {
            question: "Welche Unterlagen werden benötigt?",
            answer: "Standardmäßig benötigen Sie: Einkommensnachweise der letzten 3 Monate, den letzten Steuerbescheid, Personalausweis und Informationen zum Objekt (Exposé, Grundbuchauszug)."
        },
        {
            question: "Kann ich Sondertilgungen leisten?",
            answer: "Ja, wir verhandeln standardmäßig die Option auf 5% Sondertilgung pro Jahr für Sie. Höhere Sondertilgungsrechte können oft gegen einen geringen Zinsaufschlag vereinbart werden."
        },
        {
            question: "Was passiert, wenn die Zinsen weiter steigen?",
            answer: "Wir empfehlen oft längere Zinsbindungen (15, 20 oder 30 Jahre), um Sie vor steigenden Zinsen zu schützen. Ein Forward-Darlehen kann zudem helfen, sich heutige Zinsen für die Zukunft zu sichern."
        }
    ]

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index)
    }

    return (
        <section id="basics" className="py-24 bg-secondary/30 dark:bg-secondary/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl font-bold text-primary dark:text-white mb-4">
                        Häufig gestellte Fragen
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Alles was Sie über Baufinanzierung wissen müssen
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`bg-white dark:bg-card border rounded-xl overflow-hidden transition-all duration-300 ${activeIndex === index ? 'border-accent shadow-md' : 'border-border hover:border-accent/50'
                                }`}
                        >
                            <button
                                className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                                onClick={() => toggleFAQ(index)}
                            >
                                <span className={`font-bold text-lg ${activeIndex === index ? 'text-primary dark:text-white' : 'text-foreground/80'}`}>
                                    {faq.question}
                                </span>
                                <span className={`transform transition-transform duration-300 ${activeIndex === index ? 'rotate-180 text-accent' : 'text-muted-foreground'}`}>
                                    {activeIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {activeIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default FAQ
