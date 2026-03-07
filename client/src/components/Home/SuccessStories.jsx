// File: client/src/components/Home/SuccessStories.jsx
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel'
import { Quote, Star } from 'lucide-react'
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
        },
        {
            name: "Anonymous Client",
            role: language === 'en' ? "Home Buyer" : "Hauskauf",
            text: "Buying a house in Germany felt overwhelming due to the bureaucracy and language barrier, but Ravinder Singh made the entire process smooth and stress-free. His expertise and insights were invaluable, and he guided me every step of the way. He is incredibly polite, genuine, and supportive, which made the experience even better. I highly recommend his services and am extremely satisfied with the support he provided.",
            initials: "AC",
            image: "/Testimonials/testimonial_4.jpeg"
        }
    ]

    return (
        <section id="testimonials" className="relative overflow-hidden py-24 bg-gradient-to-b from-background via-secondary/20 to-background">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-20 -left-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
                <div className="absolute -bottom-20 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-accent mb-5">
                        {language === 'en' ? 'Client Testimonials' : 'Kundenstimmen'}
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
                        {language === 'en' ? 'What Our Clients Say' : 'Was unsere Kunden sagen'}
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        {language === 'en'
                            ? 'Real experiences from people who financed their dream home with us'
                            : 'Vertrauen ist gut, Erfahrung ist besser. Das sagen Hausbesitzer über uns.'}
                    </p>
                </div>

                <div className="max-w-5xl mx-auto">
                    <Carousel opts={{ align: 'start', loop: true }} setApi={setApi} className="relative">
                        <CarouselContent className="items-stretch">
                            {testimonials.map((item, index) => (
                                <CarouselItem key={index} className="basis-full">
                                    <div className="group bg-card/90 backdrop-blur-sm dark:bg-card/80 border border-border/70 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden h-full">
                                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-accent/40 via-primary/50 to-accent/40" />
                                        <div className="p-8 sm:p-10">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-14 w-14 rounded-full overflow-hidden ring-2 ring-accent/40 shadow-sm shrink-0">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-primary dark:text-white">{item.name}</div>
                                                        <div className="text-xs text-accent font-medium uppercase tracking-wider">{item.role}</div>
                                                        <div className="flex items-center gap-1 mt-2 text-amber-500">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className="w-3.5 h-3.5 fill-current" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="self-start sm:self-auto rounded-full border border-accent/20 bg-accent/10 p-3 text-accent/70 group-hover:scale-105 transition-transform">
                                                    <Quote className="w-5 h-5" />
                                                </div>
                                            </div>

                                            <div className="rounded-2xl bg-secondary/40 dark:bg-white/5 border border-border/60 p-6">
                                                <p className="text-muted-foreground leading-relaxed">
                                                    "{item.text}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-3 sm:-left-12 h-11 w-11 border-border/80 bg-background/90 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground" />
                        <CarouselNext className="-right-3 sm:-right-12 h-11 w-11 border-border/80 bg-background/90 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}

export default SuccessStories
