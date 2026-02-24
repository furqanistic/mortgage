// File: client/src/components/Calculators/PropertyInvestmentCalculator.jsx
import ConsultationModal from '@/components/Home/ConsultationModal'
import { jsPDF } from 'jspdf'
import { ChevronDown, ChevronRight } from 'lucide-react'
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
  const [inputDrafts, setInputDrafts] = useState({})
  const [openSections, setOpenSections] = useState({
    basics: true,
    purchase: false,
    financing: false,
    operations: false,
    tax: false,
    growth: false,
  })

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

  const formatCurrency = (value) => {
    const formattedNum = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(value)
    return isEnglish ? `€  ${formattedNum}` : `${formattedNum}  €`
  }

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

  const toggleSection = (sectionKey) =>
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }))

  const getFieldValue = (field) => {
    if (Object.prototype.hasOwnProperty.call(inputDrafts, field.key)) return inputDrafts[field.key]
    return String(field.value)
  }

  const handleFieldChange = (field, rawValue) => {
    const min = field.min ?? 0
    const max = field.max ?? Number.POSITIVE_INFINITY
    setInputDrafts((prev) => ({ ...prev, [field.key]: rawValue }))

    if (rawValue === '' || rawValue === '-' || rawValue === '.' || rawValue === '-.') return

    const numericValue = Number(rawValue)
    if (!Number.isFinite(numericValue)) return
    field.setter(clamp(numericValue, min, max))
  }

  const handleFieldBlur = (field, rawValue) => {
    const min = field.min ?? 0
    const max = field.max ?? Number.POSITIVE_INFINITY

    if (rawValue === '' || rawValue === '-' || rawValue === '.' || rawValue === '-.') {
      field.setter(min)
      setInputDrafts((prev) => ({ ...prev, [field.key]: String(min) }))
      return
    }

    const numericValue = Number(rawValue)
    if (!Number.isFinite(numericValue)) {
      setInputDrafts((prev) => ({ ...prev, [field.key]: String(field.value) }))
      return
    }

    const nextValue = clamp(numericValue, min, max)
    field.setter(nextValue)
    setInputDrafts((prev) => ({ ...prev, [field.key]: String(nextValue) }))
  }

  const inputSections = [
    {
      key: 'basics',
      title: isEnglish ? 'Basic Information' : 'Basisdaten',
      description: isEnglish ? 'Core deal assumptions to start valuation.' : 'Kernannahmen fuer die Objektbewertung.',
      fields: [
        { key: 'purchasePrice', label: isEnglish ? 'Purchase Price' : 'Kaufpreis', hint: isEnglish ? 'Total purchase price of the property.' : 'Gesamter Kaufpreis.', value: purchasePrice, setter: setPurchasePrice, prefix: 'EUR', min: 0, step: 1000 },
        { key: 'equity', label: isEnglish ? 'Your Down Payment' : 'Eigenkapital', hint: isEnglish ? 'Your upfront cash contribution.' : 'Ihr eingebrachtes Kapital.', value: equity, setter: setEquity, prefix: 'EUR', min: 0, step: 1000 },
        { key: 'monthlyRent', label: isEnglish ? 'Monthly Rent Income' : 'Monatliche Kaltmiete', hint: isEnglish ? 'Expected gross rent from tenant.' : 'Erwartete monatliche Miete.', value: monthlyRent, setter: setMonthlyRent, prefix: 'EUR', min: 0, step: 50 },
      ],
    },
    {
      key: 'purchase',
      title: isEnglish ? 'Purchase Transaction Costs' : 'Kaufnebenkosten',
      description: isEnglish ? 'One-time costs due at acquisition.' : 'Einmalige Erwerbsnebenkosten.',
      fields: [
        { key: 'transferTax', label: isEnglish ? 'Transfer Tax' : 'Grunderwerbsteuer', hint: isEnglish ? 'Depends on German state.' : 'Abhaengig vom Bundesland.', value: transferTax, setter: setTransferTax, suffix: '%', min: 0, max: 10, step: 0.1 },
        { key: 'notaryCosts', label: isEnglish ? 'Notary & Registry' : 'Notar & Grundbuch', hint: isEnglish ? 'Usually around 1.5% to 2%.' : 'Meist 1,5% bis 2,0%.', value: notaryCosts, setter: setNotaryCosts, suffix: '%', min: 0, max: 5, step: 0.1 },
        { key: 'agentFees', label: isEnglish ? 'Agent Commission' : 'Maklerprovision', hint: isEnglish ? 'Broker fee as % of price.' : 'Maklergebuehr in Prozent.', value: agentFees, setter: setAgentFees, suffix: '%', min: 0, max: 10, step: 0.01 },
      ],
    },
    {
      key: 'financing',
      title: isEnglish ? 'Mortgage Terms' : 'Finanzierung',
      description: isEnglish ? 'Debt cost and repayment profile.' : 'Kreditkosten und Tilgungsprofil.',
      fields: [
        { key: 'interestRate', label: isEnglish ? 'Interest Rate' : 'Sollzins', hint: isEnglish ? 'Annual mortgage interest rate.' : 'Jaehrlicher Darlehenszins.', value: interestRate, setter: setInterestRate, suffix: '%', min: 0, max: 15, step: 0.1 },
        { key: 'repaymentRate', label: isEnglish ? 'Repayment Rate' : 'Tilgung', hint: isEnglish ? 'Higher rate reduces loan faster.' : 'Hoehere Tilgung baut schneller Schulden ab.', value: repaymentRate, setter: setRepaymentRate, suffix: '%', min: 0.5, max: 10, step: 0.1 },
      ],
    },
    {
      key: 'operations',
      title: isEnglish ? 'Monthly Operating Costs' : 'Monatliche Betriebskosten',
      description: isEnglish ? 'Owner costs not covered by tenant billing.' : 'Kosten, die nicht voll umlegbar sind.',
      fields: [
        { key: 'nonTransferableCosts', label: isEnglish ? 'Non-Transferable Costs' : 'Nicht umlegbare Kosten', hint: isEnglish ? 'Management, insurance, owner-side expenses.' : 'Verwaltung, Versicherungen, Eigentuemerkosten.', value: nonTransferableCosts, setter: setNonTransferableCosts, prefix: 'EUR', min: 0, step: 10 },
        { key: 'maintenanceCosts', label: isEnglish ? 'Maintenance Reserve' : 'Instandhaltungsruecklage', hint: isEnglish ? 'Monthly maintenance reserve provision.' : 'Monatliche Ruecklage fuer Reparaturen.', value: maintenanceCosts, setter: setMaintenanceCosts, prefix: 'EUR', min: 0, step: 10 },
      ],
    },
    {
      key: 'tax',
      title: isEnglish ? 'Tax Structure' : 'Steuerstruktur',
      description: isEnglish ? 'Tax assumptions affecting after-tax returns.' : 'Steuerannahmen fuer Nettorendite.',
      fields: [
        { key: 'taxRate', label: isEnglish ? 'Your Tax Rate' : 'Persoenlicher Steuersatz', hint: isEnglish ? 'Marginal income tax rate.' : 'Persoenlicher Grenzsteuersatz.', value: taxRate, setter: setTaxRate, suffix: '%', min: 0, max: 50, step: 1 },
        { key: 'depreciationRate', label: isEnglish ? 'Depreciation (AfA)' : 'Abschreibung (AfA)', hint: isEnglish ? 'Annual depreciation rate for building part.' : 'Jaehrliche Abschreibung auf Gebaeudeanteil.', value: depreciationRate, setter: setDepreciationRate, suffix: '%', min: 0, max: 5, step: 0.1 },
        { key: 'buildingRatio', label: isEnglish ? 'Building Ratio' : 'Gebaeudeanteil', hint: isEnglish ? 'Share of purchase considered depreciable building.' : 'Anteil des Gebaeudes am Kaufpreis.', value: buildingRatio, setter: setBuildingRatio, suffix: '%', min: 50, max: 95, step: 1 },
      ],
    },
    {
      key: 'growth',
      title: isEnglish ? 'Growth & Exit Assumptions' : 'Wachstum & Exit-Annahmen',
      description: isEnglish ? 'Long-term return drivers and benchmark.' : 'Langfristige Treiber fuer Renditevergleich.',
      fields: [
        { key: 'propertyGrowth', label: isEnglish ? 'Property Growth' : 'Wertsteigerung Immobilie', hint: isEnglish ? 'Annual property value growth.' : 'Jaehrliche Wertentwicklung.', value: propertyGrowth, setter: setPropertyGrowth, suffix: '%', min: -5, max: 15, step: 0.1 },
        { key: 'rentIncrease', label: isEnglish ? 'Rent Increase' : 'Mietsteigerung', hint: isEnglish ? 'Annual increase in rental income.' : 'Jaehrliches Mietwachstum.', value: rentIncrease, setter: setRentIncrease, suffix: '%', min: 0, max: 10, step: 0.1 },
        { key: 'costInflation', label: isEnglish ? 'Cost Inflation' : 'Kosteninflation', hint: isEnglish ? 'Annual growth of operating costs.' : 'Jaehrliche Erhoehung der Kosten.', value: costInflation, setter: setCostInflation, suffix: '%', min: 0, max: 10, step: 0.1 },
        { key: 'sellingCosts', label: isEnglish ? 'Selling Costs' : 'Verkaufskosten', hint: isEnglish ? 'Exit transaction costs as % of sale.' : 'Verkaufsnebenkosten in Prozent.', value: sellingCosts, setter: setSellingCosts, suffix: '%', min: 0, max: 10, step: 0.1 },
        { key: 'alternativeReturn', label: isEnglish ? 'Alternative Return' : 'Alternative Rendite', hint: isEnglish ? 'Benchmark return for equity alternative.' : 'Vergleichsrendite fuer Alternativanlage.', value: alternativeReturn, setter: setAlternativeReturn, suffix: '%', min: 0, max: 20, step: 0.1 },
      ],
    },
  ]

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
      doc.text(isEnglish ? 'Property Investment Analysis' : 'Immobilien-Investment Analyse', pw - mr, 15, { align: 'right' })
      
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

    // 1. Recommendation / Signal Box
    guard(30)
    const recColor = data.monthlyCashflowAfterTax >= 0 ? [26, 77, 46] : [146, 100, 4]
    doc.setFillColor(...recColor)
    doc.roundedRect(ml, y, cw, 16, 1.5, 1.5, 'F')
    
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10.5)
    doc.setTextColor(255, 255, 255)
    doc.text(isEnglish ? 'ROI SIGNAL' : 'ROI-SIGNAL', ml + 5, y + 6.5)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(230, 245, 230)
    const recText = roiTone === 'positive'
      ? (isEnglish ? 'After-tax cashflow is positive. This setup is income-supporting.' : 'Cashflow nach Steuern ist positiv. Dieses Setup ist einkommensstützend.')
      : (isEnglish ? 'Cashflow is near neutral or negative. Long-term upside depends on growth.' : 'Cashflow ist neutral oder negativ. Langfristige Rendite hängt von Wertzuwachs ab.')
    const recLines = doc.splitTextToSize(recText, cw - 10)
    doc.text(recLines, ml + 5, y + 11)
    y += 24

    // 2. Key Results Dashboard
    guard(30)
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(ml, y, cw, 22, 1.5, 1.5, 'F')
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2); doc.roundedRect(ml, y, cw, 22, 1.5, 1.5, 'D')

    const boxW = cw / 4
    const drawBox = (label, val, x, color = [26, 26, 26]) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(100, 116, 139)
      doc.text(label, x + 5, y + 7)
      doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(...color)
      doc.text(val, x + 5, y + 16)
    }

    drawBox(isEnglish ? 'MON. CASHFLOW' : 'CASHFLOW (mtl.)', formatCurrency(data.monthlyCashflowAfterTax), ml, data.monthlyCashflowAfterTax >= 0 ? [26, 77, 46] : [185, 28, 28])
    drawBox(isEnglish ? 'NET YIELD' : 'NETTORENDITE', formatPercent(data.netYield), ml + boxW)
    drawBox(isEnglish ? 'TOTAL ROI (10Y)' : 'RENDITE (10J)', formatPercent(data.roe10Year), ml + boxW * 2)
    drawBox('IRR', data.irr !== null ? formatPercent(data.irr) : 'N/A', ml + boxW * 3)
    y += 30

    // 3. Two Column Details (Inputs vs Results)
    guard(65)
    const colW = (cw - 10) / 2
    let ly = y; let ry = y
    
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'KEY INPUTS' : 'WICHTIGE EINGABEN', ml, ly)
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
    ly = dataRow(isEnglish ? 'Equity' : 'Eigenkapital', formatCurrency(equity), ly)
    ly = dataRow(isEnglish ? 'Monthly Rent' : 'Monatsmiete', formatCurrency(monthlyRent), ly)
    ly = dataRow(isEnglish ? 'Interest Rate' : 'Zinssatz', `${interestRate.toFixed(2)}%`, ly)
    ly = dataRow(isEnglish ? 'Repayment' : 'Tilgung', `${repaymentRate.toFixed(2)}%`, ly)
    ly = dataRow(isEnglish ? 'Tax Rate' : 'Steuersatz', `${taxRate}%`, ly)
    ly = dataRow(isEnglish ? 'Appreciation' : 'Wertsteigerung', `${propertyGrowth.toFixed(1)}%`, ly)
    ly = dataRow(isEnglish ? 'Depreciation (Afa)' : 'Abschreibung', `${depreciationRate.toFixed(1)}%`, ly)

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? '10-YEAR PROJECTION' : '10-JAHRES PROGNOSE', ml + colW + 10, ry)
    doc.setDrawColor(193, 154, 107); doc.setLineWidth(0.4); doc.line(ml + colW + 10, ry + 2, ml + cw, ry + 2)
    ry += 8

    const resultRow = (label, value, targetY) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(107, 114, 128)
      doc.text(label, ml + colW + 10, targetY)
      doc.setFont('helvetica', 'bold'); doc.setTextColor(26, 26, 26)
      doc.text(value, ml + cw, targetY, { align: 'right' })
      return targetY + 5.5
    }

    ry = resultRow(isEnglish ? 'Future Value' : 'Zukünftiger Wert', formatCurrency(data.futurePropertyValue), ry)
    ry = resultRow(isEnglish ? 'Remaining Debt' : 'Restschuld', formatCurrency(data.remainingBalance), ry)
    ry = resultRow(isEnglish ? 'Cum. Cashflow' : 'Gesamt-Cashflow', formatCurrency(data.cumulativeCashflowAfterTax), ry)
    ry = resultRow(isEnglish ? 'Annual Tax Savings' : 'Steuerersparnis p.a.', formatCurrency(data.annualTaxSavings), ry)
    
    ry += 2
    doc.setFillColor(232, 245, 233)
    doc.roundedRect(ml + colW + 10, ry, colW, 9, 1.2, 1.2, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'TOTAL EQUITY POSITION' : 'NETTO-VERMÖGEN (10J)', ml + colW + 10 + colW / 2, ry + 5.8, { align: 'center' })
    doc.setTextColor(26, 26, 26)
    doc.text(formatCurrency(data.netEquityPosition), ml + cw, ry + 5.8, { align: 'right' })
    ry += 15
    
    y = Math.max(ly, ry + 12)

    // 4. Comparison
    guard(40)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'INVESTMENT COMPARISON' : 'INVESTMENTVERGLEICH', ml, y)
    doc.setDrawColor(193, 154, 107); doc.setLineWidth(0.4); doc.line(ml, y + 2, ml + cw, y + 2)
    y += 10

    const compRow = (label, propertyVal, altVal, targetY) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(107, 114, 128)
      doc.text(label, ml, targetY)
      doc.setFont('helvetica', 'bold'); doc.setTextColor(26, 77, 46)
      doc.text(propertyVal, ml + (cw * 0.6), targetY, { align: 'right' })
      doc.setTextColor(193, 154, 107)
      doc.text(altVal, ml + cw, targetY, { align: 'right' })
      doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.1); doc.line(ml, targetY + 1.2, ml + cw, targetY + 1.2)
      return targetY + 5.5
    }

    doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(156, 163, 175)
    doc.text(isEnglish ? 'METRIC' : 'KENNZAHL', ml, y - 4)
    doc.text(isEnglish ? 'PROPERTY' : 'IMMOBILIE', ml + (cw * 0.6), y - 4, { align: 'right' })
    doc.text(isEnglish ? 'ALTERNATIVE' : 'ALTERNATIVE', ml + cw, y - 4, { align: 'right' })

    y = compRow(isEnglish ? 'Total Value (10Y)' : 'Gesamtwert (10J)', formatCurrency(data.propertyTotalValue), formatCurrency(data.alternativeValue), y)
    y = compRow(isEnglish ? 'Yield / Return' : 'Rendite', formatPercent(data.netYield), formatPercent(alternativeReturn), y)
    
    const pos = data.difference >= 0
    doc.setFillColor(pos ? 232 : 254, pos ? 245 : 226, pos ? 233 : 226)
    doc.roundedRect(ml, y, cw, 7.5, 1, 1, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5)
    doc.setTextColor(pos ? 26 : 185, pos ? 77 : 28, pos ? 46 : 28)
    doc.text(pos
      ? (isEnglish ? `Property leads by ${formatCurrency(data.difference)}` : `Immobilie vorne um ${formatCurrency(data.difference)}`)
      : (isEnglish ? `Alternative leads by ${formatCurrency(Math.abs(data.difference))}` : `Alternative vorne um ${formatCurrency(Math.abs(data.difference))}`),
    ml + 4, y + 5)
    y += 15

    // 5. Disclaimer
    guard(20)
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2); doc.line(ml, y, ml + cw, y)
    y += 4
    doc.setFont('helvetica', 'italic'); doc.setFontSize(6.5); doc.setTextColor(107, 114, 128)
    const discLines = doc.splitTextToSize(isEnglish
      ? 'Note: This report is a simulation based on your assumptions. Past performance does not guarantee future results. No financial or tax advice.'
      : 'Hinweis: Simulation auf Basis Ihrer Annahmen. Keine Gewähr für künftige Ergebnisse. Keine Finanz- oder Steuerberatung.', cw)
    doc.text(discLines, ml, y)

    drawFooter()
    doc.save(`BaufiKing-Investment-${fileDate}.pdf`)
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
            {isEnglish ? 'Investment Property Analysis' : 'Analyse Ihrer Kapitalanlage'}
          </h2>
          <p className="text-sm sm:text-base text-white/80 mt-3">
            {labels.subtitle}
          </p>
        </div>

        <div className="bg-white text-slate-900 rounded-[24px] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div className="-mx-6 sm:-mx-10 -mt-6 sm:-mt-10 px-6 sm:px-10 py-5 bg-white/95 border-b border-border/60">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:items-center">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{isEnglish ? 'Monthly Net Cashflow' : 'Monatlicher Netto-Cashflow'}</div>
                <div className={`text-3xl sm:text-4xl font-extrabold ${data.monthlyCashflowAfterTax >= 0 ? 'text-primary' : 'text-rose-600'}`}>
                  {formatCurrency(data.monthlyCashflowAfterTax)}
                </div>
                <div className="text-xs text-slate-500">
                  {isEnglish ? 'Total Equity Position (10y):' : 'Netto-Vermögensposition (10J):'} {formatCurrency(data.netEquityPosition)}
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-center">
                  <div className="text-[11px] text-slate-400">Net Yield</div>
                  <div className="text-base font-extrabold text-slate-900">{formatPercent(data.netYield)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-center">
                  <div className="text-[11px] text-slate-400">Total ROI (10y)</div>
                  <div className="text-base font-extrabold text-slate-900">{formatPercent(data.roe10Year)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-center">
                  <div className="text-[11px] text-slate-400">IRR</div>
                  <div className="text-base font-extrabold text-slate-900">{data.irr !== null ? formatPercent(data.irr) : 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 -mx-6 sm:-mx-10 px-6 sm:px-10 lg:grid lg:grid-cols-[400px_1fr] lg:gap-10">
            <div className="space-y-4 pb-6 lg:pb-0">
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-5">
                <h3 className="font-heading text-lg text-primary font-bold">{labels.inputs}</h3>
                <p className="mt-2 text-sm text-slate-600">
                  {isEnglish
                    ? 'All assumptions are grouped into expandable sections with context hints, similar to your ROI reference layout.'
                    : 'Alle Annahmen sind in aufklappbare Bereiche mit Erklaerungen gruppiert, analog zum ROI-Referenzlayout.'}
                </p>
              </div>

              {inputSections.map((section) => (
                <div key={section.key} className="rounded-2xl border border-border/60 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{section.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{section.description}</div>
                    </div>
                    <span className="text-slate-500">
                      {openSections[section.key] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                  </button>

                  {openSections[section.key] && (
                    <div className="border-t border-border/60 p-4 space-y-4">
                      {section.fields.map((field) => (
                        <div key={field.key}>
                          <label className="text-sm font-semibold text-slate-700">{field.label}</label>
                          <div className="text-[11px] text-slate-500 mb-1">{field.hint}</div>
                          <div className="relative">
                            {field.prefix && (
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                {field.prefix}
                              </span>
                            )}
                            {field.suffix && (
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                {field.suffix}
                              </span>
                            )}
                            <input
                              type="number"
                              min={field.min}
                              max={field.max}
                              step={field.step ?? 0.1}
                              value={getFieldValue(field)}
                              onChange={(e) => handleFieldChange(field, e.target.value)}
                              onBlur={(e) => handleFieldBlur(field, e.target.value)}
                              className={`w-full rounded-xl border-2 border-slate-200 bg-white py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary ${
                                field.prefix ? 'pl-12 pr-3' : field.suffix ? 'pl-3 pr-12' : 'px-3'
                              }`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-2 grid gap-3">
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
                  {isEnglish ? 'Download Full PDF Report' : 'Vollständigen PDF-Report laden'}
                </button>
              </div>
            </div>

            <div className="space-y-6 pb-10">
              <div className={`rounded-2xl border p-5 ${
                roiTone === 'positive'
                  ? 'bg-emerald-50 border-emerald-200'
                  : roiTone === 'neutral'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-rose-50 border-rose-200'
              }`}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  {isEnglish ? 'ROI Signal' : 'ROI-Signal'}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {roiTone === 'positive'
                    ? (isEnglish ? 'After-tax cashflow is positive. This setup is currently income-supporting.' : 'Der Cashflow nach Steuern ist positiv. Dieses Setup ist derzeit einkommensstuetzend.')
                    : roiTone === 'neutral'
                      ? (isEnglish ? 'Cashflow is near neutral. Value creation relies mostly on loan paydown and appreciation.' : 'Der Cashflow ist nahezu neutral. Wertaufbau kommt vor allem durch Tilgung und Wertsteigerung.')
                      : (isEnglish ? 'Cashflow is negative. Long-term upside depends strongly on growth and tax effects.' : 'Der Cashflow ist negativ. Langfristiges Potenzial haengt stark von Wachstum und Steuerwirkung ab.')}
                </p>
              </div>

              <div className="rounded-2xl border border-sky-200 bg-sky-50 p-5">
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">{isEnglish ? 'How this model works:' : 'So funktioniert das Modell:'}</span>{' '}
                  {isEnglish
                    ? 'It combines cashflow after tax, principal paydown, projected property value, and selling costs to compare your 10-year property result against an alternative investment return.'
                    : 'Es kombiniert Cashflow nach Steuern, Tilgung, erwarteten Immobilienwert und Verkaufskosten, um Ihr 10-Jahres-Ergebnis mit einer alternativen Anlage zu vergleichen.'}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-heading text-lg text-primary font-bold mb-4">{labels.taxBenefits}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">{isEnglish ? 'Annual Tax Savings' : 'Steuerersparnis p.a.'}</span>
                      <span className="text-base font-bold text-emerald-600">{formatCurrency(data.annualTaxSavings)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">{isEnglish ? 'Rental Income' : 'Mieteinnahmen'}</span>
                      <span className="text-sm font-bold">{formatCurrency(data.annualRentIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">{isEnglish ? 'Deductible Expenses' : 'Abzusetzende Kosten'}</span>
                      <span className="text-sm font-bold">{formatCurrency(data.deductibleExpenses)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-heading text-lg text-primary font-bold mb-4">{labels.breakdown}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">{isEnglish ? 'Total Investment' : 'Gesamtinvestition'}</span>
                      <span className="text-sm font-bold">{formatCurrency(data.totalInvestment)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">{isEnglish ? 'Loan Amount' : 'Darlehensbetrag'}</span>
                      <span className="text-sm font-bold">{formatCurrency(data.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-500">{isEnglish ? 'Monthly Payment' : 'Monatliche Rate'}</span>
                      <span className="text-sm font-bold">{formatCurrency(data.monthlyPayment)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6">
                <h3 className="font-heading text-lg text-primary font-bold mb-4">{labels.projection}</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl border border-primary/15 bg-white p-4 sm:col-span-2 lg:col-span-4 text-center">
                    <div className="text-xs uppercase tracking-[0.12em] text-slate-500">{isEnglish ? '10Y Equity Position' : 'Netto-Vermoegensposition nach 10J'}</div>
                    <div className="text-3xl font-black text-primary mt-1">{formatCurrency(data.netEquityPosition)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{isEnglish ? 'Equity Growth' : 'Vermögensplus'}</div>
                    <div className="text-lg font-bold text-primary">{formatCurrency(data.netEquityPosition)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{isEnglish ? 'Property Value' : 'Immobilienwert'}</div>
                    <div className="text-lg font-bold text-slate-800">{formatCurrency(data.futurePropertyValue)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{isEnglish ? 'Remaining Loan' : 'Restschuld'}</div>
                    <div className="text-lg font-bold text-slate-800">{formatCurrency(data.remainingBalance)}</div>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{isEnglish ? 'Cash Accumulation' : 'Cash-Bestand'}</div>
                    <div className="text-lg font-bold text-slate-800">{formatCurrency(data.cumulativeCashflowAfterTax)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-lg text-primary font-bold">{labels.comparison}</h3>
                  <div className={`px-4 py-1 rounded-full text-xs font-bold ${data.difference >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {data.difference >= 0 
                      ? (isEnglish ? `Property leads by ${formatCurrency(data.difference)}` : `Immobilie führt mit ${formatCurrency(data.difference)}`)
                      : (isEnglish ? `Alternative leads by ${formatCurrency(Math.abs(data.difference))}` : `Alternative führt mit ${formatCurrency(Math.abs(data.difference))}`)
                    }
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `€${Math.round(v / 1000)}k`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} formatter={(v) => [formatCurrency(v), '']} />
                      <Line type="monotone" dataKey="property" stroke="#1a4d2e" strokeWidth={3} dot={{ r: 4, fill: '#1a4d2e', strokeWidth: 0 }} activeDot={{ r: 6 }} name={isEnglish ? 'Property' : 'Immobilie'} />
                      <Line type="monotone" dataKey="alternative" stroke="#c19a6b" strokeWidth={3} dot={{ r: 4, fill: '#c19a6b', strokeWidth: 0 }} activeDot={{ r: 6 }} name={isEnglish ? 'Alternative' : 'Alternative'} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-4">
                <h4 className="font-bold text-amber-800">{isEnglish ? 'Important Notes' : 'Wichtige Hinweise'}</h4>
                <ul className="mt-2 text-sm text-amber-800/90 list-disc list-inside space-y-1">
                  <li>{isEnglish ? 'All results are scenario estimates based on your assumptions.' : 'Alle Ergebnisse sind Szenario-Schaetzungen auf Basis Ihrer Annahmen.'}</li>
                  <li>{isEnglish ? 'Tax outcomes depend on your personal setup and legal structure.' : 'Steuereffekte haengen von Ihrer persoenlichen Situation und Struktur ab.'}</li>
                  <li>{isEnglish ? 'This is not financial, investment, or tax advice.' : 'Dies ist keine Finanz-, Steuer- oder Anlageberatung.'}</li>
                </ul>
              </div>
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
