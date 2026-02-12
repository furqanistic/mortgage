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
const HomePage = ({ language = 'de', onLanguageChange }) => {
  return (
    <div className="min-h-screen bg-background font-body text-foreground overflow-x-hidden selection:bg-primary/20">
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main>
        <HeroSection language={language} />
        <Partners language={language} />
        <ValueProps language={language} />
        <TargetAudience language={language} />
        <RoadmapSection language={language} />
        <MortgageCalculator language={language} />
        <SuccessStories language={language} />
        <FAQ language={language} />
        <CTASection language={language} />
      </main>

      <Footer language={language} />
    </div>
  )
}

export default HomePage
