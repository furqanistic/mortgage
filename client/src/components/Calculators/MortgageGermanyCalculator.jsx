// File: client/src/components/Calculators/MortgageGermanyCalculator.jsx
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

const stateOptions = [
  { label: 'Baden-Württemberg (5.0%)', value: 'baden-wuerttemberg', taxRate: 5.0 },
  { label: 'Bayern / Bavaria (3.5%)', value: 'bayern', taxRate: 3.5 },
  { label: 'Berlin (6.0%)', value: 'berlin', taxRate: 6.0 },
  { label: 'Brandenburg (6.5%)', value: 'brandenburg', taxRate: 6.5 },
  { label: 'Bremen (5.0%)', value: 'bremen', taxRate: 5.0 },
  { label: 'Hamburg (5.5%)', value: 'hamburg', taxRate: 5.5 },
  { label: 'Hessen / Hesse (6.0%)', value: 'hessen', taxRate: 6.0 },
  { label: 'Mecklenburg-Vorpommern (6.0%)', value: 'mecklenburg-vorpommern', taxRate: 6.0 },
  { label: 'Niedersachsen / Lower Saxony (5.0%)', value: 'niedersachsen', taxRate: 5.0 },
  { label: 'Nordrhein-Westfalen / North Rhine-Westphalia (6.5%)', value: 'nordrhein-westfalen', taxRate: 6.5 },
  { label: 'Rheinland-Pfalz / Rhineland-Palatinate (5.0%)', value: 'rheinland-pfalz', taxRate: 5.0 },
  { label: 'Saarland (6.5%)', value: 'saarland', taxRate: 6.5 },
  { label: 'Sachsen / Saxony (5.5%)', value: 'sachsen', taxRate: 5.5 },
  { label: 'Sachsen-Anhalt / Saxony-Anhalt (5.0%)', value: 'sachsen-anhalt', taxRate: 5.0 },
  { label: 'Schleswig-Holstein (6.5%)', value: 'schleswig-holstein', taxRate: 6.5 },
  { label: 'Thüringen / Thuringia (6.5%)', value: 'thueringen', taxRate: 6.5 },
]

