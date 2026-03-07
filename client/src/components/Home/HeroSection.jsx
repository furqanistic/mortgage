import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HeroSection = ({ language = 'de' }) => {
  const navigate = useNavigate()
  const [monthlyIncome, setMonthlyIncome] = useState(3500)
  const [downPayment, setDownPayment] = useState(50000)

  const isEnglish = language === 'en'
  const locale = isEnglish ? 'en-US' : 'de-DE'

  const estimatedLoanAmount = useMemo(() => {
    const interestRate = 4
    const repaymentRate = 2
    const maxPaymentPercent = 35
    const totalRate = interestRate + repaymentRate
    const maxMonthlyPayment = (monthlyIncome * maxPaymentPercent) / 100
    const annualPayment = maxMonthlyPayment * 12
    const maxLoan = totalRate > 0 ? annualPayment / (totalRate / 100) : 0
    return Math.max(0, Math.round(maxLoan))
  }, [monthlyIncome])

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)

  const copy = isEnglish
    ? {
        title: 'Your Dream Home is Within Reach',
        calculatorTitle: 'Affordability Calculator',
        income: 'Monthly Income (€)',
        downPayment: 'Down Payment (€)',
        incomePlaceholder: 'e.g., 3,500',
        downPaymentPlaceholder: 'e.g., 50,000',
        estimateLabel: 'Estimated Loan Amount',
        ctaPrimary: 'Open Full Calculator',
        imageAlt: 'Happy family in front of their new home',
        trust: [
          { value: '500+', label: 'Happy Clients' },
          { value: '4.9/5', label: 'Client Rating' },
          { value: '100+', label: 'Bank Partners' },
        ],
      }
    : {
        title: 'Ihr Traumhaus ist in Reichweite',
        calculatorTitle: 'Erschwinglichkeitsrechner',
        income: 'Monatliches Einkommen (€)',
        downPayment: 'Eigenkapital (€)',
        incomePlaceholder: 'z. B. 3.500',
        downPaymentPlaceholder: 'z. B. 50.000',
        estimateLabel: 'Geschätzte Darlehenssumme',
        ctaPrimary: 'Vollständigen Rechner öffnen',
        imageAlt: 'Glückliche Familie vor ihrem neuen Zuhause',
        trust: [
          { value: '500+', label: 'Zufriedene Kunden' },
          { value: '4.9/5', label: 'Kundenbewertung' },
          { value: '100+', label: 'Banken Partner' },
        ],
      }

  return (
    <section className="bg-[#f8f8f5] pt-8 pb-14 md:pt-12 md:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[26px] border border-[#e6e8e2] bg-white px-4 py-8 shadow-[0_10px_40px_rgba(17,24,39,0.06)] sm:px-8 lg:px-10 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.95fr] lg:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <h1 className="font-heading text-4xl font-bold leading-[1.1] text-primary sm:text-5xl lg:text-7xl">
                {copy.title}
              </h1>

              <div className="mt-6 rounded-3xl border border-[#dde2da] bg-white p-5 shadow-[0_12px_24px_rgba(15,47,36,0.08)] sm:p-6">
                <h3 className="text-2xl font-semibold text-[#1f2937]">{copy.calculatorTitle}</h3>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#2b3340]">{copy.income}</span>
                    <input
                      type="number"
                      min={0}
                      step={100}
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value || 0))}
                      placeholder={copy.incomePlaceholder}
                      className="h-12 w-full rounded-xl border border-[#c9d1c7] bg-white px-4 text-base text-[#1f2937] outline-none transition focus:border-[#0c6a40] focus:ring-2 focus:ring-[#0c6a40]/20"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#2b3340]">{copy.downPayment}</span>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value || 0))}
                      placeholder={copy.downPaymentPlaceholder}
                      className="h-12 w-full rounded-xl border border-[#c9d1c7] bg-white px-4 text-base text-[#1f2937] outline-none transition focus:border-[#0c6a40] focus:ring-2 focus:ring-[#0c6a40]/20"
                    />
                  </label>
                </div>

                <p className="mt-4 text-center text-lg text-[#2f3744]">
                  {copy.estimateLabel}:{' '}
                  <span className="font-bold text-[#101827]">{formatCurrency(estimatedLoanAmount)}</span>
                </p>

                <button
                  type="button"
                  onClick={() => navigate('/tools?tab=calculators&calculator=affordability')}
                  className="mt-4 h-12 w-full rounded-xl bg-gradient-to-r from-[#0f8a4a] to-[#0b6f3e] text-base font-semibold text-white shadow-[0_10px_20px_rgba(15,138,74,0.28)] transition hover:brightness-105"
                >
                  {copy.ctaPrimary}
                </button>

                <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  {copy.trust.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-[#dde2da] bg-[#f8fbf7] px-2 py-3 text-center sm:px-3"
                    >
                      <div className="text-base font-bold text-[#0f2f24] sm:text-lg">{item.value}</div>
                      <div className="text-[11px] text-[#64748b] sm:text-xs">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 26 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.12 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-[30px] border border-[#dfe4db] bg-[#eef2eb] shadow-[0_12px_28px_rgba(17,24,39,0.12)]">
                <img
                  src="/family-in-berlin.png"
                  alt={copy.imageAlt}
                  className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[460px]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default HeroSection
