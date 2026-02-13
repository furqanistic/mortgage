// File: client/src/components/Home/MortgageCalculator.jsx
import { useMemo, useState } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const MortgageCalculator = ({ language = 'de' }) => {
  const isEnglish = language === 'en'
  const locale = isEnglish ? 'en-US' : 'de-DE'

  const [income, setIncome] = useState(5000)
  const [loanAmount, setLoanAmount] = useState(300000)
  const [termYears, setTermYears] = useState(25)
  const [equity, setEquity] = useState(50000)

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)

  const interestRate = 0.04
  const totalMonths = termYears * 12

  const monthlyPayment = useMemo(() => {
    if (loanAmount <= 0 || totalMonths <= 0) return 0
    const monthlyRate = interestRate / 12
    return (
      (loanAmount * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -totalMonths))
    )
  }, [loanAmount, totalMonths])

  const totalCost = monthlyPayment * totalMonths
  const recommendedPrice = loanAmount + equity

  const labels = {
    title: isEnglish ? 'Advanced Mortgage Calculator' : 'Erweiterter Hypothekenrechner',
    headline: isEnglish
      ? 'How much home can you afford?'
      : 'Wie viel Haus können Sie sich leisten?',
    subtitle: isEnglish
      ? 'Use this calculator for a quick estimate of your budget'
      : 'Nutzen Sie unseren Rechner für eine erste Einschätzung Ihres Budgets',
    inputs: {
      income: isEnglish ? 'Monthly net income' : 'Monatliches Nettoeinkommen',
      equity: isEnglish ? 'Available equity (€)' : 'Vorhandenes Eigenkapital (€)',
      loan: isEnglish ? 'Desired loan amount' : 'Gewünschte Kreditsumme',
      term: isEnglish ? 'Term (years)' : 'Laufzeit (Jahre)',
    },
    resultsTitle: isEnglish ? 'Your estimated financing' : 'Ihre geschätzte Finanzierung',
    monthlyPayment: isEnglish ? 'Monthly payment' : 'Monatliche Rate',
    totalCost: isEnglish ? 'Total cost' : 'Gesamtkosten',
    recommendedPrice: isEnglish ? 'Recommended purchase price' : 'Empfohlener Kaufpreis',
    cta: isEnglish ? 'Get a personal offer' : 'Persönliches Angebot erhalten',
  }

  return (
    <section
      id="tools"
      className="relative overflow-hidden py-20 text-white"
      style={{ background: 'linear-gradient(135deg, #1a4d2e 0%, #0f2919 100%)' }}
    >
      <div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">
            {labels.title}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-3">
            {labels.headline}
          </h2>
          <p className="text-sm sm:text-base text-white/80 mt-3">
            {labels.subtitle}
          </p>
        </div>

        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="grid gap-6">
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  {labels.inputs.income}
                </label>
                <input
                  type="range"
                  min={2000}
                  max={15000}
                  step={500}
                  value={income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>€2,000</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(income)}
                  </span>
                  <span>€15,000</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  {labels.inputs.equity}
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={equity}
                  onChange={(e) =>
                    setEquity(clamp(Number(e.target.value || 0), 0, 500000))
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  {labels.inputs.loan}
                </label>
                <input
                  type="range"
                  min={100000}
                  max={1000000}
                  step={10000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>€100k</span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(loanAmount)}
                  </span>
                  <span>€1M</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  {labels.inputs.term}
                </label>
                <input
                  type="range"
                  min={10}
                  max={30}
                  step={5}
                  value={termYears}
                  onChange={(e) => setTermYears(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>10</span>
                  <span className="font-semibold text-primary">{termYears}</span>
                  <span>30</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-primary to-emerald-900 text-white p-6 sm:p-7">
              <div className="text-center text-lg font-heading mb-5">
                {labels.resultsTitle}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <span className="text-sm text-white/80">
                    {labels.monthlyPayment}
                  </span>
                  <span className="text-xl font-semibold">
                    {formatCurrency(monthlyPayment)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <span className="text-sm text-white/80">
                    {labels.totalCost}
                  </span>
                  <span className="text-xl font-semibold">
                    {formatCurrency(totalCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">
                    {labels.recommendedPrice}
                  </span>
                  <span className="text-xl font-semibold">
                    {formatCurrency(recommendedPrice)}
                  </span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-primary shadow-md transition hover:bg-amber-50">
                  {labels.cta}
                </button>
              </div>
              <p className="mt-4 text-xs text-white/70 text-center">
                {isEnglish
                  ? 'Estimates use a 4% interest rate for illustration.'
                  : 'Schätzwerte basieren auf 4% Beispielzins.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MortgageCalculator
