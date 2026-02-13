// File: client/src/components/Calculators/AdvancedMortgageCalculator.jsx
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
  const firstMonthRepayment = maxMonthlyPayment - firstMonthInterest

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
    title: isEnglish ? 'Advanced Mortgage Calculator' : 'Erweiterter Hypothekenrechner',
    subtitle: isEnglish
      ? 'Calculate your mortgage with detailed amortization and remaining balance after fixed period'
      : 'Berechnen Sie Ihre Finanzierung mit Tilgungsverlauf und Restschuld nach der Zinsbindung',
    inputs: {
      income: isEnglish ? 'Net Household Income (Monthly)' : 'Nettoeinkommen (monatlich)',
      interest: isEnglish ? 'Interest Rate (Annual)' : 'Zinssatz (jährlich)',
      repayment: isEnglish ? 'Repayment Rate (Annual)' : 'Tilgungssatz (jährlich)',
      maxPayment: isEnglish ? 'Maximum Payment (% of Income)' : 'Max. Rate (% vom Einkommen)',
      fixed: isEnglish ? 'Fixed Interest Period (Years)' : 'Zinsbindung (Jahre)',
    },
    resultsTitle: isEnglish ? 'Your Mortgage Summary' : 'Ihre Finanzierungsübersicht',
    maxLoan: isEnglish ? 'Maximum Loan Amount' : 'Maximale Darlehenssumme',
    monthlyPayment: isEnglish ? 'Monthly Payment' : 'Monatliche Rate',
    loanTerm: isEnglish ? 'Total Loan Term' : 'Gesamtlaufzeit',
    afterFixed: isEnglish ? 'After' : 'Nach',
    paidOff: isEnglish ? 'Paid Off in Period' : 'Getilgt in der Periode',
    breakdown: isEnglish ? 'Payment Breakdown' : 'Zahlungsaufteilung',
    chartTitle: isEnglish ? 'Loan Balance Over Time' : 'Restschuldverlauf',
    infoTitle: isEnglish ? 'How This Calculation Works' : 'So funktioniert die Berechnung',
    infoText: isEnglish
      ? 'This calculator determines your maximum affordable mortgage based on a customizable percentage of your net household income. Adjust interest rate, repayment rate, and maximum payment percentage to match your situation.'
      : 'Der Rechner bestimmt Ihre maximal leistbare Finanzierung basierend auf einem frei wählbaren Anteil Ihres Nettoeinkommens. Passen Sie Zins, Tilgung und maximalen Zahlungsanteil an.',
    cta: isEnglish ? 'Get Personalized Advice' : 'Persönliche Beratung anfordern',
    download: isEnglish ? 'Download PDF report' : 'PDF-Report herunterladen',
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
    doc.text(isEnglish ? 'Mortgage Report' : 'Finanzierungs-Report', marginX + 54, 44)
    doc.setFontSize(11)
    doc.setFont('times', 'bolditalic')
    doc.text('Baufiking', pageWidth - marginX, 44, { align: 'right' })

    try {
      const logoData = await loadImageAsDataUrl('/logo.jpeg')
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
      [`${labels.afterFixed} ${fixedPeriodYears}`, formatCurrencyPdf(remainingAfterFixed)],
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
    yearlyBreakdown.slice(0, 8).forEach((item, index) => {
      const rowX = marginX + 6
      doc.setTextColor(40, 55, 69)
      doc.text(String(item.year), rowX, rowY)
      doc.text(formatCurrencyPdf(item.principal), rowX + colWidths[0], rowY)
      doc.text(formatCurrencyPdf(item.interest), rowX + colWidths[0] + colWidths[1], rowY)
      doc.text(formatCurrencyPdf(item.balance), rowX + colWidths[0] + colWidths[1] + colWidths[2], rowY)
      if (index < 7) {
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
    <section className="py-10 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-8 border border-border/60">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
              {labels.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {labels.subtitle}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 divide-y divide-border/60 overflow-hidden">
                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{labels.inputs.income}</span>
                    <span className="text-primary font-bold">{formatCurrency(income)}</span>
                  </div>
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
                    className="w-full h-11 px-4 rounded-xl border border-border focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                  />
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
                    className="w-full accent-[#1a4d2e]"
                  />
                </div>

                <div className="p-4 sm:p-5 grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{labels.inputs.interest}</span>
                      <span className="text-primary font-bold">{interestRate.toFixed(1)}%</span>
                    </div>
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
                      className="w-full h-11 px-4 rounded-xl border border-border focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                    />
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
                    className="w-full accent-[#1a4d2e]"
                  />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{labels.inputs.repayment}</span>
                      <span className="text-primary font-bold">{repaymentRate.toFixed(1)}%</span>
                    </div>
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
                      className="w-full h-11 px-4 rounded-xl border border-border focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                    />
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
                    className="w-full accent-[#1a4d2e]"
                  />
                  </div>
                </div>

                <div className="p-4 sm:p-5 grid sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{labels.inputs.maxPayment}</span>
                      <span className="text-primary font-bold">{maxPaymentPercent}%</span>
                    </div>
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
                      className="w-full h-11 px-4 rounded-xl border border-border focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                    />
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
                    className="w-full accent-[#1a4d2e]"
                  />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-semibold">
                      <span>{labels.inputs.fixed}</span>
                      <span className="text-primary font-bold">
                        {fixedPeriodYears} {isEnglish ? 'years' : 'Jahre'}
                      </span>
                    </div>
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
                      className="w-full h-11 px-4 rounded-xl border border-border focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                    />
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
                    className="w-full accent-[#1a4d2e]"
                  />
                  </div>
                </div>
              </div>

              <div className="bg-secondary/30 border border-border/60 rounded-2xl p-4 sm:p-5">
                <div className="font-semibold text-primary mb-2 text-sm">{labels.infoTitle}</div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {labels.infoText}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-primary text-white rounded-2xl p-5 sm:p-6 shadow-lg border border-primary/30">
                <h3 className="text-center font-heading text-xl mb-4">
                  {labels.resultsTitle}
                </h3>

                <div className="text-center bg-white/10 rounded-2xl p-5 mb-5">
                  <div className="text-xs opacity-80">{labels.maxLoan}</div>
                  <div className="text-3xl sm:text-4xl font-bold">
                    {formatCurrency(maxLoan)}
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    {isEnglish ? 'Based on your monthly income of' : 'Basierend auf Ihrem Einkommen von'} {formatCurrency(income)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-[11px] opacity-80">{labels.monthlyPayment}</div>
                    <div className="text-lg font-bold">{formatCurrency(maxMonthlyPayment)}</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-[11px] opacity-80">{labels.loanTerm}</div>
                    <div className="text-lg font-bold">{totalYears.toFixed(1)} {isEnglish ? 'yrs' : 'Jahre'}</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-[11px] opacity-80">
                      {labels.afterFixed} {fixedPeriodYears} {isEnglish ? 'years' : 'Jahre'}
                    </div>
                    <div className="text-lg font-bold">{formatCurrency(remainingAfterFixed)}</div>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3">
                    <div className="text-[11px] opacity-80">{labels.paidOff}</div>
                    <div className="text-lg font-bold">{formatCurrency(paidOffInPeriod)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border/60 rounded-2xl p-4 sm:p-5">
                <h3 className="font-heading text-lg text-primary mb-3">{labels.breakdown}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>
                        {isEnglish ? 'Interest' : 'Zinsen'} ({interestRate.toFixed(1)}% {isEnglish ? 'annually' : 'p.a.'})
                      </span>
                      <span className="text-primary">{formatCurrency(firstMonthInterest)}/mo</span>
                    </div>
                    <div className="h-1.5 bg-border/60 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-primary" style={{ width: `${interestShare}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>
                        {isEnglish ? 'Principal Repayment' : 'Tilgung'} ({repaymentRate.toFixed(1)}% {isEnglish ? 'annually' : 'p.a.'})
                      </span>
                      <span className="text-primary">{formatCurrency(firstMonthRepayment)}/mo</span>
                    </div>
                    <div className="h-1.5 bg-border/60 rounded-full overflow-hidden mt-2">
                      <div className="h-full bg-primary" style={{ width: `${repaymentShare}%` }} />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-primary/30 flex items-center justify-between text-sm font-semibold">
                    <span>{isEnglish ? 'Total Monthly Payment' : 'Gesamtrate pro Monat'}</span>
                    <span className="text-primary">{formatCurrency(maxMonthlyPayment)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-md hover:bg-primary/90 transition"
              >
                {labels.cta}
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="w-full border border-primary/30 text-primary font-semibold py-3 rounded-xl transition hover:border-primary/60 hover:bg-primary/5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDownloading ? (isEnglish ? 'Preparing PDF...' : 'PDF wird erstellt...') : labels.download}
              </button>
            </div>
          </div>

          <div className="mt-6 bg-white border border-border/60 rounded-2xl p-4 sm:p-5">
            <h3 className="font-heading text-lg text-primary mb-1">{labels.chartTitle}</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {isEnglish
                ? 'Stacked chart shows yearly principal vs interest.'
                : 'Gestapelte Grafik zeigt jährliche Tilgung vs. Zinsen.'}
            </p>
            <div className="h-[260px] sm:h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={yearlyBreakdown} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="year"
                    tickFormatter={(value) => `${value}`}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis
                    tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value) => `€${formatNumber(value)}`}
                    labelFormatter={(label) => `${isEnglish ? 'Year' : 'Jahr'} ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="interest"
                    stackId="1"
                    stroke="#c19a6b"
                    fill="#c19a6b33"
                    name={isEnglish ? 'Interest' : 'Zinsen'}
                  />
                  <Area
                    type="monotone"
                    dataKey="principal"
                    stackId="1"
                    stroke="#1a4d2e"
                    fill="#1a4d2e33"
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
