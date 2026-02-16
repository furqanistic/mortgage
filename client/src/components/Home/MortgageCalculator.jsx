// File: client/src/components/Home/MortgageCalculator.jsx
import { useState } from 'react'
import ConsultationModal from '@/components/Home/ConsultationModal'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const MortgageCalculator = ({ language = 'de' }) => {
  const isEnglish = language === 'en'
  const locale = isEnglish ? 'en-US' : 'de-DE'

  const [income, setIncome] = useState(5000)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [interestRate, setInterestRate] = useState(4.0)
  const [repaymentRate, setRepaymentRate] = useState(1.5)
  const [maxPaymentPercent, setMaxPaymentPercent] = useState(35)

  const [incomeInput, setIncomeInput] = useState('5000')
  const [interestInput, setInterestInput] = useState('4.0')
  const [repaymentInput, setRepaymentInput] = useState('1.5')
  const [maxPaymentInput, setMaxPaymentInput] = useState('35')

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)

  const totalRate = interestRate + repaymentRate
  const maxMonthlyPayment = (income * maxPaymentPercent) / 100
  const annualPayment = maxMonthlyPayment * 12
  const maxLoan = totalRate > 0 ? annualPayment / (totalRate / 100) : 0

  const monthlyInterest = (maxLoan * (interestRate / 100)) / 12
  const monthlyRepayment = Math.max(0, maxMonthlyPayment - monthlyInterest)

  const interestShare = maxMonthlyPayment > 0 ? (monthlyInterest / maxMonthlyPayment) * 100 : 0
  const repaymentShare = maxMonthlyPayment > 0 ? (monthlyRepayment / maxMonthlyPayment) * 100 : 0

  const monthlyRate = interestRate / 100 / 12
  const loanDurationMonths = (() => {
    if (maxMonthlyPayment <= 0) return 0
    if (monthlyRate === 0) return maxLoan / maxMonthlyPayment
    const paymentCoverage = maxMonthlyPayment - maxLoan * monthlyRate
    if (paymentCoverage <= 0) return Infinity
    return Math.log(maxMonthlyPayment / paymentCoverage) / Math.log(1 + monthlyRate)
  })()
  const remainingAfterTenYears = (() => {
    const months = 120
    if (maxLoan <= 0) return 0
    if (monthlyRate === 0) return Math.max(0, maxLoan - maxMonthlyPayment * months)
    const factor = Math.pow(1 + monthlyRate, months)
    const balance = maxLoan * factor - (maxMonthlyPayment * (factor - 1)) / monthlyRate
    return Math.max(0, balance)
  })()
  const totalInterestPaid = (() => {
    if (!Number.isFinite(loanDurationMonths) || loanDurationMonths <= 0) return 0
    const totalPaid = maxMonthlyPayment * loanDurationMonths
    return Math.max(0, totalPaid - maxLoan)
  })()

  const labels = {
    title: isEnglish ? 'Mortgage Affordability Calculator' : 'Finanzierungsrechner',
    headline: isEnglish
      ? 'How much can you afford?'
      : 'Wie viel können Sie sich leisten?',
    subtitle: isEnglish
      ? 'Calculate your maximum mortgage amount based on your household income'
      : 'Berechnen Sie Ihre maximale Finanzierung basierend auf Ihrem Haushaltseinkommen',
    inputs: {
      income: isEnglish ? 'Net Household Income (Monthly)' : 'Nettoeinkommen (monatlich)',
      interest: isEnglish ? 'Interest Rate (Annual)' : 'Zinssatz (jährlich)',
      repayment: isEnglish ? 'Repayment Rate (Annual)' : 'Tilgungssatz (jährlich)',
      maxPayment: isEnglish ? 'Maximum Payment (% of Income)' : 'Max. Rate (% vom Einkommen)',
    },
    resultsTitle: isEnglish ? 'Your Maximum Mortgage' : 'Ihre maximale Finanzierung',
    maxLoan: isEnglish ? 'Maximum Loan Amount' : 'Maximale Darlehenssumme',
    monthlyPayment: isEnglish ? 'Monthly Instalment' : 'Monatliche Rate',
    loanDuration: isEnglish ? 'Loan Duration' : 'Darlehensdauer',
    remainingAfterTenYears: isEnglish ? 'Remaining Loan after 10 years' : 'Restschuld nach 10 Jahren',
    interestPaidTotal: isEnglish ? 'Interest paid during full loan period' : 'Gezahlte Zinsen über die gesamte Laufzeit',
    breakdownTitle: isEnglish ? 'Payment Breakdown' : 'Zahlungsaufteilung',
    totalPayment: isEnglish ? 'Total Monthly Payment' : 'Gesamtrate pro Monat',
    infoTitle: isEnglish ? 'How This Calculation Works' : 'So funktioniert die Berechnung',
    infoText: isEnglish
      ? 'This calculator determines your maximum affordable mortgage based on a customizable percentage of your net household income. Adjust interest rate, repayment rate, and maximum payment percentage to match your situation or bank requirements.'
      : 'Der Rechner bestimmt Ihre maximal leistbare Finanzierung basierend auf einem frei wählbaren Anteil Ihres Nettoeinkommens. Passen Sie Zins, Tilgung und maximalen Zahlungsanteil an.',
    infoNote: isEnglish
      ? '* This is an estimate only - actual loan approval depends on bank assessment'
      : '* Nur eine Schätzung - tatsächliche Zusage hängt von der Bank ab',
    cta: isEnglish ? 'Get Personalized Advice' : 'Persönliche Beratung anfordern',
  }

  const formatDuration = (months) => {
    if (!Number.isFinite(months) || months <= 0) return '—'
    if (months < 12) {
      return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(months)} ${
        isEnglish ? 'months' : 'Monate'
      }`
    }
    const years = months / 12
    return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(years)} ${
      isEnglish ? 'years' : 'Jahre'
    }`
  }

  return (
    <section
      id="tools"
      className="relative overflow-hidden py-20 text-white"
      style={{ background: 'linear-gradient(135deg, #1a4d2e 0%, #0f2919 100%)' }}
    >
      <div
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full opacity-40"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
        }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">
            {labels.title}
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold mt-3 text-white">
            {labels.headline}
          </h2>
          <p className="text-sm sm:text-base text-white/80 mt-3">
            {labels.subtitle}
          </p>
        </div>

        <div className="bg-white text-slate-900 rounded-[24px] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div className="grid gap-8">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span>{labels.inputs.income}</span>
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/70 text-[10px] text-white" title={isEnglish ? 'Combined monthly income after taxes' : 'Monatliches Einkommen nach Steuern'}>
                      i
                    </span>
                  </div>
                  <span className="text-base font-bold text-primary">{formatCurrency(income)}</span>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">€</span>
                  <input
                    type="number"
                    min={1000}
                    max={20000}
                    step={100}
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(e.target.value)}
                    onBlur={() => {
                      const next = clamp(Number(incomeInput || 0), 1000, 20000)
                      setIncome(next)
                      setIncomeInput(String(next))
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 px-10 py-3 text-base font-semibold focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <input
                  type="range"
                  min={1000}
                  max={20000}
                  step={100}
                  value={income}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    setIncome(next)
                    setIncomeInput(String(next))
                  }}
                  className="w-full accent-primary"
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>€1,000</span>
                  <span>€20,000</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span>{labels.inputs.interest}</span>
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/70 text-[10px] text-white" title={isEnglish ? 'Annual interest rate charged by the bank' : 'Jährlicher Zinssatz der Bank'}>
                      i
                    </span>
                  </div>
                  <span className="text-base font-bold text-primary">{interestRate.toFixed(1)}%</span>
                </div>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    step={0.1}
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onBlur={() => {
                      const next = clamp(Number(interestInput || 0), 1, 10)
                      setInterestRate(next)
                      setInterestInput(next.toFixed(1))
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 pr-10 py-3 text-base font-semibold focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.1}
                  value={interestRate}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    setInterestRate(next)
                    setInterestInput(next.toFixed(1))
                  }}
                  className="w-full accent-primary"
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>1.0%</span>
                  <span>10.0%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span>{labels.inputs.repayment}</span>
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/70 text-[10px] text-white" title={isEnglish ? 'Annual percentage used for loan repayment' : 'Jährlicher Tilgungsanteil'}>
                      i
                    </span>
                  </div>
                  <span className="text-base font-bold text-primary">{repaymentRate.toFixed(1)}%</span>
                </div>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  <input
                    type="number"
                    min={0.5}
                    max={5}
                    step={0.1}
                    value={repaymentInput}
                    onChange={(e) => setRepaymentInput(e.target.value)}
                    onBlur={() => {
                      const next = clamp(Number(repaymentInput || 0), 0.5, 5)
                      setRepaymentRate(next)
                      setRepaymentInput(next.toFixed(1))
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 pr-10 py-3 text-base font-semibold focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={5}
                  step={0.1}
                  value={repaymentRate}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    setRepaymentRate(next)
                    setRepaymentInput(next.toFixed(1))
                  }}
                  className="w-full accent-primary"
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>0.5%</span>
                  <span>5.0%</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span>{labels.inputs.maxPayment}</span>
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent/70 text-[10px] text-white" title={isEnglish ? 'Maximum percentage of income for mortgage payment' : 'Maximaler Anteil des Einkommens für die Rate'}>
                      i
                    </span>
                  </div>
                  <span className="text-base font-bold text-primary">{maxPaymentPercent}%</span>
                </div>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  <input
                    type="number"
                    min={20}
                    max={50}
                    step={1}
                    value={maxPaymentInput}
                    onChange={(e) => setMaxPaymentInput(e.target.value)}
                    onBlur={() => {
                      const next = clamp(Number(maxPaymentInput || 0), 20, 50)
                      setMaxPaymentPercent(next)
                      setMaxPaymentInput(String(next))
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 pr-10 py-3 text-base font-semibold focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <input
                  type="range"
                  min={20}
                  max={50}
                  step={1}
                  value={maxPaymentPercent}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    setMaxPaymentPercent(next)
                    setMaxPaymentInput(String(next))
                  }}
                  className="w-full accent-primary"
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>20%</span>
                  <span>50%</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-secondary/20 p-5">
                <div className="text-sm font-semibold text-primary mb-3">
                  {isEnglish ? 'Combined Rate Calculation' : 'Kombinierte Ratenberechnung'}
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs font-semibold text-slate-600">
                  <div className="rounded-xl bg-white p-3 border border-border/60">
                    <div className="text-[11px] text-slate-400">{isEnglish ? 'Interest Rate' : 'Zinssatz'}</div>
                    <div className="text-primary text-base">{interestRate.toFixed(1)}%</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-border/60">
                    <div className="text-[11px] text-slate-400">{isEnglish ? 'Repayment Rate' : 'Tilgung'}</div>
                    <div className="text-primary text-base">{repaymentRate.toFixed(1)}%</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-border/60">
                    <div className="text-[11px] text-slate-400">{isEnglish ? 'Total Annual Rate' : 'Gesamtrate p.a.'}</div>
                    <div className="text-primary text-base">{totalRate.toFixed(1)}%</div>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-border/60">
                    <div className="text-[11px] text-slate-400">{isEnglish ? 'Max Monthly Payment' : 'Max. Monatsrate'}</div>
                    <div className="text-primary text-base">{maxPaymentPercent}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-gradient-to-br from-primary to-emerald-950 text-white p-6 sm:p-7">
                <div className="text-center text-lg font-heading mb-5">
                  {labels.resultsTitle}
                </div>
                <div className="rounded-2xl bg-white/10 p-5 text-center mb-6">
                  <div className="text-xs text-white/70">{labels.maxLoan}</div>
                  <div className="text-3xl sm:text-4xl font-bold">{formatCurrency(maxLoan)}</div>
                  <div className="text-xs text-white/70 mt-2">
                    {isEnglish ? 'Based on your monthly income of' : 'Basierend auf Ihrem Einkommen von'} {formatCurrency(income)}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/10 p-4">
                    <div className="text-[11px] text-white/70">{labels.monthlyPayment}</div>
                    <div className="text-lg font-semibold">{formatCurrency(maxMonthlyPayment)}</div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4">
                    <div className="text-[11px] text-white/70">{labels.loanDuration}</div>
                    <div className="text-lg font-semibold">{formatDuration(loanDurationMonths)}</div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4">
                    <div className="text-[11px] text-white/70">{labels.remainingAfterTenYears}</div>
                    <div className="text-lg font-semibold">{formatCurrency(remainingAfterTenYears)}</div>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4">
                    <div className="text-[11px] text-white/70">{labels.interestPaidTotal}</div>
                    <div className="text-lg font-semibold">{formatCurrency(totalInterestPaid)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border/60 rounded-2xl p-5">
                <div className="font-heading text-lg text-primary mb-4">{labels.breakdownTitle}</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{isEnglish ? 'Interest' : 'Zinsen'} ({interestRate.toFixed(1)}% {isEnglish ? 'annually' : 'p.a.'})</span>
                      <span className="text-primary">{formatCurrency(monthlyInterest)}/mo</span>
                    </div>
                    <div className="h-2 bg-border/60 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-primary" style={{ width: `${interestShare}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{isEnglish ? 'Principal Repayment' : 'Tilgung'} ({repaymentRate.toFixed(1)}% {isEnglish ? 'annually' : 'p.a.'})</span>
                      <span className="text-primary">{formatCurrency(monthlyRepayment)}/mo</span>
                    </div>
                    <div className="h-2 bg-border/60 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-accent" style={{ width: `${repaymentShare}%` }} />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-primary/30 flex items-center justify-between text-sm font-semibold">
                    <span>{labels.totalPayment}</span>
                    <span className="text-primary">{formatCurrency(maxMonthlyPayment)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary/30 border border-border/60 rounded-2xl p-5">
                <div className="flex items-center gap-2 font-semibold text-primary mb-2">
                  <span className="text-lg">💡</span>
                  <span>{labels.infoTitle}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {labels.infoText}
                </p>
                <p className="text-xs text-muted-foreground/90 mt-3">{labels.infoNote}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90"
              >
                {labels.cta}
              </button>

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

export default MortgageCalculator
