// File: client/src/components/Home/MortgageCalculator.jsx
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { AnimatePresence, motion } from 'framer-motion'
import {
    ArrowRight,
    Building,
    Calculator,
    CheckCircle,
    Euro,
    Info,
    Landmark,
    MapPin,
    Percent,
    RefreshCcw,
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
    salary: 60000,
    savings: 100000,
    duration: 20,
    propertyValue: 500000,
    state: 'Bayern',
    hasAgent: false,
    agentFee: 3.57,
    interestRate: 3.5,
  })

  const [results, setResults] = useState(null)
  
  // Real-time calculation effect
  const calculate = () => {
    const propertyValue = Number(formData.propertyValue)
    const downPayment = Number(formData.savings)
    const annualIncome = Number(formData.salary)
    const monthlyIncome = annualIncome / 12
    const maxMonthlyPayment = monthlyIncome * 0.40

    // Buying costs
    const notaryFee = propertyValue * 0.015
    const landRegistrationFee = propertyValue * 0.005
    const selectedState = GERMAN_STATES.find(s => s.name === formData.state)
    const propertyAcquisitionTax = propertyValue * (selectedState.tax / 100)
    const agentFee = formData.hasAgent ? propertyValue * (formData.agentFee / 100) : 0
    const totalBuyingCosts = notaryFee + landRegistrationFee + propertyAcquisitionTax + agentFee

    const totalCost = propertyValue + totalBuyingCosts
    const loanAmount = Math.max(0, totalCost - downPayment)

    const annualInterestRate = formData.interestRate / 100
    const monthlyInterestRate = annualInterestRate / 12
    const numberOfPayments = formData.duration * 12

    let monthlyPayment = 0
    let totalInterest = 0

    if (loanAmount > 0) {
        monthlyPayment = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1)
        totalInterest = monthlyPayment * numberOfPayments - loanAmount
    }

    return {
        monthlyPayment: monthlyPayment.toFixed(0),
        loanAmount: loanAmount.toFixed(0),
        totalBuyingCosts: totalBuyingCosts.toFixed(0),
        totalCost: totalCost.toFixed(0),
        isAffordable: monthlyPayment <= maxMonthlyPayment,
        buyingCosts: {
            tax: propertyAcquisitionTax,
            notary: notaryFee + landRegistrationFee,
            agent: agentFee
        }
    }
  }

  const data = calculate()

  return (
    <section className='relative py-20 bg-background overflow-hidden border-b border-border/50'> 
       {/* Background */}
       <div className='absolute inset-0 opacity-[0.03] pointer-events-none' 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
       />

      <div className='max-w-7xl mx-auto px-6 lg:px-8 relative z-10'>
        <div className='flex flex-col md:flex-row items-end justify-between gap-8 mb-16'>
           <div className='space-y-4'>
               <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className='inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-accent text-[10px] font-bold uppercase tracking-widest border border-accent/20'>
                 <Calculator className='w-3 h-3' /> Financial Engineering
               </motion.div>
               <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className='text-4xl md:text-6xl font-heading font-black tracking-tighter text-foreground leading-[0.9]'>
                 Plan Your <br /><span className='text-accent'>Investment</span>
               </motion.h2>
           </div>
           
           <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className='text-muted-foreground font-medium max-w-sm text-sm text-right hidden md:block'>
              Real-time mortgage simulation with current <br /> German market variables and tax rates.
           </motion.p>
        </div>

        <div className='grid lg:grid-cols-12 gap-8 items-start'>
           {/* Control Panel */}
           <div className='lg:col-span-4 space-y-3'>
              <div className='bg-card border border-border rounded-[2rem] p-6 shadow-xl'>
                 <div className='space-y-6'>
                    
                    {/* Property Price */}
                    <div className='space-y-3'>
                       <label className='flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                          Property Value
                          <span className='text-foreground'>€{Number(formData.propertyValue).toLocaleString()}</span>
                       </label>
                       <Slider 
                          value={[Number(formData.propertyValue)]} 
                          min={100000} max={2000000} step={10000} 
                          onValueChange={v => setFormData({...formData, propertyValue: v[0]})} 
                          className='py-2'
                       />
                    </div>

                    {/* Savings */}
                    <div className='space-y-3'>
                       <label className='flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                          Down Payment
                          <span className='text-accent'>€{Number(formData.savings).toLocaleString()}</span>
                       </label>
                       <Slider 
                          value={[Number(formData.savings)]} 
                          min={0} max={Number(formData.propertyValue)} step={5000} 
                          onValueChange={v => setFormData({...formData, savings: v[0]})} 
                          className='py-2'
                       />
                    </div>
                    
                    {/* Income */}
                    <div className='space-y-3'>
                       <label className='flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                          Gross Annual Income
                          <span className='text-foreground'>€{Number(formData.salary).toLocaleString()}</span>
                       </label>
                       <Slider 
                          value={[Number(formData.salary)]} 
                          min={30000} max={300000} step={1000} 
                          onValueChange={v => setFormData({...formData, salary: v[0]})} 
                          className='py-2'
                       />
                    </div>

                 </div>
              </div>

              {/* Toggles Panel */}
              <div className='bg-secondary/30 border border-border rounded-[2rem] p-6 space-y-5'>
                  <div className='space-y-1.5'>
                      <label className='text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>Region</label>
                      <select 
                        title="state"
                        value={formData.state} 
                        onChange={e => setFormData({...formData, state: e.target.value})}
                        className='w-full h-10 bg-background rounded-xl px-3 text-sm font-bold border-none outline-none focus:ring-1 focus:ring-accent'
                      >
                         {GERMAN_STATES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      </select>
                  </div>

                  <div className='flex items-center justify-between'>
                      <span className='text-sm font-bold text-foreground'>Real Estate Agent</span>
                      <Switch checked={formData.hasAgent} onCheckedChange={c => setFormData({...formData, hasAgent: c})} />
                  </div>
                  
                  <div className='space-y-1.5'>
                      <div className='flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>
                        <span>Duration</span>
                        <span>{formData.duration} Years</span>
                      </div>
                      <Slider value={[formData.duration]} min={5} max={35} step={5} onValueChange={v => setFormData({...formData, duration: v[0]})} />
                  </div>
              </div>
           </div>

           {/* Visualization Dashboard */}
           <div className='lg:col-span-8 space-y-4'>
              {/* Main Result Card */}
              <div className='bg-primary text-primary-foreground rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl'>
                 <div className='absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none' />
                 
                 <div className='relative z-10 grid md:grid-cols-2 gap-12 items-end'>
                    <div className='space-y-2'>
                       <p className='text-sm font-bold text-primary-foreground/60 uppercase tracking-widest'>Est. Monthly Rate</p>
                       <div className='flex items-baseline gap-1'>
                          <span className='text-6xl md:text-7xl font-heading font-black tracking-tighter text-white'>
                             €{Number(data.monthlyPayment).toLocaleString()}
                          </span>
                       </div>
                       <div className='flex items-center gap-2 mt-2'>
                          <div className={`w-2 h-2 rounded-full ${data.isAffordable ? 'bg-green-400' : 'bg-red-400'}`} />
                          <span className={`text-xs font-bold uppercase tracking-wide ${data.isAffordable ? 'text-green-400' : 'text-red-400'}`}>
                             {data.isAffordable ? 'Healthy Ratio' : 'High Risk Ratio'}
                          </span>
                       </div>
                    </div>

                    <div className='space-y-6'>
                       <div className='flex justify-between items-end border-b border-white/10 pb-4'>
                          <span className='text-xs font-bold text-primary-foreground/60 uppercase tracking-widest'>Loan Amount</span>
                          <span className='text-2xl font-black text-white'>€{Number(data.loanAmount).toLocaleString()}</span>
                       </div>
                       <div className='flex justify-between items-end border-b border-white/10 pb-4'>
                          <span className='text-xs font-bold text-primary-foreground/60 uppercase tracking-widest'>Interest Rate</span>
                          <span className='text-2xl font-black text-blue-400'>{formData.interestRate}%</span>
                       </div>
                       <div className='flex justify-between items-end border-b border-white/10 pb-4'>
                          <span className='text-xs font-bold text-primary-foreground/60 uppercase tracking-widest'>Total Capital</span>
                          <span className='text-2xl font-black text-white'>€{Number(data.totalCost).toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Buying Costs Breakdown */}
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                 <div className='bg-card border border-border rounded-3xl p-5 text-center space-y-1 hover:border-accent/30 transition-colors'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>Notary</p>
                    <p className='text-lg font-bold'>€{(data.buyingCosts.notary).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                 </div>
                 <div className='bg-card border border-border rounded-3xl p-5 text-center space-y-1 hover:border-accent/30 transition-colors'>
                    <p className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>Tax ({GERMAN_STATES.find(s => s.name === formData.state).tax}%)</p>
                    <p className='text-lg font-bold'>€{(data.buyingCosts.tax).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                 </div>
                 <div className={`bg-card border border-border rounded-3xl p-5 text-center space-y-1 transition-colors ${formData.hasAgent ? 'opacity-100' : 'opacity-40'}`}>
                    <p className='text-[10px] font-black uppercase tracking-widest text-muted-foreground'>Agent</p>
                    <p className='text-lg font-bold'>€{(data.buyingCosts.agent).toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                 </div>
                 <div className='bg-accent text-accent-foreground rounded-3xl p-5 text-center space-y-1 cursor-pointer hover:bg-accent/90'>
                    <p className='text-[10px] font-black uppercase tracking-widest opacity-80'>Total Fees</p>
                    <p className='text-lg font-black'>€{Number(data.totalBuyingCosts).toLocaleString()}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}

export default MortgageCalculator
