// File: client/src/components/Calculators/MortgageGermanyCalculator.jsx
import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { jsPDF } from 'jspdf'
import ConsultationModal from '@/components/Home/ConsultationModal'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const stateOptions = [
  { label: 'Baden-Württemberg (5.0%)', value: 5.0 },
  { label: 'Bayern / Bavaria (3.5%)', value: 3.5 },
  { label: 'Berlin (6.0%)', value: 6.0 },
  { label: 'Brandenburg (6.5%)', value: 6.5 },
  { label: 'Bremen (5.0%)', value: 5.0 },
  { label: 'Hamburg (5.5%)', value: 5.5 },
  { label: 'Hessen / Hesse (6.0%)', value: 6.0 },
  { label: 'Mecklenburg-Vorpommern (6.0%)', value: 6.0 },
  { label: 'Niedersachsen / Lower Saxony (5.0%)', value: 5.0 },
  { label: 'Nordrhein-Westfalen / North Rhine-Westphalia (6.5%)', value: 6.5 },
  { label: 'Rheinland-Pfalz / Rhineland-Palatinate (5.0%)', value: 5.0 },
  { label: 'Saarland (6.5%)', value: 6.5 },
  { label: 'Sachsen / Saxony (5.5%)', value: 5.5 },
  { label: 'Sachsen-Anhalt / Saxony-Anhalt (5.0%)', value: 5.0 },
  { label: 'Schleswig-Holstein (6.5%)', value: 6.5 },
  { label: 'Thüringen / Thuringia (6.5%)', value: 6.5 },
]

