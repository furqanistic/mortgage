// File: client/src/pages/HomePage.jsx
import Navbar from '@/components/Home/Navbar'
import HeroSection from '@/components/Home/HeroSection'
import Partners from '@/components/Home/Partners'
import ValueProps from '@/components/Home/ValueProps'
import TargetAudience from '@/components/Home/TargetAudience'
import RoadmapSection from '@/components/Home/RoadmapSection' // How It Works
import MortgageCalculator from '@/components/Home/MortgageCalculator'
import SuccessStories from '@/components/Home/SuccessStories' // Testimonials
import FAQ from '@/components/Home/FAQ'
import CTASection from '@/components/Home/CTASection'
import Footer from '@/components/Layout/Footer'
import { motion } from 'framer-motion'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background font-body text-foreground overflow-x-hidden selection:bg-primary/20">
      <Navbar />

      <main>
        <HeroSection />
        <Partners />
        <ValueProps />
        <TargetAudience />
        <RoadmapSection />
        <MortgageCalculator />
        <SuccessStories />
        <FAQ />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
