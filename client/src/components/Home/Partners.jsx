// File: client/src/components/Home/Partners.jsx
import { motion } from 'framer-motion'

const Partners = () => {
    const partners = [
        "Deutsche Bank", "Commerzbank", "ING", "DKB", "Sparkasse", "+ 95 mehr"
    ]

    return (
        <section className="py-16 bg-white dark:bg-slate-950 border-y border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="font-heading text-3xl font-bold text-primary dark:text-white mb-2">
                        Unsere Partner
                    </h2>
                    <p className="text-muted-foreground">
                        Wir vergleichen über 100 Banken für Sie
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="h-16 bg-secondary/50 dark:bg-white/5 border-2 border-border/50 rounded-xl flex items-center justify-center text-muted-foreground font-semibold hover:border-accent hover:text-accent hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer text-sm md:text-base"
                        >
                            {partner}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Partners
