// File: client/src/components/Home/SuccessStories.jsx
import { Quote } from 'lucide-react'
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const SuccessStories = () => {
    const testimonials = [
        {
            name: "Julia & Thomas Müller",
            role: "Erstkäufer",
            text: "Dank Baufiking haben wir unsere Traumfinanzierung gefunden, obwohl unsere Bank zunächst abgelehnt hatte. Die Beratung war erstklassig und super persönlich.",
            initials: "JM"
        },
        {
            name: "Markus Weber",
            role: "Kapitalanleger",
            text: "Schnell, effizient und professionell. Für meine dritte Immobilie habe ich direkt wieder hier angefragt. Die Konditionen sind unschlagbar.",
            initials: "MW"
        },
        {
            name: "Sarah K.",
            role: "Anschlussfinanzierung",
            text: "Ich habe durch den Wechsel und die Umschuldung fast 200€ im Monat gespart. Der Prozess war viel einfacher als gedacht.",
            initials: "SK"
        }
    ]

    return (
        <section id="testimonials" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl font-bold text-primary dark:text-white mb-4">
                        Was unsere Kunden sagen
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Vertrauen ist gut, Erfahrung ist besser. Das sagen Hausbesitzer über uns.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-card dark:bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow relative"
                        >
                            <Quote className="w-12 h-12 text-accent/20 absolute top-6 right-6" />

                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="h-12 w-12 border-2 border-accent/20">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-primary/5 text-primary font-bold dark:bg-primary/20 dark:text-white">
                                        {item.initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-bold text-primary dark:text-white">{item.name}</div>
                                    <div className="text-xs text-accent font-medium uppercase tracking-wider">{item.role}</div>
                                </div>
                            </div>

                            <p className="text-muted-foreground italic leading-relaxed">
                                "{item.text}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default SuccessStories
