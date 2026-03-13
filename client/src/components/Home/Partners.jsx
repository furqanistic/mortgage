// File: client/src/components/Home/Partners.jsx
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { defaultPartners } from '@/data/contentDefaults'
import { getPartners } from '@/services/contentApi'

const Partners = ({ language = 'de' }) => {
    const [partners, setPartners] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadPartners = async () => {
            try {
                const response = await getPartners()
                setPartners(response.length ? response : defaultPartners)
            } catch (error) {
                setPartners(defaultPartners)
            } finally {
                setIsLoading(false)
            }
        }

        loadPartners()
    }, [])

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
                    {isLoading ? (
                        <div className="flex gap-6 overflow-hidden">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-16 min-w-[200px] animate-pulse rounded-2xl border border-border/60 bg-secondary/40"
                                />
                            ))}
                        </div>
                    ) : (
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
                                        src={partner.logoUrl}
                                        alt={`${partner.name} logo`}
                                        className="h-7 w-7 object-contain"
                                        loading="lazy"
                                    />
                                    <span className="whitespace-nowrap">{partner.name}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Partners
