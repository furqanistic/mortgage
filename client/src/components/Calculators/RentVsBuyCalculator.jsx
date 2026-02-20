// File: client/src/components/Calculators/RentVsBuyCalculator.jsx
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

const RentVsBuyCalculator = ({ language = 'de' }) => {
  const isEnglish = language === 'en'
  const locale = isEnglish ? 'en-US' : 'de-DE'
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('nominal')

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

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)

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
    const buyW = viewMode === 'real' ? data.realBuyingWealth : data.buyingWealth
    const rentW = viewMode === 'real' ? data.realRentingWealth : data.rentingWealth
    const diffW = viewMode === 'real' ? data.realWealthDifference : data.wealthDifference

    // ── Header band
    doc.setFillColor(26, 77, 46); doc.rect(0, 0, pw, 38, 'F')
    doc.setFillColor(193, 154, 107); doc.rect(0, 38, pw, 1.5, 'F')
    if (logo) { const lh = 26; doc.addImage(logo.src, 'JPEG', ml, 6, lh * logo.aspect, lh) }
    doc.setFont('helvetica', 'bold'); doc.setFontSize(17); doc.setTextColor(255, 255, 255)
    doc.text(isEnglish ? 'Rent vs Buy Analysis' : 'Mieten vs. Kaufen Analyse', pw - ml, 16, { align: 'right' })
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

    // ── Key Assumptions
    secHead(isEnglish ? 'Key Assumptions' : 'Annahmen')
    row2(isEnglish ? 'Purchase Price' : 'Kaufpreis', formatCurrency(salePrice), isEnglish ? 'Down Payment' : 'Eigenkapital', formatCurrency(equity))
    row2(isEnglish ? 'Loan Amount' : 'Darlehen', formatCurrency(data.loanAmount), isEnglish ? 'Monthly EMI' : 'Monatsrate', formatCurrency(data.emi))
    row2(isEnglish ? 'Interest Rate' : 'Zinssatz', `${interestRate.toFixed(2)}%`, isEnglish ? 'Repayment Rate' : 'Tilgung', `${repaymentRate.toFixed(2)}%`)
    row2(isEnglish ? 'Holding Period' : 'Haltezeit', `${holdingPeriod} ${isEnglish ? 'yrs' : 'J'}`, isEnglish ? 'Monthly Rent' : 'Monatsmiete', formatCurrency(monthlyRent))
    row2(isEnglish ? 'Transfer Tax' : 'Grunderwerbsteuer', `${transferTax.toFixed(1)}%`, isEnglish ? 'Notary Charges' : 'Notarkosten', `${notaryCharges.toFixed(1)}%`)
    row2(isEnglish ? 'Appreciation' : 'Wertsteigerung', `${appreciation.toFixed(1)}%`, isEnglish ? 'Investment Return' : 'Kapitalrendite', `${investmentReturn.toFixed(1)}%`)
    row2(isEnglish ? 'Rent Increase' : 'Mietsteigerung', `${rentIncrease.toFixed(1)}%`, isEnglish ? 'Inflation' : 'Inflation', `${inflation.toFixed(1)}%`); y += 3

    // ── Recommendation
    secHead(isEnglish ? 'Recommendation' : 'Empfehlung')
    guard(15)
    const recIsBuy = recommendation.tone === 'buy'
    const recBg = recIsBuy ? [26, 77, 46] : recommendation.tone === 'neutral' ? [146, 100, 4] : [21, 128, 61]
    doc.setFillColor(...recBg); doc.roundedRect(ml, y, cw, 13, 2, 2, 'F')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(255, 255, 255)
    doc.text(recommendation.title, ml + 4, y + 5.5)
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(220, 240, 220)
    const recBody = doc.splitTextToSize(recommendation.body, cw - 8)
    doc.text(recBody, ml + 4, y + 10); y += 16 + (recBody.length - 1) * 3.5

    // ── Monthly Comparison
    secHead(isEnglish ? 'Monthly Cost Comparison' : 'Monatlicher Kostenvergleich')
    row2(isEnglish ? 'Monthly Buying Cost' : 'Kaufen monatlich', formatCurrency(data.initialMonthlyBuying), isEnglish ? 'Monthly Rent' : 'Mieten monatlich', formatCurrency(data.monthlyRent))
    const mDiff = data.initialMonthlyBuying - data.monthlyRent
    row2(isEnglish ? 'Monthly Difference' : 'Differenz monatlich', formatCurrency(Math.abs(mDiff)),
      isEnglish ? (mDiff > 0 ? 'Renting cheaper' : 'Buying cheaper') : (mDiff > 0 ? 'Mieten günstiger' : 'Kaufen günstiger'), '')
    y += 3

    // ── Wealth Comparison
    secHead(isEnglish ? `Wealth After ${holdingPeriod} Years` : `Vermögen nach ${holdingPeriod} Jahren`)
    guard(17)
    doc.setFillColor(26, 77, 46); doc.roundedRect(ml, y, cw, 13, 2, 2, 'F')
    doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(180, 210, 180)
    doc.text(isEnglish ? 'Buying Wealth (Net Position)' : 'Vermögen durch Kaufen', ml + 4, y + 5)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(255, 255, 255)
    doc.text(formatCurrency(buyW), pw - ml, y + 9.5, { align: 'right' }); y += 17
    row2(isEnglish ? 'Renting Wealth' : 'Vermögen durch Mieten', formatCurrency(rentW), isEnglish ? 'Wealth Difference' : 'Vermögensdifferenz', formatSignedCurrency(diffW)); y += 2
    guard(12)
    const bpos = diffW >= 0
    doc.setFillColor(bpos ? 232 : 254, bpos ? 245 : 226, bpos ? 233 : 226)
    doc.setDrawColor(bpos ? 26 : 185, bpos ? 77 : 28, bpos ? 46 : 28); doc.setLineWidth(0.3)
    doc.roundedRect(ml, y, cw, 9, 1.5, 1.5, 'FD')
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5)
    doc.setTextColor(bpos ? 26 : 185, bpos ? 77 : 28, bpos ? 46 : 28)
    doc.text(bpos
      ? (isEnglish ? `Buying leads by ${formatCurrency(diffW)}` : `Kaufen vorne um ${formatCurrency(diffW)}`)
      : (isEnglish ? `Renting leads by ${formatCurrency(Math.abs(diffW))}` : `Mieten vorne um ${formatCurrency(Math.abs(diffW))}`),
    ml + 4, y + 5.5); y += 13

    // ── Break-even
    secHead(isEnglish ? 'Break-Even Analysis' : 'Break-Even-Analyse')
    row2(isEnglish ? 'Break-Even Year' : 'Break-Even-Jahr',
      data.breakEvenYear ? `${isEnglish ? 'Year' : 'Jahr'} ${data.breakEvenYear}` : (isEnglish ? 'Not reached' : 'Nicht erreicht'),
      isEnglish ? 'Holding Period' : 'Haltezeit', `${holdingPeriod} ${isEnglish ? 'years' : 'Jahre'}`)
    row2(isEnglish ? 'Acquisition Costs' : 'Erwerbsnebenkosten', formatCurrency(data.acquisitionCosts), isEnglish ? 'Selling Costs' : 'Verkaufskosten', formatCurrency(data.sellingCostsAmount)); y += 3

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

    doc.save(`BaufiKing-RentVsBuy-${fileDate}.pdf`)
  }

  return (
    <section className="rounded-[28px] border border-border/60 bg-white p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-5 lg:flex lg:flex-col lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
      <header className="mb-4 shrink-0">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{labels.title}</p>
        <h2 className="mt-3 text-3xl font-heading font-bold text-primary">{labels.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{labels.subtitle}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start relative w-full lg:min-h-0 lg:flex-1">
        <div className="flex flex-col py-1 pe-3 -ms-1 max-lg:space-y-6 lg:h-full lg:overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/20 hover:[&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-track]:bg-transparent">
          <div className="rounded-2xl border border-border/60 bg-secondary/10 p-4">
              <h3 className="text-sm font-semibold text-primary">{labels.inputs}</h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <label className="text-xs leading-snug text-muted-foreground">
                Property Sale Price (€)
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={salePrice}
                  onChange={(event) => setSalePrice(Math.max(0, Number(event.target.value || 0)))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Transfer Tax (%)
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={transferTax}
                  onChange={(event) => setTransferTax(clamp(Number(event.target.value || 0), 0, 10))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Notary Charges (%)
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={notaryCharges}
                  onChange={(event) => setNotaryCharges(clamp(Number(event.target.value || 0), 0, 5))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Agent Fees (%)
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.01}
                  value={agentFees}
                  onChange={(event) => setAgentFees(clamp(Number(event.target.value || 0), 0, 10))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Equity / Down Payment (€)
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
                Interest Rate (% p.a.)
                <input
                  type="number"
                  min={0}
                  max={15}
                  step={0.1}
                  value={interestRate}
                  onChange={(event) => setInterestRate(clamp(Number(event.target.value || 0), 0, 15))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Repayment Rate (% p.a.)
                <input
                  type="number"
                  min={1}
                  max={10}
                  step={0.1}
                  value={repaymentRate}
                  onChange={(event) => setRepaymentRate(clamp(Number(event.target.value || 0), 1, 10))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Holding Period (Years)
                <input
                  type="number"
                  min={1}
                  max={40}
                  step={1}
                  value={holdingPeriod}
                  onChange={(event) => setHoldingPeriod(clamp(Number(event.target.value || 0), 1, 40))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Maintenance (% of value)
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={maintenance}
                  onChange={(event) => setMaintenance(clamp(Number(event.target.value || 0), 0, 5))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Monthly Hausgeld (€)
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={hausgeld}
                  onChange={(event) => setHausgeld(Math.max(0, Number(event.target.value || 0)))}
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
                Annual Rent Increase (%)
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={rentIncrease}
                  onChange={(event) => setRentIncrease(clamp(Number(event.target.value || 0), 0, 10))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Inflation Rate (%)
                <input
                  type="number"
                  min={0}
                  max={10}
                  step={0.1}
                  value={inflation}
                  onChange={(event) => setInflation(clamp(Number(event.target.value || 0), 0, 10))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Property Appreciation (%)
                <input
                  type="number"
                  min={-5}
                  max={15}
                  step={0.1}
                  value={appreciation}
                  onChange={(event) => setAppreciation(clamp(Number(event.target.value || 0), -5, 15))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <label className="text-xs leading-snug text-muted-foreground">
                Investment Return (%)
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.1}
                  value={investmentReturn}
                  onChange={(event) => setInvestmentReturn(clamp(Number(event.target.value || 0), 0, 20))}
                  className="mt-1 w-full rounded-xl border border-border/60 bg-white px-2.5 py-1.5 text-sm font-semibold text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </label>
              </div>
            </div>
        </div>

        <div className="space-y-6 py-1 lg:h-full lg:overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/20 hover:[&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-track]:bg-transparent">
<div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{labels.viewMode}</p>
                  <p className="text-sm font-semibold text-primary">{labels.results}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="viewMode"
                      value="nominal"
                      checked={viewMode === 'nominal'}
                      onChange={() => setViewMode('nominal')}
                      className="h-4 w-4 accent-primary"
                    />
                    {labels.nominal}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="viewMode"
                      value="real"
                      checked={viewMode === 'real'}
                      onChange={() => setViewMode('real')}
                      className="h-4 w-4 accent-primary"
                    />
                    {labels.real}
                  </label>
                </div>
              </div>
            </div>

            <div
              className={`rounded-2xl border p-6 text-center shadow-sm ${
                recommendation.tone === 'buy'
                  ? 'border-primary/40 bg-primary/5'
                  : recommendation.tone === 'rent'
                  ? 'border-emerald-500/40 bg-emerald-50'
                  : 'border-amber-400/50 bg-amber-50'
              }`}
            >
              <h3 className="text-lg font-semibold text-foreground">{recommendation.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{recommendation.body}</p>
            </div>

            
          <div className="grid gap-4 sm:grid-cols-2">
<div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-primary">{labels.breakEven}</h3>
              <div className="mt-4 rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {data.breakEvenYear
                    ? `${isEnglish ? 'Year' : 'Jahr'} ${data.breakEvenYear}`
                    : isEnglish
                    ? 'Not reached'
                    : 'Nicht erreicht'}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {data.breakEvenYear
                    ? data.breakEvenYear <= data.holdingPeriod
                      ? isEnglish
                        ? 'Buying becomes more profitable within your holding period.'
                        : 'Kaufen wird innerhalb Ihres Zeitraums profitabler.'
                      : isEnglish
                      ? 'Buying breaks even after your planned holding period.'
                      : 'Break-even liegt nach Ihrem Zeitraum.'
                    : wealthDifferenceDisplay > 0
                    ? isEnglish
                      ? 'Buying is immediately more profitable.'
                      : 'Kaufen ist sofort profitabler.'
                    : isEnglish
                    ? 'Renting stays ahead for the full period.'
                    : 'Mieten bleibt über den Zeitraum vorteilhaft.'}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-primary">{labels.monthlyComparison}</h3>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Buying (Monthly)</div>
                  <div className="text-xl font-bold text-primary">{formatCurrency(data.initialMonthlyBuying)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Hausgeld {formatCurrency(hausgeld)} · Maintenance {formatCurrency(data.initialMonthlyMaintenance)}
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Renting (Monthly)</div>
                  <div className="text-lg font-semibold text-foreground">{formatCurrency(data.monthlyRent)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Monthly Difference</div>
                  <div className="text-lg font-semibold text-foreground">
                    {formatCurrency(Math.abs(monthlyDiff))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {monthlyDiff > 0
                      ? isEnglish
                        ? 'Renting is cheaper — difference invested.'
                        : 'Mieten ist günstiger — Differenz wird investiert.'
                      : isEnglish
                      ? 'Buying is cheaper — rent pays extra.'
                      : 'Kaufen ist günstiger — Miete ist teurer.'}
                  </div>
                </div>
              </div>
            </div>

            
          </div>
<div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-primary">{labels.chartTitle}</h3>
              <div className="mt-4 h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chartData}>
                    <defs>
                      <linearGradient id="buyFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1a4d2e" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#1a4d2e" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="rentFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2f9e44" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#2f9e44" stopOpacity={0.05} />
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
                    <Area type="monotone" dataKey="buying" stroke="#1a4d2e" fill="url(#buyFill)" name="Buying" />
                    <Area type="monotone" dataKey="renting" stroke="#2f9e44" fill="url(#rentFill)" name="Renting" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
<div className="rounded-2xl border border-border/60 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-primary">
                {labels.wealthComparison} ({data.holdingPeriod} {isEnglish ? 'years' : 'Jahre'})
              </h3>
              <div className="mt-4 grid gap-3">
                <div className="rounded-xl border border-border/60 bg-secondary/20 px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Buying Wealth</div>
                  <div className="text-xl font-bold text-primary">{formatCurrency(buyingWealthDisplay)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Renting Wealth</div>
                  <div className="text-lg font-semibold text-foreground">{formatCurrency(rentingWealthDisplay)}</div>
                </div>
                <div className="rounded-xl border border-border/60 bg-white px-4 py-3">
                  <div className="text-[11px] text-muted-foreground">Wealth Difference</div>
                  <div
                    className={`text-lg font-semibold ${
                      wealthDifferenceDisplay >= 0 ? 'text-primary' : 'text-emerald-600'
                    }`}
                  >
                    {formatSignedCurrency(wealthDifferenceDisplay)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 pt-4">
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

export default RentVsBuyCalculator
