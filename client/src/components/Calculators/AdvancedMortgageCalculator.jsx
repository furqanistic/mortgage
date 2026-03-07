// File: client/src/components/Calculators/AdvancedMortgageCalculator.jsx
import ConsultationModal from '@/components/Home/ConsultationModal'
import { jsPDF } from 'jspdf'
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

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const AdvancedMortgageCalculator = ({ language = 'de' }) => {
  const isEnglish = language === 'en'
  const locale = isEnglish ? 'en-US' : 'de-DE'
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [income, setIncome] = useState(5000)
  const [interestRate, setInterestRate] = useState(4.0)
  const [repaymentRate, setRepaymentRate] = useState(1.5)
  const [maxPaymentPercent, setMaxPaymentPercent] = useState(35)
  const [fixedPeriodYears, setFixedPeriodYears] = useState(10)

  const [incomeInput, setIncomeInput] = useState('5000')
  const [interestInput, setInterestInput] = useState('4.0')
  const [repaymentInput, setRepaymentInput] = useState('1.5')
  const [maxPaymentInput, setMaxPaymentInput] = useState('35')
  const [fixedPeriodInput, setFixedPeriodInput] = useState('10')
  const [isDownloading, setIsDownloading] = useState(false)

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)

  const formatNumber = (value) => Math.round(value).toLocaleString(locale)
  const formatCurrencyPdf = (value) => {
    const formatted = formatNumber(value)
    return isEnglish ? `€ ${formatted}` : `${formatted} €`
  }

  const totalRate = interestRate + repaymentRate
  const maxMonthlyPayment = (income * maxPaymentPercent) / 100
  const annualPayment = maxMonthlyPayment * 12
  const maxLoan = totalRate > 0 ? annualPayment / (totalRate / 100) : 0

  const schedule = useMemo(() => {
    const monthlyInterestRate = interestRate / 100 / 12
    const data = [{ month: 0, balance: maxLoan }]
    let balance = maxLoan
    let month = 0

    while (balance > 0 && month < 600) {
      month += 1
      const interestPayment = balance * monthlyInterestRate
      const principalPayment = maxMonthlyPayment - interestPayment
      balance = Math.max(0, balance - principalPayment)
      data.push({
        month,
        balance,
        interestPayment,
        principalPayment,
      })
      if (balance <= 0) break
    }

    return data
  }, [interestRate, maxLoan, maxMonthlyPayment])

  const totalMonths = Math.max(0, schedule.length - 1)
  const totalYears = totalMonths / 12
  const fixedMonths = fixedPeriodYears * 12

  const remainingAfterFixed =
    fixedMonths < schedule.length ? schedule[fixedMonths].balance : 0

  const paidOffInPeriod = Math.max(0, maxLoan - remainingAfterFixed)

  const firstMonthInterest = (maxLoan * (interestRate / 100)) / 12
  const firstMonthRepayment = Math.max(0, maxMonthlyPayment - firstMonthInterest)

  const interestShare =
    maxMonthlyPayment > 0
      ? (firstMonthInterest / maxMonthlyPayment) * 100
      : 0
  const repaymentShare =
    maxMonthlyPayment > 0
      ? (firstMonthRepayment / maxMonthlyPayment) * 100
      : 0

  const yearlyBreakdown = useMemo(() => {
    const buckets = []
    let yearIndex = 0

    for (let i = 1; i < schedule.length; i += 1) {
      const month = schedule[i]
      const currentYear = Math.floor((month.month - 1) / 12)
      if (!buckets[currentYear]) {
        buckets[currentYear] = {
          year: currentYear + 1,
          interest: 0,
          principal: 0,
          balance: month.balance,
        }
      }
      buckets[currentYear].interest += month.interestPayment || 0
      buckets[currentYear].principal += month.principalPayment || 0
      buckets[currentYear].balance = month.balance
      yearIndex = currentYear
    }

    return buckets
      .filter(Boolean)
      .slice(0, Math.min(yearIndex + 1, 15))
      .map((item) => ({
        ...item,
        interest: Math.max(0, item.interest),
        principal: Math.max(0, item.principal),
        balance: Math.max(0, item.balance),
      }))
  }, [schedule])

  const labels = {
    title: isEnglish ? 'Advanced Affordability Calculator' : 'Erweiterter Finanzierungsrechner',
    headline: isEnglish ? 'Plan Your Future Home' : 'Planen Sie Ihre Immobilie',
    subtitle: isEnglish
      ? 'Detailed financing calculation with amortization schedule and PDF report'
      : 'Detaillierte Finanzierungsberechnung mit Tilgungsverlauf und PDF-Report',
    inputs: {
      income: isEnglish ? 'Net Household Income (Monthly)' : 'Nettoeinkommen (monatlich)',
      interest: isEnglish ? 'Interest Rate (Annual)' : 'Zinssatz (jährlich)',
      repayment: isEnglish ? 'Repayment Rate (Annual)' : 'Tilgungssatz (jährlich)',
      maxPayment: isEnglish ? 'Maximum Payment (% of Income)' : 'Max. Rate (% vom Einkommen)',
      fixed: isEnglish ? 'Fixed Interest Period (Years)' : 'Zinsbindung (Jahre)',
    },
    resultsTitle: isEnglish ? 'Your Advanced Summary' : 'Ihre detaillierte Übersicht',
    maxLoan: isEnglish ? 'Maximum Financing Amount' : 'Maximale Finanzierungssumme',
    monthlyPayment: isEnglish ? 'Monthly Instalment' : 'Monatliche Rate',
    loanTerm: isEnglish ? 'Total Loan Duration' : 'Gesamtlaufzeit',
    fixedPeriod: isEnglish ? 'Fixed Interst Period' : 'Zinsbindung',
    remainingAfterFixed: isEnglish ? 'Remaining Balance after Period' : 'Restschuld nach Zinsbindung',
    paidOff: isEnglish ? 'Principal Paid during Period' : 'Getilgt in der Zinsbindung',
    breakdownTitle: isEnglish ? 'Payment Breakdown' : 'Zahlungsaufteilung',
    totalPayment: isEnglish ? 'Total Monthly Payment' : 'Gesamtrate pro Monat',
    chartTitle: isEnglish ? 'Amortization Over Time' : 'Tilgungsverlauf',
    chartSubtitle: isEnglish ? 'Stacked chart showing yearly principal vs interest' : 'Jährliche Tilgung vs. Zinsen',
    infoTitle: isEnglish ? 'How This Calculation Works' : 'So funktioniert die Berechnung',
    infoText: isEnglish
      ? 'This advanced calculator determines your maximum financing and shows how your balance decreases over time. Adjust interest, repayment, and fixed period to see the impact on your remaining debt.'
      : 'Der Rechner bestimmt Ihre maximale Finanzierung und zeigt den Restschuldverlauf. Passen Sie Zins, Tilgung und Zinsbindung an, um die Auswirkungen zu sehen.',
    infoNote: isEnglish
      ? '* This is an estimate only - actual loan approval depends on bank assessment'
      : '* Nur eine Schätzung - tatsächliche Zusage hängt von der Bank ab',
    cta: isEnglish ? 'Get Personalized Advice' : 'Persönliche Beratung anfordern',
    download: isEnglish ? 'Download PDF Report' : 'PDF-Report herunterladen',
  }

  const loadImageAsDataUrl = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return reject(new Error('Canvas not supported'))
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/jpeg', 0.9))
      }
      img.onerror = reject
      img.src = src
    })

  const handleDownloadPdf = async () => {
    if (isDownloading) return
    setIsDownloading(true)
    try {
      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const marginX = 48
      let cursorY = 64

      doc.setFillColor(255, 255, 255)
      doc.rect(0, 0, pageWidth, 72, 'F')
      doc.setDrawColor(230, 233, 237)
      doc.line(0, 72, pageWidth, 72)
      doc.setTextColor(26, 77, 46)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text(isEnglish ? 'Financing Report' : 'Finanzierungs-Report', marginX + 54, 44)
      doc.setFontSize(11)
      doc.setFont('times', 'bolditalic')
      doc.text('Baufiking', pageWidth - marginX, 44, { align: 'right' })

      try {
        const logoData = await loadImageAsDataUrl('/logo-dark.png')
        doc.addImage(logoData, 'JPEG', marginX, 20, 36, 36)
      } catch (error) {
        // Ignore logo load errors
      }

      cursorY = 96
      doc.setTextColor(40, 55, 69)
      doc.setFontSize(11)
      doc.text(
        `${isEnglish ? 'Generated on' : 'Erstellt am'} ${new Date().toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`,
        marginX,
        cursorY
      )

      cursorY += 26
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text(isEnglish ? 'Inputs' : 'Eingaben', marginX, cursorY)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)

      const inputRows = [
        [labels.inputs.income, formatCurrencyPdf(income)],
        [labels.inputs.interest, `${interestRate.toFixed(2)}%`],
        [labels.inputs.repayment, `${repaymentRate.toFixed(2)}%`],
        [labels.inputs.maxPayment, `${maxPaymentPercent}%`],
        [labels.inputs.fixed, `${fixedPeriodYears} ${isEnglish ? 'years' : 'Jahre'}`],
      ]

      cursorY += 16
      inputRows.forEach(([label, value]) => {
        doc.text(label, marginX, cursorY)
        doc.text(String(value), pageWidth - marginX, cursorY, { align: 'right' })
        cursorY += 16
      })

      cursorY += 12
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text(isEnglish ? 'Results' : 'Ergebnisse', marginX, cursorY)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)

      cursorY += 16
      const resultRows = [
        [labels.maxLoan, formatCurrencyPdf(maxLoan)],
        [labels.monthlyPayment, formatCurrencyPdf(maxMonthlyPayment)],
        [labels.loanTerm, `${totalYears.toFixed(1)} ${isEnglish ? 'years' : 'Jahre'}`],
        [`${labels.remainingAfterFixed}`, formatCurrencyPdf(remainingAfterFixed)],
        [labels.paidOff, formatCurrencyPdf(paidOffInPeriod)],
      ]

      resultRows.forEach(([label, value]) => {
        doc.text(label, marginX, cursorY)
        doc.text(String(value), pageWidth - marginX, cursorY, { align: 'right' })
        cursorY += 16
      })

      cursorY += 14
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(13)
      doc.text(isEnglish ? 'Yearly breakdown' : 'Jährliche Übersicht', marginX, cursorY)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)

      cursorY += 14
      const tableTop = cursorY
      const colWidths = [60, 150, 150, 150]
      const headers = [
        isEnglish ? 'Year' : 'Jahr',
        isEnglish ? 'Principal' : 'Tilgung',
        isEnglish ? 'Interest' : 'Zinsen',
        isEnglish ? 'Balance' : 'Restschuld',
      ]

      doc.setFillColor(245, 247, 250)
      doc.rect(marginX, tableTop, pageWidth - marginX * 2, 20, 'F')
      let colX = marginX + 6
      headers.forEach((header, index) => {
        doc.text(header, colX, tableTop + 14)
        colX += colWidths[index]
      })

      let rowY = tableTop + 30
      yearlyBreakdown.slice(0, 10).forEach((item, index) => {
        const rowX = marginX + 6
        doc.setTextColor(40, 55, 69)
        doc.text(String(item.year), rowX, rowY)
        doc.text(formatCurrencyPdf(item.principal), rowX + colWidths[0], rowY)
        doc.text(formatCurrencyPdf(item.interest), rowX + colWidths[0] + colWidths[1], rowY)
        doc.text(formatCurrencyPdf(item.balance), rowX + colWidths[0] + colWidths[1] + colWidths[2], rowY)
        if (index < yearlyBreakdown.slice(0,10).length - 1) {
          doc.setDrawColor(230, 233, 237)
          doc.line(marginX, rowY + 6, pageWidth - marginX, rowY + 6)
        }
        rowY += 18
      })

      doc.setFontSize(9)
      doc.setTextColor(120, 134, 150)
      doc.text(
        isEnglish
          ? 'This report is an estimate for informational purposes only.'
          : 'Dieser Report ist eine unverbindliche Schätzung zu Informationszwecken.',
        marginX,
        800
      )

      doc.save(isEnglish ? 'mortgage-report.pdf' : 'finanzierungs-report.pdf')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="sticky top-4 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-5 bg-white/95 backdrop-blur border-b border-border/60">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{labels.resultsTitle}</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-primary">{formatCurrency(maxLoan)}</div>
                <div className="text-xs text-slate-500">
                  {isEnglish ? 'Based on monthly income of' : 'Basierend auf einem Einkommen von'} {formatCurrency(income)}
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                  <div className="text-[11px] text-slate-400">{labels.monthlyPayment}</div>
                  <div className="text-base font-extrabold text-slate-900">{formatCurrency(maxMonthlyPayment)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                  <div className="text-[11px] text-slate-400">{labels.loanTerm}</div>
                  <div className="text-base font-extrabold text-slate-900 whitespace-nowrap">{totalYears.toFixed(1)} {isEnglish ? 'yrs' : 'Jahre'}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                  <div className="text-[11px] text-slate-400">{isEnglish ? 'Total Annual Rate' : 'Gesamtrate p.a.'}</div>
                  <div className="text-base font-extrabold text-slate-900">{totalRate.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] pt-6">
            <div className="grid gap-4 sm:grid-cols-2 items-start">
              {/* Income Input */}
              <div className="space-y-2">
                <div className="flex min-h-[24px] items-center justify-between pr-2 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="lg:whitespace-nowrap">{labels.inputs.income}</span>
                  </div>
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
                    className="w-full rounded-xl border-2 border-slate-200 px-10 py-2.5 text-base font-semibold focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
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
              </div>

              {/* Interest Rate Input */}
              <div className="space-y-2">
                <div className="flex min-h-[24px] items-center justify-between pr-2 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="lg:whitespace-nowrap">{labels.inputs.interest}</span>
                  </div>
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
                    className="w-full rounded-xl border-2 border-slate-200 px-4 pr-10 py-2.5 text-base font-semibold focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
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
              </div>

              {/* Repayment Rate Input */}
              <div className="space-y-2">
                <div className="flex min-h-[24px] items-center justify-between pr-2 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="lg:whitespace-nowrap">{labels.inputs.repayment}</span>
                  </div>
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
                    className="w-full rounded-xl border-2 border-slate-200 px-4 pr-10 py-2.5 text-base font-semibold focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
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
              </div>

              {/* Max Payment Input */}
              <div className="space-y-2">
                <div className="flex min-h-[24px] items-center justify-between pr-2 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="lg:whitespace-nowrap">{labels.inputs.maxPayment}</span>
                  </div>
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
                    className="w-full rounded-xl border-2 border-slate-200 px-4 pr-10 py-2.5 text-base font-semibold focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
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
              </div>

              {/* Fixed Period Input */}
              <div className="space-y-2 lg:col-span-2">
                <div className="flex min-h-[24px] items-center justify-between pr-2 text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="lg:whitespace-nowrap">{labels.inputs.fixed}</span>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    step={1}
                    value={fixedPeriodInput}
                    onChange={(e) => setFixedPeriodInput(e.target.value)}
                    onBlur={() => {
                      const next = clamp(Number(fixedPeriodInput || 0), 1, 30)
                      setFixedPeriodYears(next)
                      setFixedPeriodInput(String(next))
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-base font-semibold focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={fixedPeriodYears}
                  onChange={(e) => {
                    const next = Number(e.target.value)
                    setFixedPeriodYears(next)
                    setFixedPeriodInput(String(next))
                  }}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-border/60 bg-secondary/10 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-4 border border-border/60">
                    <div className="text-[11px] text-slate-400">{labels.remainingAfterFixed}</div>
                    <div className="text-lg font-semibold text-slate-800">{formatCurrency(remainingAfterFixed)}</div>
                  </div>
                  <div className="rounded-xl bg-white p-4 border border-border/60">
                    <div className="text-[11px] text-slate-400">{labels.paidOff}</div>
                    <div className="text-lg font-semibold text-slate-800">{formatCurrency(paidOffInPeriod)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border/60 rounded-2xl p-5">
                <div className="font-heading text-lg text-primary mb-4">{labels.breakdownTitle}</div>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{isEnglish ? 'Interest' : 'Zinsen'} ({interestRate.toFixed(1)}% {isEnglish ? 'annually' : 'p.a.'})</span>
                      <span className="text-primary">{formatCurrency(firstMonthInterest)}/mo</span>
                    </div>
                    <div className="h-2 bg-border/60 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-primary" style={{ width: `${interestShare}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>{isEnglish ? 'Principal Repayment' : 'Tilgung'} ({repaymentRate.toFixed(1)}% {isEnglish ? 'annually' : 'p.a.'})</span>
                      <span className="text-primary">{formatCurrency(firstMonthRepayment)}/mo</span>
                    </div>
                    <div className="h-2 bg-border/60 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-accent" style={{ width: `${repaymentShare}%` }} />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-primary/30 flex items-center justify-between text-sm font-semibold">
                    <div className="flex items-center gap-2">
                      <span>{labels.totalPayment}</span>
                    </div>
                    <span className="text-primary">{formatCurrency(maxMonthlyPayment)}</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90"
                >
                  {labels.cta}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isDownloading}
                  className="w-full rounded-xl border-2 border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5 disabled:opacity-50"
                >
                  {isDownloading ? (isEnglish ? 'Preparing...' : 'Wird vorbereitet...') : labels.download}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-10 border-t border-border/60">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <h3 className="font-heading text-xl text-primary font-bold">{labels.chartTitle}</h3>
                <p className="text-sm text-slate-500">{labels.chartSubtitle}</p>
              </div>
            </div>
            <div className="h-[300px] sm:h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    dy={10}
                    label={{ value: isEnglish ? 'Year' : 'Jahr', position: 'insideBottomRight', offset: -10, fontSize: 10, fill: '#94a3b8' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [formatCurrency(value), '']}
                    labelFormatter={(label) => `${isEnglish ? 'Year' : 'Jahr'} ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="interest"
                    stackId="1"
                    stroke="#c19a6b"
                    fill="#c19a6b"
                    fillOpacity={0.1}
                    name={isEnglish ? 'Interest' : 'Zinsen'}
                  />
                  <Area
                    type="monotone"
                    dataKey="principal"
                    stackId="1"
                    stroke="#1a4d2e"
                    fill="#1a4d2e"
                    fillOpacity={0.2}
                    name={isEnglish ? 'Principal' : 'Tilgung'}
                  />
                </AreaChart>
              </ResponsiveContainer>
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

export default AdvancedMortgageCalculator