const MortgageGermanyCalculator = ({ language = 'de' }) => {
  const isEnglish = language === 'en'
  const locale = isEnglish ? 'en-US' : 'de-DE'
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [purchasePrice, setPurchasePrice] = useState(400000)
  const [transferTax, setTransferTax] = useState(6.0)
  const [notaryCosts, setNotaryCosts] = useState(2.0)
  const [hasAgent, setHasAgent] = useState(false)
  const [agentCommission, setAgentCommission] = useState(3.57)
  const [downPayment, setDownPayment] = useState(80000)
  const [interestRate, setInterestRate] = useState(3.5)
  const [repaymentRate, setRepaymentRate] = useState(2.0)
  const [fixedPeriod, setFixedPeriod] = useState(15)

  const labels = {
    title: isEnglish ? 'Mortgage Calculator (Germany)' : 'Finanzierungsrechner (Deutschland)',
    subtitle: isEnglish
      ? 'Calculate your total investment, loan size, and payment breakdown in real time.'
      : 'Berechnen Sie Gesamtinvestition, Darlehenshöhe und Raten in Echtzeit.',
    inputTitle: isEnglish ? 'Purchase & Financing Details' : 'Kauf- & Finanzierungsdetails',
    resultsTitle: isEnglish ? 'Your Financing Results' : 'Ihre Finanzierungsergebnisse',
    purchasePrice: isEnglish ? 'Purchase Price (€)' : 'Kaufpreis (€)',
    federalState: isEnglish ? 'German Federal State' : 'Bundesland',
    notaryCosts: isEnglish ? 'Notary Costs (%)' : 'Notarkosten (%)',
    agent: isEnglish ? 'Real Estate Agent' : 'Immobilienmakler',
    agentCommission: isEnglish ? 'Agent Commission (%)' : 'Maklerprovision (%)',
    downPayment: isEnglish ? 'Down Payment (€)' : 'Eigenkapital (€)',
    interestRate: isEnglish ? 'Interest Rate (% p.a.)' : 'Zinssatz (% p.a.)',
    repaymentRate: isEnglish ? 'Initial Repayment (% p.a.)' : 'Tilgungssatz (% p.a.)',
    fixedPeriod: isEnglish ? 'Fixed Interest Period (Years)' : 'Zinsbindung (Jahre)',
    totalCost: isEnglish ? 'Total Investment Cost' : 'Gesamtinvestition',
    loanAmount: isEnglish ? 'Loan Amount' : 'Darlehensbetrag',
    monthlyPayment: isEnglish ? 'Monthly Instalment' : 'Monatsrate',
    monthlyInterest: isEnglish ? 'Monthly Interest' : 'Monatszins',
    monthlyPrincipal: isEnglish ? 'Monthly Principal Repaid' : 'Monatliche Tilgung',
    remainingBalance: isEnglish ? 'Balance After Fixed Period' : 'Restschuld nach Zinsbindung',
    totalDuration: isEnglish ? 'Estimated Loan Duration' : 'Geschätzte Gesamtlaufzeit',
    ltv: isEnglish ? 'Loan-to-Value (LTV)' : 'Beleihungsauslauf (LTV)',
    chartTitle: isEnglish ? 'Loan Amortization Over Time' : 'Darlehensverlauf',
    cta: isEnglish ? 'Schedule a Free Consultation' : 'Kostenlose Beratung vereinbaren',
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)

  const { results, chartData } = useMemo(() => {
    const transferTaxAmount = purchasePrice * (transferTax / 100)
    const notaryAmount = purchasePrice * (notaryCosts / 100)
    const agentAmount = hasAgent ? purchasePrice * (agentCommission / 100) : 0
    const totalCost = purchasePrice + transferTaxAmount + notaryAmount + agentAmount
    const loanAmount = Math.max(0, totalCost - downPayment)

    const monthlyRate = (interestRate + repaymentRate) / 100 / 12
    const monthlyPayment = loanAmount * monthlyRate
    const monthlyInterest = (loanAmount * (interestRate / 100)) / 12
    const monthlyPrincipal = Math.max(0, monthlyPayment - monthlyInterest)

    let balance = loanAmount
    const maxMonths = 50 * 12
    let months = 0
    const chart = [{ year: 0, balance, principal: 0 }]
    let principalPaid = 0

    while (balance > 0.01 && months < maxMonths) {
      const interestPayment = balance * (interestRate / 100 / 12)
      const principalPayment = monthlyPayment - interestPayment
      balance = Math.max(0, balance - principalPayment)
      principalPaid += principalPayment
      months += 1
      if (months % 12 === 0) {
        chart.push({
          year: months / 12,
          balance,
          principal: principalPaid,
        })
      }
    }

    let balanceAfterFixed = loanAmount
    for (let i = 0; i < fixedPeriod * 12; i += 1) {
      const interestPayment = balanceAfterFixed * (interestRate / 100 / 12)
      const principalPayment = monthlyPayment - interestPayment
      balanceAfterFixed -= principalPayment
      if (balanceAfterFixed <= 0.01) {
        balanceAfterFixed = 0
        break
      }
    }

    const totalDuration = months > 0 ? (months / 12).toFixed(1) : '0.0'
    const ltvRatio = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 0

    return {
      results: {
        totalCost,
        loanAmount,
        monthlyPayment,
        monthlyInterest,
        monthlyPrincipal,
        balanceAfterFixed,
        totalDuration,
        ltvRatio,
      },
      chartData: chart,
    }
  }, [
    agentCommission,
    downPayment,
    fixedPeriod,
    hasAgent,
    interestRate,
    notaryCosts,
    purchasePrice,
    repaymentRate,
    transferTax,
  ])

  const handleDownloadPdf = () => {
    const doc = new jsPDF()
    const title = isEnglish ? 'Mortgage Summary (Germany)' : 'Finanzierungsübersicht (Deutschland)'
    const today = new Date().toLocaleDateString(locale)

    doc.setFontSize(18)
    doc.setTextColor(26, 77, 46)
    doc.text(title, 14, 18)

    doc.setFontSize(10)
    doc.setTextColor(90, 90, 90)
    doc.text(`${isEnglish ? 'Generated' : 'Erstellt'}: ${today}`, 14, 26)

    let y = 36
    doc.setFontSize(12)
    doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'Inputs' : 'Eingaben', 14, y)
    y += 8

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const inputs = [
      [`${isEnglish ? 'Purchase Price' : 'Kaufpreis'}:`, formatCurrency(purchasePrice)],
      [`${isEnglish ? 'Transfer Tax' : 'Grunderwerbsteuer'}:`, `${transferTax.toFixed(2)}%`],
      [`${isEnglish ? 'Notary Costs' : 'Notarkosten'}:`, `${notaryCosts.toFixed(2)}%`],
      [`${isEnglish ? 'Agent Commission' : 'Maklerprovision'}:`, hasAgent ? `${agentCommission.toFixed(2)}%` : '—'],
      [`${isEnglish ? 'Down Payment' : 'Eigenkapital'}:`, formatCurrency(downPayment)],
      [`${isEnglish ? 'Interest Rate' : 'Zinssatz'}:`, `${interestRate.toFixed(2)}%`],
      [`${isEnglish ? 'Repayment Rate' : 'Tilgung'}:`, `${repaymentRate.toFixed(2)}%`],
      [`${isEnglish ? 'Fixed Period' : 'Zinsbindung'}:`, `${fixedPeriod} ${isEnglish ? 'years' : 'Jahre'}`],
    ]

    inputs.forEach(([label, value]) => {
      doc.text(label, 14, y)
      doc.text(String(value), 90, y)
      y += 6
    })

    y += 4
    doc.setFontSize(12)
    doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'Results' : 'Ergebnisse', 14, y)
    y += 8

    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    const resultRows = [
      [labels.totalCost, formatCurrency(results.totalCost)],
      [labels.loanAmount, formatCurrency(results.loanAmount)],
      [labels.monthlyPayment, formatCurrency(results.monthlyPayment)],
      [labels.monthlyInterest, formatCurrency(results.monthlyInterest)],
      [labels.monthlyPrincipal, formatCurrency(results.monthlyPrincipal)],
      [labels.remainingBalance, formatCurrency(results.balanceAfterFixed)],
      [labels.totalDuration, `${results.totalDuration} ${isEnglish ? 'years' : 'Jahre'}`],
      [labels.ltv, `${results.ltvRatio.toFixed(1)}%`],
    ]

    resultRows.forEach(([label, value]) => {
      doc.text(String(label), 14, y)
      doc.text(String(value), 90, y)
      y += 6
    })

    doc.save(`Mortgage-Germany-${today}.pdf`)
  }

  return (
    <section className="rounded-[28px] border border-border/60 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-10">
      <header className="mb-8">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{labels.title}</p>
        <h2 className="mt-3 text-3xl font-heading font-bold text-primary">
          {labels.title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{labels.subtitle}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="rounded-2xl border border-border/60 bg-secondary/10 p-6">
            <h3 className="text-sm font-semibold text-primary">{labels.inputTitle}</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="text-sm text-muted-foreground">
                {labels.purchasePrice}
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={purchasePrice}
                  onChange={(event) => setPurchasePrice(Math.max(0, Number(event.target.value || 0)))}
                  className="mt-2 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-base font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="text-sm text-muted-foreground">
                {labels.federalState}
                <select
                  value={transferTax}
                  onChange={(event) => setTransferTax(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-base font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {stateOptions.map((state) => (
                    <option key={state.label} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm text-muted-foreground">
                {labels.notaryCosts}
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={notaryCosts}
                  onChange={(event) =>
                    setNotaryCosts(clamp(Number(event.target.value || 0), 0, 10))
                  }
                  className="mt-2 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-base font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border border-border/60 text-primary"
                    checked={hasAgent}
                    onChange={(event) => setHasAgent(event.target.checked)}
                  />
                  {labels.agent}
                </label>
                {hasAgent && (
                  <label className="text-sm text-muted-foreground">
                    {labels.agentCommission}
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.01}
                      value={agentCommission}
                      onChange={(event) =>
                        setAgentCommission(clamp(Number(event.target.value || 0), 0, 10))
                      }
                      className="mt-2 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-base font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </label>
                )}
              </div>

              <label className="text-sm text-muted-foreground">
                {labels.downPayment}
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={downPayment}
                  onChange={(event) => setDownPayment(Math.max(0, Number(event.target.value || 0)))}
                  className="mt-2 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-base font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="text-sm text-muted-foreground">
                {labels.interestRate}
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.01}
                  value={interestRate}
                  onChange={(event) =>
                    setInterestRate(clamp(Number(event.target.value || 0), 0, 20))
                  }
                  className="mt-2 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-base font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="text-sm text-muted-foreground">
                {labels.repaymentRate}
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={repaymentRate}
                  onChange={(event) =>
                    setRepaymentRate(clamp(Number(event.target.value || 0), 0, 10))
                  }
                  className="mt-2 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-base font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>

              <label className="text-sm text-muted-foreground">
                {labels.fixedPeriod}
                <select
                  value={fixedPeriod}
                  onChange={(event) => setFixedPeriod(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-border/60 bg-white px-3 py-2 text-base font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {[10, 15, 20, 25, 30].map((years) => (
                    <option key={years} value={years}>
                      {years} {isEnglish ? 'years' : 'Jahre'}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary">{labels.chartTitle}</h3>
            <div className="mt-4 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1a4d2e" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#1a4d2e" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="principalFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c19a6b" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#c19a6b" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e7ec" />
                  <XAxis dataKey="year" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `€${Math.round(value / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    labelFormatter={(label) => `${isEnglish ? 'Year' : 'Jahr'} ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#1a4d2e"
                    fill="url(#balanceFill)"
                    name={isEnglish ? 'Remaining balance' : 'Restschuld'}
                  />
                  <Area
                    type="monotone"
                    dataKey="principal"
                    stroke="#c19a6b"
                    fill="url(#principalFill)"
                    name={isEnglish ? 'Principal repaid' : 'Getilgt'}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary">{labels.resultsTitle}</h3>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                <div className="text-[11px] text-muted-foreground">{labels.totalCost}</div>
                <div className="text-xl font-bold text-foreground">{formatCurrency(results.totalCost)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                <div className="text-[11px] text-muted-foreground">{labels.loanAmount}</div>
                <div className="text-xl font-bold text-foreground">{formatCurrency(results.loanAmount)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                <div className="text-[11px] text-muted-foreground">{labels.monthlyPayment}</div>
                <div className="text-xl font-bold text-primary">{formatCurrency(results.monthlyPayment)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                <div className="text-[11px] text-muted-foreground">{labels.monthlyInterest}</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(results.monthlyInterest)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                <div className="text-[11px] text-muted-foreground">{labels.monthlyPrincipal}</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(results.monthlyPrincipal)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                <div className="text-[11px] text-muted-foreground">{labels.remainingBalance}</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(results.balanceAfterFixed)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                <div className="text-[11px] text-muted-foreground">{labels.totalDuration}</div>
                <div className="text-base font-semibold text-foreground">
                  {results.totalDuration} {isEnglish ? 'years' : 'Jahre'}
                </div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                <div className="text-[11px] text-muted-foreground">{labels.ltv}</div>
                <div className="text-base font-semibold text-foreground">{results.ltvRatio.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10"
            >
              {isEnglish ? 'Download PDF' : 'PDF herunterladen'}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90"
            >
              {labels.cta}
            </button>
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

export default MortgageGermanyCalculator
