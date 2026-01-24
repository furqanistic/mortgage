// File: client/src/pages/HomePage.jsx
import CTASection from '@/components/Home/CTASection'
import HeroSection from '@/components/Home/HeroSection'
import MortgageCalculator from '@/components/Home/MortgageCalculator'
import Navbar from '@/components/Home/Navbar'
import RoadmapSection from '@/components/Home/RoadmapSection'
import SuccessStories from '@/components/Home/SuccessStories'
import Footer from '@/components/Layout/Footer'

const HomePage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <RoadmapSection />
      <MortgageCalculator />
      <SuccessStories />
      <CTASection />
      <Footer />
    </>
  )
}

export default HomePage
