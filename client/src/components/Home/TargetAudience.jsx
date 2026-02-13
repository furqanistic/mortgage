// File: client/src/components/Home/TargetAudience.jsx
import { Home, RefreshCw, Globe, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const TargetAudience = ({ language = 'de' }) => {
    const audiences = language === 'en'
        ? [
            {
                icon: Home,
                title: "First-Time Buyers",
                subtitle: "Your first home purchase",
                description: "Your first home purchase? We guide you step by step and explain every process clearly.",
                features: [],
                cta: "Learn More"
            },
            {
                icon: Globe,
                title: "Expats & International",
                subtitle: "New to Germany",
                description: "New to Germany? We speak your language and know the special requirements for international buyers.",
                features: [],
                cta: "Learn More"
            },
            {
                icon: RefreshCw,
                title: "Investors",
                subtitle: "Strategic financing",
                description: "Strategic financing solutions focused on sustainable wealth growth and intelligent tax optimisation.",
                features: [],
                cta: "Check Now"
            }
        ]
        : [
            {
                icon: Home,
                title: "Erstkäufer",
                subtitle: "Endlich ins Eigenheim",
                description: "Wir führen Sie sicher durch den Dschungel der Immobilienfinanzierung. Von Förderungen bis zur Schlüsselübergabe.",
                features: [],
                cta: "Mehr erfahren"
            },
            {
                icon: RefreshCw,
                title: "Anschlussfinanzierung",
                subtitle: "Bessere Zinsen sichern",
                description: "Ihre Zinsbindung läuft aus? Sichern Sie sich jetzt günstige Konditionen für die Zukunft, bis zu 5 Jahre im Voraus.",
                features: [],
                cta: "Mehr erfahren"
            },
            {
                icon: Globe,
                title: "Kapitalanleger",
                subtitle: "Vermögen aufbauen",
                description: "Maßgeschneiderte Konzepte für Ihre Rendite-Immobile. Hebeln Sie Ihr Eigenkapital effektiv.",
                features: [],
                cta: "Mehr erfahren"
            }
        ]

    return (
        <section id="for-whom" className="py-24 section-padding bg-gradient-to-b from-[#faf8f5] to-white dark:from-[#0a0a0a] dark:to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="text-accent font-bold uppercase tracking-widest text-sm block mb-2">
                        {language === 'en' ? 'Who We Help' : 'Für wen wir da sind'}
                    </span>
                    <h2 className="font-heading text-4xl font-bold text-primary dark:text-white mb-4">
                        {language === 'en' ? 'Specialized advice for your individual situation' : 'Finanzierungslösungen für jede Situation'}
                    </h2>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {audiences.map((item, index) => (
                        <div key={index} className="bg-white dark:bg-card border border-border/50 rounded-2xl p-8 hover:border-accent hover:shadow-2xl transition-all duration-300 group flex flex-col">
                            <div className="w-16 h-16 rounded-xl bg-primary/5 dark:bg-white/5 flex items-center justify-center text-primary dark:text-white mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                <item.icon className="w-8 h-8" />
                            </div>

                            <h3 className="font-heading text-2xl font-bold text-primary dark:text-white mb-1">
                                {item.title}
                            </h3>
                            <p className="text-accent font-medium mb-4">{item.subtitle}</p>

                            <p className="text-muted-foreground mb-8 flex-grow">
                                {item.description}
                            </p>

                            {item.features.length > 0 && (
                                <ul className="space-y-3 mb-8">
                                    {item.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-foreground/80">
                                            <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <Button variant="outline" className="w-full border-primary/20 hover:bg-primary hover:text-white dark:border-white/20 dark:hover:bg-white dark:hover:text-black transition-colors">
                                {item.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default TargetAudience
