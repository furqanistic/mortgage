// File: client/src/components/Home/CTASection.jsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import ConsultationModal from '@/components/Home/ConsultationModal'

const CTASection = ({ language = 'de' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const isEnglish = language === 'en'
  const benefits = isEnglish
    ? ["Free initial consultation", "No obligation", "No hidden fees", "Personal advisor"]
    : ["Kostenlose Erstberatung", "Unverbindlicher Vergleich", "Keine versteckten Gebühren", "Persönlicher Ansprechpartner"]

  return (
    <section id="contact" className="py-16 relative overflow-hidden bg-primary dark:bg-primary/90 text-white">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-white rounded-full blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-accent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] items-center">
          <div className="text-center lg:text-left">
            <h2 className="font-heading text-3xl lg:text-4xl font-bold mb-4 text-white">
            {isEnglish ? 'Ready for Your Dream Home?' : 'Bereit für Ihr eigenes Zuhause?'}
          </h2>
          <p className="text-white/80 text-base mb-6 max-w-xl mx-auto lg:mx-0">
            {isEnglish
              ? 'Free initial consultation – no obligation and competent. Start your journey to your dream home now.'
              : 'Starten Sie jetzt Ihre unverbindliche Finanzierungsanfrage. Unsere Experten melden sich innerhalb von 24 Stunden bei Ihnen.'}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 mb-6 max-w-lg mx-auto lg:mx-0 text-sm">
            {benefits.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-bold h-11 px-6 shadow-lg"
          >
            {isEnglish ? 'Request Consultation' : 'Kostenlose Beratung anfordern'} <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>

          <div className="bg-white/10 backdrop-blur-sm p-5 rounded-2xl border border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center font-bold text-lg text-primary">
                4.9
              </div>
              <div>
                <div className="font-bold">{isEnglish ? 'Excellent Advice' : 'Ausgezeichnete Beratung'}</div>
                <div className="text-sm text-white/70">{isEnglish ? 'Based on 500+ reviews' : 'Basierend auf 500+ Bewertungen'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
      />
    </section>
  )
}

export default CTASection
