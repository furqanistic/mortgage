// File: client/src/pages/HomePage.jsx
import CTASection from '@/components/Home/CTASection'
import FAQ from '@/components/Home/FAQ'
import HeroSection from '@/components/Home/HeroSection'
import MortgageCalculator from '@/components/Home/MortgageCalculator'
import Navbar from '@/components/Home/Navbar'
import Partners from '@/components/Home/Partners'
import RoadmapSection from '@/components/Home/RoadmapSection'; // How It Works
import SuccessStories from '@/components/Home/SuccessStories'; // Testimonials
import TargetAudience from '@/components/Home/TargetAudience'
import ValueProps from '@/components/Home/ValueProps'
import Footer from '@/components/Layout/Footer'
const HomePage = ({ language = 'de', onLanguageChange }) => {
  return (
    <div className="min-h-screen bg-background font-body text-foreground overflow-x-hidden selection:bg-primary/20">
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main>
        <HeroSection language={language} />
        <Partners language={language} />
        <ValueProps language={language} />
        <MortgageCalculator language={language} />
        <TargetAudience language={language} />
        <RoadmapSection language={language} />
        <SuccessStories language={language} />
        <FAQ language={language} />
        <CTASection language={language} />
      </main>

      <Footer language={language} />
    </div>
  )
}

export default HomePage
