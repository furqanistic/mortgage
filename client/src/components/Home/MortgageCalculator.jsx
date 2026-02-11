// File: client/src/components/Home/MortgageCalculator.jsx
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { useState, useEffect } from 'react'

const MortgageCalculator = () => {
   const [income, setIncome] = useState(5000)
   const [equity, setEquity] = useState(50000)
   const [loan, setLoan] = useState(300000)
   const [term, setTerm] = useState(25)
   const [monthlyRate, setMonthlyRate] = useState(0)
   const [totalCost, setTotalCost] = useState(0)

   // Assumed interest rate
   const interestRate = 0.035 // 3.5%

   useEffect(() => {
      // Mortgage Calculation Formula: M = P[r(1+r)^n]/[(1+r)^n-1]
      const monthlyInterest = interestRate / 12
      const numberOfPayments = term * 12

      // Only calculate if loan > 0
      if (loan > 0) {
         const x = Math.pow(1 + monthlyInterest, numberOfPayments)
         const monthly = (loan * x * monthlyInterest) / (x - 1)

         setMonthlyRate(monthly)
         setTotalCost(monthly * numberOfPayments)
      } else {
         setMonthlyRate(0)
         setTotalCost(0)
      }
   }, [loan, term, interestRate])

   const formatCurrency = (value) => {
      return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
   }

   return (
      <section className="py-20 relative overflow-hidden bg-gradient-to-br from-primary to-[#0f2919] text-white">
         {/* Background Decoration */}
         <div className="absolute top-[-50%] left-[-20%] w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
               <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 text-white">
                  Wie viel Haus können Sie sich leisten?
               </h2>
               <p className="text-white/80 text-lg">
                  Nutzen Sie unseren Rechner für eine erste Einschätzung Ihres Budgets
               </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden text-foreground">
               <div className="p-8 md:p-12">
                  <div className="grid gap-8 mb-8">
                     {/* Income Slider */}
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-semibold">
                           <label>Monatliches Nettoeinkommen</label>
                           <span className="text-primary dark:text-accent font-bold text-lg">{formatCurrency(income)}</span>
                        </div>
                        <Slider
                           value={[income]}
                           onValueChange={(val) => setIncome(val[0])}
                           min={2000}
                           max={15000}
                           step={500}
                           className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                           <span>€2.000</span>
                           <span>€15.000</span>
                        </div>
                     </div>

                     {/* Equity Input */}
                     <div className="space-y-4">
                        <label className="text-sm font-semibold block">Vorhandenes Eigenkapital (€)</label>
                        <input
                           type="number"
                           value={equity}
                           onChange={(e) => setEquity(Number(e.target.value))}
                           className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all dark:bg-slate-950 dark:border-slate-800"
                           placeholder="z.B. 50000"
                        />
                     </div>

                     {/* Loan Slider */}
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-semibold">
                           <label>Gewünschte Kreditsumme</label>
                           <span className="text-primary dark:text-accent font-bold text-lg">{formatCurrency(loan)}</span>
                        </div>
                        <Slider
                           value={[loan]}
                           onValueChange={(val) => setLoan(val[0])}
                           min={100000}
                           max={1000000}
                           step={10000}
                           className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                           <span>€100k</span>
                           <span>€1M</span>
                        </div>
                     </div>

                     {/* Term Slider */}
                     <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-semibold">
                           <label>Laufzeit (Jahre)</label>
                           <span className="text-primary dark:text-accent font-bold text-lg">{term} Jahre</span>
                        </div>
                        <Slider
                           value={[term]}
                           onValueChange={(val) => setTerm(val[0])}
                           min={10}
                           max={35}
                           step={5}
                           className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                           <span>10</span>
                           <span>35</span>
                        </div>
                     </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary to-[#0f2919] rounded-xl p-8 text-white shadow-lg">
                     <h3 className="font-heading text-xl font-semibold mb-6 text-center border-b border-white/20 pb-4">
                        Ihre geschätzte Finanzierung
                     </h3>

                     <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                           <span className="opacity-90">Monatliche Rate</span>
                           <span className="text-2xl font-bold">{formatCurrency(monthlyRate)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/10">
                           <span className="opacity-90">Gesamtkosten</span>
                           <span className="text-xl font-semibold">{formatCurrency(totalCost)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 text-accent">
                           <span className="opacity-90">Empfohlener Kaufpreis</span>
                           <span className="text-xl font-semibold">{formatCurrency(loan + equity)}</span>
                        </div>
                     </div>

                     <div className="text-center">
                        <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 font-bold w-full sm:w-auto transition-transform hover:-translate-y-1">
                           Persönliches Angebot erhalten
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default MortgageCalculator
