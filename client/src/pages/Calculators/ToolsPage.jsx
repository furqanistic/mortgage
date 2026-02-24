// File: client/src/pages/Calculators/ToolsPage.jsx
import MortgageGermanyCalculator from '@/components/Calculators/MortgageGermanyCalculator'
import PropertyInvestmentCalculator from '@/components/Calculators/PropertyInvestmentCalculator'
import RentVsBuyCalculator from '@/components/Calculators/RentVsBuyCalculator'
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { useSearchParams } from 'react-router-dom'

/* ── Clean monoline icons (24 × 24, 1.6 stroke) ─────────────────── */
const IconMortgage = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" />
    <rect x="9" y="14" width="6" height="7" rx="1" />
    <circle cx="12" cy="7" r="1.5" />
  </svg>
)

const IconRentBuy = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12L7 7l5 5 5-5 5 5" />
    <path d="M5 21V12" />
    <path d="M19 21V12" />
    <path d="M5 17h3M16 17h3" />
    <circle cx="12" cy="17" r="2" />
  </svg>
)

const IconROI = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 17 9 11 13 15 21 7" />
    <polyline points="17 7 21 7 21 11" />
    <line x1="3" y1="21" x2="21" y2="21" />
  </svg>
)

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7h8M8 4l3 3-3 3" />
  </svg>
)

const IconChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 4L6 8l4 4" />
  </svg>
)

/* ── Tool definitions ────────────────────────────────────────────── */
const tools = [
  {
    id: 'mortgage-germany',
    titleEn: 'Mortgage Calculator',
    titleDe: 'Finanzierungsrechner',
    tagEn: 'Germany',
    tagDe: 'Deutschland',
    descEn: 'Loan amounts, costs & full amortisation schedule.',
    descDe: 'Darlehenshöhe, Kosten & Tilgungsverlauf.',
    Icon: IconMortgage,
    badge: 'Popular',
  },
  {
    id: 'rent-vs-buy',
    titleEn: 'Rent vs Buy',
    titleDe: 'Mieten vs. Kaufen',
    tagEn: 'Decision Engine',
    tagDe: 'Entscheidungshilfe',
    descEn: 'Long-term wealth comparison with inflation & equity growth.',
    descDe: 'Langfristiger Vermögensvergleich mit Inflation & Rendite.',
    Icon: IconRentBuy,
    badge: null,
  },
  {
    id: 'investment-roi',
    titleEn: 'Property ROI',
    titleDe: 'Investment-Rendite',
    tagEn: 'Rental Analysis',
    tagDe: 'Vermietungsanalyse',
    descEn: 'Cashflow, taxes & 10-year projections for buy-to-let.',
    descDe: 'Cashflow, Steuern & 10-Jahres-Prognosen für Vermietung.',
    Icon: IconROI,
    badge: null,
  },
]

/* ── Page component ─────────────────────────────────────────────── */
const ToolsPage = ({ language = 'de', onLanguageChange }) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const isEn = language === 'en'
  const calculatorParam = searchParams.get('calculator')
  const activeTool = tools.some((t) => t.id === calculatorParam) ? calculatorParam : null
  const activeToolData = tools.find((t) => t.id === activeTool)

  const setActiveTool = (toolId) => {
    const nextParams = new URLSearchParams(searchParams)
    if (toolId) {
      nextParams.set('calculator', toolId)
    } else {
      nextParams.delete('calculator')
    }
    setSearchParams(nextParams)
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground overflow-x-hidden selection:bg-primary/20">
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main>
        {/* ── Selector ───────────────────────────────────────────── */}
        {!activeTool && (
          <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 pt-10 pb-14">

            {/* compact header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] font-semibold mb-1.5"
                  style={{ color: '#c19a6b' }}>
                  {isEn ? 'Calculators & Tools' : 'Rechner & Tools'}
                </p>
                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-primary leading-tight">
                  {isEn ? 'Mortgage Tools' : 'Finanzierungs-Tools'}
                </h1>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs sm:text-right leading-relaxed">
                {isEn
                  ? 'Three calculators for the German property market.'
                  : 'Drei Rechner für den deutschen Immobilienmarkt.'}
              </p>
            </div>

            {/* cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map(({ id, titleEn, titleDe, tagEn, tagDe, descEn, descDe, Icon, badge }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTool(id)}
                  className="group relative text-left rounded-2xl bg-white overflow-hidden transition-all duration-300"
                  style={{
                    border: '1.5px solid rgba(26,77,46,0.10)',
                    boxShadow: '0 1px 4px rgba(26,77,46,0.05)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(193,154,107,0.45)'
                    e.currentTarget.style.boxShadow = '0 6px 24px rgba(26,77,46,0.10)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(26,77,46,0.10)'
                    e.currentTarget.style.boxShadow = '0 1px 4px rgba(26,77,46,0.05)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  {/* top accent */}
                  <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#1a4d2e,#c19a6b)' }} />

                  <div className="p-5">
                    {/* icon row */}
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200"
                        style={{ background: 'rgba(26,77,46,0.07)', color: '#1a4d2e' }}
                      >
                        <Icon />
                      </div>
                      {badge && (
                        <span className="text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-0.5"
                          style={{ background: 'rgba(193,154,107,0.12)', color: '#c19a6b' }}>
                          {badge}
                        </span>
                      )}
                    </div>

                    {/* text */}
                    <p className="text-[10px] uppercase tracking-[0.16em] font-semibold mb-0.5"
                      style={{ color: '#c19a6b' }}>
                      {isEn ? tagEn : tagDe}
                    </p>
                    <h2 className="text-base font-heading font-bold text-primary mb-2">
                      {isEn ? titleEn : titleDe}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {isEn ? descEn : descDe}
                    </p>

                    {/* footer */}
                    <div className="flex items-center justify-between pt-3.5"
                      style={{ borderTop: '1px solid rgba(26,77,46,0.07)' }}>
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-primary
                        group-hover:gap-2.5 transition-all duration-200">
                        {isEn ? 'Open calculator' : 'Rechner öffnen'}
                        <IconArrow />
                      </span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5"
                        style={{ background: 'rgba(26,77,46,0.06)', color: '#1a4d2e' }}>
                        {isEn ? 'Free' : 'Kostenlos'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground/60">
              {isEn
                ? 'Results are indicative and not financial advice.'
                : 'Ergebnisse sind indikativ und keine Finanzberatung.'}
            </p>
          </section>
        )}

        {/* ── Active calculator ───────────────────────────────────── */}
        {activeTool && (
          <div className="mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
            <div className="flex items-center gap-2.5 py-4 mt-2 mb-1"
              style={{ borderBottom: '1px solid rgba(26,77,46,0.08)' }}>
              <button
                type="button"
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:opacity-70 transition-opacity"
              >
                <IconChevronLeft />
                {isEn ? 'All tools' : 'Alle Tools'}
              </button>
              <span className="text-muted-foreground/30 text-sm">/</span>
              <span className="text-sm text-muted-foreground font-medium">
                {activeToolData ? (isEn ? activeToolData.titleEn : activeToolData.titleDe) : ''}
              </span>
            </div>

            {activeTool === 'mortgage-germany' && <div className="mt-3"><MortgageGermanyCalculator language={language} /></div>}
            {activeTool === 'rent-vs-buy' && <div className="mt-3"><RentVsBuyCalculator language={language} /></div>}
            {activeTool === 'investment-roi' && <div className="mt-3"><PropertyInvestmentCalculator language={language} /></div>}
          </div>
        )}
      </main>

      <Footer language={language} />
    </div>
  )
}

export default ToolsPage
