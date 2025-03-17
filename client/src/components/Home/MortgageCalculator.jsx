import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowRight,
  BarChart2,
  Building,
  Calculator,
  CheckCircle2,
  Clock,
  Euro,
  Home,
  Landmark,
  MapPin,
  PiggyBank,
  Scale,
  TrendingUp,
  Users,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

const WavePattern = () => (
  <div className='absolute inset-0 overflow-hidden pointer-events-none'>
    <svg
      className='absolute w-full opacity-5'
      viewBox='0 0 100 100'
      preserveAspectRatio='none'
    >
      <path d='M0,50 Q25,45 50,50 T100,50' stroke='currentColor' fill='none' />
      <path d='M0,60 Q25,65 50,60 T100,60' stroke='currentColor' fill='none' />
      <path d='M0,70 Q25,75 50,70 T100,70' stroke='currentColor' fill='none' />
    </svg>
  </div>
)

const FloatingElements = () => (
  <div className='absolute inset-0 overflow-hidden pointer-events-none'>
    <motion.div
      animate={{
        y: [0, -20, 0],
        rotate: [0, 5, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className='absolute top-20 right-20'
    >
      <div className='w-20 h-20 rounded-full bg-[#71C8DC]/10' />
    </motion.div>
    <motion.div
      animate={{
        y: [0, 20, 0],
        rotate: [0, -5, 0],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className='absolute bottom-40 left-20'
    >
      <div className='w-16 h-16 rounded-full bg-[#51A0D0]/10' />
    </motion.div>
  </div>
)

// German states with their property acquisition tax rates
const GERMAN_STATES = [
  { name: 'Baden-Württemberg', tax: 5.0 },
  { name: 'Bayern', tax: 3.5 },
  { name: 'Berlin', tax: 6.0 },
  { name: 'Brandenburg', tax: 6.5 },
  { name: 'Bremen', tax: 5.0 },
  { name: 'Hamburg', tax: 5.5 },
  { name: 'Hessen', tax: 6.0 },
  { name: 'Mecklenburg-Vorpommern', tax: 6.0 },
  { name: 'Niedersachsen', tax: 5.0 },
  { name: 'Nordrhein-Westfalen', tax: 6.5 },
  { name: 'Rheinland-Pfalz', tax: 5.0 },
  { name: 'Saarland', tax: 6.5 },
  { name: 'Sachsen', tax: 5.5 },
  { name: 'Sachsen-Anhalt', tax: 5.0 },
  { name: 'Schleswig-Holstein', tax: 6.5 },
  { name: 'Thüringen', tax: 5.0 },
]

const MortgageCalculator = () => {
  const [formData, setFormData] = useState({
    salary: '',
    savings: '',
    duration: 20,
    propertyValue: '',
    state: 'Bayern', // Default state
    hasAgent: false,
    agentFee: 3.57, // Default max agent fee
    interestRate: 3.0, // Default annual interest rate
  })

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const calculateMortgage = () => {
    setLoading(true)
    setError(null)
    setResults(null) // Reset results on new calculation

    if (
      !formData.salary ||
      !formData.savings ||
      !formData.propertyValue ||
      !formData.state
    ) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    // Validate numeric inputs are positive
    if (Number(formData.propertyValue) <= 0 || Number(formData.salary) <= 0) {
      setError('Property value and salary must be positive values')
      setLoading(false)
      return
    }

    // Validate down payment is not negative
    if (Number(formData.savings) < 0) {
      setError('Down payment cannot be negative')
      setLoading(false)
      return
    }

    // Validate interest rate is positive
    if (formData.interestRate <= 0) {
      setError('Interest rate must be greater than zero')
      setLoading(false)
      return
    }

    const propertyValue = Number(formData.propertyValue)
    const downPayment = Number(formData.savings)
    const annualIncome = Number(formData.salary)
    const monthlyIncome = annualIncome / 12
    const maxMonthlyPayment = monthlyIncome * 0.35

    // Calculate buying costs
    const notaryFee = propertyValue * 0.015 // 1.5% of property value
    const landRegistrationFee = propertyValue * 0.005 // 0.5% of property value

    // Find the selected state tax rate
    const selectedState = GERMAN_STATES.find(
      (state) => state.name === formData.state
    )
    const propertyAcquisitionTax = propertyValue * (selectedState.tax / 100)

    // Calculate agent fee if applicable
    const agentFee = formData.hasAgent
      ? propertyValue * (formData.agentFee / 100)
      : 0

    // Total buying costs
    const totalBuyingCosts =
      notaryFee + landRegistrationFee + propertyAcquisitionTax + agentFee

    // Calculate loan amount including buying costs
    const totalCost = propertyValue + totalBuyingCosts
    const loanAmount = totalCost - downPayment

    // Check if loan amount is negative (down payment exceeds total cost)
    if (loanAmount < 0) {
      setError(
        'Down payment exceeds the total cost. Please reduce your down payment or increase property value.'
      )
      setLoading(false)
      return
    }

    const minDownPayment = propertyValue * 0.2 // 20% of property value

    const annualInterestRate = formData.interestRate / 100
    const monthlyInterestRate = annualInterestRate / 12
    const numberOfPayments = formData.duration * 12

    const monthlyPayment =
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfPayments)) /
      (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)

    // Check if monthly payment is negative or invalid
    if (monthlyPayment <= 0 || !isFinite(monthlyPayment)) {
      setError('Invalid calculation result. Please check your input values.')
      setLoading(false)
      return
    }

    setTimeout(() => {
      setResults({
        monthlyPayment: monthlyPayment.toFixed(2),
        loanAmount: loanAmount.toFixed(2),
        propertyValue: propertyValue.toFixed(2),
        totalBuyingCosts: totalBuyingCosts.toFixed(2),
        notaryFee: notaryFee.toFixed(2),
        landRegistrationFee: landRegistrationFee.toFixed(2),
        propertyAcquisitionTax: propertyAcquisitionTax.toFixed(2),
        agentFee: agentFee.toFixed(2),
        totalCost: totalCost.toFixed(2),
        downPaymentPercentage: ((downPayment / totalCost) * 100).toFixed(1),
        isDownPaymentSufficient: downPayment >= minDownPayment,
        isAffordable: monthlyPayment <= maxMonthlyPayment,
        debtToIncomeRatio: ((monthlyPayment / monthlyIncome) * 100).toFixed(1),
        totalInterest: (monthlyPayment * numberOfPayments - loanAmount).toFixed(
          2
        ),
        annualInterestRate: formData.interestRate,
        totalPayment: (monthlyPayment * numberOfPayments).toFixed(2),
        monthlyIncome: monthlyIncome.toFixed(2),
      })
      setLoading(false)
    }, 1500)
  }

  return (
    <div className='relative min-h-screen bg-gradient-to-br from-[#155FA0] to-[#71C8DC] p-4 sm:p-6 md:p-12 overflow-x-hidden'>
      <WavePattern />
      <FloatingElements />

      <motion.div
        className='relative'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <motion.div
          className='text-center mb-12 md:mb-16 px-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white mb-6 shadow-lg'>
            <Calculator className='w-5 h-5' />
            <span className='font-medium'>Mortgage Calculator</span>
          </div>
          <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight'>
            Plan Your Dream Home
          </h1>
          <p className='text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed'>
            Get instant mortgage calculations based on German standards
          </p>
        </motion.div>

        <div className='grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto'>
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className='w-full'
          >
            <Card className='backdrop-blur-xl bg-white/95 overflow-hidden shadow-xl border-0'>
              <div className='absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#71C8DC] via-[#51A0D0] to-[#155FA0]' />
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-[#155FA0]'>
                  Calculate Your Mortgage
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-8 p-6'>
                {/* Section: Property Details */}
                <div className='bg-blue-50/50 p-4 rounded-lg border border-blue-100'>
                  <h3 className='font-medium text-[#155FA0] mb-4 flex items-center gap-2'>
                    <Home className='w-4 h-4' />
                    Property Details
                  </h3>
                  <div className='space-y-4'>
                    {/* Property Value */}
                    <div className='space-y-2'>
                      <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                        <label className='text-sm font-medium text-gray-700'>
                          Property Value
                        </label>
                        <span className='text-xs text-gray-500 mt-1 sm:mt-0'>
                          Recommended: €200,000 - €1,000,000
                        </span>
                      </div>
                      <div className='relative'>
                        <Euro className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4' />
                        <Input
                          type='number'
                          placeholder='Enter property value'
                          className='pl-10 focus:border-[#51A0D0] focus:ring-[#51A0D0]/20'
                          value={formData.propertyValue}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              propertyValue: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* State Selection */}
                    <div className='space-y-2'>
                      <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                        <label className='text-sm font-medium text-gray-700'>
                          State (Bundesland)
                        </label>
                        <span className='text-xs text-gray-500 mt-1 sm:mt-0'>
                          For property tax calculation
                        </span>
                      </div>
                      <div className='relative'>
                        <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 z-10' />
                        <Select
                          value={formData.state}
                          onValueChange={(value) =>
                            setFormData({ ...formData, state: value })
                          }
                        >
                          <SelectTrigger className='pl-10 focus:border-[#51A0D0] focus:ring-[#51A0D0]/20'>
                            <SelectValue placeholder='Select a state' />
                          </SelectTrigger>
                          <SelectContent className='max-h-60'>
                            {GERMAN_STATES.map((state) => (
                              <SelectItem key={state.name} value={state.name}>
                                {state.name} ({state.tax}%)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Financial Information */}
                <div className='bg-green-50/50 p-4 rounded-lg border border-green-100'>
                  <h3 className='font-medium text-[#155FA0] mb-4 flex items-center gap-2'>
                    <PiggyBank className='w-4 h-4' />
                    Financial Information
                  </h3>
                  <div className='space-y-4'>
                    {/* Salary */}
                    <div className='space-y-2'>
                      <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                        <label className='text-sm font-medium text-gray-700'>
                          Annual Salary
                        </label>
                        <span className='text-xs text-gray-500 mt-1 sm:mt-0'>
                          Before tax
                        </span>
                      </div>
                      <div className='relative'>
                        <Euro className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4' />
                        <Input
                          type='number'
                          placeholder='Enter your annual salary'
                          className='pl-10 focus:border-[#51A0D0] focus:ring-[#51A0D0]/20'
                          value={formData.salary}
                          onChange={(e) =>
                            setFormData({ ...formData, salary: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Down Payment */}
                    <div className='space-y-2'>
                      <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                        <label className='text-sm font-medium text-gray-700'>
                          Down Payment
                        </label>
                        <span className='text-xs text-gray-500 mt-1 sm:mt-0'>
                          Minimum 20% recommended
                        </span>
                      </div>
                      <div className='relative'>
                        <PiggyBank className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4' />
                        <Input
                          type='number'
                          placeholder='Available savings for down payment'
                          className='pl-10 focus:border-[#51A0D0] focus:ring-[#51A0D0]/20'
                          value={formData.savings}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              savings: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Additional Costs */}
                <div className='bg-amber-50/50 p-4 rounded-lg border border-amber-100'>
                  <h3 className='font-medium text-[#155FA0] mb-4 flex items-center gap-2'>
                    <Building className='w-4 h-4' />
                    Additional Costs
                  </h3>
                  <div className='space-y-4'>
                    {/* Agent/Broker Toggle */}
                    <div className='space-y-2'>
                      <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                        <label className='text-sm font-medium text-gray-700'>
                          Using a Real Estate Agent
                        </label>
                        <div className='flex items-center space-x-2 mt-1 sm:mt-0'>
                          <span className='text-xs text-gray-500'>No</span>
                          <Switch
                            checked={formData.hasAgent}
                            onCheckedChange={(checked) =>
                              setFormData({ ...formData, hasAgent: checked })
                            }
                            className='data-[state=checked]:bg-[#155FA0]'
                          />
                          <span className='text-xs text-gray-500'>Yes</span>
                        </div>
                      </div>
                      {formData.hasAgent && (
                        <div className='relative mt-2'>
                          <Users className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4' />
                          <Input
                            type='number'
                            placeholder='Agent fee percentage'
                            className='pl-10 focus:border-[#51A0D0] focus:ring-[#51A0D0]/20'
                            value={formData.agentFee}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                agentFee: parseFloat(e.target.value) || 3.57,
                              })
                            }
                            min='0'
                            max='7'
                            step='0.01'
                          />
                          <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                            %
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Interest Rate */}
                    <div className='space-y-2'>
                      <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                        <label className='text-sm font-medium text-gray-700'>
                          Annual Interest Rate
                        </label>
                        <span className='text-xs text-gray-500 mt-1 sm:mt-0'>
                          Current market rate: ~3.0%
                        </span>
                      </div>
                      <div className='relative'>
                        <Scale className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4' />
                        <Input
                          type='number'
                          placeholder='Interest rate'
                          className='pl-10 focus:border-[#51A0D0] focus:ring-[#51A0D0]/20'
                          value={formData.interestRate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              interestRate: parseFloat(e.target.value) || 3.0,
                            })
                          }
                          min='0.1'
                          max='10'
                          step='0.1'
                        />
                        <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'>
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Loan Terms */}
                <div className='bg-purple-50/50 p-4 rounded-lg border border-purple-100'>
                  <h3 className='font-medium text-[#155FA0] mb-4 flex items-center gap-2'>
                    <Clock className='w-4 h-4' />
                    Loan Terms
                  </h3>

                  {/* Loan Duration */}
                  <div className='space-y-4'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                      <div>
                        <label className='text-sm font-medium text-gray-700 block'>
                          Loan Duration
                        </label>
                        <span className='text-[#155FA0] font-semibold text-lg'>
                          {formData.duration} years
                        </span>
                      </div>
                      <span className='text-xs text-gray-500 mt-1 sm:mt-0'>
                        5-30 years
                      </span>
                    </div>
                    <div className='px-1'>
                      <Slider
                        value={[formData.duration]}
                        min={5}
                        max={30}
                        step={1}
                        className='w-full'
                        onValueChange={(value) =>
                          setFormData({ ...formData, duration: value[0] })
                        }
                      />
                      <div className='flex justify-between text-xs text-gray-500 mt-2'>
                        <span>5 years</span>
                        <span>30 years</span>
                      </div>
                    </div>
                  </div>
                </div>

                {error && (
                  <Alert variant='destructive' className='bg-red-50'>
                    <AlertCircle className='h-4 w-4 text-red-600' />
                    <AlertDescription className='text-red-600'>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {error && (
                  <Alert
                    variant='destructive'
                    className='bg-red-50 border border-red-200 shadow-sm animate-fadeIn'
                  >
                    <AlertCircle className='h-5 w-5 text-red-600' />
                    <AlertDescription className='text-red-600 ml-2 font-medium'>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className='pt-2'>
                  <Button
                    className='w-full bg-[#155FA0] hover:bg-[#51A0D0] text-white py-6 text-lg rounded-lg shadow-lg transition-all duration-300 relative overflow-hidden group'
                    onClick={calculateMortgage}
                    disabled={loading}
                  >
                    <span className='absolute inset-0 w-full h-full bg-gradient-to-r from-[#51A0D0] to-[#71C8DC] opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
                    {loading ? (
                      <div className='flex items-center gap-3 justify-center relative z-10'>
                        <div className='w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin' />
                        <span className='font-medium'>Calculating...</span>
                      </div>
                    ) : (
                      <div className='flex items-center justify-center gap-2 relative z-10'>
                        <Calculator className='w-5 h-5' />
                        <span className='font-medium'>Calculate Mortgage</span>
                        <ArrowRight className='w-5 h-5 ml-1 transition-transform duration-300 group-hover:translate-x-1' />
                      </div>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results */}
          <AnimatePresence mode='wait'>
            {results && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.5 }}
              >
                <Card className='backdrop-blur-xl bg-white/95 shadow-xl border-0 overflow-hidden'>
                  <div className='absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#71C8DC] via-[#51A0D0] to-[#155FA0]' />
                  <CardHeader className='pb-0'>
                    <CardTitle className='flex items-center gap-2 text-[#155FA0]'>
                      <Landmark className='w-6 h-6' />
                      Your Mortgage Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-8 p-6'>
                    {/* Monthly Payment */}
                    <div className='text-center p-6 bg-gradient-to-r from-[#155FA0] to-[#51A0D0] rounded-xl text-white shadow-lg relative overflow-hidden'>
                      <div className='absolute inset-0 opacity-20'>
                        <svg
                          viewBox='0 0 100 100'
                          preserveAspectRatio='none'
                          className='w-full h-full'
                        >
                          <path
                            d='M0,50 Q25,30 50,50 T100,50'
                            stroke='white'
                            strokeWidth='0.5'
                            fill='none'
                          />
                          <path
                            d='M0,70 Q25,50 50,70 T100,70'
                            stroke='white'
                            strokeWidth='0.5'
                            fill='none'
                          />
                        </svg>
                      </div>
                      <div className='relative z-10'>
                        <p className='text-sm font-medium mb-2'>
                          Estimated Monthly Payment
                        </p>
                        <p className='text-4xl sm:text-5xl font-bold tracking-tight'>
                          €{Number(results.monthlyPayment).toLocaleString()}
                        </p>
                        <p className='text-sm opacity-90 mt-2 flex items-center justify-center gap-1'>
                          <span
                            className={
                              Number(results.debtToIncomeRatio) <= 35
                                ? 'text-green-200'
                                : 'text-amber-200'
                            }
                          >
                            {(
                              (Number(results.monthlyPayment) /
                                Number(results.monthlyIncome)) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                          of monthly income
                        </p>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className='p-5 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100'>
                      <h3 className='text-base font-medium text-[#155FA0] mb-4 flex items-center gap-2'>
                        <Building className='w-4 h-4' />
                        Property Cost Breakdown
                      </h3>
                      <div className='space-y-3'>
                        <div className='flex justify-between items-center text-sm'>
                          <span className='text-gray-700'>Property Value</span>
                          <span className='font-medium bg-blue-50 text-[#155FA0] px-3 py-1 rounded-md'>
                            €{Number(results.propertyValue).toLocaleString()}
                          </span>
                        </div>

                        <div className='my-3 bg-gray-100 h-px'></div>
                        <p className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-2'>
                          Additional Costs
                        </p>

                        <div className='flex justify-between items-center text-sm'>
                          <div className='flex items-center gap-1'>
                            <span className='text-gray-700'>Notary</span>
                            <span className='text-xs text-gray-500'>
                              (1.5%)
                            </span>
                          </div>
                          <span className='font-medium'>
                            €{Number(results.notaryFee).toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <div className='flex items-center gap-1'>
                            <span className='text-gray-700'>
                              Land Registration
                            </span>
                            <span className='text-xs text-gray-500'>
                              (0.5%)
                            </span>
                          </div>
                          <span className='font-medium'>
                            €
                            {Number(
                              results.landRegistrationFee
                            ).toLocaleString()}
                          </span>
                        </div>
                        <div className='flex justify-between items-center text-sm'>
                          <div className='flex items-center gap-1'>
                            <span className='text-gray-700'>
                              Property Acquisition Tax
                            </span>
                            <span className='text-xs text-gray-500'>
                              (
                              {
                                GERMAN_STATES.find(
                                  (state) => state.name === formData.state
                                ).tax
                              }
                              %)
                            </span>
                          </div>
                          <span className='font-medium'>
                            €
                            {Number(
                              results.propertyAcquisitionTax
                            ).toLocaleString()}
                          </span>
                        </div>
                        {formData.hasAgent && (
                          <div className='flex justify-between items-center text-sm'>
                            <div className='flex items-center gap-1'>
                              <span className='text-gray-700'>Agent Fee</span>
                              <span className='text-xs text-gray-500'>
                                ({formData.agentFee}%)
                              </span>
                            </div>
                            <span className='font-medium'>
                              €{Number(results.agentFee).toLocaleString()}
                            </span>
                          </div>
                        )}
                        <div className='border-t border-gray-200 pt-3 flex justify-between items-center text-sm font-medium mt-3'>
                          <span className='text-gray-700'>
                            Total Buying Costs
                          </span>
                          <span className='bg-blue-100 text-[#155FA0] px-3 py-1 rounded-md'>
                            €{Number(results.totalBuyingCosts).toLocaleString()}
                          </span>
                        </div>
                        <div className='border-t-2 border-gray-300 pt-3 flex justify-between items-center font-medium mt-3'>
                          <span className='text-[#155FA0]'>
                            Total Purchase Cost
                          </span>
                          <span className='bg-[#155FA0] text-white px-3 py-1.5 rounded-md text-base'>
                            €{Number(results.totalCost).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Main Metrics */}
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                      <div className='p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl text-center shadow-sm border border-gray-100 transform transition-transform duration-300 hover:scale-105'>
                        <div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3'>
                          <Clock className='w-6 h-6 text-[#155FA0]' />
                        </div>
                        <p className='text-sm font-medium text-gray-600'>
                          Loan Duration
                        </p>
                        <p className='text-xl font-bold text-[#155FA0] mt-1'>
                          {formData.duration} Years
                        </p>
                      </div>
                      <div className='p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl text-center shadow-sm border border-gray-100 transform transition-transform duration-300 hover:scale-105'>
                        <div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3'>
                          <Scale className='w-6 h-6 text-[#155FA0]' />
                        </div>
                        <p className='text-sm font-medium text-gray-600'>
                          Interest Rate
                        </p>
                        <p className='text-xl font-bold text-[#155FA0] mt-1'>
                          {results.annualInterestRate}%
                        </p>
                      </div>
                      <div className='p-4 bg-gradient-to-b from-gray-50 to-white rounded-xl text-center shadow-sm border border-gray-100 transform transition-transform duration-300 hover:scale-105'>
                        <div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3'>
                          <TrendingUp className='w-6 h-6 text-[#155FA0]' />
                        </div>
                        <p className='text-sm font-medium text-gray-600'>
                          Total Interest
                        </p>
                        <p className='text-xl font-bold text-[#155FA0] mt-1'>
                          €{(Number(results.totalInterest) / 1000).toFixed(1)}k
                        </p>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className='space-y-6 bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl shadow-sm border border-gray-100'>
                      <h3 className='text-base font-medium text-[#155FA0] mb-4 flex items-center gap-2'>
                        <BarChart2 className='w-4 h-4' />
                        Financial Health Indicators
                      </h3>

                      <div className='space-y-4'>
                        <div className='space-y-2'>
                          <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                            <span className='text-sm font-medium text-gray-700'>
                              Down Payment Progress
                            </span>
                            <span
                              className={`text-sm font-medium px-2 py-0.5 rounded ${
                                Number(results.downPaymentPercentage) >= 20
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {results.downPaymentPercentage}% of total cost
                            </span>
                          </div>
                          <div className='relative mt-4 mb-6'>
                            <Progress
                              value={Number(results.downPaymentPercentage)}
                              className={`h-3 rounded-full bg-gray-200 ${
                                Number(results.downPaymentPercentage) >= 20
                                  ? 'text-green-500'
                                  : 'text-amber-500'
                              }`}
                            />
                            <div className='absolute -top-2 left-[20%] w-0.5 h-5 bg-gray-400' />
                            <div className='absolute -bottom-5 left-[19%] text-xs font-medium text-gray-600 bg-gray-100 px-1 rounded'>
                              20% recommended
                            </div>
                          </div>
                          <div className='flex justify-between items-center mt-2'>
                            <span
                              className={
                                results.isDownPaymentSufficient
                                  ? 'text-green-600 flex items-center gap-1 text-sm'
                                  : 'text-amber-600 flex items-center gap-1 text-sm'
                              }
                            >
                              {results.isDownPaymentSufficient ? (
                                <>
                                  <CheckCircle2 className='w-4 h-4' />
                                  Sufficient down payment
                                </>
                              ) : (
                                <>
                                  <AlertCircle className='w-4 h-4' />
                                  Consider higher down payment
                                </>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className='h-px bg-gray-200 my-4'></div>

                        <div className='space-y-2'>
                          <div className='flex flex-col sm:flex-row sm:items-center justify-between'>
                            <span className='text-sm font-medium text-gray-700'>
                              Monthly Payment Ratio
                            </span>
                            <span
                              className={`text-sm font-medium px-2 py-0.5 rounded ${
                                Number(results.debtToIncomeRatio) <= 35
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {results.debtToIncomeRatio}% of income
                            </span>
                          </div>
                          <div className='relative mt-4 mb-6'>
                            <Progress
                              value={Number(results.debtToIncomeRatio)}
                              className={`h-3 rounded-full bg-gray-200 ${
                                Number(results.debtToIncomeRatio) <= 35
                                  ? 'text-green-500'
                                  : 'text-amber-500'
                              }`}
                            />
                            <div className='absolute -top-2 left-[35%] w-0.5 h-5 bg-gray-400' />
                            <div className='absolute -bottom-5 left-[34%] text-xs font-medium text-gray-600 bg-gray-100 px-1 rounded'>
                              35% threshold
                            </div>
                          </div>
                          <div className='flex justify-between items-center mt-2'>
                            <span
                              className={
                                Number(results.debtToIncomeRatio) <= 35
                                  ? 'text-green-600 flex items-center gap-1 text-sm'
                                  : 'text-amber-600 flex items-center gap-1 text-sm'
                              }
                            >
                              {Number(results.debtToIncomeRatio) <= 35 ? (
                                <>
                                  <CheckCircle2 className='w-4 h-4' />
                                  Within recommended limit
                                </>
                              ) : (
                                <>
                                  <AlertCircle className='w-4 h-4' />
                                  Exceeds recommended limit
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Loan Breakdown */}
                    <div className='bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-sm border border-gray-100'>
                      <h3 className='text-base font-medium text-[#155FA0] mb-4 flex items-center gap-2'>
                        <Scale className='w-4 h-4' />
                        Loan Breakdown
                      </h3>
                      <div className='relative pt-2'>
                        <div className='flex justify-between items-center text-sm text-gray-700 mb-3'>
                          <span className='font-medium'>
                            Principal + Interest
                          </span>
                          <span className='font-semibold text-[#155FA0]'>
                            €{Number(results.totalPayment).toLocaleString()}
                          </span>
                        </div>
                        <div className='h-6 rounded-full overflow-hidden bg-gray-200 shadow-inner'>
                          <div
                            className='h-full bg-gradient-to-r from-[#155FA0] to-[#51A0D0] relative'
                            style={{
                              width: `${
                                (Number(results.loanAmount) /
                                  Number(results.totalPayment)) *
                                100
                              }%`,
                            }}
                          >
                            <span className='absolute inset-0 flex items-center justify-center text-xs font-medium text-white'>
                              Principal
                            </span>
                          </div>
                        </div>
                        <div className='flex justify-between text-xs text-gray-500 mt-1'>
                          <span>
                            Principal:{' '}
                            {(
                              (Number(results.loanAmount) /
                                Number(results.totalPayment)) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                          <span>
                            Interest:{' '}
                            {(
                              (Number(results.totalInterest) /
                                Number(results.totalPayment)) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm'>
                          <div className='bg-blue-50 p-4 rounded-lg'>
                            <p className='text-gray-700 font-medium mb-1'>
                              Principal Amount
                            </p>
                            <p className='font-bold text-lg text-[#155FA0]'>
                              €{Number(results.loanAmount).toLocaleString()}
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>
                              Amount borrowed from the bank
                            </p>
                          </div>
                          <div className='bg-blue-50 p-4 rounded-lg'>
                            <p className='text-gray-700 font-medium mb-1'>
                              Total Interest
                            </p>
                            <p className='font-bold text-lg text-[#51A0D0]'>
                              €{Number(results.totalInterest).toLocaleString()}
                            </p>
                            <p className='text-xs text-gray-500 mt-1'>
                              Cost of borrowing over {formData.duration} years
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Final Assessment */}
                    <div
                      className={
                        results.isAffordable
                          ? 'bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm'
                          : 'bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm'
                      }
                    >
                      <div className='flex items-start gap-3'>
                        <div
                          className={
                            results.isAffordable
                              ? 'flex-shrink-0 bg-green-100 p-2 rounded-full'
                              : 'flex-shrink-0 bg-amber-100 p-2 rounded-full'
                          }
                        >
                          {results.isAffordable ? (
                            <CheckCircle2 className='h-6 w-6 text-green-600' />
                          ) : (
                            <AlertCircle className='h-6 w-6 text-amber-600' />
                          )}
                        </div>
                        <div>
                          <h4
                            className={
                              results.isAffordable
                                ? 'font-semibold text-green-800 mb-1 text-lg'
                                : 'font-semibold text-amber-800 mb-1 text-lg'
                            }
                          >
                            {results.isAffordable
                              ? 'Mortgage Appears Affordable'
                              : 'Potential Budget Concerns'}
                          </h4>
                          <p
                            className={
                              results.isAffordable
                                ? 'text-green-700'
                                : 'text-amber-700'
                            }
                          >
                            {results.isAffordable
                              ? 'Based on your income and savings, this mortgage appears affordable. Consider scheduling a consultation for personalized advice.'
                              : 'This mortgage may stretch your monthly budget. Consider adjusting the loan amount or increasing your down payment for better affordability.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

export default MortgageCalculator
