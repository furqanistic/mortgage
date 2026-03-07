// File: client/src/components/Calculators/RentVsBuyCalculator.jsx
import ConsultationModal from '@/components/Home/ConsultationModal'
import { jsPDF } from 'jspdf'
import { ChevronDown, ChevronRight } from 'lucide-react'
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

const RentVsBuyCalculator = ({ language = 'de' }) => {
  const isEnglish = language === 'en'
  const locale = isEnglish ? 'en-US' : 'de-DE'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('nominal')
  const [inputDrafts, setInputDrafts] = useState({})
  const [openSections, setOpenSections] = useState({
    property: true,
    financing: false,
    ownership: false,
    renting: false,
    economics: false,
  })

  const [salePrice, setSalePrice] = useState(400000)
  const [transferTax, setTransferTax] = useState(6.0)
  const [notaryCharges, setNotaryCharges] = useState(2.0)
  const [agentFees, setAgentFees] = useState(3.57)
  const [equity, setEquity] = useState(100000)
  const [interestRate, setInterestRate] = useState(3.5)
  const [repaymentRate, setRepaymentRate] = useState(2.0)
  const [holdingPeriod, setHoldingPeriod] = useState(10)
  const [maintenance, setMaintenance] = useState(1.0)
  const [hausgeld, setHausgeld] = useState(250)
  const [sellingCosts, setSellingCosts] = useState(3.5)
  const [monthlyRent, setMonthlyRent] = useState(1500)
  const [rentIncrease, setRentIncrease] = useState(2.5)
  const [inflation, setInflation] = useState(2.0)
  const [appreciation, setAppreciation] = useState(3.0)
  const [investmentReturn, setInvestmentReturn] = useState(7.0)

  const labels = {
    title: isEnglish ? 'Rent vs Buy Decision Engine' : 'Mieten vs. Kaufen',
    subtitle: isEnglish
      ? 'Advanced financial comparison for Germany based on your assumptions.'
      : 'Fundierter Vergleich für Deutschland – basierend auf Ihren Annahmen.',
    inputs: isEnglish ? 'Inputs' : 'Eingaben',
    results: isEnglish ? 'Results' : 'Ergebnisse',
    viewMode: isEnglish ? 'View Mode' : 'Ansicht',
    nominal: isEnglish ? 'Nominal Values' : 'Nominalwerte',
    real: isEnglish ? 'Real Values' : 'Inflationsbereinigt',
    recommendation: isEnglish ? 'Financial Recommendation' : 'Finanzielle Empfehlung',
    monthlyComparison: isEnglish ? 'Monthly Cost Comparison' : 'Monatlicher Vergleich',
    wealthComparison: isEnglish
      ? 'Net Wealth at Exit'
      : 'Vermögen bei Verkauf',
    breakEven: isEnglish ? 'Break-Even Analysis' : 'Break-even-Analyse',
    chartTitle: isEnglish ? 'Wealth Over Time' : 'Vermögensentwicklung',
    cta: isEnglish ? 'Schedule a Free Consultation' : 'Kostenlose Beratung vereinbaren',
  }

  const formatCurrency = (value) => {
    const formattedNum = new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
    }).format(value)
    return isEnglish ? `€  ${formattedNum}` : `${formattedNum}  €`
  }

  const formatSignedCurrency = (value) => {
    const abs = Math.abs(value)
    const formatted = formatCurrency(abs)
    return value < 0 ? `-${formatted}` : formatted
  }

  const data = useMemo(() => {
    const transferTaxAmount = salePrice * (transferTax / 100)
    const notaryAmount = salePrice * (notaryCharges / 100)
    const agentFeesAmount = salePrice * (agentFees / 100)
    const totalAcquisition = salePrice + transferTaxAmount + notaryAmount + agentFeesAmount
    const acquisitionCosts = totalAcquisition - salePrice
    const loanAmount = Math.max(0, totalAcquisition - equity)

    const interestRateDec = interestRate / 100
    const repaymentRateDec = repaymentRate / 100
    const appreciationDec = appreciation / 100
    const sellingCostsDec = sellingCosts / 100
    const maintenanceDec = maintenance / 100
    const rentIncreaseDec = rentIncrease / 100
    const inflationDec = inflation / 100
    const investmentReturnDec = investmentReturn / 100

    const monthlyInterestRate = interestRateDec / 12
    const annualRate = interestRateDec + repaymentRateDec
    const monthlyEmiRate = annualRate / 12
    const emi = loanAmount * monthlyEmiRate

    let totalMonths = 0
    if (interestRateDec > 0 && repaymentRateDec > 0 && emi > 0) {
      totalMonths = Math.ceil(
        -Math.log(1 - (interestRateDec * loanAmount) / emi) /
          Math.log(1 + monthlyInterestRate)
      )
    } else if (emi > 0) {
      totalMonths = Math.ceil(loanAmount / emi)
    }
    if (!Number.isFinite(totalMonths) || totalMonths <= 0) totalMonths = 600

    let remainingBalance = loanAmount
    let totalInterestPaid = 0
    let totalPrincipalPaid = 0
    const monthsHeld = Math.min(holdingPeriod * 12, totalMonths)

    for (let month = 1; month <= monthsHeld; month += 1) {
      const interestPayment = remainingBalance * monthlyInterestRate
      const principalPayment = emi - interestPayment
      totalInterestPaid += interestPayment
      totalPrincipalPaid += principalPayment
      remainingBalance -= principalPayment
      if (remainingBalance < 0) remainingBalance = 0
    }

    let totalMaintenance = 0
    for (let year = 1; year <= holdingPeriod; year += 1) {
      totalMaintenance += salePrice * maintenanceDec * Math.pow(1 + inflationDec, year - 1)
    }

    let totalHausgeld = 0
    let currentHausgeld = hausgeld
    for (let year = 1; year <= holdingPeriod; year += 1) {
      totalHausgeld += currentHausgeld * 12
      currentHausgeld *= 1 + inflationDec
    }

    const futurePropertyValue = salePrice * Math.pow(1 + appreciationDec, holdingPeriod)
    const sellingCostsAmount = futurePropertyValue * sellingCostsDec

    const buyingWealth =
      futurePropertyValue - remainingBalance - sellingCostsAmount - totalMaintenance - totalHausgeld

    const buyingTotalHousingCost =
      totalInterestPaid + acquisitionCosts + totalMaintenance + totalHausgeld + sellingCostsAmount

    let totalRentPaid = 0
    let currentRent = monthlyRent
    for (let year = 1; year <= holdingPeriod; year += 1) {
      totalRentPaid += currentRent * 12
      currentRent *= 1 + rentIncreaseDec
    }

    const futureInvestmentValue = equity * Math.pow(1 + investmentReturnDec, holdingPeriod)

    let investedMonthlySavings = 0
    let extraRentCost = 0
    let rentLoop = monthlyRent

    for (let year = 1; year <= holdingPeriod; year += 1) {
      const yearMaint = (salePrice * maintenanceDec * Math.pow(1 + inflationDec, year - 1)) / 12
      const yearHaus = hausgeld * Math.pow(1 + inflationDec, year - 1)
      const monthlyBuying = emi + yearHaus + yearMaint

      for (let month = 1; month <= 12; month += 1) {
        const diff = monthlyBuying - rentLoop
        const monthlyReturn = investmentReturnDec / 12
        const monthsRemaining = (holdingPeriod - year) * 12 + (12 - month)

        if (diff > 0) {
          investedMonthlySavings += diff * Math.pow(1 + monthlyReturn, monthsRemaining)
        } else {
          extraRentCost += Math.abs(diff) * Math.pow(1 + monthlyReturn, monthsRemaining)
        }
      }
      rentLoop *= 1 + rentIncreaseDec
    }

    const rentingTotalHousingCost = totalRentPaid + extraRentCost
    const rentingWealth =
      futureInvestmentValue + investedMonthlySavings - totalRentPaid - extraRentCost

    const wealthDifference = buyingWealth - rentingWealth

    const inflationFactor = Math.pow(1 + inflationDec, holdingPeriod)
    const realBuyingWealth = buyingWealth / inflationFactor
    const realRentingWealth = rentingWealth / inflationFactor
    const realWealthDifference = wealthDifference / inflationFactor

    const computeWealthAtYear = (year) => {
      if (year === 0) {
        return { buyWealth: 0, rentWealth: equity }
      }

      let tempLoan = loanAmount
      const tempMonths = Math.min(year * 12, totalMonths)
      for (let m = 0; m < tempMonths; m += 1) {
        const interest = tempLoan * monthlyInterestRate
        const principal = emi - interest
        tempLoan -= principal
        if (tempLoan < 0) tempLoan = 0
      }

      const tempPropertyValue = salePrice * Math.pow(1 + appreciationDec, year)
      let tempMaintenance = 0
      for (let y = 1; y <= year; y += 1) {
        tempMaintenance += salePrice * maintenanceDec * Math.pow(1 + inflationDec, y - 1)
      }

      let tempHausgeld = 0
      let tempHG = hausgeld
      for (let y = 1; y <= year; y += 1) {
        tempHausgeld += tempHG * 12
        tempHG *= 1 + inflationDec
      }

      const tempSellingCosts = tempPropertyValue * sellingCostsDec
      const tempBuyingWealth = tempPropertyValue - tempLoan - tempSellingCosts - tempMaintenance - tempHausgeld

      const tempEquityGrown = equity * Math.pow(1 + investmentReturnDec, year)
      let tempMonthlySavings = 0
      let tempExtraRentCost = 0
      let tempRentPaid = 0
      let tempRentLoop = monthlyRent

      for (let y = 1; y <= year; y += 1) {
        const yMaint = (salePrice * maintenanceDec * Math.pow(1 + inflationDec, y - 1)) / 12
        const yHaus = hausgeld * Math.pow(1 + inflationDec, y - 1)
        const yBuying = emi + yHaus + yMaint
        const mReturn = investmentReturnDec / 12

        for (let m = 1; m <= 12; m += 1) {
          const diff = yBuying - tempRentLoop
          const monthsLeft = (year - y) * 12 + (12 - m)
          if (diff > 0) {
            tempMonthlySavings += diff * Math.pow(1 + mReturn, monthsLeft)
          } else {
            tempExtraRentCost += Math.abs(diff) * Math.pow(1 + mReturn, monthsLeft)
          }
        }
        tempRentPaid += tempRentLoop * 12
        tempRentLoop *= 1 + rentIncreaseDec
      }

      const tempRentingWealth =
        tempEquityGrown + tempMonthlySavings - tempRentPaid - tempExtraRentCost

      return { buyWealth: tempBuyingWealth, rentWealth: tempRentingWealth }
    }

    let breakEvenYear = null
    for (let year = 1; year <= 40; year += 1) {
      const { buyWealth, rentWealth } = computeWealthAtYear(year)
      if (buyWealth > rentWealth) {
        breakEvenYear = year
        break
      }
    }

    const chartData = Array.from({ length: holdingPeriod + 1 }, (_, idx) => {
      const { buyWealth, rentWealth } = computeWealthAtYear(idx)
      const inflationAdjust = Math.pow(1 + inflationDec, idx)
      const buyValue = viewMode === 'real' ? buyWealth / inflationAdjust : buyWealth
      const rentValue = viewMode === 'real' ? rentWealth / inflationAdjust : rentWealth
      return {
        year: idx,
        buying: buyValue,
        renting: rentValue,
      }
    })

    const initialMonthlyMaintenance = (salePrice * maintenanceDec) / 12
    const initialMonthlyBuying = emi + hausgeld + initialMonthlyMaintenance

    return {
      totalAcquisition,
      acquisitionCosts,
      loanAmount,
      emi,
      totalInterestPaid,
      totalPrincipalPaid,
      totalMaintenance,
      totalHausgeld,
      futurePropertyValue,
      sellingCostsAmount,
      buyingWealth,
      buyingTotalHousingCost,
      totalRentPaid,
      rentingWealth,
      rentingTotalHousingCost,
      extraRentCost,
      wealthDifference,
      realBuyingWealth,
      realRentingWealth,
      realWealthDifference,
      holdingPeriod,
      initialMonthlyBuying,
      initialMonthlyMaintenance,
      chartData,
      breakEvenYear,
      futureInvestmentValue,
      investedMonthlySavings,
      remainingBalance,
      principalPaid: loanAmount - remainingBalance,
      inflation,
      appreciation,
      equity,
      monthlyRent,
    }
  }, [
    agentFees,
    appreciation,
    equity,
    hausgeld,
    holdingPeriod,
    inflation,
    interestRate,
    investmentReturn,
    maintenance,
    monthlyRent,
    notaryCharges,
    repaymentRate,
    rentIncrease,
    salePrice,
    sellingCosts,
    transferTax,
    viewMode,
  ])

  const wealthDifferenceDisplay =
    viewMode === 'real' ? data.realWealthDifference : data.wealthDifference
  const buyingWealthDisplay = viewMode === 'real' ? data.realBuyingWealth : data.buyingWealth
  const rentingWealthDisplay = viewMode === 'real' ? data.realRentingWealth : data.rentingWealth

  const recommendation = useMemo(() => {
    if (wealthDifferenceDisplay > 50000) {
      return {
        tone: 'buy',
        title: isEnglish ? 'Strongly Favor Buying' : 'Kaufen klar bevorzugt',
        body: isEnglish
          ? `Buying could build ${formatCurrency(wealthDifferenceDisplay)} more wealth over ${data.holdingPeriod} years.`
          : `Kaufen könnte über ${data.holdingPeriod} Jahre ${formatCurrency(
              wealthDifferenceDisplay
            )} mehr Vermögen aufbauen.`,
      }
    }
    if (wealthDifferenceDisplay > 10000) {
      return {
        tone: 'buy',
        title: isEnglish ? 'Moderately Favor Buying' : 'Kaufen leicht bevorzugt',
        body: isEnglish
          ? `Buying looks favorable by about ${formatCurrency(wealthDifferenceDisplay)}.`
          : `Kaufen wirkt mit etwa ${formatCurrency(wealthDifferenceDisplay)} Vorteil.`,
      }
    }
    if (wealthDifferenceDisplay > -10000) {
      return {
        tone: 'neutral',
        title: isEnglish ? 'Neutral' : 'Neutral',
        body: isEnglish
          ? 'The difference is small. Lifestyle and flexibility matter most.'
          : 'Der Unterschied ist gering – Lebensstil und Flexibilität zählen.',
      }
    }
    if (wealthDifferenceDisplay > -50000) {
      return {
        tone: 'rent',
        title: isEnglish ? 'Moderately Favor Renting' : 'Mieten leicht bevorzugt',
        body: isEnglish
          ? `Renting could save about ${formatCurrency(Math.abs(wealthDifferenceDisplay))}.`
          : `Mieten könnte etwa ${formatCurrency(Math.abs(wealthDifferenceDisplay))} sparen.`,
      }
    }
    return {
      tone: 'rent',
      title: isEnglish ? 'Strongly Favor Renting' : 'Mieten klar bevorzugt',
      body: isEnglish
        ? `Renting may save ${formatCurrency(Math.abs(wealthDifferenceDisplay))} over ${data.holdingPeriod} years.`
        : `Mieten kann über ${data.holdingPeriod} Jahre ${formatCurrency(
            Math.abs(wealthDifferenceDisplay)
          )} sparen.`,
    }
  }, [
    data.holdingPeriod,
    formatCurrency,
    isEnglish,
    wealthDifferenceDisplay,
  ])

  const monthlyDiff = data.initialMonthlyBuying - data.monthlyRent
  const realAppreciation = appreciation - inflation

  const toggleSection = (sectionKey) =>
    setOpenSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }))

  const getFieldValue = (field) => {
    if (Object.prototype.hasOwnProperty.call(inputDrafts, field.fieldKey)) {
      return inputDrafts[field.fieldKey]
    }
    return String(field.value)
  }

  const handleFieldChange = (field, rawValue) => {
    const min = field.min ?? 0
    const max = field.max ?? Number.POSITIVE_INFINITY
    setInputDrafts((prev) => ({ ...prev, [field.fieldKey]: rawValue }))

    if (rawValue === '' || rawValue === '-' || rawValue === '.' || rawValue === '-.') {
      return
    }

    const numericValue = Number(rawValue)
    if (!Number.isFinite(numericValue)) return
    field.setter(clamp(numericValue, min, max))
  }

  const handleFieldBlur = (field, rawValue) => {
    const min = field.min ?? 0
    const max = field.max ?? Number.POSITIVE_INFINITY

    if (rawValue === '' || rawValue === '-' || rawValue === '.' || rawValue === '-.') {
      field.setter(min)
      setInputDrafts((prev) => ({ ...prev, [field.fieldKey]: String(min) }))
      return
    }

    const numericValue = Number(rawValue)
    if (!Number.isFinite(numericValue)) {
      setInputDrafts((prev) => ({ ...prev, [field.fieldKey]: String(field.value) }))
      return
    }

    const nextValue = clamp(numericValue, min, max)
    field.setter(nextValue)
    setInputDrafts((prev) => ({ ...prev, [field.fieldKey]: String(nextValue) }))
  }

  const inputSections = [
    {
      key: 'property',
      title: isEnglish ? 'Property & Purchase Details' : 'Objekt & Kaufdaten',
      fields: [
        {
          label: isEnglish ? 'Property Sale Price' : 'Kaufpreis',
          help: isEnglish
            ? 'Total purchase price of the property you are evaluating.'
            : 'Gesamter Kaufpreis der Immobilie.',
          fieldKey: 'salePrice',
          setter: setSalePrice,
          prefix: 'EUR',
          value: salePrice,
          min: 0,
          step: 1000,
        },
        {
          label: isEnglish ? 'Property Transfer Tax' : 'Grunderwerbsteuer',
          help: isEnglish
            ? 'Varies by German state, usually between 3.5% and 6.5%.'
            : 'Je nach Bundesland meistens zwischen 3,5% und 6,5%.',
          fieldKey: 'transferTax',
          setter: setTransferTax,
          suffix: '%',
          value: transferTax,
          min: 0,
          max: 10,
          step: 0.1,
        },
        {
          label: isEnglish ? 'Notary Charges' : 'Notarkosten',
          help: isEnglish
            ? 'Legal and land registry fees, usually around 1.5% to 2%.'
            : 'Kosten fuer Notar und Grundbuch, meist 1,5% bis 2%.',
          fieldKey: 'notaryCharges',
          setter: setNotaryCharges,
          suffix: '%',
          value: notaryCharges,
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          label: isEnglish ? 'Agent Fees' : 'Maklerprovision',
          help: isEnglish
            ? 'Broker commission as a percentage of sale price.'
            : 'Maklergebuehr als Anteil vom Kaufpreis.',
          fieldKey: 'agentFees',
          setter: setAgentFees,
          suffix: '%',
          value: agentFees,
          min: 0,
          max: 10,
          step: 0.01,
        },
        {
          label: isEnglish ? 'Initial Equity / Down Payment' : 'Eigenkapital',
          help: isEnglish
            ? 'Upfront capital you contribute at purchase.'
            : 'Ihr eingebrachtes Startkapital fuer den Kauf.',
          fieldKey: 'equity',
          setter: setEquity,
          prefix: 'EUR',
          value: equity,
          min: 0,
          step: 1000,
        },
      ],
    },
    {
      key: 'financing',
      title: isEnglish ? 'Financing Details' : 'Finanzierungsdaten',
      fields: [
        {
          label: isEnglish ? 'Interest Rate (p.a.)' : 'Sollzins (p.a.)',
          help: isEnglish
            ? 'Annual mortgage interest rate from the lender.'
            : 'Jaehrlicher Sollzins des Darlehens.',
          fieldKey: 'interestRate',
          setter: setInterestRate,
          suffix: '%',
          value: interestRate,
          min: 0,
          max: 15,
          step: 0.1,
        },
        {
          label: isEnglish ? 'Repayment Rate / Tilgung (p.a.)' : 'Tilgung (p.a.)',
          help: isEnglish
            ? 'Higher repayment shortens loan duration and reduces interest paid.'
            : 'Hoehere Tilgung verkuerzt Laufzeit und reduziert Zinskosten.',
          fieldKey: 'repaymentRate',
          setter: setRepaymentRate,
          suffix: '%',
          value: repaymentRate,
          min: 0.5,
          max: 10,
          step: 0.1,
        },
        {
          label: isEnglish ? 'Expected Holding Period' : 'Geplante Haltedauer',
          help: isEnglish
            ? 'How long you plan to keep the property before exit.'
            : 'Zeitraum bis zum geplanten Verkauf.',
          fieldKey: 'holdingPeriod',
          setter: setHoldingPeriod,
          suffix: isEnglish ? 'years' : 'Jahre',
          value: holdingPeriod,
          min: 1,
          max: 40,
          step: 1,
        },
      ],
    },
    {
      key: 'ownership',
      title: isEnglish ? 'Ownership Costs' : 'Laufende Eigentuemerkosten',
      fields: [
        {
          label: isEnglish ? 'Annual Maintenance' : 'Instandhaltung pro Jahr',
          help: isEnglish
            ? 'Typical range is 1% to 2% of property value each year.'
            : 'Typisch sind 1% bis 2% pro Jahr vom Immobilienwert.',
          fieldKey: 'maintenance',
          setter: setMaintenance,
          suffix: '%',
          value: maintenance,
          min: 0,
          max: 5,
          step: 0.1,
        },
        {
          label: isEnglish ? 'Monthly Hausgeld' : 'Hausgeld pro Monat',
          help: isEnglish
            ? 'Building and shared service fees for owners.'
            : 'Monatliche Kosten fuer Gemeinschaft und Verwaltung.',
          fieldKey: 'hausgeld',
          setter: setHausgeld,
          prefix: 'EUR',
          value: hausgeld,
          min: 0,
          step: 10,
        },
        {
          label: isEnglish ? 'Selling Costs at Exit' : 'Verkaufskosten',
          help: isEnglish
            ? 'Transaction costs when selling the property.'
            : 'Nebenkosten beim spaeteren Verkauf.',
          fieldKey: 'sellingCosts',
          setter: setSellingCosts,
          suffix: '%',
          value: sellingCosts,
          min: 0,
          max: 10,
          step: 0.1,
        },
      ],
    },
    {
      key: 'renting',
      title: isEnglish ? 'Renting Details' : 'Mietdaten',
      fields: [
        {
          label: isEnglish ? 'Monthly Rent' : 'Monatliche Miete',
          help: isEnglish
            ? 'Current rent for a comparable property.'
            : 'Aktuelle Miete fuer ein vergleichbares Objekt.',
          fieldKey: 'monthlyRent',
          setter: setMonthlyRent,
          prefix: 'EUR',
          value: monthlyRent,
          min: 0,
          step: 50,
        },
        {
          label: isEnglish ? 'Annual Rent Increase' : 'Mietsteigerung pro Jahr',
          help: isEnglish
            ? 'Expected yearly rent growth.'
            : 'Erwartete jaehrliche Mietanpassung.',
          fieldKey: 'rentIncrease',
          setter: setRentIncrease,
          suffix: '%',
          value: rentIncrease,
          min: 0,
          max: 10,
          step: 0.1,
        },
      ],
    },
    {
      key: 'economics',
      title: isEnglish ? 'Economic Assumptions' : 'Oekonomische Annahmen',
      fields: [
        {
          label: isEnglish ? 'Inflation Rate (p.a.)' : 'Inflationsrate (p.a.)',
          help: isEnglish
            ? 'Affects purchasing power and ownership costs over time.'
            : 'Beeinflusst Kaufkraft und laufende Kosten.',
          fieldKey: 'inflation',
          setter: setInflation,
          suffix: '%',
          value: inflation,
          min: 0,
          max: 10,
          step: 0.1,
        },
        {
          label: isEnglish ? 'Property Appreciation (p.a.)' : 'Wertsteigerung Immobilie',
          help: isEnglish
            ? 'Expected nominal yearly growth of property value.'
            : 'Erwartete nominale Wertentwicklung pro Jahr.',
          fieldKey: 'appreciation',
          setter: setAppreciation,
          suffix: '%',
          value: appreciation,
          min: -5,
          max: 15,
          step: 0.1,
        },
        {
          label: isEnglish ? 'Investment Return (p.a.)' : 'Rendite Alternativanlage',
          help: isEnglish
            ? 'Expected return if equity and monthly savings are invested.'
            : 'Renditeannahme fuer investiertes Eigenkapital und Ersparnisse.',
          fieldKey: 'investmentReturn',
          setter: setInvestmentReturn,
          suffix: '%',
          value: investmentReturn,
          min: 0,
          max: 20,
          step: 0.1,
        },
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
          resolve({ src: canvas.toDataURL('image/png'), aspect: img.naturalWidth / img.naturalHeight })
        } catch { resolve(null) }
      }
      img.onerror = () => resolve(null)
      img.src = '/logo-dark.png'
    })

    const logo = await loadLogo()
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    const pw = 210; const ph = 297; const ml = 15; const mr = 15; const cw = pw - ml - mr
    const brandWebsite = 'baufiking.de'
    const brandEmail = 'ravinder.singh@baufiking.de'
    const brandPhone = '+49 151 71618082'
    const fileDate = new Date().toISOString().slice(0, 10)
    const buyW = viewMode === 'real' ? data.realBuyingWealth : data.buyingWealth
    const rentW = viewMode === 'real' ? data.realRentingWealth : data.rentingWealth
    const diffW = viewMode === 'real' ? data.realWealthDifference : data.wealthDifference
    const headerHeight = 30
    const contentStartY = 38

    let y = 0

    const drawHeader = () => {
      doc.setFillColor(20, 64, 40)
      doc.rect(0, 0, pw, headerHeight, 'F')
      doc.setFillColor(30, 92, 56)
      doc.rect(0, 0, pw, 4, 'F')
      doc.setFillColor(193, 154, 107)
      doc.rect(0, headerHeight - 1, pw, 1, 'F')
      
      if (logo) {
        const maxLogoWidth = 42
        const maxLogoHeight = 11
        const logoWidth = Math.min(maxLogoWidth, maxLogoHeight * logo.aspect)
        const logoHeight = logoWidth / logo.aspect
        const logoY = (headerHeight - logoHeight) / 2
        doc.addImage(logo.src, 'PNG', ml, logoY, logoWidth, logoHeight)
      }
      
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.setTextColor(255, 255, 255)
      doc.text(isEnglish ? 'Rent vs Buy Analysis' : 'Mieten vs. Kaufen Analyse', pw - mr, 13, { align: 'right' })

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      const websiteBadgeWidth = doc.getTextWidth(brandWebsite) + 7
      const websiteBadgeX = pw - mr - websiteBadgeWidth
      doc.setFillColor(193, 154, 107)
      doc.roundedRect(websiteBadgeX, 17, websiteBadgeWidth, 7, 2, 2, 'F')
      doc.setTextColor(26, 77, 46)
      doc.text(brandWebsite, pw - mr - 4, 21.8, { align: 'right' })
      y = contentStartY
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
        y = contentStartY
      }
    }

    drawHeader()

    // 1. Recommendation Box
    guard(30)
    const recColor = recommendation.tone === 'buy' ? [26, 77, 46] : recommendation.tone === 'rent' ? [21, 128, 61] : [146, 100, 4]
    doc.setFillColor(...recColor)
    doc.roundedRect(ml, y, cw, 16, 1.5, 1.5, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10.5); doc.setTextColor(255, 255, 255)
    doc.text(recommendation.title.toUpperCase(), ml + 5, y + 6.5)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(230, 245, 230)
    const recLines = doc.splitTextToSize(recommendation.body, cw - 10)
    doc.text(recLines, ml + 5, y + 11)
    y += 24

    // 2. Key Results Dashboard
    guard(30)
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(ml, y, cw, 22, 1.5, 1.5, 'F')
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2); doc.roundedRect(ml, y, cw, 22, 1.5, 1.5, 'D')

    const boxW = cw / 3
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(100, 116, 139)
    doc.text(isEnglish ? 'WEALTH DIFFERENCE' : 'VERMÖGENS-PLUS', ml + 5, y + 7)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12)
    doc.setTextColor(diffW >= 0 ? 26 : 185, diffW >= 0 ? 77 : 28, diffW >= 0 ? 46 : 28)
    doc.text(formatSignedCurrency(diffW), ml + 5, y + 16)

    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(100, 116, 139)
    doc.text(isEnglish ? 'BREAK-EVEN YEAR' : 'BREAK-EVEN-JAHR', ml + boxW + 5, y + 7)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(26, 26, 26)
    doc.text(data.breakEvenYear ? `${isEnglish ? 'Year' : 'Jahr'} ${data.breakEvenYear}` : 'N/A', ml + boxW + 5, y + 16)

    doc.setFont('helvetica', 'normal'); doc.setFontSize(7); doc.setTextColor(100, 116, 139)
    doc.text(isEnglish ? 'HOLDING PERIOD' : 'HALTEDAUER', ml + boxW * 2 + 5, y + 7)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.setTextColor(26, 26, 26)
    doc.text(`${holdingPeriod} ${isEnglish ? 'Years' : 'Jahre'}`, ml + boxW * 2 + 5, y + 16)
    y += 30

    // 3. Two Column Details (Inputs vs Results)
    guard(65)
    const colW = (cw - 10) / 2
    let ly = y; let ry = y
    
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'KEY ASSUMPTIONS' : 'WICHTIGE ANNAHMEN', ml, ly)
    doc.setDrawColor(193, 154, 107); doc.setLineWidth(0.4); doc.line(ml, ly + 2, ml + colW, ly + 2)
    ly += 8

    const dataRow = (label, value, targetY) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(107, 114, 128)
      doc.text(label, ml, targetY)
      doc.setFont('helvetica', 'bold'); doc.setTextColor(26, 26, 26)
      doc.text(value, ml + colW, targetY, { align: 'right' })
      return targetY + 5.5
    }

    ly = dataRow(isEnglish ? 'Property Price' : 'Kaufpreis', formatCurrency(salePrice), ly)
    ly = dataRow(isEnglish ? 'Equity' : 'Eigenkapital', formatCurrency(equity), ly)
    ly = dataRow(isEnglish ? 'Interest Rate' : 'Zinssatz', `${interestRate.toFixed(2)}%`, ly)
    ly = dataRow(isEnglish ? 'Repayment' : 'Tilgung', `${repaymentRate.toFixed(2)}%`, ly)
    ly = dataRow(isEnglish ? 'Current Rent' : 'Aktuelle Miete', formatCurrency(monthlyRent), ly)
    ly = dataRow(isEnglish ? 'Appreciation' : 'Wertsteigerung', `${appreciation.toFixed(1)}%`, ly)
    ly = dataRow(isEnglish ? 'Investment Return' : 'Kapitalrendite', `${investmentReturn.toFixed(1)}%`, ly)
    ly = dataRow(isEnglish ? 'Rent Increase' : 'Mietsteigerung', `${rentIncrease.toFixed(1)}%`, ly)

    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'FINANCIAL SUMMARY' : 'FINANZIELLES FAZIT', ml + colW + 10, ry)
    doc.setDrawColor(193, 154, 107); doc.setLineWidth(0.4); doc.line(ml + colW + 10, ry + 2, ml + cw, ry + 2)
    ry += 8

    const resultRow = (label, value, targetY) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(107, 114, 128)
      doc.text(label, ml + colW + 10, targetY)
      doc.setFont('helvetica', 'bold'); doc.setTextColor(26, 26, 26)
      doc.text(value, ml + cw, targetY, { align: 'right' })
      return targetY + 5.5
    }

    ry = resultRow(isEnglish ? 'Monthly Cost (Buy)' : 'Kosten Kauf (mtl.)', formatCurrency(data.initialMonthlyBuying), ry)
    ry = resultRow(isEnglish ? 'Monthly Cost (Rent)' : 'Kosten Miete (mtl.)', formatCurrency(data.monthlyRent), ry)
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.1); doc.line(ml + colW + 10, ry - 3, ml + cw, ry - 3)
    ry += 1
    ry = resultRow(isEnglish ? 'Net Wealth (Buying)' : 'Vermoegen (Kauf)', formatCurrency(buyW), ry)
    ry = resultRow(isEnglish ? 'Net Wealth (Renting)' : 'Vermoegen (Miete)', formatCurrency(rentW), ry)
    
    ry += 2
    doc.setFillColor(diffW >= 0 ? 232 : 254, diffW >= 0 ? 245 : 226, diffW >= 0 ? 233 : 226)
    doc.roundedRect(ml + colW + 10, ry, colW, 9, 1.2, 1.2, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8)
    doc.setTextColor(diffW >= 0 ? 26 : 185, diffW >= 0 ? 77 : 28, diffW >= 0 ? 46 : 28)
    doc.text(diffW >= 0 ? (isEnglish ? 'BUYING IS BETTER' : 'KAUFEN IST BESSER') : (isEnglish ? 'RENTING IS BETTER' : 'MIETEN IST BESSER'), ml + colW + colW / 2, ry + 6, { align: 'center' })
    
    y = Math.max(ly, ry + 12)

    // 4. Monthly Breakdown
    guard(35)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? 'MONTHLY COST DETAIL' : 'MONATLICHE KOSTENDETAILS', ml, y)
    doc.setDrawColor(193, 154, 107); doc.setLineWidth(0.4); doc.line(ml, y + 2, ml + cw, y + 2)
    y += 7.5

    doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(156, 163, 175)
    doc.text(isEnglish ? 'CATEGORY' : 'KATEGORIE', ml, y)
    doc.text(isEnglish ? 'BUYING' : 'KAUFEN', ml + (cw * 0.6), y, { align: 'right' })
    doc.text(isEnglish ? 'RENTING' : 'MIETEN', ml + cw, y, { align: 'right' })
    y += 5

    const detailRow = (label, buyVal, rentVal, targetY) => {
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(107, 114, 128)
      doc.text(label, ml, targetY)
      doc.setFont('helvetica', 'bold'); doc.setTextColor(26, 77, 46)
      doc.text(buyVal, ml + (cw * 0.6), targetY, { align: 'right' })
      doc.setTextColor(193, 154, 107)
      doc.text(rentVal, ml + cw, targetY, { align: 'right' })
      doc.setDrawColor(241, 245, 249); doc.setLineWidth(0.1); doc.line(ml, targetY + 1.2, ml + cw, targetY + 1.2)
      return targetY + 5
    }

    y = detailRow(isEnglish ? 'Mortgage / Rent' : 'Annuitaet / Miete', formatCurrency(data.emi), formatCurrency(data.monthlyRent), y)
    y = detailRow(isEnglish ? 'Maintenance / Extra' : 'Instandhaltung / Mehrkosten', formatCurrency(data.initialMonthlyMaintenance), formatCurrency(0), y)
    y = detailRow(isEnglish ? 'Hausgeld' : 'Hausgeld', formatCurrency(hausgeld), formatCurrency(0), y)
    y = detailRow(isEnglish ? 'TOTAL MONTHLY' : 'GESAMT MONATLICH', formatCurrency(data.initialMonthlyBuying), formatCurrency(data.monthlyRent), y)
    y += 8

    // 5. Wealth Breakdown
    guard(35)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(26, 77, 46)
    doc.text(isEnglish ? `NET WEALTH AFTER ${holdingPeriod} YEARS` : `VERMÖGEN NACH ${holdingPeriod} JAHREN`, ml, y)
    doc.setDrawColor(193, 154, 107); doc.setLineWidth(0.4); doc.line(ml, y + 2, ml + cw, y + 2)
    y += 7.5

    doc.setFont('helvetica', 'bold'); doc.setFontSize(6.5); doc.setTextColor(156, 163, 175)
    doc.text(isEnglish ? 'POSITION' : 'POSITION', ml, y)
    doc.text(isEnglish ? 'BUYING' : 'KAUFEN', ml + (cw * 0.6), y, { align: 'right' })
    doc.text(isEnglish ? 'RENTING' : 'MIETEN', ml + cw, y, { align: 'right' })
    y += 5

    y = detailRow(isEnglish ? 'Property / Investment Value' : 'Immobilie / Investment', formatCurrency(data.futurePropertyValue), formatCurrency(data.futureInvestmentValue), y)
    y = detailRow(isEnglish ? 'Debt / Monthly Savings' : 'Restschuld / Sparplan', `-${formatCurrency(data.remainingBalance)}`, `+${formatCurrency(data.investedMonthlySavings)}`, y)
    y = detailRow(isEnglish ? 'Exit Costs / Total Rent' : 'Nebenkosten / Gesamtmiete', `-${formatCurrency(data.sellingCostsAmount + data.totalMaintenance + data.totalHausgeld)}`, `-${formatCurrency(data.totalRentPaid + data.extraRentCost)}`, y)
    doc.setFillColor(248, 250, 252); doc.rect(ml, y - 3.8, cw, 5, 'F')
    y = detailRow(isEnglish ? 'NET WEALTH POSITION' : 'NETTO-VERMÖGEN', formatCurrency(buyW), formatCurrency(rentW), y)
    y += 8

    // 6. Disclaimer
    guard(20)
    doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.2); doc.line(ml, y, ml + cw, y)
    y += 4
    doc.setFont('helvetica', 'italic'); doc.setFontSize(6.5); doc.setTextColor(107, 114, 128)
    const disclaimerText = isEnglish
      ? 'Note: This report is a simulation based on your assumptions. Past performance does not guarantee future results. No financial or tax advice.'
      : 'Hinweis: Simulation auf Basis Ihrer Annahmen. Keine Gewähr für künftige Ergebnisse. Keine Finanz- oder Steuerberatung.'
    const dispLines = doc.splitTextToSize(disclaimerText, cw)
    doc.text(dispLines, ml, y)

    drawFooter()
    doc.save(`BaufiKing-RentVsBuy-${fileDate}.pdf`)
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
            {isEnglish ? 'Rent vs Buy Decision Engine' : 'Mieten vs. Kaufen'}
          </h2>
          <p className="text-sm sm:text-base text-white/80 mt-3">
            {labels.subtitle}
          </p>
        </div>

        <div className="bg-white text-slate-900 rounded-[24px] p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          {/* Sticky Header */}
          <div className="-mx-6 sm:-mx-10 -mt-6 sm:-mt-10 px-6 sm:px-10 py-5 bg-white/95 border-b border-border/60">
            <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div className="space-y-1">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-400">{recommendation.title}</div>
                <div className={`text-2xl sm:text-3xl font-extrabold ${recommendation.tone === 'buy' ? 'text-primary' : recommendation.tone === 'rent' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {recommendation.body}
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-3 text-sm">
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-center min-w-[120px]">
                  <div className="text-[11px] text-slate-400">{isEnglish ? 'Wealth Gap' : 'Vermögens-Plus'}</div>
                  <div className={`text-lg font-extrabold ${wealthDifferenceDisplay >= 0 ? 'text-primary' : 'text-rose-600'}`}>{formatSignedCurrency(wealthDifferenceDisplay)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3 text-center">
                  <div className="text-[11px] text-slate-400">Break-Even</div>
                  <div className="text-lg font-extrabold text-slate-900">
                    {data.breakEvenYear ? `${isEnglish ? 'Year' : 'Jahr'} ${data.breakEvenYear}` : 'N/A'}
                  </div>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button onClick={() => setViewMode('nominal')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'nominal' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{labels.nominal}</button>
                  <button onClick={() => setViewMode('real')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${viewMode === 'real' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{labels.real}</button>
                </div>
              </div>
              <div className="mt-2 lg:col-start-2 flex lg:justify-end">
                <p className="inline-flex rounded-lg border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary text-right">
                  {isEnglish
                    ? `Real Appreciation: ${realAppreciation.toFixed(1)}% (Property Growth: ${appreciation.toFixed(1)}% - Inflation: ${inflation.toFixed(1)}%)`
                    : `Reale Wertsteigerung: ${realAppreciation.toFixed(1)}% (Wertzuwachs: ${appreciation.toFixed(1)}% - Inflation: ${inflation.toFixed(1)}%)`}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 -mx-6 sm:-mx-10 px-6 sm:px-10 lg:grid lg:grid-cols-[400px_1fr] lg:gap-10">
            <div className="space-y-4 pb-6 lg:pb-0">
              <div className="bg-secondary/10 border border-border/60 rounded-2xl p-5">
                <h3 className="font-heading text-lg text-primary font-bold">{labels.inputs}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {isEnglish
                    ? 'Expand each section to review assumptions and see short explanations for every field.'
                    : 'Oeffnen Sie die Bereiche, um alle Annahmen und kurze Feldbeschreibungen zu sehen.'}
                </p>
              </div>

              {inputSections.map((section) => (
                <div key={section.key} className="rounded-2xl border border-border/60 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleSection(section.key)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left"
                  >
                    <span className="font-semibold text-slate-900">{section.title}</span>
                    <span className="text-slate-500">
                      {openSections[section.key] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </span>
                  </button>
                  {openSections[section.key] && (
                    <div className="border-t border-border/60 p-4 space-y-4">
                      {section.fields.map((field) => (
                        <div key={field.label}>
                          <div className="flex items-center justify-between gap-3">
                            <label className="text-sm font-semibold text-slate-700">{field.label}</label>
                            <span className="text-[11px] text-slate-400">{field.help}</span>
                          </div>
                          <div className="relative mt-1">
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
                              onChange={(event) => handleFieldChange(field, event.target.value)}
                              onBlur={(event) => handleFieldBlur(field, event.target.value)}
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
                <button onClick={() => setIsModalOpen(true)} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary/90">{labels.cta}</button>
                <button onClick={handleDownloadPdf} className="w-full rounded-xl border-2 border-primary/20 bg-white px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5">{isEnglish ? 'Download PDF Report' : 'PDF-Report laden'}</button>
              </div>
            </div>

            <div className="space-y-6 pb-10">
              <div className={`rounded-2xl border p-6 ${recommendation.tone === 'buy' ? 'bg-primary/5 border-primary/20' : recommendation.tone === 'rent' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <p className="text-xs uppercase tracking-[0.12em] text-slate-500">{labels.recommendation}</p>
                <h3 className="mt-1 text-2xl font-black text-slate-900">{recommendation.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{recommendation.body}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-primary">{isEnglish ? 'Buying Monthly Cost' : 'Monatliche Kosten Kauf'}</p>
                  <p className="mt-2 text-3xl font-black text-primary">{formatCurrency(data.initialMonthlyBuying)}</p>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <div>{isEnglish ? 'Mortgage EMI:' : 'Annuitaet:'} <span className="font-semibold">{formatCurrency(data.emi)}</span></div>
                    <div>{isEnglish ? 'Hausgeld:' : 'Hausgeld:'} <span className="font-semibold">{formatCurrency(hausgeld)}</span></div>
                    <div>{isEnglish ? 'Maintenance:' : 'Instandhaltung:'} <span className="font-semibold">{formatCurrency(data.initialMonthlyMaintenance)}</span></div>
                  </div>
                </div>
                <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">{isEnglish ? 'Renting Monthly Cost' : 'Monatliche Kosten Miete'}</p>
                  <p className="mt-2 text-3xl font-black text-emerald-700">{formatCurrency(data.monthlyRent)}</p>
                  <div className="mt-3 text-sm text-slate-600">
                    <div>
                      {isEnglish ? 'Difference:' : 'Differenz:'}{' '}
                      <span className="font-semibold">{formatCurrency(Math.abs(monthlyDiff))}</span>
                    </div>
                    <div className="mt-1 text-xs">
                      {monthlyDiff > 0
                        ? (isEnglish ? 'Renting is cheaper per month in year 1.' : 'Mieten ist im ersten Jahr monatlich guenstiger.')
                        : (isEnglish ? 'Buying is cheaper per month in year 1.' : 'Kaufen ist im ersten Jahr monatlich guenstiger.')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-heading text-lg text-primary font-bold mb-4">{isEnglish ? 'Buying Net Wealth' : 'Nettovermoegen Kauf'}</h3>
                  <p className="text-3xl font-black text-primary">{formatCurrency(buyingWealthDisplay)}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div>{isEnglish ? 'Future property value:' : 'Immobilienwert am Ende:'} <span className="font-semibold">{formatCurrency(data.futurePropertyValue)}</span></div>
                    <div>{isEnglish ? 'Remaining loan:' : 'Restschuld:'} <span className="font-semibold">-{formatCurrency(data.remainingBalance)}</span></div>
                    <div>{isEnglish ? 'Selling costs:' : 'Verkaufskosten:'} <span className="font-semibold">-{formatCurrency(data.sellingCostsAmount)}</span></div>
                    <div>{isEnglish ? 'Maintenance + Hausgeld:' : 'Instandhaltung + Hausgeld:'} <span className="font-semibold">-{formatCurrency(data.totalMaintenance + data.totalHausgeld)}</span></div>
                  </div>
                </div>
                <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                  <h3 className="font-heading text-lg text-emerald-700 font-bold mb-4">{isEnglish ? 'Renting Net Wealth' : 'Nettovermoegen Miete'}</h3>
                  <p className="text-3xl font-black text-emerald-700">{formatCurrency(rentingWealthDisplay)}</p>
                  <div className="mt-4 space-y-2 text-sm text-slate-600">
                    <div>{isEnglish ? 'Equity growth:' : 'Wachstum Eigenkapital:'} <span className="font-semibold">{formatCurrency(data.futureInvestmentValue)}</span></div>
                    <div>{isEnglish ? 'Invested monthly savings:' : 'Investierte Monatsdifferenzen:'} <span className="font-semibold">{formatCurrency(data.investedMonthlySavings)}</span></div>
                    <div>{isEnglish ? 'Total rent paid:' : 'Gesamtmiete:'} <span className="font-semibold">-{formatCurrency(data.totalRentPaid)}</span></div>
                    <div>{isEnglish ? 'Extra rent penalty:' : 'Mehrkosten Miete:'} <span className="font-semibold">-{formatCurrency(data.extraRentCost)}</span></div>
                  </div>
                </div>
              </div>

              <div className={`rounded-2xl border p-5 ${wealthDifferenceDisplay >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                <p className="text-xs font-bold uppercase tracking-[0.12em] opacity-80">{isEnglish ? 'Net Wealth Difference (Buy vs Rent)' : 'Vermoegensdifferenz (Kauf vs Miete)'}</p>
                <p className="mt-2 text-3xl font-black">{formatSignedCurrency(wealthDifferenceDisplay)}</p>
                <p className="mt-2 text-sm opacity-90">
                  {wealthDifferenceDisplay >= 0
                    ? (isEnglish ? 'Buying leads in this scenario.' : 'Kaufen liegt in diesem Szenario vorne.')
                    : (isEnglish ? 'Renting leads in this scenario.' : 'Mieten liegt in diesem Szenario vorne.')}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="font-heading text-lg font-bold text-slate-900">{isEnglish ? 'Symmetric Cost Analysis' : 'Symmetrische Kostenanalyse'}</h3>
                <p className="mt-3 text-sm text-slate-600">
                  {isEnglish
                    ? 'Both options start with the same equity. Buying uses equity as down payment, renting invests it. Monthly cost differences are either invested or treated as extra cost. Principal repayment builds equity and is not treated as spending.'
                    : 'Beide Optionen starten mit demselben Eigenkapital. Beim Kauf dient es als Eigenanteil, beim Mieten wird es investiert. Monatliche Differenzen werden investiert oder als Mehrkosten beruecksichtigt. Tilgung ist Vermoegensaufbau, kein Verbrauch.'}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <div className="text-slate-500">{isEnglish ? 'Total Interest Paid' : 'Gesamtzinskosten'}</div>
                    <div className="font-bold text-slate-900">{formatCurrency(data.totalInterestPaid)}</div>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <div className="text-slate-500">{isEnglish ? 'Acquisition Costs' : 'Kaufnebenkosten'}</div>
                    <div className="font-bold text-slate-900">{formatCurrency(data.acquisitionCosts)}</div>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <div className="text-slate-500">{isEnglish ? 'Total Maintenance' : 'Instandhaltung gesamt'}</div>
                    <div className="font-bold text-slate-900">{formatCurrency(data.totalMaintenance)}</div>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <div className="text-slate-500">{isEnglish ? 'Total Hausgeld' : 'Hausgeld gesamt'}</div>
                    <div className="font-bold text-slate-900">{formatCurrency(data.totalHausgeld)}</div>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <div className="text-slate-500">{isEnglish ? 'Total Rent Paid' : 'Gesamtmiete'}</div>
                    <div className="font-bold text-slate-900">{formatCurrency(data.totalRentPaid)}</div>
                  </div>
                  <div className="rounded-xl bg-white border border-slate-200 p-3">
                    <div className="text-slate-500">{isEnglish ? 'Property Value at Exit' : 'Immobilienwert am Ende'}</div>
                    <div className="font-bold text-slate-900">{formatCurrency(data.futurePropertyValue)}</div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
                <p className="text-sm uppercase tracking-[0.12em] text-amber-700">{labels.breakEven}</p>
                <p className="mt-2 text-3xl font-black text-amber-700">
                  {data.breakEvenYear ? `${isEnglish ? 'Year' : 'Jahr'} ${data.breakEvenYear}` : (isEnglish ? 'Not reached in model horizon' : 'Im Modellhorizont nicht erreicht')}
                </p>
                <p className="mt-2 text-sm text-amber-800">
                  {isEnglish
                    ? 'This is the first year where buying net wealth is greater than renting net wealth.'
                    : 'Dies ist das erste Jahr, in dem das Nettovermoegen beim Kaufen hoeher als beim Mieten ist.'}
                </p>
              </div>

              <div className="bg-white border border-border/60 rounded-2xl p-6 shadow-sm">
                <h3 className="font-heading text-lg text-primary font-bold mb-6">{labels.chartTitle}</h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1a4d2e" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#1a4d2e" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#c19a6b" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#c19a6b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(v) => `EUR ${Math.round(v / 1000)}k`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} formatter={(v) => [formatCurrency(v), '']} />
                      <Area type="monotone" dataKey="buying" name={isEnglish ? 'Buying' : 'Kaufen'} stroke="#1a4d2e" strokeWidth={3} fillOpacity={1} fill="url(#colorBuy)" />
                      <Area type="monotone" dataKey="renting" name={isEnglish ? 'Renting' : 'Mieten'} stroke="#c19a6b" strokeWidth={3} fillOpacity={1} fill="url(#colorRent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-4">
                <h4 className="font-bold text-amber-800">{isEnglish ? 'Important Disclaimer' : 'Wichtiger Hinweis'}</h4>
                <p className="text-sm text-amber-800/90 mt-1">
                  {isEnglish
                    ? 'This calculator is informational only, not financial, tax, or investment advice. Results are scenario estimates based on your assumptions.'
                    : 'Dieser Rechner dient nur zur Orientierung und ersetzt keine Finanz-, Steuer- oder Anlageberatung. Die Ergebnisse sind modellhafte Schaetzungen.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} language={language} />
    </section>
  )
}

export default RentVsBuyCalculator
