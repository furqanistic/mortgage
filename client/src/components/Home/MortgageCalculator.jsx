// File: client/src/components/Home/MortgageCalculator.jsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
    Pencil,
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
    propertyValue: 500000,
    state: 'Bayern',
    hasAgent: false,
    agentFee: 3.57,
    interestRate: 3.5,
  })

  // Formatters
  const formatNumber = (num) => {
    if (num === '' || num === undefined || num === null) return ''
    const parts = num.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  const parseNumber = (str) => {
    return str.toString().replace(/,/g, '')
  }

  const handleInputChange = (field, value) => {
    const rawValue = parseNumber(value)
    if (rawValue === '' || !isNaN(rawValue)) {
      setFormData(prev => ({ ...prev, [field]: rawValue }))
    }
  }

  const [results, setResults] = useState(null)
  
  // Real-time calculation effect
  const calculate = () => {
    const propertyValue = Number(formData.propertyValue)
    const downPayment = Number(formData.savings)
    
    // Buying costs
    const notaryFee = propertyValue * 0.02 // 2.0% covers Notary + Land Registry
    const selectedState = GERMAN_STATES.find(s => s.name === formData.state)
    const propertyAcquisitionTax = propertyValue * (selectedState.tax / 100)
    const agentFee = formData.hasAgent ? propertyValue * (formData.agentFee / 100) : 0
    const totalBuyingCosts = notaryFee + propertyAcquisitionTax + agentFee

    const totalCost = propertyValue + totalBuyingCosts
    const loanAmount = Math.max(0, totalCost - downPayment)

    const annualInterestRate = formData.interestRate / 100
    const monthlyInterestRate = annualInterestRate / 12

    // Monthly payment calculation removed since duration is gone
    // We will show 0 or hide it if we only care about acquisition costs now
    let monthlyPayment = 0

    return {
        monthlyPayment: monthlyPayment.toFixed(0),
        loanAmount: loanAmount.toFixed(0),
        totalBuyingCosts: totalBuyingCosts.toFixed(0),
        totalCost: totalCost.toFixed(0),
        buyingCosts: {
            tax: propertyAcquisitionTax,
            notary: notaryFee,
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
                 Plan Your <br /><span className='text-[#155FA0]'>Investment</span>
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
                     <div className='group space-y-3'>
                        <label className='flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                           Buying Price
                           <div className='flex items-center gap-2 text-foreground bg-secondary/30 px-3 py-1.5 rounded-xl border border-border group-hover:border-accent/50 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all cursor-text'>
                              <Pencil className='w-3 h-3 text-muted-foreground' />
                              <div className='flex items-center gap-1'>
                                 <span>€</span>
                                 <input 
                                    type="text" 
                                    value={formatNumber(formData.propertyValue)} 
                                    onChange={e => handleInputChange('propertyValue', e.target.value)}
                                    className='w-24 bg-transparent border-none outline-none text-right font-bold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                 />
                              </div>
                           </div>
                        </label>
                        <Slider 
                           value={[Number(formData.propertyValue)]} 
                           min={100000} max={2000000} step={10000} 
                           onValueChange={v => setFormData({...formData, propertyValue: v[0]})} 
                           className='py-2'
                        />
                     </div>

                    {/* Savings */}
                     <div className='group space-y-3'>
                        <label className='flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground'>
                           Down Payment
                           <div className='flex items-center gap-2 text-accent bg-secondary/30 px-3 py-1.5 rounded-xl border border-border group-hover:border-accent/50 focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all cursor-text'>
                              <Pencil className='w-3 h-3 text-muted-foreground/50' />
                              <div className='flex items-center gap-1'>
                                 <span>€</span>
                                 <input 
                                    type="text" 
                                    value={formatNumber(formData.savings)} 
                                    onChange={e => handleInputChange('savings', e.target.value)}
                                    className='w-24 bg-transparent border-none outline-none text-right font-bold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                                 />
                              </div>
                           </div>
                        </label>
                        <Slider 
                           value={[Number(formData.savings)]} 
                           min={0} max={Number(formData.propertyValue)} step={5000} 
                           onValueChange={v => setFormData({...formData, savings: v[0]})} 
                           className='py-2'
                        />
                     </div>
                    
                     {/* Income removed */}

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

                  {formData.hasAgent && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      className='group space-y-1.5'
                    >
                        <div className='flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>
                          <span>Agent Fee</span>
                          <div className='flex items-center gap-2 text-foreground bg-background/50 px-2 py-1 rounded-lg border border-border/50 group-hover:border-accent/50 focus-within:border-accent transition-all cursor-text'>
                            <Pencil className='w-2.5 h-2.5 text-muted-foreground/50' />
                            <div className='flex items-center gap-1'>
                              <input 
                                 type="text" 
                                 value={formData.agentFee} 
                                 onChange={e => {
                                    const val = e.target.value;
                                    if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                                       setFormData(prev => ({ ...prev, agentFee: val }));
                                    }
                                 }}
                                 className='w-10 bg-transparent border-none outline-none text-right font-bold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                              />
                              <span>%</span>
                            </div>
                          </div>
                        </div>
                        <Slider value={[Number(formData.agentFee)]} min={0.1} max={7} step={0.01} onValueChange={v => setFormData({...formData, agentFee: v[0]})} />
                    </motion.div>
                  )}
                  
                   <div className='group space-y-1.5'>
                       <div className='flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground'>
                         <span>Interest Rate</span>
                         <div className='flex items-center gap-2 text-foreground bg-background/50 px-2 py-1 rounded-lg border border-border/50 group-hover:border-accent/50 focus-within:border-accent transition-all cursor-text'>
                           <Pencil className='w-2.5 h-2.5 text-muted-foreground/50' />
                           <div className='flex items-center gap-1'>
                             <input 
                                type="text" 
                                value={formData.interestRate} 
                                onChange={e => {
                                   const val = e.target.value;
                                   if (val === '' || /^[0-9]*\.?[0-9]*$/.test(val)) {
                                      setFormData(prev => ({ ...prev, interestRate: val }));
                                   }
                                }}
                                className='w-10 bg-transparent border-none outline-none text-right font-bold p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                             />
                             <span>%</span>
                           </div>
                         </div>
                       </div>
                       <Slider value={[Number(formData.interestRate)]} min={0.1} max={10} step={0.1} onValueChange={v => setFormData({...formData, interestRate: v[0]})} />
                   </div>
              </div>
           </div>

           {/* Visualization Dashboard */}
           <div className='lg:col-span-8 space-y-4'>
              {/* Main Result Card */}
              <div className='bg-[#155FA0] text-primary-foreground rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl'>
                 <div className='absolute top-0 right-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none' />
                 
                 <div className='relative z-10 grid md:grid-cols-2 gap-12 items-end'>
                    <div className='space-y-2'>
                       <p className='text-sm font-bold text-primary-foreground/60 uppercase tracking-widest whitespace-nowrap'>Total Cost of Acquisition</p>
                        <div className='flex items-baseline gap-1'>
                           <span className='text-6xl md:text-7xl font-heading font-black tracking-tighter text-white'>
                              €{Number(data.totalCost).toLocaleString()}
                           </span>
                        </div>
                    </div>

                    <div className='space-y-4'>
                       <div className='flex justify-between items-end border-b border-white/10 pb-2'>
                          <span className='text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest'>Loan Amount</span>
                          <span className='text-xl font-black text-white'>€{Number(data.loanAmount).toLocaleString()}</span>
                       </div>
                        <div className='flex justify-between items-end border-b border-white/10 pb-2'>
                           <span className='text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest'>Interest Rate</span>
                           <span className='text-xl font-black text-blue-400'>{Number(formData.interestRate).toFixed(2)}%</span>
                        </div>
                       <div className='flex justify-between items-end border-b border-white/10 pb-2'>
                          <span className='text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest'>Notary (2.0%)</span>
                          <span className='text-xl font-black text-white'>€{(data.buyingCosts.notary).toLocaleString()}</span>
                       </div>
                       <div className='flex justify-between items-end border-b border-white/10 pb-2'>
                          <span className='text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest'>Tax ({GERMAN_STATES.find(s => s.name === formData.state).tax}%)</span>
                          <span className='text-xl font-black text-white'>€{(data.buyingCosts.tax).toLocaleString()}</span>
                       </div>
                       <div className={`flex justify-between items-end border-b border-white/10 pb-2 ${!formData.hasAgent && 'opacity-40'}`}>
                          <span className='text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest'>Agent {formData.hasAgent && `(${Number(formData.agentFee).toFixed(2)}%)`}</span>
                          <span className='text-xl font-black text-white'>€{(data.buyingCosts.agent).toLocaleString()}</span>
                       </div>
                       <div className='flex justify-between items-end pt-2'>
                          <span className='text-[10px] font-bold text-primary-foreground/60 uppercase tracking-widest'>Total Fees</span>
                          <span className='text-xl font-black text-[#FAC51C]'>€{Number(data.totalBuyingCosts).toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  )
}

export default MortgageCalculator
