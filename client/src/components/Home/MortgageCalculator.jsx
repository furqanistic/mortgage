// File: client/src/components/Home/MortgageCalculator.jsx
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
  Building,
  Calculator,
  Euro,
  Landmark,
  MapPin,
  PiggyBank,
  Scale,
  Users,
} from 'lucide-react'
import { useState } from 'react'

// German states tax
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
    state: 'Bayern',
    hasAgent: false,
    agentFee: 3.57,
    interestRate: 3.5,
  })

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const calculateMortgage = () => {
    setLoading(true)
    setError(null)
    setResults(null)

    if (!formData.salary || !formData.savings || !formData.propertyValue || !formData.state) {
      setError('Please fill in all required fields')
      setLoading(false)
      return
    }

    if (Number(formData.propertyValue) <= 0 || Number(formData.salary) <= 0) {
      setError('Values must be positive')
      setLoading(false)
      return
    }

    const propertyValue = Number(formData.propertyValue)
    const downPayment = Number(formData.savings)
    const annualIncome = Number(formData.salary)
    const monthlyIncome = annualIncome / 12
    const maxMonthlyPayment = monthlyIncome * 0.40 // 40% usually acceptable

    // Buying costs
    const notaryFee = propertyValue * 0.015
    const landRegistrationFee = propertyValue * 0.005
    const selectedState = GERMAN_STATES.find(s => s.name === formData.state)
    const propertyAcquisitionTax = propertyValue * (selectedState.tax / 100)
    const agentFee = formData.hasAgent ? propertyValue * (formData.agentFee / 100) : 0
    const totalBuyingCosts = notaryFee + landRegistrationFee + propertyAcquisitionTax + agentFee

    const totalCost = propertyValue + totalBuyingCosts
    const loanAmount = totalCost - downPayment

    const annualInterestRate = formData.interestRate / 100
    const monthlyInterestRate = annualInterestRate / 12
    const numberOfPayments = formData.duration * 12

    let monthlyPayment = 0
    let totalInterest = 0

    if (loanAmount > 0) {
        monthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
        totalInterest = monthlyPayment * numberOfPayments - loanAmount
    }

    setTimeout(() => {
      setResults({
        monthlyPayment: monthlyPayment.toFixed(2),
        loanAmount: Math.max(0, loanAmount).toFixed(2),
        propertyValue: propertyValue.toFixed(2),
        totalBuyingCosts: totalBuyingCosts.toFixed(2),
        notaryFee: notaryFee.toFixed(2),
        landRegistrationFee: landRegistrationFee.toFixed(2),
        propertyAcquisitionTax: propertyAcquisitionTax.toFixed(2),
        agentFee: agentFee.toFixed(2),
        totalCost: totalCost.toFixed(2),
        downPaymentPercentage: ((downPayment / totalCost) * 100).toFixed(1),
        isDownPaymentSufficient: true,
        isAffordable: loanAmount <= 0 || monthlyPayment <= maxMonthlyPayment,
        debtToIncomeRatio: monthlyIncome > 0 ? ((monthlyPayment / monthlyIncome) * 100).toFixed(1) : 0,
        totalInterest: totalInterest.toFixed(2),
        annualInterestRate: formData.interestRate,
        monthlyIncome: monthlyIncome.toFixed(2),
        isCashBuy: loanAmount <= 0
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className='relative min-h-screen bg-background py-12 md:py-24 overflow-hidden'> 
       {/* Background */}
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
       <div className='absolute inset-0 opacity-[0.02]' 
           style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
       />

      <div className='container mx-auto px-4 max-w-7xl relative z-10'>
        <div className='text-center mb-16'>
           <div className='inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-accent text-xs font-bold uppercase tracking-wider mb-4'>
             <Calculator className='w-4 h-4' /> Mortgage Calculator
           </div>
           <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-4'>Plan Your Investment</h2>
           <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
              Calculate your buying potential with real-time German market data.
           </p>
        </div>

        <div className='grid lg:grid-cols-12 gap-8 items-start'>
          {/* Form Side */}
           <div className='lg:col-span-5 space-y-4 md:space-y-6'>
             <Card className='border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300'>
                 <CardHeader className="border-b border-border/50 pb-4">
                     <CardTitle className="text-xl text-foreground flex items-center gap-2">
                        <Users className="w-5 h-5 text-accent" /> Your Profile
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-5">
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Property Value (€)</label>
                          <div className="relative">
                              <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input type="number" placeholder="500000" className="pl-9 bg-secondary/30" 
                                  value={formData.propertyValue} onChange={e => setFormData({...formData, propertyValue: e.target.value})} />
                          </div>
                      </div>
                      
                      <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Available Savings (€)</label>
                          <div className="relative">
                              <PiggyBank className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input type="number" placeholder="100000" className="pl-9 bg-secondary/30"
                                  value={formData.savings} onChange={e => setFormData({...formData, savings: e.target.value})} />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">Annual Salary (€)</label>
                          <div className="relative">
                              <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input type="number" placeholder="60000" className="pl-9 bg-secondary/30"
                                  value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground/80">State</label>
                          <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                              <Select value={formData.state} onValueChange={v => setFormData({...formData, state: v})}>
                                  <SelectTrigger className="pl-9 bg-secondary/30"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                      {GERMAN_STATES.map(s => <SelectItem key={s.name} value={s.name}>{s.name} ({s.tax}%)</SelectItem>)}
                                  </SelectContent>
                              </Select>
                          </div>
                      </div>
                 </CardContent>
             </Card>

             <Card className='border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300'>
                 <CardHeader className="border-b border-border/50 pb-4">
                     <CardTitle className="text-xl text-foreground flex items-center gap-2">
                        <Scale className="w-5 h-5 text-accent" /> Loan Details
                     </CardTitle>
                 </CardHeader>
                 <CardContent className="pt-6 space-y-5">
                      <div className="space-y-4">
                          <div className="flex justify-between">
                              <label className="text-sm font-medium text-foreground/80">Duration</label>
                              <span className="text-sm font-bold text-foreground">{formData.duration} Years</span>
                          </div>
                          <Slider value={[formData.duration]} min={5} max={35} step={1} onValueChange={v => setFormData({...formData, duration: v[0]})} 
                              className="py-2" />
                      </div>

                       <div className="space-y-2">
                          <div className="flex justify-between items-center">
                              <label className="text-sm font-medium text-foreground/80">Interest Rate (%)</label>
                              <span className="text-xs text-muted-foreground text-right block">Current Avg: 3.5%</span>
                          </div>
                          <Input type="number" step="0.1" value={formData.interestRate} onChange={e => setFormData({...formData, interestRate: Number(e.target.value)})} className="bg-secondary/30" />
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                          <label className="text-sm font-medium text-foreground/80 cursor-pointer" htmlFor="agent-toggle">Real Estate Agent?</label>
                          <Switch id="agent-toggle" checked={formData.hasAgent} onCheckedChange={c => setFormData({...formData, hasAgent: c})} />
                      </div>
                      
                      {formData.hasAgent && (
                           <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                              <label className="text-sm font-medium text-foreground/80">Agent Fee (%)</label>
                              <Input type="number" value={formData.agentFee} onChange={e => setFormData({...formData, agentFee: Number(e.target.value)})} className="bg-secondary/30" />
                           </div>
                      )}

                      {error && (
                         <Alert variant="destructive">
                             <AlertCircle className="h-4 w-4" />
                             <AlertDescription>{error}</AlertDescription>
                         </Alert>
                      )}

                      <Button onClick={calculateMortgage} disabled={loading} className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-[0.98]">
                          {loading ? 'Calculating...' : 'Calculate Now'} <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                 </CardContent>
             </Card>
          </div>

          {/* Results Side */}
          <div className='lg:col-span-7'>
             <AnimatePresence mode="wait">
                 {!results ? (
                     <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                        className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-secondary/20 rounded-3xl border-2 border-dashed border-border text-center text-muted-foreground"
                     >
                         <Calculator className="w-16 h-16 text-muted-foreground/20 mb-4" />
                         <p className="text-lg">Enter your details to generate a comprehensive analysis.</p>
                     </motion.div>
                 ) : (
                     <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                     >
                         {/* Mortgage Monthly Card */}
                          <div className="relative overflow-hidden rounded-3xl bg-primary dark:bg-[#0A0A0A] text-white p-6 md:p-8 border border-white/10 shadow-lg dark:shadow-none">
                             <div className="absolute top-0 right-0 p-32 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                             
                             <div className="relative z-10 text-center">
                                 <p className="text-primary-foreground/80 dark:text-muted-foreground font-medium mb-1">Estimated Monthly Payment</p>
                                 <div className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
                                     {results.isCashBuy ? '€0' : `€${Number(results.monthlyPayment).toLocaleString()}`}
                                 </div>
                                 <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${results.isCashBuy ? 'bg-green-500/20 border-green-500/30 text-green-100' : (results.isAffordable ? 'bg-green-500/20 border-green-500/30 text-green-100' : 'bg-red-500/20 border-red-500/30 text-red-100')}`}>
                                     {results.isCashBuy ? 'Full Cash Purchase (No Loan Needed)' : (results.isAffordable ? 'Affordable within 40% rule' : 'Exceeds recommended 40% income')}
                                 </div>
                             </div>
                         </div>

                         {/* Breakdown Grid */}
                         <div className="grid sm:grid-cols-2 gap-4">
                             <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border/60 shadow-sm">
                                <h4 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                                    <Building className="w-5 h-5 text-accent" /> Buying Costs
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Notary (1.5%)</span>
                                        <span className="font-medium">€{Number(results.notaryFee).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Land Registry (0.5%)</span>
                                        <span className="font-medium">€{Number(results.landRegistrationFee).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tax ({GERMAN_STATES.find(s=>s.name===formData.state).tax}%)</span>
                                        <span className="font-medium">€{Number(results.propertyAcquisitionTax).toLocaleString()}</span>
                                    </div>
                                    {Number(results.agentFee) > 0 && (
                                       <div className="flex justify-between">
                                           <span className="text-muted-foreground">Agent</span>
                                           <span className="font-medium">€{Number(results.agentFee).toLocaleString()}</span>
                                       </div>
                                    )}
                                    <div className="pt-3 border-t border-border mt-2 flex justify-between font-bold text-foreground">
                                        <span>Total Fees</span>
                                        <span>€{Number(results.totalBuyingCosts).toLocaleString()}</span>
                                    </div>
                                </div>
                             </div>

                             <div className="bg-white dark:bg-card p-6 rounded-2xl border border-border/60 shadow-sm">
                                <h4 className="flex items-center gap-2 font-semibold text-foreground mb-4">
                                    <Landmark className="w-5 h-5 text-accent" /> Loan Summary
                                </h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Property Price</span>
                                        <span className="font-medium">€{Number(results.propertyValue).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Down Payment</span>
                                        <span className="font-medium text-green-600">- €{Number(formData.savings).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Loan</span>
                                        <span className="font-medium">€{Number(results.loanAmount).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total Interest</span>
                                        <span className="font-medium text-destructive">€{Number(results.totalInterest).toLocaleString()}</span>
                                    </div>
                                    <div className="pt-3 border-t border-border mt-2 flex justify-between font-bold text-foreground">
                                        <span>Total Cost</span>
                                        <span>€{Number(results.totalCost).toLocaleString()}</span>
                                    </div>
                                </div>
                             </div>
                         </div>
                     </motion.div>
                 )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MortgageCalculator
