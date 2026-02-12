// File: client/src/components/Home/Partners.jsx
import { motion } from 'framer-motion'

const Partners = ({ language = 'de' }) => {
    const partners = [
        {
            name: "Deutsche Bank",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Deutsche_Bank_logo_without_wordmark.svg/1024px-Deutsche_Bank_logo_without_wordmark.svg.png"
        },
        {
            name: "Commerzbank",
            logo: "https://companieslogo.com/img/orig/CBK.F-2e335f15.png?t=1720244491"
        },
        {
            name: "Sparkasse",
            logo: "https://images.seeklogo.com/logo-png/13/1/sparkasse-logo-png_seeklogo-130014.png"
        },
        {
            name: "DKB",
            logo: "https://play-lh.googleusercontent.com/Ks2wR3vsbHjM-qVLGOWrTAvpCSQbExc0_RJvt0JXHesqJGIhHR6d5iSwVrkifs49oA"
        },
        {
            name: "Volksbank",
            logo: "https://images.seeklogo.com/logo-png/15/2/volksbank-logo-png_seeklogo-150519.png"
        },
        {
            name: "ING",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLTTTxWusLsdnDetJgPtmKHSEkpBwZYXKz8w&s"
        },
        {
            name: "PSD Bank",
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ8eJXfc82ez7frzvrV3beSSN7PKiCEHq1Kg&s"
        },
        {
            name: "Bausparkasse Schwäbisch Hall",
            logo: "https://play-lh.googleusercontent.com/a_8TkLz33oblA2NFoOdF72xqZE5qxzSY-jf-yJ6NJC3XchFABhKAA8GzKpSsW6wsf5s"
        },
        {
            name: "ImmoScout24",
            logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/ImmoScout24_Logo_2020.svg/2560px-ImmoScout24_Logo_2020.svg.png"
        }
    ]

    return (
        <section className="py-16 bg-white dark:bg-slate-950 border-y border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="font-heading text-3xl font-bold text-primary dark:text-white mb-2">
                        {language === 'en' ? 'Our Partners' : 'Unsere Partner'}
                    </h2>
                    <p className="text-muted-foreground">
                        {language === 'en' ? 'We compare over 100 banks for you' : 'Wir vergleichen über 100 Banken für Sie'}
                    </p>
                </div>
                <div className="relative overflow-hidden">
                    <motion.div
                        className="flex gap-6 w-max"
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
                    >
                        {[...partners, ...partners].map((partner, index) => (
                            <div
                                key={`${partner.name}-${index}`}
                                className="h-16 min-w-[200px] bg-secondary/40 dark:bg-white/5 border border-border/60 rounded-2xl flex items-center gap-3 text-muted-foreground font-semibold hover:border-accent/60 hover:text-accent hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 cursor-pointer text-sm md:text-base px-4"
                            >
                                <img
                                    src={partner.logo}
                                    alt={`${partner.name} logo`}
                                    className="h-7 w-7 object-contain"
                                    loading="lazy"
                                />
                                <span className="whitespace-nowrap">{partner.name}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Partners
