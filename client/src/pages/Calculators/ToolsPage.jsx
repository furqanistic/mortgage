// File: client/src/pages/Calculators/ToolsPage.jsx
import { useState } from 'react'
import MortgageGermanyCalculator from '@/components/Calculators/MortgageGermanyCalculator'
import PropertyInvestmentCalculator from '@/components/Calculators/PropertyInvestmentCalculator'
import RentVsBuyCalculator from '@/components/Calculators/RentVsBuyCalculator'
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'

const ToolsPage = ({ language = 'de', onLanguageChange }) => {
  const [activeTool, setActiveTool] = useState(null)
  const isEnglish = language === 'en'

  const tools = [
    {
      id: 'mortgage-germany',
      title: isEnglish ? 'Mortgage Calculator (Germany)' : 'Finanzierungsrechner (Deutschland)',
      description: isEnglish
        ? 'Total investment, loan amount, and amortization insights.'
        : 'Gesamtinvestition, Darlehen und Tilgungsverlauf.',
    },
    {
      id: 'rent-vs-buy',
      title: isEnglish ? 'Rent vs Buy Decision Engine' : 'Mieten vs. Kaufen',
      description: isEnglish
        ? 'Compare wealth outcomes with inflation and investment assumptions.'
        : 'Vergleichen Sie Vermögen mit Inflation & Renditeannahmen.',
    },
    {
      id: 'investment-roi',
      title: isEnglish ? 'Property Investment ROI' : 'Investment-Rendite Rechner',
      description: isEnglish
        ? 'Cashflow, taxes, and 10-year projections for rentals.'
        : 'Cashflow, Steuern und 10-Jahres-Projektionen für Vermietung.',
    },
  ]

  return (
    <div className="min-h-screen bg-background font-body text-foreground overflow-x-hidden selection:bg-primary/20">
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main className="pt-0">
        <section className="py-2">
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {isEnglish ? 'Tools' : 'Tools'}
                </p>
                <h1 className="text-3xl sm:text-4xl font-heading font-bold text-primary">
                  {isEnglish ? 'Mortgage Tools' : 'Finanzierungs-Tools'}
                </h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  {isEnglish
                    ? 'Choose a calculator to explore. All tools follow the same Baufiking theme for clarity.'
                    : 'Wählen Sie einen Rechner aus. Alle Tools folgen dem Baufiking-Design.'}
                </p>
              </div>
              {activeTool && (
                <button
                  type="button"
                  onClick={() => setActiveTool(null)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                >
                  ← {isEnglish ? 'Back to tools' : 'Zurück zur Übersicht'}
                </button>
              )}
            </div>

            {!activeTool && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setActiveTool(tool.id)}
                    className="text-left rounded-2xl border border-border/60 bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-primary">{tool.title}</div>
                        <p className="text-sm text-muted-foreground mt-2">{tool.description}</p>
                      </div>
                      <div className="shrink-0 rounded-xl border border-border/60 bg-muted/40 p-2">
                        <svg
                          width="64"
                          height="52"
                          viewBox="0 0 140 110"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect x="8" y="24" width="60" height="68" rx="8" stroke="#1a4d2e" strokeWidth="2" />
                          <rect x="18" y="36" width="18" height="18" rx="4" fill="#1a4d2e" />
                          <rect x="42" y="36" width="18" height="18" rx="4" fill="#c19a6b" />
                          <rect x="18" y="60" width="42" height="6" rx="3" fill="#1a4d2e" />
                          <rect x="18" y="72" width="30" height="6" rx="3" fill="#c19a6b" />
                          <path d="M82 88V56L110 36L138 56V88" stroke="#1a4d2e" strokeWidth="2" strokeLinejoin="round" />
                          <path d="M96 88V68H124V88" stroke="#1a4d2e" strokeWidth="2" strokeLinejoin="round" />
                          <path d="M92 58L110 46L128 58" stroke="#c19a6b" strokeWidth="2" strokeLinejoin="round" />
                          <circle cx="110" cy="24" r="8" stroke="#1a4d2e" strokeWidth="2" />
                          <path d="M110 19V29" stroke="#1a4d2e" strokeWidth="2" strokeLinecap="round" />
                          <path d="M106 24H114" stroke="#1a4d2e" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-xs font-semibold">
                      <span className="text-primary">
                        {isEnglish ? 'Open calculator' : 'Rechner öffnen'}
                      </span>
                      <span className="text-muted-foreground">
                        {isEnglish ? 'Download report' : 'Report herunterladen'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {activeTool === 'mortgage-germany' && (
              <div className="mt-3">
                <MortgageGermanyCalculator language={language} />
              </div>
            )}

            {activeTool === 'rent-vs-buy' && (
              <div className="mt-3">
                <RentVsBuyCalculator language={language} />
              </div>
            )}

            {activeTool === 'investment-roi' && (
              <div className="mt-3">
                <PropertyInvestmentCalculator language={language} />
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer language={language} />
    </div>
  )
}

export default ToolsPage
