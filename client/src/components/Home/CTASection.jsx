// File: client/src/components/Home/CTASection.jsx
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const CTASection = () => {
  // Placeholder function for contact form
  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission logic
    console.log("Form submitted")
  }

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
            Bereit für Ihr eigenes Zuhause?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto lg:mx-0">
            Starten Sie jetzt Ihre unverbindliche Finanzierungsanfrage. Unsere Experten melden sich innerhalb von 24 Stunden bei Ihnen.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10 max-w-lg mx-auto lg:mx-0">
            {["Kostenlose Erstberatung", "Unverbindlicher Vergleich", "Keine versteckten Gebühren", "Persönlicher Ansprechpartner"].map((item, i) => (
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
                <div className="font-bold">Ausgezeichnete Beratung</div>
                <div className="text-sm text-white/70">Basierend auf 500+ Bewertungen</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-primary dark:text-white mb-6 text-center">
              Jetzt Kontakt aufnehmen
            </h3>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Ihr Name</label>
                <input type="text" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-background transition-all" placeholder="Max Mustermann" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">E-Mail Adresse</label>
                <input type="email" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-background transition-all" placeholder="max@beispiel.de" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Telefonnummer</label>
                <input type="tel" className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-background transition-all" placeholder="+49 123 456789" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Wie können wir helfen?</label>
                <select className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none bg-background transition-all">
                  <option>Erstfinanzierung</option>
                  <option>Anschlussfinanzierung</option>
                  <option>Kapitalanlage</option>
                  <option>Sonstiges</option>
                </select>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-lg shadow-lg mt-4">
                Kostenlos anfragen <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Durch das Absenden stimmen Sie unseren Datenschutzbestimmungen zu.
              </p>
            </form>
          </div>
        </div>

      </div>
    </section>
  )
}

export default CTASection
