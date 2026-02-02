// File: client/src/components/Home/RoadmapSection.jsx
import { Button } from '@/components/ui/button'
import {
  BadgeDollarSign,
  Calculator,
  ChevronRight,
  FileCheck,
  FileText,
  Home,
  Key,
  Milestone,
  Search,
  Shield,
  Users,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const RoadmapSection = () => {
  const [activeStep, setActiveStep] = useState(0)
  const scrollContainerRef = useRef(null)

  const steps = [
    {
      icon: Search,
      title: 'Precheck Needs',
      description: 'We establish a solid foundation by analyzing your financial situation and specific goals.',
      details: ['Define property criteria', 'Analyze monthly budget', 'Select preferred locations'],
      timeframe: '1 hour',
    },
    {
      icon: Calculator,
      title: 'Pre-Approval',
      description: 'Receive a financing certificate to prove your seriousness to sellers.',
      details: ['Financial document collection', 'Credit score verification', 'Financing certificate issuance'],
      timeframe: '1 day',
    },
    {
      icon: Home,
      title: 'Property Search',
      description: 'We leverage our network to find properties, including off-market opportunities.',
      details: ['Automated alert setup', 'Market value analysis', 'Candidate shortlisting'],
      timeframe: '2-4 weeks',
    },
    {
      icon: Users,
      title: 'Viewings',
      description: 'Guided inspections to assess condition and neighborhood viability.',
      details: ['Guided property tours', 'Building condition assessment', 'Area exploration'],
      timeframe: '1-2 weeks',
    },
    {
      icon: BadgeDollarSign,
      title: 'Negotiation',
      description: 'Data-driven price negotiation to secure fair market value.',
      details: ['Strategic offering', 'Professional valuation', 'Meeting minutes review'],
      timeframe: '1-2 weeks',
    },
    {
      icon: FileCheck,
      title: 'Application',
      description: 'Optimized loan application submission for quick bank approval.',
      details: ['Dossier submission', 'Bank risk assessment', 'Contract generation'],
      timeframe: '2-3 weeks',
    },
    {
      icon: FileText,
      title: 'Notary',
      description: 'Legal finalization of the purchase with contract review protection.',
      details: ['Draft review', 'Notary appointment', 'Deed signing'],
      timeframe: '1-2 weeks',
    },
    {
      icon: BadgeDollarSign,
      title: 'Payments',
      description: 'Coordination of purchase price and ancillary cost transfers.',
      details: ['Purchase price transfer', 'Tax & notary payment', 'Receipt confirmation'],
      timeframe: '1-2 weeks',
    },
    {
      icon: Key,
      title: 'Handover',
      description: 'Final walkthrough and key handover. The home is yours.',
      details: ['Final property check', 'Protocol signing', 'Key handover'],
      timeframe: '1 day',
    },
    {
      icon: Shield,
      title: 'Insurance',
      description: 'Essential coverage implementation for asset protection.',
      details: ['Building insurance', 'Liability coverage', 'Household protection'],
      timeframe: '1-2 days',
    },
  ]

  // Auto-scroll the vertical list safely without moving the whole page
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      const activeElement = container.children[activeStep + 1] // +1 because of the absolute line div at index 0
      
      if (activeElement) {
        const containerHeight = container.clientHeight
        const elementHeight = activeElement.clientHeight
        const elementTop = activeElement.offsetTop
        
        // Calculate centered position
        const scrollTo = elementTop - (containerHeight / 2) + (elementHeight / 2)
        
        container.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        })
      }
    }
  }, [activeStep])

  return (
    <section className='py-24 bg-background relative overflow-hidden text-foreground'>
      {/* Decorative Branding Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#155FA0]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FAC51C]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      
      <div className='max-w-7xl mx-auto px-6 lg:px-8 relative'>
        
        {/* Header */}
        <div className='flex flex-col md:flex-row items-end justify-between gap-8 mb-16'>
          <div className="space-y-4">
            <div className='inline-flex items-center gap-2 px-3 py-1 bg-[#155FA0]/10 rounded-full text-[#155FA0] text-[10px] font-bold uppercase tracking-widest border border-[#155FA0]/20'>
              <Milestone className='w-3 h-3 text-[#FAC51C]' /> The Roadmap
            </div>
            <h2 className='text-4xl md:text-6xl font-heading font-black tracking-tighter text-foreground leading-[0.9]'>
              Follow Your <br /><span className='text-[#155FA0] decoration-[#FAC51C]/30 underline underline-offset-8'>Path Home</span>
            </h2>
          </div>
          
          <div className='flex items-center gap-4 bg-secondary/80 backdrop-blur-md rounded-full px-4 py-2 border border-border'>
             <div className="flex gap-1">
                {steps.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeStep ? 'w-6 bg-[#FAC51C]' : i < activeStep ? 'w-1.5 bg-[#155FA0]' : 'w-1.5 bg-border'}`} />
                ))}
             </div>
             <p className='text-[10px] font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap'>
                Step {activeStep + 1} / {steps.length}
             </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            
            {/* Left Column: Vertical Navigation */}
            <div className="hidden lg:block lg:col-span-4 sticky top-24">
                <div 
                    ref={scrollContainerRef}
                    className="max-h-[600px] overflow-y-auto pr-4 space-y-2 scrollbar-hide relative"
                    style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
                >
                     {steps.map((step, index) => {
                         const isActive = index === activeStep
                         const isCompleted = index < activeStep

                         return (
                             <button 
                                key={index}
                                onClick={() => setActiveStep(index)}
                                className={`w-full group flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 text-left relative z-10
                                    ${isActive ? 'bg-[#155FA0]/5 translate-x-2 border border-[#155FA0]/10' : 'hover:bg-secondary hover:translate-x-1'}
                                `}
                             >
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 shadow-sm
                                     ${isActive 
                                         ? 'bg-[#FAC51C] text-[#155FA0] border-[#FAC51C] scale-110 shadow-[0_0_15px_rgba(250,197,28,0.2)]' 
                                         : isCompleted 
                                             ? 'bg-[#155FA0] text-white border-[#155FA0]' 
                                             : 'bg-background text-muted-foreground border-border group-hover:border-[#155FA0]/30'
                                     }
                                 `}>
                                     <step.icon className="w-4 h-4" />
                                 </div>
                                 
                                 <div>
                                     <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isActive ? 'text-[#155FA0]' : 'text-muted-foreground'}`}>
                                         Step {index + 1}
                                     </p>
                                     <p className={`text-sm font-bold leading-none transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                         {step.title}
                                     </p>
                                 </div>
                             </button>
                         )
                     })}
                </div>
            </div>

            {/* Right Column: Detail Card */}
            <div className="lg:col-span-8">
               <div className='bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden h-full min-h-[500px] flex flex-col justify-between group'>
                   
                   {/* Background ambiance */}
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#155FA0]/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-[#FAC51C]/5 transition-colors duration-1000" />
                   
                   <div className="relative z-10 space-y-10">
                       <div className="flex items-start justify-between gap-6">
                           <div className="space-y-6">
                               <div className={`inline-flex p-4 rounded-2xl ${activeStep === steps.length-1 ? 'bg-green-500 text-white' : 'bg-[#155FA0] text-white'} shadow-xl`}>
                                  {React.createElement(steps[activeStep].icon, { className: 'w-8 h-8' })}
                               </div>
                               
                               <div>
                                  <h3 className="text-3xl md:text-5xl font-heading font-black text-foreground leading-[0.9] mb-4">
                                    {steps[activeStep].title}
                                  </h3>
                                  <p className="text-lg md:text-xl text-muted-foreground leading-relaxed font-medium max-w-xl">
                                     {steps[activeStep].description}
                                  </p>
                               </div>
                           </div>

                           <div className="hidden sm:block text-right">
                               <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Timeline</p>
                               <p className="text-2xl font-black text-[#155FA0]">{steps[activeStep].timeframe}</p>
                           </div>
                       </div>
                       
                       {/* Action Items */}
                       <div className="bg-[#155FA0] rounded-3xl p-8 border border-[#155FA0]/10 shadow-lg relative overflow-hidden">
                           <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                               {steps[activeStep].details.map((detail, idx) => (
                                   <div key={idx} className="flex flex-col gap-2">
                                       <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-[10px] font-bold text-white">
                                           0{idx + 1}
                                       </div>
                                       <span className="text-sm font-bold text-white leading-tight">{detail}</span>
                                   </div>
                               ))}
                           </div>
                       </div>
                   </div>

                   {/* Footer Nav */}
                   <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-10 mt-4 relative z-10">
                       <Button 
                         variant="ghost" 
                         onClick={() => setActiveStep(p => Math.max(0, p - 1))}
                         disabled={activeStep === 0}
                         className="w-full sm:w-auto hover:bg-secondary text-muted-foreground hover:text-[#155FA0] font-bold uppercase tracking-widest text-xs"
                       >
                           Analysis Phase
                       </Button>

                       <Button 
                        onClick={() => setActiveStep(p => Math.min(steps.length - 1, p + 1))}
                        disabled={activeStep === steps.length - 1}
                        className="w-full sm:w-auto h-14 rounded-full px-10 bg-[#FAC51C] text-[#155FA0] hover:bg-[#FAC51C]/90 hover:scale-105 active:scale-95 font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-[#FAC51C]/20"
                       >
                           {activeStep === steps.length - 1 ? 'Complete Journey' : 'Next Phase'} <ChevronRight className="w-4 h-4 ml-2" />
                       </Button>
                   </div>
               </div>
            </div>

        </div>
      </div>
    </section>
  )
}

export default RoadmapSection
