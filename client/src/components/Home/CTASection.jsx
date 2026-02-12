// File: client/src/components/Home/CTASection.jsx
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const CTASection = ({ language = 'de' }) => {
  // Placeholder function for contact form
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic
    console.log("Form submitted")
  }

  const isEnglish = language === 'en'
  const benefits = isEnglish
    ? ["Free initial consultation", "No obligation", "No hidden fees", "Personal advisor"]
    : ["Kostenlose Erstberatung", "Unverbindlicher Vergleich", "Keine versteckten Gebühren", "Persönlicher Ansprechpartner"]

  const selectOptions = isEnglish
    ? ["First Purchase", "Refinancing", "Construction Financing", "Debt Restructuring"]
    : ["Erstfinanzierung", "Anschlussfinanzierung", "Kapitalanlage", "Sonstiges"]

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-primary dark:bg-primary/90 text-white">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-white rounded-full blur-3xl" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] bg-accent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-16">

        <div className="flex-1 text-center lg:text-left">
          <h2 className="font-heading text-4xl lg:text-5xl font-bold mb-6 text-white">
            {isEnglish ? 'Ready for Your Dream Home?' : 'Bereit für Ihr eigenes Zuhause?'}
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
            {isEnglish
              ? 'Free initial consultation – no obligation and competent. Start your journey to your dream home now.'
              : 'Starten Sie jetzt Ihre unverbindliche Finanzierungsanfrage. Unsere Experten melden sich innerhalb von 24 Stunden bei Ihnen.'}
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10 max-w-lg mx-auto lg:mx-0">
            {benefits.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hidden lg:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center font-bold text-xl text-primary">
                4.9
              </div>
              <div>
                <div className="font-bold">{isEnglish ? 'Excellent Advice' : 'Ausgezeichnete Beratung'}</div>
                <div className="text-sm text-white/70">{isEnglish ? 'Based on 500+ reviews' : 'Basierend auf 500+ Bewertungen'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
              {isEnglish ? 'Request Consultation' : 'Jetzt Kontakt aufnehmen'}
            </h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{isEnglish ? 'Name' : 'Ihr Name'}</label>
                <input type="text" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-background transition-all" placeholder={isEnglish ? 'Your full name' : 'Max Mustermann'} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{isEnglish ? 'Email' : 'E-Mail Adresse'}</label>
                <input type="email" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-background transition-all" placeholder={isEnglish ? 'your@email.com' : 'max@beispiel.de'} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{isEnglish ? 'Phone' : 'Telefonnummer'}</label>
                <input type="tel" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-background transition-all" placeholder={isEnglish ? '+49 ...' : '+49 123 456789'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">{isEnglish ? "I'm interested in" : 'Wie können wir helfen?'}</label>
                <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-background transition-all">
                  {selectOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-lg shadow-lg mt-4">
                {isEnglish ? 'Request Consultation' : 'Kostenlos anfragen'} <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                {isEnglish
                  ? 'By submitting, you agree to our privacy policy.'
                  : 'Durch das Absenden stimmen Sie unseren Datenschutzbestimmungen zu.'}
              </p>
            </form>
          </div>
        </div>

      </div>
    </section>
  )
}

export default CTASection
