// File: client/src/components/Calculators/PropertyInvestmentCalculator.jsx
import ConsultationModal from '@/components/Home/ConsultationModal'
import { jsPDF } from 'jspdf'
import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const PropertyInvestmentCalculator = ({ language = 'de' }) => {
  const isEnglish = language === 'en'
  const locale = isEnglish ? 'en-US' : 'de-DE'
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [purchasePrice, setPurchasePrice] = useState(300000)
  const [equity, setEquity] = useState(60000)
  const [monthlyRent, setMonthlyRent] = useState(1200)
  const [transferTax, setTransferTax] = useState(5.0)
  const [notaryCosts, setNotaryCosts] = useState(1.5)
  const [agentFees, setAgentFees] = useState(3.57)
  const [interestRate, setInterestRate] = useState(3.5)
  const [repaymentRate, setRepaymentRate] = useState(2.0)
  const [nonTransferableCosts, setNonTransferableCosts] = useState(200)
  const [maintenanceCosts, setMaintenanceCosts] = useState(150)
  const [taxRate, setTaxRate] = useState(35)
  const [depreciationRate, setDepreciationRate] = useState(2.0)
  const [buildingRatio, setBuildingRatio] = useState(80)
  const [propertyGrowth, setPropertyGrowth] = useState(2.5)
  const [rentIncrease, setRentIncrease] = useState(2.0)
  const [costInflation, setCostInflation] = useState(2.0)
  const [sellingCosts, setSellingCosts] = useState(3.5)
  const [alternativeReturn, setAlternativeReturn] = useState(7.0)

  const labels = {
    title: isEnglish ? 'Property Investment Calculator' : 'Immobilien-Investment Rechner',
    subtitle: isEnglish
      ? 'Measure cashflow, yields, tax impact, and 10-year outcomes.'
      : 'Cashflow, Rendite, Steuerwirkung und 10-Jahres-Projektion.',
    inputs: isEnglish ? 'Property Inputs' : 'Eingaben',
    keyResults: isEnglish ? 'Key Results' : 'Ergebnisse',
    taxBenefits: isEnglish ? 'Tax Benefits' : 'Steuervorteile',
    projection: isEnglish ? '10-Year Projection' : '10-Jahres-Projektion',
    comparison: isEnglish ? 'Property vs Alternative' : 'Immobilie vs Alternative',
    breakdown: isEnglish ? 'Detailed Breakdown' : 'Detailübersicht',
    cta: isEnglish ? 'Schedule a Free Consultation' : 'Kostenlose Beratung vereinbaren',
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)

  const formatPercent = (value) => `${value.toFixed(2)}%`

  const data = useMemo(() => {
    const transferTaxAmount = purchasePrice * (transferTax / 100)
    const notaryAmount = purchasePrice * (notaryCosts / 100)
    const agentAmount = purchasePrice * (agentFees / 100)
    const acquisitionCosts = transferTaxAmount + notaryAmount + agentAmount
    const totalInvestment = purchasePrice + acquisitionCosts

    const loanAmount = Math.max(0, totalInvestment - equity)
    const monthlyRate = interestRate / 100 / 12
    const monthlyPayment = loanAmount * ((interestRate + repaymentRate) / 100) / 12

    const buildingValue = purchasePrice * (buildingRatio / 100)
    const annualDepreciation = buildingValue * (depreciationRate / 100)

    let loanBalance = loanAmount
    let interestYear1 = 0
    let principalYear1 = 0

    for (let month = 1; month <= 12; month += 1) {
      const monthlyInterest = loanBalance * monthlyRate
      const monthlyPrincipal = monthlyPayment - monthlyInterest
      interestYear1 += monthlyInterest
      principalYear1 += monthlyPrincipal
      loanBalance -= monthlyPrincipal
    }

    const annualRentIncome = monthlyRent * 12
    const annualCosts = (nonTransferableCosts + maintenanceCosts) * 12
    const annualFinancing = monthlyPayment * 12

    const deductibleExpenses = interestYear1 + annualCosts + annualDepreciation
    const taxableRentalIncome = annualRentIncome - deductibleExpenses
    const taxLiability = taxableRentalIncome * (taxRate / 100)
    const annualTaxSavings = Math.max(0, -taxLiability)
    const taxOnRentalIncome = Math.max(0, taxLiability)

    const annualCashflow = annualRentIncome - annualCosts - annualFinancing
    const annualCashflowAfterTax = annualCashflow - taxOnRentalIncome + annualTaxSavings

    const monthlyCashflowAfterTax = annualCashflowAfterTax / 12

    const grossYield = (annualRentIncome / purchasePrice) * 100
    const netRentIncome = annualRentIncome - annualCosts
    const netYield = (netRentIncome / totalInvestment) * 100

    const years = 10
    const cashflows = [-equity]
    let cumulativeCashflowAfterTax = 0
    let totalPrincipalPaid = 0
    let currentPropertyValue = purchasePrice
    loanBalance = loanAmount

    let currentRent = monthlyRent
    let currentCosts = nonTransferableCosts + maintenanceCosts

    for (let year = 1; year <= years; year += 1) {
      const yearlyRent = currentRent * 12
      const yearlyCosts = currentCosts * 12

      let yearlyInterest = 0
      let yearlyPrincipal = 0

      for (let month = 1; month <= 12; month += 1) {
        const monthlyInterest = loanBalance * monthlyRate
        const monthlyPrincipal = monthlyPayment - monthlyInterest
        yearlyInterest += monthlyInterest
        yearlyPrincipal += monthlyPrincipal
        loanBalance -= monthlyPrincipal
      }

      totalPrincipalPaid += yearlyPrincipal

      const yearlyDeductible = yearlyInterest + yearlyCosts + annualDepreciation
      const yearlyTaxableIncome = yearlyRent - yearlyDeductible
      const yearlyTaxLiability = yearlyTaxableIncome * (taxRate / 100)
      const yearlyTaxSavings = Math.max(0, -yearlyTaxLiability)
      const yearlyTax = Math.max(0, yearlyTaxLiability)

      const yearlyGrossCashflow = yearlyRent - yearlyCosts - monthlyPayment * 12
      const yearlyNetCashflow = yearlyGrossCashflow - yearlyTax + yearlyTaxSavings
      cumulativeCashflowAfterTax += yearlyNetCashflow
      cashflows.push(yearlyNetCashflow)

      currentPropertyValue *= 1 + propertyGrowth / 100
      currentRent *= 1 + rentIncrease / 100
      currentCosts *= 1 + costInflation / 100
    }

    const futurePropertyValue = currentPropertyValue
    const remainingBalance = loanBalance
    const sellingCostsAmount = futurePropertyValue * (sellingCosts / 100)
    const netProceeds = futurePropertyValue - sellingCostsAmount - remainingBalance

    cashflows[cashflows.length - 1] += netProceeds

    const netEquityPosition = futurePropertyValue - remainingBalance
    const totalReturn = netProceeds + cumulativeCashflowAfterTax - equity
    const roe10Year = equity > 0 ? (totalReturn / equity) * 100 : 0

    const calculateIRR = (flows) => {
      let guess = 0.1
      const maxIterations = 100
      const tolerance = 0.0001

      for (let i = 0; i < maxIterations; i += 1) {
        let npv = 0
        let dnpv = 0
        flows.forEach((flow, idx) => {
          npv += flow / Math.pow(1 + guess, idx)
          dnpv += (-idx * flow) / Math.pow(1 + guess, idx + 1)
        })
        const nextGuess = guess - npv / dnpv
        if (Math.abs(nextGuess - guess) < tolerance) return nextGuess * 100
        guess = nextGuess
      }
      return null
    }

    const irr = calculateIRR(cashflows)

    const alternativeValue = equity * Math.pow(1 + alternativeReturn / 100, years)
    const propertyTotalValue = netProceeds + cumulativeCashflowAfterTax
    const difference = propertyTotalValue - alternativeValue

    const comparisonData = []
    let compLoanBalance = loanAmount
    let compCashflow = 0
    let compPropertyValue = purchasePrice
    let compRent = monthlyRent
    let compCosts = nonTransferableCosts + maintenanceCosts

    comparisonData.push({ year: 0, property: equity, alternative: equity })

    for (let year = 1; year <= years; year += 1) {
      let yearlyInterest = 0
      for (let month = 1; month <= 12; month += 1) {
        const monthlyInterest = compLoanBalance * monthlyRate
        const monthlyPrincipal = monthlyPayment - monthlyInterest
        yearlyInterest += monthlyInterest
        compLoanBalance -= monthlyPrincipal
      }

      const yearlyRent = compRent * 12
      const yearlyCosts = compCosts * 12
      const yearlyDeductible = yearlyInterest + yearlyCosts + annualDepreciation
      const yearlyTaxable = yearlyRent - yearlyDeductible
      const yearlyTax = Math.max(0, yearlyTaxable * (taxRate / 100))
      const yearlyTaxSavings = Math.max(0, -yearlyTaxable * (taxRate / 100))

      const yearlyGross = yearlyRent - yearlyCosts - monthlyPayment * 12
      const yearlyNet = yearlyGross - yearlyTax + yearlyTaxSavings
      compCashflow += yearlyNet

      compPropertyValue *= 1 + propertyGrowth / 100
      const netEquity = compPropertyValue - compLoanBalance
      const totalPropertyValue = netEquity + compCashflow

      const altValue = equity * Math.pow(1 + alternativeReturn / 100, year)
      comparisonData.push({ year, property: totalPropertyValue, alternative: altValue })

      compRent *= 1 + rentIncrease / 100
      compCosts *= 1 + costInflation / 100
    }

    return {
      totalInvestment,
      acquisitionCosts,
      loanAmount,
      monthlyPayment,
      interestYear1,
      principalYear1,
      monthlyOperatingCosts: nonTransferableCosts + maintenanceCosts,
      monthlyCashflowAfterTax,
      grossYield,
      netYield,
      annualTaxSavings,
      annualRentIncome,
      deductibleExpenses,
      taxableRentalIncome,
      futurePropertyValue,
      remainingBalance,
      totalPrincipalPaid,
      cumulativeCashflowAfterTax,
      netEquityPosition,
      roe10Year,
      irr,
      propertyTotalValue,
      alternativeValue,
      difference,
      comparisonData,
    }
  }, [
    agentFees,
    alternativeReturn,
    buildingRatio,
    costInflation,
    depreciationRate,
    equity,
    interestRate,
    maintenanceCosts,
    monthlyRent,
    nonTransferableCosts,
    notaryCosts,
    propertyGrowth,
    purchasePrice,
    rentIncrease,
    repaymentRate,
    sellingCosts,
    taxRate,
    transferTax,
  ])

  const roiTone = data.monthlyCashflowAfterTax > 200
    ? 'positive'
    : data.monthlyCashflowAfterTax > 0
    ? 'positive'
    : data.monthlyCashflowAfterTax > -200
    ? 'neutral'
    : 'negative'

  const handleDownloadPdf = async () => {
    const loadLogo = () => new Promise((resolve) => {
      const img = new window.Image()
      img.crossOrigin = 'Anonymous'
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          canvas.width = img.naturalWidth
          canvas.height = img.naturalHeight
          canvas.getContext('2d').drawImage(img, 0, 0)
          resolve({ src: canvas.toDataURL('image/jpeg'), aspect: img.naturalWidth / img.naturalHeight })
        } catch (_) { resolve(null) }
      }
      img.onerror = () => resolve(null)
      img.src = '/logo.jpeg'
    })

    const logo = await loadLogo()
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const pw = 210; const ph = 297; const ml = 14; const cw = pw - ml * 2
    const today = new Date().toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    const fileDate = new Date().toISOString().slice(0, 10)

    // ── Header band
    doc.setFillColor(26, 77, 46); doc.rect(0, 0, pw, 38, 'F')
    doc.setFillColor(193, 154, 107); doc.rect(0, 38, pw, 1.5, 'F')
    if (logo) { const lh = 26; doc.addImage(logo.src, 'JPEG', ml, 6, lh * logo.aspect, lh) }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(17); doc.setTextColor(255, 255, 255)
    doc.text(isEnglish ? 'Property Investment Report' : 'Immobilien-Investment Bericht', pw - ml, 16, { align: 'right' })
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(180, 210, 180)
    doc.text(isEnglish ? `Generated: ${today}` : `Erstellt: ${today}`, pw - ml, 25, { align: 'right' })
    doc.setFontSize(8); doc.setTextColor(193, 154, 107)
    doc.text('baufiking.de', pw - ml, 33, { align: 'right' })

    let y = 50
    const guard = (n = 16) => { if (y + n > ph - 18) { doc.addPage(); y = 18 } }

    const secHead = (label) => {
      guard(14)
      doc.setFillColor(232, 245, 233); doc.setDrawColor(180, 210, 180); doc.setLineWidth(0.3)
      doc.roundedRect(ml, y, cw, 7.5, 1.5, 1.5, 'FD')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(26, 77, 46)
      doc.text(label.toUpperCase(), ml + 4, y + 5); y += 11
    }

    const row2 = (l1, v1, l2, v2) => {
      guard(9); const col = cw / 2 - 2
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(107, 114, 128)
      doc.text(l1, ml + 2, y)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(26, 26, 26)
      doc.text(v1, ml + col, y, { align: 'right' })
      if (l2 !== undefined) {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(107, 114, 128)
        doc.text(l2, ml + col + 6, y)
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(26, 26, 26)
        doc.text(v2, ml + cw, y, { align: 'right' })
      }
      y += 7.5
    }

    // ── Key Inputs
    secHead(isEnglish ? 'Key Inputs' : 'Eingaben')
    row2(isEnglish ? 'Purchase Price' : 'Kaufpreis', formatCurrency(purchasePrice), isEnglish ? 'Down Payment' : 'Eigenkapital', formatCurrency(equity))
    row2(isEnglish ? 'Monthly Rent' : 'Monatsmiete', formatCurrency(monthlyRent), isEnglish ? 'Loan Amount' : 'Darlehen', formatCurrency(data.loanAmount))
    row2(isEnglish ? 'Interest Rate' : 'Zinssatz', `${interestRate.toFixed(2)}%`, isEnglish ? 'Repayment Rate' : 'Tilgung', `${repaymentRate.toFixed(2)}%`)
    row2(isEnglish ? 'Transfer Tax' : 'Grunderwerbsteuer', `${transferTax.toFixed(1)}%`, isEnglish ? 'Notary & Registry' : 'Notar & Grundbuch', `${notaryCosts.toFixed(1)}%`)
    row2(isEnglish ? 'Agent Commission' : 'Maklergebühr', `${agentFees.toFixed(2)}%`, isEnglish ? 'Tax Rate' : 'Steuersatz', `${taxRate}%`)
    row2(isEnglish ? 'Depreciation (AfA)' : 'AfA', `${depreciationRate.toFixed(1)}%`, isEnglish ? 'Building Ratio' : 'Gebäudeanteil', `${buildingRatio}%`); y += 3

    // ── Key Results
    secHead(isEnglish ? 'Key Results' : 'Ergebnisse')
    guard(17)
    doc.setFillColor(26, 77, 46); doc.roundedRect(ml, y, cw, 13, 2, 2, 'F')
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(180, 210, 180)
    doc.text(isEnglish ? 'Monthly Cashflow (After Tax)' : 'Monatlicher Cashflow (nach Steuern)', ml + 4, y + 5)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(255, 255, 255)
    doc.text(formatCurrency(data.monthlyCashflowAfterTax), pw - ml, y + 9.5, { align: 'right' }); y += 17
    row2(isEnglish ? 'Gross Yield' : 'Bruttorendite', formatPercent(data.grossYield), isEnglish ? 'Net Yield' : 'Nettorendite', formatPercent(data.netYield))
    row2(isEnglish ? 'Total ROI (10y)' : 'Rendite (10J)', formatPercent(data.roe10Year), 'IRR', data.irr !== null ? formatPercent(data.irr) : 'N/A')
    row2(isEnglish ? 'Monthly Payment' : 'Monatsrate', formatCurrency(data.monthlyPayment), isEnglish ? 'Operating Costs' : 'Betriebskosten', formatCurrency(data.monthlyOperatingCosts)); y += 3

    // ── Tax Overview
    secHead(isEnglish ? 'Tax Overview' : 'Steuerübersicht')
    row2(isEnglish ? 'Annual Rental Income' : 'Jahresmieteinnahmen', formatCurrency(data.annualRentIncome), isEnglish ? 'Deductible Expenses' : 'Abzüge', formatCurrency(data.deductibleExpenses))
    row2(isEnglish ? 'Annual Tax Savings' : 'Steuerersparnis p.a.', formatCurrency(data.annualTaxSavings), isEnglish ? 'Taxable Income' : 'Steuerpflichtig', formatCurrency(Math.max(0, data.taxableRentalIncome))); y += 3

    // ── 10-Year Projection
    secHead(isEnglish ? '10-Year Projection' : '10-Jahres-Projektion')
    row2(isEnglish ? 'Future Property Value' : 'Zukünftiger Wert', formatCurrency(data.futurePropertyValue), isEnglish ? 'Remaining Loan' : 'Restschuld', formatCurrency(data.remainingBalance))
    row2(isEnglish ? 'Principal Paid' : 'Tilgungsleistung', formatCurrency(data.totalPrincipalPaid), isEnglish ? 'Cumulative Cashflow' : 'Kumulierter Cashflow', formatCurrency(data.cumulativeCashflowAfterTax)); y += 2
    guard(14)
    doc.setFillColor(232, 245, 233); doc.setDrawColor(180, 210, 180); doc.setLineWidth(0.3)
    doc.roundedRect(ml, y, cw, 11, 1.5, 1.5, 'FD')
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'Total Equity Position' : 'Nettovermögen (10J)', ml + 4, y + 4.5)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(26, 77, 46)
    doc.text(formatCurrency(data.netEquityPosition), pw - ml, y + 8, { align: 'right' }); y += 15

    // ── Property vs Alternative
    secHead(isEnglish ? 'Property vs Alternative' : 'Immobilie vs. Alternative')
    row2(isEnglish ? 'Property Total (10y)' : 'Immobilie gesamt (10J)', formatCurrency(data.propertyTotalValue), isEnglish ? 'Alternative Investment' : 'Alternative Anlage', formatCurrency(data.alternativeValue)); y += 2
    guard(11)
    const pos = data.difference >= 0
    doc.setFillColor(pos ? 232 : 254, pos ? 245 : 226, pos ? 233 : 226)
    doc.setDrawColor(pos ? 26 : 185, pos ? 77 : 28, pos ? 46 : 28); doc.setLineWidth(0.3)
    doc.roundedRect(ml, y, cw, 9, 1.5, 1.5, 'FD')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5)
    doc.setTextColor(pos ? 26 : 185, pos ? 77 : 28, pos ? 46 : 28)
    doc.text(pos
      ? (isEnglish ? `Property leads by ${formatCurrency(data.difference)}` : `Immobilie vorne um ${formatCurrency(data.difference)}`)
      : (isEnglish ? `Alternative leads by ${formatCurrency(Math.abs(data.difference))}` : `Alternative vorne um ${formatCurrency(Math.abs(data.difference))}`),
    ml + 4, y + 5.5); y += 13

    // ── Disclaimer
    guard(22)
    doc.setDrawColor(228, 231, 236); doc.setLineWidth(0.3); doc.line(ml, y, pw - ml, y); y += 5
    doc.setFont('helvetica', 'italic'); doc.setFontSize(7); doc.setTextColor(107, 114, 128)
    const disc = isEnglish
      ? 'This report is for informational purposes only and does not constitute financial, investment, or tax advice. All projections are estimates based on the inputs provided. Actual results may vary significantly.'
      : 'Dieser Bericht dient nur zu Informationszwecken und stellt keine Finanz-, Anlage- oder Steuerberatung dar. Alle Projektionen sind Schätzungen auf Basis der eingegebenen Daten.'
    doc.text(doc.splitTextToSize(disc, cw), ml, y)

    // ── Footer on every page
    const total = doc.internal.getNumberOfPages()
    for (let p = 1; p <= total; p++) {
      doc.setPage(p); doc.setFillColor(26, 77, 46); doc.rect(0, ph - 11, pw, 11, 'F')
      doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.setTextColor(255, 255, 255)
      doc.text('baufiking.de', ml, ph - 4)
      doc.setFont('helvetica', 'normal'); doc.setTextColor(180, 210, 180)
      doc.text(isEnglish ? 'Professional Mortgage & Investment Advisory' : 'Professionelle Finanzierungsberatung', pw / 2, ph - 4, { align: 'center' })
      doc.setTextColor(193, 154, 107); doc.text(`${p} / ${total}`, pw - ml, ph - 4, { align: 'right' })
    }

    doc.save(`BaufiKing-Investment-${fileDate}.pdf`)
  }

  return (
    <section className="w-full rounded-[24px] border border-border/60 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-5 lg:h-[calc(100vh-8rem)] lg:overflow-hidden">
      <div className="relative grid w-full gap-5 lg:h-full lg:grid-cols-[minmax(340px,420px)_minmax(0,1fr)] lg:items-start">
        {/* Left Section: Inputs - Fixed on screen */}
        <div className="flex flex-col py-1 pe-2 lg:h-full lg:overflow-y-scroll lg:pr-2 lg:[scrollbar-gutter:stable] lg:[scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/30 hover:[&::-webkit-scrollbar-thumb]:bg-primary/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-primary/5">
          <div>
            <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
              <h3 className="text-sm font-semibold text-primary">{labels.inputs}</h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <label className="text-xs leading-snug text-muted-foreground">
                Purchase Price (€)
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={purchasePrice}
                  onChange={(event) => setPurchasePrice(Math.max(0, Number(event.target.value || 0)))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Down Payment (€)
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={equity}
                  onChange={(event) => setEquity(Math.max(0, Number(event.target.value || 0)))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Monthly Rent (€)
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={monthlyRent}
                  onChange={(event) => setMonthlyRent(Math.max(0, Number(event.target.value || 0)))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Transfer Tax (%)
                <input
                  type="number"
                  min={3.5}
                  max={6.5}
                  step={0.1}
                  value={transferTax}
                  onChange={(event) => setTransferTax(clamp(Number(event.target.value || 0), 3.5, 6.5))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Notary & Registry (%)
                <input
                  type="number"
                  min={0}
                  max={3}
                  step={0.1}
                  value={notaryCosts}
                  onChange={(event) => setNotaryCosts(clamp(Number(event.target.value || 0), 0, 3))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Agent Commission (%)
                <input
                  type="number"
                  min={0}
                  max={7.14}
                  step={0.01}
                  value={agentFees}
                  onChange={(event) => setAgentFees(clamp(Number(event.target.value || 0), 0, 7.14))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Interest Rate (%)
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={interestRate}
                  onChange={(event) => setInterestRate(clamp(Number(event.target.value || 0), 0, 10))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Repayment Rate (%)
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={repaymentRate}
                  onChange={(event) => setRepaymentRate(clamp(Number(event.target.value || 0), 0, 10))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Non-transferable Costs (€)
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={nonTransferableCosts}
                  onChange={(event) => setNonTransferableCosts(Math.max(0, Number(event.target.value || 0)))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Maintenance Reserve (€)
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={maintenanceCosts}
                  onChange={(event) => setMaintenanceCosts(Math.max(0, Number(event.target.value || 0)))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Tax Rate (%)
                <input
                  type="number"
                  min={0}
                  max={45}
                  step={1}
                  value={taxRate}
                  onChange={(event) => setTaxRate(clamp(Number(event.target.value || 0), 0, 45))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Depreciation (AfA) (%)
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={depreciationRate}
                  onChange={(event) => setDepreciationRate(clamp(Number(event.target.value || 0), 0, 5))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Building Ratio (%)
                <input
                  type="number"
                  min={50}
                  max={95}
                  step={1}
                  value={buildingRatio}
                  onChange={(event) => setBuildingRatio(clamp(Number(event.target.value || 0), 50, 95))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Property Growth (%)
                <input
                  type="number"
                  min={-2}
                  max={10}
                  step={0.1}
                  value={propertyGrowth}
                  onChange={(event) => setPropertyGrowth(clamp(Number(event.target.value || 0), -2, 10))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Rent Increase (%)
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={rentIncrease}
                  onChange={(event) => setRentIncrease(clamp(Number(event.target.value || 0), 0, 5))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Cost Inflation (%)
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={costInflation}
                  onChange={(event) => setCostInflation(clamp(Number(event.target.value || 0), 0, 5))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Selling Costs (%)
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={sellingCosts}
                  onChange={(event) => setSellingCosts(clamp(Number(event.target.value || 0), 0, 10))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Alternative Return (%)
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  value={alternativeReturn}
                  onChange={(event) => setAlternativeReturn(clamp(Number(event.target.value || 0), 0, 20))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Results - Scrollable */}
        <div className="flex flex-col py-1 lg:h-full lg:min-h-0">
          <div className="flex-1 space-y-6 lg:overflow-y-scroll lg:pr-2 lg:[scrollbar-gutter:stable] lg:[scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/20 hover:[&::-webkit-scrollbar-thumb]:bg-primary/35 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-primary/5">
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary">{labels.keyResults}</h3>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                <div className="text-[11px] text-muted-foreground">Monthly Cashflow (After Tax)</div>
                <div className="text-xl font-bold text-primary">{formatCurrency(data.monthlyCashflowAfterTax)}</div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Gross Yield</div>
                  <div className="text-lg font-semibold text-foreground">{formatPercent(data.grossYield)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Net Yield</div>
                  <div className="text-lg font-semibold text-foreground">{formatPercent(data.netYield)}</div>
                </div>
              </div>
              <div
                className={`rounded-xl border px-4 py-3 text-sm ${
                  roiTone === 'positive'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                    : roiTone === 'neutral'
                    ? 'border-amber-300 bg-amber-50 text-amber-700'
                    : 'border-rose-300 bg-rose-50 text-rose-700'
                }`}
              >
                {roiTone === 'positive'
                  ? isEnglish
                    ? `Positive cashflow of ${formatCurrency(data.monthlyCashflowAfterTax)}.`
                    : `Positiver Cashflow von ${formatCurrency(data.monthlyCashflowAfterTax)}.`
                  : roiTone === 'neutral'
                  ? isEnglish
                    ? `Near break-even: ${formatCurrency(Math.abs(data.monthlyCashflowAfterTax))} per month.`
                    : `Nahe am Break-even: ${formatCurrency(Math.abs(data.monthlyCashflowAfterTax))} pro Monat.`
                  : isEnglish
                  ? `Negative cashflow of ${formatCurrency(Math.abs(data.monthlyCashflowAfterTax))}.`
                  : `Negativer Cashflow von ${formatCurrency(Math.abs(data.monthlyCashflowAfterTax))}.`}
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-primary">{labels.taxBenefits}</h3>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div className="text-[11px] text-emerald-700">Annual Tax Savings</div>
                  <div className="text-lg font-semibold text-emerald-700">{formatCurrency(data.annualTaxSavings)}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                    <div className="text-[11px] text-muted-foreground">Rental Income</div>
                    <div className="text-base font-semibold text-foreground">{formatCurrency(data.annualRentIncome)}</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                    <div className="text-[11px] text-muted-foreground">Deductible Expenses</div>
                    <div className="text-base font-semibold text-foreground">{formatCurrency(data.deductibleExpenses)}</div>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-white px-4 py-3 sm:col-span-2">
                    <div className="text-[11px] text-muted-foreground">Taxable Income</div>
                    <div className="text-base font-semibold text-foreground">{formatCurrency(Math.max(0, data.taxableRentalIncome))}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-primary">{labels.breakdown}</h3>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Total Investment</div>
                  <div className="text-lg font-semibold text-foreground">{formatCurrency(data.totalInvestment)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Acquisition Costs</div>
                  <div className="text-base font-semibold text-foreground">{formatCurrency(data.acquisitionCosts)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Loan Amount</div>
                  <div className="text-base font-semibold text-foreground">{formatCurrency(data.loanAmount)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Monthly Payment</div>
                  <div className="text-base font-semibold text-foreground">{formatCurrency(data.monthlyPayment)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Operating Costs</div>
                  <div className="text-base font-semibold text-foreground">{formatCurrency(data.monthlyOperatingCosts)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary">{labels.projection}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 sm:col-span-2">
                <div className="text-[11px] text-muted-foreground">Total Equity Position</div>
                <div className="text-xl font-bold text-primary">{formatCurrency(data.netEquityPosition)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                <div className="text-[11px] text-muted-foreground">Property Value</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(data.futurePropertyValue)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                <div className="text-[11px] text-muted-foreground">Remaining Loan</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(data.remainingBalance)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                <div className="text-[11px] text-muted-foreground">Principal Paid</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(data.totalPrincipalPaid)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                <div className="text-[11px] text-muted-foreground">Cashflow Accumulated</div>
                <div className="text-base font-semibold text-foreground">{formatCurrency(data.cumulativeCashflowAfterTax)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3 sm:col-span-2">
                <div className="text-[11px] text-muted-foreground">Total ROI (10 years)</div>
                <div className="text-lg font-semibold text-primary">{formatPercent(data.roe10Year)}</div>
                <div className="text-xs text-muted-foreground mt-1">IRR: {data.irr !== null ? formatPercent(data.irr) : 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-primary">{labels.comparison}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                <div className="text-[11px] text-muted-foreground">Property (10 years)</div>
                <div className="text-lg font-semibold text-primary">{formatCurrency(data.propertyTotalValue)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                <div className="text-[11px] text-muted-foreground">Alternative (10 years)</div>
                <div className="text-lg font-semibold text-foreground">{formatCurrency(data.alternativeValue)}</div>
              </div>
              <div className="rounded-xl border border-border/60 bg-white px-4 py-3 sm:col-span-2">
                <div className="text-[11px] text-muted-foreground">Difference</div>
                <div className={`text-lg font-semibold ${data.difference >= 0 ? 'text-primary' : 'text-rose-600'}`}>
                  {formatCurrency(Math.abs(data.difference))} {data.difference >= 0 ? (isEnglish ? 'better' : 'besser') : (isEnglish ? 'worse' : 'schlechter')}
                </div>
              </div>
            </div>
            <div className="mt-4 h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.comparisonData}>
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
                  <Line type="monotone" dataKey="property" stroke="#1a4d2e" strokeWidth={3} dot={false} />
                  <Line type="monotone" dataKey="alternative" stroke="#c19a6b" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-accent/40 bg-accent/10 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-accent">{isEnglish ? 'Important Disclaimer' : 'Wichtiger Hinweis'}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isEnglish
                  ? 'This calculator provides estimates only and does not constitute investment or tax advice. Results depend on assumptions, market conditions, and individual circumstances.'
                  : 'Dieser Rechner liefert nur Schätzwerte und stellt keine Anlage- oder Steuerberatung dar. Ergebnisse hängen von Annahmen, Marktbedingungen und individuellen Umständen ab.'}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-secondary/10 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-primary">{isEnglish ? 'Customize This Calculator' : 'Rechner anpassen'}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isEnglish
                  ? 'Set your own booking link for the consultation CTA. Replace the default link in your booking settings to match your preferred provider.'
                  : 'Hinterlegen Sie Ihren eigenen Buchungslink für die Beratung. Ersetzen Sie den Standard-Link durch Ihren bevorzugten Anbieter.'}
              </p>
            </div>
          </div>

          </div>

          <div className="mt-4 border-t border-border/60 bg-white/95 pt-4 backdrop-blur">
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
      </div>
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
      />
    </section>
  )
}

export default PropertyInvestmentCalculator
