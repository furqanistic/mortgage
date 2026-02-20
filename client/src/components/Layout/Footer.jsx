// File: client/src/components/Layout/Footer.jsx
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = ({ language = 'de' }) => {
  const isEnglish = language === 'en'
  const aboutText = isEnglish
    ? 'Independent guidance for German home financing. We compare over 100 banks to secure the best conditions.'
    : 'Ihr unabhängiger Partner für Immobilienfinanzierung. Wir vergleichen über 500 Banken, um Ihnen die besten Konditionen zu sichern.'

  const services = isEnglish
    ? ['Home Loan Financing', 'Real Estate', 'Investments', 'Property Support']
    : ['Baufinanzierung', 'Anschlussfinanzierung', 'Kapitalanlage', 'Forward-Darlehen', 'Privatkredit']

  const company = isEnglish
    ? [
      { label: 'Our Team', href: '#' },
      { label: 'Our Story', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Glossary', to: '/glossary' },
    ]
    : [
      { label: 'Über uns', href: '#' },
      { label: 'Partner werden', href: '#' },
      { label: 'Kontakt', href: '#' },
      { label: 'Glossar', to: '/glossary' },
    ]

  const contact = isEnglish
    ? ['+49 151 71618082', 'ravinder.singh@baufiking.de']
    : ['+49 151 71618082', 'ravinder.singh@baufiking.de']
  return (
    <footer className="bg-[#050f08] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img
                src="/logo.jpeg"
                alt="Baufiking logo"
                className="h-9 w-9 rounded-full object-cover ring-1 ring-white/20"
              />
              <span className="font-logo text-2xl font-bold">Baufiking</span>
            </Link>
            <p className="text-white/60 mb-6 leading-relaxed">
              {aboutText}
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
            <h4 className="font-bold text-lg mb-6 text-white">{isEnglish ? 'Services' : 'Dienstleistungen'}</h4>
            <ul className="space-y-4 text-white/60">
              {services.map((item) => (
                <li key={item}><a href="#" className="hover:text-accent transition-colors">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">{isEnglish ? 'About Us' : 'Unternehmen'}</h4>
            <ul className="space-y-4 text-white/60">
              {company.map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <Link to={item.to} className="hover:text-accent transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.href} className="hover:text-accent transition-colors">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-white">{isEnglish ? 'Contact' : 'Kontakt'}</h4>
            <ul className="space-y-4 text-white/60">
              <li className="pt-2">
                <a href="tel:+4915171618082" className="hover:text-accent transition-colors">
                  {contact[0]}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact[1]}`} className="hover:text-accent transition-colors">
                  {contact[1]}
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <div>
            &copy; {new Date().getFullYear()} Baufiking {isEnglish ? 'All rights reserved.' : 'GmbH. Alle Rechte vorbehalten.'}
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">{isEnglish ? 'Legal Notice' : 'Impressum'}</a>
            <a href="#" className="hover:text-white transition-colors">{isEnglish ? 'Privacy Policy' : 'Datenschutz'}</a>
            <a href="#" className="hover:text-white transition-colors">{isEnglish ? 'Terms & Conditions' : 'AGB'}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
