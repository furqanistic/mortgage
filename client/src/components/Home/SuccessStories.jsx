// File: client/src/components/Home/SuccessStories.jsx
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'
import { useEffect, useState } from 'react'

const SuccessStories = ({ language = 'de' }) => {
    const [api, setApi] = useState(null)

    useEffect(() => {
        if (!api) return
        const interval = setInterval(() => {
            api.scrollNext()
        }, 6000)
        return () => clearInterval(interval)
    }, [api])

    const testimonials = [
        {
            name: "Deepika Rajput & Jagdish Rawat",
            role: language === 'en' ? "Home Buyers" : "Hauskauf",
            text: "A big thank you from our whole family for helping us get our dream home! We had no idea about the German housing market, but you guided us through every step — from understanding the process to finding the right financing that fit our budget. What was once just a dream has now come true, thanks to your support and patience. We’ve finally moved in and couldn’t be happier! Thank you so much for everything!",
            initials: "DR",
            image: "/Testimonials/testimonial_1.jpeg"
        },
        {
            name: "Mr Charanjit Singh Grewal",
            role: language === 'en' ? "Home Buyers" : "Hauskauf",
            text: "From the very first call, I felt confident I was in the right hands. They explained every option clearly, secured a great rate, and handled the paperwork without stress. I moved in earlier than expected and the monthly payments fit perfectly with my plan.",
            initials: "CS",
            image: "/Testimonials/testimonial_3.jpeg"
        },
        {
            name: "Mubashir Ali",
            role: language === 'en' ? "Home Buyer" : "Hauskauf",
            text: "Professional, patient, and truly honest advice. They compared multiple banks and negotiated terms that saved me money every month. The whole process was transparent, fast, and far easier than I imagined.",
            initials: "GM",
            image: "/Testimonials/testimonial_2.jpeg"
        }
    ]

    return (
        <section id="testimonials" className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-heading text-4xl font-bold text-primary dark:text-white mb-4">
                        {language === 'en' ? 'What Our Clients Say' : 'Was unsere Kunden sagen'}
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        {language === 'en'
                            ? 'Real experiences from people who financed their dream home with us'
                            : 'Vertrauen ist gut, Erfahrung ist besser. Das sagen Hausbesitzer über uns.'}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <Carousel opts={{ align: 'start', loop: true }} setApi={setApi} className="relative">
                        <CarouselContent>
                            {testimonials.map((item, index) => (
                                <CarouselItem key={index}>
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                        viewport={{ once: true }}
                                        className="bg-card dark:bg-card border border-border rounded-3xl shadow-sm hover:shadow-xl transition-shadow relative overflow-hidden grid lg:grid-cols-2 min-h-[520px]"
                                    >
                                        <div className="relative h-72 sm:h-full min-h-[280px]">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="p-8 sm:p-10 flex flex-col justify-center">
                                            <Quote className="w-12 h-12 text-accent/20 mb-6" />

                                            <div className="mb-6">
                                                <div className="font-bold text-primary dark:text-white">{item.name}</div>
                                                <div className="text-xs text-accent font-medium uppercase tracking-wider">{item.role}</div>
                                            </div>

                                            <p className="text-muted-foreground italic leading-relaxed">
                                                "{item.text}"
                                            </p>
                                        </div>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-4 sm:-left-12" />
                        <CarouselNext className="-right-4 sm:-right-12" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}

export default SuccessStories
