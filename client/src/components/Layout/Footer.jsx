// File: client/src/components/Layout/Footer.jsx
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Home } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-[#050f08] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Home className="w-8 h-8 text-accent" />
              <span className="font-heading text-2xl font-bold">Baufiking</span>
            </Link>
            <p className="text-white/60 mb-6 leading-relaxed">
              Ihr unabhängiger Partner für Immobilienfinanzierung. Wir vergleichen über 500 Banken, um Ihnen die besten Konditionen zu sichern.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all text-white/60">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all text-white/60">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all text-white/60">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all text-white/60">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Dienstleistungen</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-accent transition-colors">Baufinanzierung</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Anschlussfinanzierung</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Kapitalanlage</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Forward-Darlehen</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privatkredit</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Unternehmen</h4>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-accent transition-colors">Über uns</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Karriere</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Partner werden</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Presse</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Kontakt</a></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Kontakt</h4>
            <ul className="space-y-4 text-white/60">
              <li>Musterstraße 123</li>
              <li>10115 Berlin</li>
              <li className="pt-2"><a href="tel:+49123456789" className="hover:text-accent transition-colors">+49 (0) 30 123 456 78</a></li>
              <li><a href="mailto:info@baufiking.de" className="hover:text-accent transition-colors">info@baufiking.de</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <div>
            &copy; {new Date().getFullYear()} Baufiking GmbH. Alle Rechte vorbehalten.
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Impressum</a>
            <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-white transition-colors">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