const MortgageGermanyCalculator = ({ language = 'de' }) => {
  const isEnglish = language === 'en'
  const locale = isEnglish ? 'en-US' : 'de-DE'
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [purchasePrice, setPurchasePrice] = useState(400000)
  const [selectedState, setSelectedState] = useState('hessen')
  const [notaryCosts, setNotaryCosts] = useState(2.0)
  const [hasAgent, setHasAgent] = useState(false)
  const [agentCommission, setAgentCommission] = useState(3.57)
  const [downPayment, setDownPayment] = useState(80000)
  const [interestRate, setInterestRate] = useState(3.5)
  const [repaymentRate, setRepaymentRate] = useState(2.0)
  const [fixedPeriod, setFixedPeriod] = useState(15)
  const transferTax = stateOptions.find((opt) => opt.value === selectedState)?.taxRate ?? 6.0

  const labels = {
    title: isEnglish ? 'Mortgage Calculator (Germany)' : 'Finanzierungsrechner (Deutschland)',
    headline: isEnglish ? 'German Mortgage Expert' : 'Expert für Baufinanzierung',
    subtitle: isEnglish
      ? 'Calculate your total investment, loan size, and payment breakdown in real time.'
      : 'Berechnen Sie Gesamtinvestition, Darlehenshöhe und Raten in Echtzeit.',
    inputTitle: isEnglish ? 'Purchase & Financing Details' : 'Kauf- & Finanzierungsdetails',
    resultsTitle: isEnglish ? 'Your Financing Summary' : 'Ihre Finanzierungsübersicht',
    purchasePrice: isEnglish ? 'Purchase Price' : 'Kaufpreis',
    federalState: isEnglish ? 'German Federal State' : 'Bundesland',
    notaryCosts: isEnglish ? 'Notary Costs (%)' : 'Notarkosten (%)',
    agent: isEnglish ? 'Real Estate Agent' : 'Immobilienmakler',
    agentCommission: isEnglish ? 'Agent Commission (%)' : 'Maklerprovision (%)',
    downPayment: isEnglish ? 'Down Payment' : 'Eigenkapital',
    interestRate: isEnglish ? 'Interest Rate (% p.a.)' : 'Zinssatz (% p.a.)',
    repaymentRate: isEnglish ? 'Initial Repayment (% p.a.)' : 'Tilgungssatz (% p.a.)',
    fixedPeriod: isEnglish ? 'Fixed Interest Period (Years)' : 'Zinsbindung (Jahre)',
    totalCost: isEnglish ? 'Total Investment Cost' : 'Gesamtinvestition',
    loanAmount: isEnglish ? 'Loan Amount' : 'Darlehensbetrag',
    monthlyPayment: isEnglish ? 'Monthly Instalment' : 'Monatsrate',
    monthlyInterest: isEnglish ? 'Monthly Interest' : 'Monatszins',
    monthlyPrincipal: isEnglish ? 'Monthly Principal' : 'Monatliche Tilgung',
    remainingBalance: isEnglish ? 'Balance After Period' : 'Restschuld nach Zinsbindung',
    totalDuration: isEnglish ? 'Estimated Loan Duration' : 'Gesamtlaufzeit',
    ltv: isEnglish ? 'Loan-to-Value (LTV)' : 'Beleihungsauslauf (LTV)',
    chartTitle: isEnglish ? 'Amortization Over Time' : 'Darlehensverlauf',
    cta: isEnglish ? 'Get Personalized Advice' : 'Persönliche Beratung anfordern',
  }

  const formatCurrency = (value) => {
    const formattedNum = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(value)
    return isEnglish ? `€  ${formattedNum}` : `${formattedNum}  €`
  }

  const { results, chartData } = useMemo(() => {
    const transferTaxAmount = purchasePrice * (transferTax / 100)
    const notaryAmount = purchasePrice * (notaryCosts / 100)
    const agentAmount = hasAgent ? purchasePrice * (agentCommission / 100) : 0
    const totalCost = purchasePrice + transferTaxAmount + notaryAmount + agentAmount
    const loanAmount = Math.max(0, totalCost - downPayment)

    const monthlyRateTotal = (interestRate + repaymentRate) / 100 / 12
    const monthlyPayment = loanAmount * monthlyRateTotal
    const monthlyInterest = (loanAmount * (interestRate / 100)) / 12
    const monthlyPrincipal = Math.max(0, monthlyPayment - monthlyInterest)

    let balance = loanAmount
    const maxMonths = 50 * 12
    let months = 0
    const chart = [{ month: 0, balance, principal: 0 }]
    let principalPaid = 0

    while (balance > 0.01 && months < maxMonths) {
      const interestPayment = balance * (interestRate / 100 / 12)
      const principalPayment = Math.max(0, monthlyPayment - interestPayment)
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
      if (balance <= 0) break
    }

    let balanceAfterFixed = loanAmount
    for (let i = 0; i < fixedPeriod * 12; i += 1) {
      const interestPayment = balanceAfterFixed * (interestRate / 100 / 12)
      const principalPayment = Math.max(0, monthlyPayment - interestPayment)
      balanceAfterFixed -= principalPayment
      if (balanceAfterFixed <= 0.01) {
        balanceAfterFixed = 0
        break
      }
    }

    const totalDurationYears = months > 0 ? (months / 12).toFixed(1) : '0.0'
    const ltvRatio = purchasePrice > 0 ? (loanAmount / purchasePrice) * 100 : 0

    return {
      results: {
        totalCost,
        loanAmount,
        monthlyPayment,
        monthlyInterest,
        monthlyPrincipal,
        balanceAfterFixed,
        totalDuration: totalDurationYears,
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

  const handleDownloadPdf = async () => {
    const loadLogo = () => new Promise((resolve) => {
      const img = new window.Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
          canvas.getContext('2d').drawImage(img, 0, 0)
          resolve({ src: canvas.toDataURL('image/jpeg'), aspect: img.naturalWidth / img.naturalHeight })
        } catch { resolve(null) }
      }
      img.onerror = () => resolve(null)
      img.src = '/logo.jpeg'
    })

    const logo = await loadLogo()
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const pw = 210; const ph = 297; const ml = 15; const mr = 15; const cw = pw - ml - mr
    const brandWebsite = 'baufiking.de'
    const brandEmail = 'ravinder.singh@baufiking.de'
    const brandPhone = '+49 151 71618082'
    const today = new Date().toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    const fileDate = new Date().toISOString().slice(0, 10)

    let y = 0

    const drawHeader = () => {
      doc.setFillColor(26, 77, 46)
      doc.rect(0, 0, pw, 35, 'F')
      doc.setFillColor(193, 154, 107)
      doc.rect(0, 35, pw, 1, 'F')
      
      if (logo) {
        const lh = 22
        doc.addImage(logo.src, 'JPEG', ml, 6, lh * logo.aspect, lh)
      }
      
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.setTextColor(255, 255, 255)
      doc.text(isEnglish ? 'Mortgage Financing Analysis' : 'Baufinanzierungs-Bericht', pw - mr, 15, { align: 'right' })
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.setTextColor(180, 210, 180)
      doc.text(isEnglish ? `Generated on ${today}` : `Erstellt am ${today}`, pw - mr, 22, { align: 'right' })
      
      doc.setFontSize(10)
      doc.setTextColor(193, 154, 107)
      doc.text(brandWebsite, pw - mr, 29, { align: 'right' })
      y = 45
    }

    const drawFooter = () => {
      const total = doc.internal.getNumberOfPages()
      for (let p = 1; p <= total; p++) {
        doc.setPage(p)
        doc.setFillColor(26, 77, 46)
        doc.rect(0, ph - 18, pw, 18, 'F')
        
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(8)
        doc.setTextColor(255, 255, 255)
        doc.text(brandWebsite, ml, ph - 11)
        
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        doc.setTextColor(220, 240, 220)
        doc.text(brandEmail, pw / 2, ph - 11, { align: 'center' })
        doc.text(brandPhone, pw - mr, ph - 11, { align: 'right' })
        
        doc.setFontSize(7)
        doc.setTextColor(193, 154, 107)
        doc.text(isEnglish ? 'Professional Mortgage & Investment Advisory' : 'Professionelle Finanzierungsberatung', ml, ph - 5)
        doc.text(`${p} / ${total}`, pw - mr, ph - 5, { align: 'right' })
      }
    }

    const guard = (h) => {
      if (y + h > ph - 25) {
        doc.addPage()
        drawHeader()
        y = 45
      }
    }

    drawHeader()

    // 1. Recommendation / Verdict Box
    guard(30)
    doc.setFillColor(26, 77, 46)
    doc.roundedRect(ml, y, cw, 16, 1.5, 1.5, 'F')
    
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(255, 255, 255)
    doc.text(isEnglish ? 'FINANCING SIGNAL' : 'FINANZIERUNGS-SIGNAL', ml + 5, y + 6.5)
    
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(230, 245, 230)
    const verdictText = isEnglish
      ? `Based on a purchase price of ${formatCurrency(purchasePrice)}, your required loan is ${formatCurrency(results.loanAmount)}.`
      : `Auf Basis eines Kaufpreises von ${formatCurrency(purchasePrice)} beträgt das Darlehen ${formatCurrency(results.loanAmount)}.`
    doc.text(verdictText, ml + 5, y + 11)
    y += 24

    // 2. Key Results Dashboard
    guard(30)
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(ml, y, cw, 22, 1.5, 1.5, 'F')
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2); doc.roundedRect(ml, y, cw, 22, 1.5, 1.5, 'D')

    const boxW = cw / 4
    const drawBox = (label, val, x) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(100, 116, 139)
      doc.text(label, x + 5, y + 7)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(26, 26, 26)
      doc.text(val, x + 5, y + 16)
    }

    drawBox(isEnglish ? 'MONTHLY RATE' : 'MONATSRATE', formatCurrency(results.monthlyPayment), ml)
    drawBox(isEnglish ? 'LOAN AMOUNT' : 'DARLEHEN', formatCurrency(results.loanAmount), ml + boxW)
    drawBox(isEnglish ? 'LTV (BELEIHUNG)' : 'LTV', `${results.ltvRatio.toFixed(1)}%`, ml + boxW * 2)
    drawBox(isEnglish ? 'EST. DURATION' : 'LAUFZEIT', `${results.totalDuration} ${isEnglish ? 'yrs' : 'J.'}`, ml + boxW * 3)
    y += 30

    // 3. Two Column Details (Inputs vs Summary)
    guard(65)
    const colW = (cw - 10) / 2
    let ly = y; let ry = y
    
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'PURCHASE DETAILS' : 'KAUFDETAILS', ml, ly)
    doc.setDrawColor(193, 154, 107); doc.setLineWidth(0.4); doc.line(ml, ly + 2, ml + colW, ly + 2)
    ly += 8

    const dataRow = (label, value, targetY) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(107, 114, 128)
      doc.text(label, ml, targetY)
      doc.setFont('helvetica', 'bold'); doc.setTextColor(26, 26, 26)
      doc.text(value, ml + colW, targetY, { align: 'right' })
      return targetY + 5.5
    }

    ly = dataRow(isEnglish ? 'Purchase Price' : 'Kaufpreis', formatCurrency(purchasePrice), ly)
    ly = dataRow(isEnglish ? 'Down Payment' : 'Eigenkapital', formatCurrency(downPayment), ly)
    ly = dataRow(isEnglish ? 'Transfer Tax' : 'Grunderwerbsteuer', `${transferTax.toFixed(2)}%`, ly)
    ly = dataRow(isEnglish ? 'Notary Costs' : 'Notarkosten', `${notaryCosts.toFixed(2)}%`, ly)
    ly = dataRow(isEnglish ? 'Interest Rate' : 'Sollzins', `${interestRate.toFixed(2)}%`, ly)
    ly = dataRow(isEnglish ? 'Initial Repayment' : 'Anf. Tilgung', `${repaymentRate.toFixed(2)}%`, ly)
    ly = dataRow(isEnglish ? 'Fixed Period' : 'Zinsbindung', `${fixedPeriod} ${isEnglish ? 'Yrs' : 'J.'}`, ly)

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'FINANCING SUMMARY' : 'FINANZ-ÜBERSICHT', ml + colW + 10, ry)
    doc.setDrawColor(193, 154, 107); doc.setLineWidth(0.4); doc.line(ml + colW + 10, ry + 2, ml + cw, ry + 2)
    ry += 8

    const resultRow = (label, value, targetY) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(107, 114, 128)
      doc.text(label, ml + colW + 10, targetY)
      doc.setFont('helvetica', 'bold'); doc.setTextColor(26, 26, 26)
      doc.text(value, ml + cw, targetY, { align: 'right' })
      return targetY + 5.5
    }

    resultRow(isEnglish ? 'Total Cost' : 'Gesamtkosten', formatCurrency(results.totalCost), ry); ry += 5.5
    resultRow(isEnglish ? 'Loan Principal' : 'Darlehenssumme', formatCurrency(results.loanAmount), ry); ry += 5.5
    resultRow(isEnglish ? 'Monthly Interest' : 'Monatszins', formatCurrency(results.monthlyInterest), ry); ry += 5.5
    resultRow(isEnglish ? 'Monthly Principal' : 'Mtl. Tilgung', formatCurrency(results.monthlyPrincipal), ry); ry += 5.5
    
    ry += 2
    doc.setFillColor(232, 245, 233)
    doc.roundedRect(ml + colW + 10, ry, colW, 9, 1.2, 1.2, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'REMAINING DEBT' : 'RESTSCHULD', ml + colW + 10 + colW / 2, ry + 5.8, { align: 'center' })
    doc.setTextColor(26, 26, 26)
    doc.text(formatCurrency(results.balanceAfterFixed), ml + cw, ry + 5.8, { align: 'right' })
    ry += 15
    
    y = Math.max(ly, ry + 12)

    // 4. Disclaimer
    guard(20)
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2); doc.line(ml, y, ml + cw, y)
    y += 4
    doc.setFont('helvetica', 'italic'); doc.setFontSize(6.5); doc.setTextColor(107, 114, 128)
    const discLines = doc.splitTextToSize(isEnglish
      ? 'Note: This report is a simulation based on your assumptions. Past performance does not guarantee future results. No financial or tax advice.'
      : 'Hinweis: Simulation auf Basis Ihrer Annahmen. Keine Gewähr für künftige Ergebnisse. Keine Finanz- oder Steuerberatung.', cw)
    doc.text(discLines, ml, y)

    drawFooter()
    doc.save(`BaufiKing-Mortgage-${fileDate}.pdf`)
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
          {/* Sticky Header */}
          <div className="sticky top-4 z-20 -mx-6 sm:-mx-10 px-6 sm:px-10 py-5 bg-white/95 backdrop-blur border-b border-border/60">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{labels.resultsTitle}</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-primary">{formatCurrency(results.loanAmount)}</div>
                <div className="text-xs text-slate-500">
                  {isEnglish ? 'Total investment including costs:' : 'Gesamtinvestition inkl. Nebenkosten:'} {formatCurrency(results.totalCost)}
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                  <div className="text-[11px] text-slate-400">{labels.monthlyPayment}</div>
                  <div className="text-base font-extrabold text-slate-900">{formatCurrency(results.monthlyPayment)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                  <div className="text-[11px] text-slate-400">{labels.totalDuration}</div>
                  <div className="text-base font-extrabold text-slate-900 whitespace-nowrap">{results.totalDuration} {isEnglish ? 'yrs' : 'Jahre'}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                  <div className="text-[11px] text-slate-400">{labels.ltv}</div>
                  <div className="text-base font-extrabold text-slate-900">{results.ltvRatio.toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] pt-6">
            <div className="grid gap-4 sm:grid-cols-2 items-start">
              {/* Purchase Price */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-700">{labels.purchasePrice}</div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">€</span>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border-2 border-slate-200 px-10 py-2.5 text-base font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
                <input
                  type="range"
                  min={100000}
                  max={2000000}
                  step={10000}
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              {/* State Select */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-700">{labels.federalState}</div>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-base font-semibold focus:outline-none focus:border-accent"
                >
                  {stateOptions.map((opt) => (
                    <option key={opt.label} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Notary Costs */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-700">{labels.notaryCosts}</div>
                <input
                  type="number"
                  step={0.1}
                  value={notaryCosts}
                  onChange={(e) => setNotaryCosts(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-base font-semibold focus:outline-none focus:border-accent"
                />
              </div>

              {/* Agent Commission */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-700">{labels.agent}</div>
                  <input
                    type="checkbox"
                    checked={hasAgent}
                    onChange={(e) => setHasAgent(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary"
                  />
                </div>
                {hasAgent && (
                  <div className="relative">
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                    <input
                      type="number"
                      step={0.01}
                      value={agentCommission}
                      onChange={(e) => setAgentCommission(Number(e.target.value))}
                      className="w-full rounded-xl border-2 border-slate-200 px-4 pr-10 py-2.5 text-base font-semibold focus:outline-none focus:border-accent"
                    />
                  </div>
                )}
              </div>

              {/* Down Payment */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-700">{labels.downPayment}</div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">€</span>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border-2 border-slate-200 px-10 py-2.5 text-base font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-700">{labels.interestRate}</div>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  <input
                    type="number"
                    step={0.01}
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 pr-10 py-2.5 text-base font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Repayment Rate */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-700">{labels.repaymentRate}</div>
                <div className="relative">
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">%</span>
                  <input
                    type="number"
                    step={0.1}
                    value={repaymentRate}
                    onChange={(e) => setRepaymentRate(Number(e.target.value))}
                    className="w-full rounded-xl border-2 border-slate-200 px-4 pr-10 py-2.5 text-base font-semibold focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Fixed Period */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-slate-700">{labels.fixedPeriod}</div>
                <select
                  value={fixedPeriod}
                  onChange={(e) => setFixedPeriod(Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-slate-200 px-4 py-2.5 text-base font-semibold focus:outline-none focus:border-accent"
                >
                  {[5, 10, 15, 20, 25, 30].map(v => (
                    <option key={v} value={v}>{v} {isEnglish ? 'Years' : 'Jahre'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-border/60 bg-secondary/10 p-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-white p-4 border border-border/60">
                    <div className="text-[11px] text-slate-400">{labels.remainingBalance}</div>
                    <div className="text-lg font-semibold text-slate-800">{formatCurrency(results.balanceAfterFixed)}</div>
                  </div>
                  <div className="rounded-xl bg-white p-4 border border-border/60">
                    <div className="text-[11px] text-slate-400">{labels.totalDuration}</div>
                    <div className="text-lg font-semibold text-slate-800">{results.totalDuration} {isEnglish ? 'yrs' : 'Jahre'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border/60 rounded-2xl p-5">
                <div className="font-heading text-lg text-primary mb-4">{isEnglish ? 'Monthly Calculation' : 'Monatliche Berechnung'}</div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{labels.monthlyInterest}</span>
                    <span className="text-primary">{formatCurrency(results.monthlyInterest)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>{labels.monthlyPrincipal}</span>
                    <span className="text-accent">{formatCurrency(results.monthlyPrincipal)}</span>
                  </div>
                  <div className="pt-4 border-t border-primary/30 flex items-center justify-between text-base font-bold">
                    <span>{labels.monthlyPayment}</span>
                    <span className="text-primary">{formatCurrency(results.monthlyPayment)}</span>
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
                  className="w-full rounded-xl border-2 border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
                >
                  {isEnglish ? 'Download PDF Report' : 'PDF-Report herunterladen'}
                </button>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mt-10 pt-10 border-t border-border/60">
            <h3 className="font-heading text-xl text-primary font-bold mb-6">{labels.chartTitle}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="year"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(v) => `€${Math.round(v / 1000)}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                    formatter={(v) => [formatCurrency(v), '']}
                  />
                  <Area
                    type="monotone"
                    dataKey="balance"
                    stroke="#1a4d2e"
                    fill="#1a4d2e"
                    fillOpacity={0.1}
                    name={isEnglish ? 'Remaining Balance' : 'Restschuld'}
                  />
                  <Area
                    type="monotone"
                    dataKey="principal"
                    stroke="#c19a6b"
                    fill="#c19a6b"
                    fillOpacity={0.1}
                    name={isEnglish ? 'Principal Repaid' : 'Getilgt'}
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

export default MortgageGermanyCalculator
