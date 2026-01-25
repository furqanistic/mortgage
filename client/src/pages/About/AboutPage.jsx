// File: client/src/pages/About/AboutPage.jsx
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Award,
  Building,
  ChevronRight,
  Star,
  Target,
  Users,
} from 'lucide-react'
import React from 'react'

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.21, 0.45, 0.32, 0.9],
      },
    },
  }

  const stats = [
    { value: '1,000+', label: 'Happy Clients' },
    { value: '€10m+', label: 'Properties Handled' },
    { value: '98%', label: 'Success Rate' },
    { value: '4.9/5', label: 'Client Rating' },
  ]

  const features = [
    {
      icon: Target,
      title: 'Smart Matching',
      description: 'AI-powered property recommendations',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 guidance throughout your journey',
    },
    {
      icon: Building,
      title: 'Complete Coverage',
      description: 'From search to final handover',
    },
  ]

  return (
    <div className="font-body selection:bg-accent/30">
      <Navbar />
      <main className="min-h-screen bg-background transition-colors duration-500">
        
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid lg:grid-cols-2 gap-16 items-center"
            >
              <div className="space-y-10">
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/10 dark:border-accent/20 bg-primary/5 dark:bg-accent/5"
                >
                  <Star className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold tracking-wider uppercase text-primary dark:text-accent">
                    Trusted by 15,000+ Homebuyers
                  </span>
                </motion.div>

                <motion.h1 
                  variants={itemVariants}
                  className="text-5xl lg:text-7xl font-bold font-heading leading-[1.1] text-foreground"
                >
                  Making Home <br />
                  <span className="text-accent">Ownership</span> Simple
                </motion.h1>

                <motion.p 
                  variants={itemVariants}
                  className="text-xl text-muted-foreground leading-relaxed max-w-xl"
                >
                  We combine AI innovation with expert guidance to transform
                  your German home buying journey into a seamless experience.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-wrap gap-5">
                  <Button
                    className="bg-primary dark:bg-accent text-primary-foreground dark:text-accent-foreground hover:opacity-90 transition-all h-14 px-10 rounded-full text-lg font-medium shadow-xl shadow-primary/10 dark:shadow-accent/10"
                    onClick={() => {}}
                  >
                    Start Your Journey
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </motion.div>
              </div>

              <motion.div variants={itemVariants} className="relative group">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-primary/5 dark:bg-accent/5 border border-primary/10 dark:border-accent/20 shadow-2xl">
                  <img
                    src="/Logo.svg"
                    alt="About Baufiking"
                    className="w-full h-full object-contain p-12 transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Floating Badge */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  className="absolute -bottom-8 -left-8 bg-card shadow-2xl p-8 rounded-3xl border border-border hidden md:block"
                >
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-accent/10 rounded-2xl">
                      <Award className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-foreground">
                        Top Rated
                      </p>
                      <p className="text-sm text-muted-foreground">
                        in Property Tech
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 bg-primary text-primary-foreground dark:bg-accent/5 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl lg:text-5xl font-bold font-heading text-accent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-sm tracking-widest uppercase font-medium text-primary-foreground/70 dark:text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-32 lg:py-48">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <div className="space-y-6">
                  <h2 className="text-4xl lg:text-5xl font-bold font-heading text-foreground">
                    Our Mission
                  </h2>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    We believe that everyone deserves their dream home in Germany.
                    Through our AI-powered platform and expert guidance, we're
                    making the complex journey of home buying accessible and
                    stress-free for all.
                  </p>
                </div>

                <div className="grid gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex items-start gap-6 p-6 rounded-3xl border border-transparent hover:border-primary/10 dark:hover:border-accent/20 hover:bg-primary/5 dark:hover:bg-accent/5 transition-all duration-300"
                    >
                      <div className="shrink-0 p-4 rounded-2xl bg-primary/5 dark:bg-accent/10 text-primary dark:text-accent group-hover:bg-primary dark:group-hover:bg-accent group-hover:text-primary-foreground dark:group-hover:text-accent-foreground transition-colors">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative grid grid-cols-2 gap-6"
              >
                <div className="space-y-6">
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=1200"
                      alt="Modern German architecture"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.pexels.com/photos/8082319/pexels-photo-8082319.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load"
                      alt="Interior design"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.pexels.com/photos/5644337/pexels-photo-5644337.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load"
                      alt="Consultation session"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
                    <img
                      src="https://images.pexels.com/photos/2581922/pexels-photo-2581922.jpeg?auto=compress&cs=tinysrgb&w=1200"
                      alt="Happy family in new home"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 lg:py-32 px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-7xl mx-auto rounded-[3rem] bg-primary dark:bg-accent/10 p-12 lg:p-24 text-center relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,var(--color-accent),transparent_70%)] opacity-20" />
            
            <div className="relative z-10 max-w-3xl mx-auto space-y-10">
              <h2 className="text-4xl lg:text-6xl font-bold font-heading text-white">
                Ready to Find Your <span className="text-accent">Dream Home?</span>
              </h2>
              <p className="text-xl text-white/70 leading-relaxed">
                Let's start your journey to homeownership together. Our experts are ready to help you every step of the way.
              </p>
              <div className="flex justify-center pt-4">
                <Button
                  className="bg-accent text-accent-foreground hover:bg-background hover:text-foreground transition-all h-16 px-12 rounded-full text-lg font-bold shadow-2xl shadow-black/20"
                  onClick={() => {}}
                >
                  Schedule a Consultation
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  )
}

export default AboutPage
