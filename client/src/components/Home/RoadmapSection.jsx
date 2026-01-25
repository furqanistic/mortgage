// File: client/src/components/Home/RoadmapSection.jsx
import { Button } from '@/components/ui/button'
import {
  BadgeDollarSign,
  Calculator,
  CheckCircle,
  ChevronRight,
  FileCheck,
  FileText,
  Home,
  Key,
  Search,
  Shield,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'

const RoadmapSection = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      icon: Search,
      title: 'Precheck Needs',
      description: 'We start by deeply analyzing your financial situation and specific property goals to establish a solid foundation for your search. This phase is crucial for targeting the right properties.',
      details: [
        'Define property criteria',
        'Analyze monthly budget',
        'Select preferred locations',
      ],
      timeframe: '1 hour',
    },
    {
      icon: Calculator,
      title: 'Pre-Approval',
      description: 'Get a preliminary financing confirmation from our partner banks. This certificate proves to sellers that you are a serious and qualified buyer.',
      details: [
        'Gather financial documents',
        'Credit score check',
        'Receive financing certificate',
      ],
      timeframe: '1 day',
    },
    {
      icon: Home,
      title: 'Property Search',
      description: 'We leverage our network and modern tools to find properties that match your criteria, including off-market opportunities not yet public.',
      details: [
        'Setup automated alerts',
        'Market value analysis',
        'Shortlist top candidates',
      ],
      timeframe: '2-4 weeks',
    },
    {
      icon: Users,
      title: 'Viewings',
      description: 'Schedule and attend property viewings. We help you inspect the condition of the property and ask the right questions to the seller or agent.',
      details: [
        'Guided property tours',
        'Assess building condition',
        'Neighborhood exploration',
      ],
      timeframe: '1-2 weeks',
    },
    {
      icon: BadgeDollarSign,
      title: 'Negotiation',
      description: 'Our experts handle the price negotiation to ensure you pay fair market value. We use data-driven arguments to secure the best deal.',
      details: [
        'Strategic price offer',
        'Professional valuation',
        'Review meeting minutes',
      ],
      timeframe: '1-2 weeks',
    },
    {
      icon: FileCheck,
      title: 'Application',
      description: 'We prepare and submit your loan application to the selected bank, optimizing the presentation to ensure quick and smooth approval.',
      details: [
        'Submit full dossier',
        'Bank risk assessment',
        'Receive loan contract',
      ],
      timeframe: '2-3 weeks',
    },
    {
      icon: FileText,
      title: 'Notary',
      description: 'The purchase is finalized at the notary. We review the draft contract beforehand to ensure your legal interests are fully protected.',
      details: [
        'Review draft contract',
        'Notary appointment',
        'Sign purchase deed',
      ],
      timeframe: '1-2 weeks',
    },
    {
      icon: BadgeDollarSign,
      title: 'Payments',
      description: 'Coordinate the payment of the purchase price and ancillary costs. We guide you through the payment schedule and strict deadlines.',
      details: [
        'Pay purchase price',
        'Pay notary & tax',
        'Confirm payment receipt',
      ],
      timeframe: '1-2 weeks',
    },
    {
      icon: Key,
      title: 'Handover',
      description: 'The exciting moment! You receive the keys to your new home. We provide a checklist for the final walkthrough to document any defects.',
      details: [
        'Final property check',
        'Protocol signing',
        'Key handover',
      ],
      timeframe: '1 day',
    },
    {
      icon: Shield,
      title: 'Insurance',
      description: 'Protect your investment with the right insurance coverage from day one. We recommend the essential policies for homeowners.',
      details: [
        'Building insurance',
        'Liability coverage',
        'Household insurance',
      ],
      timeframe: '1-2 days',
    },
  ]

  return (
    <section className='py-12 md:py-24 bg-background relative overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-primary/2 -z-10' />
      
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Section Header */}
        <div className='text-center mb-20'>
          <div className='inline-flex items-center justify-center space-x-2 mb-6'>
            <span className='px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider border border-accent/20'>
              The Process
            </span>
          </div>
          <h2 className='text-4xl sm:text-5xl font-bold text-foreground mb-6'>
            Follow Your Path Home
          </h2>
          <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
            Navigate the home-buying process with confidence. Our expert team
            guides you through every milestone.
          </p>
        </div>

        {/* Desktop View: Interactive Horizontal Timeline */}
        <div className="hidden lg:block mb-32 px-4 ">
            <div className="flex items-center w-full">
                 {steps.map((step, index) => {
                     const StepIcon = step.icon
                     const isActive = index === activeStep
                     const isCompleted = index < activeStep
                     const isLastStep = index === steps.length - 1
                     
                     return (
                         <div key={index} className={`flex items-center   ${isLastStep ? '' : 'flex-1'} relative`}>
                             {/* Step Button - Z-index 10 to sit above lines */}
                             <button 
                                onClick={() => setActiveStep(index)}
                                className="group relative flex flex-col items-center focus:outline-none z-10 flex-shrink-0"
                             >
                                 <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                     ${isActive 
                                         ? 'bg-primary border-background shadow-md scale-105' 
                                         : isCompleted 
                                             ? 'bg-primary/80 border-background text-primary-foreground' 
                                             : 'bg-background border-border text-muted-foreground hover:border-primary/50 hover:bg-secondary/30'
                                     }
                                 `}>
                                     <StepIcon className={`w-7 h-7 ${isActive || isCompleted ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                                 </div>
                                 
                                 {/* Label Positioned Absolute to not affect flex layout */}
                                 <div className={`absolute top-20 left-1/2 -translate-x-1/2 w-32 text-center transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-60 hover:opacity-100'}`}>
                                     <p className={`text-xs font-bold uppercase tracking-wide mb-1 ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>Step {index + 1}</p>
                                     <p className={`text-sm font-semibold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</p>
                                 </div>
                             </button>

                             {/* Connector Line (Not for last step) */}
                             {!isLastStep && (
                                 <div className="flex-1 h-0.5 mx-2 bg-secondary dark:bg-white/20 relative">
                                     <div 
                                         className={`absolute inset-0 bg-primary transition-all duration-500 origin-left ${index < activeStep ? 'scale-x-100' : 'scale-x-0'}`} 
                                     />
                                 </div>
                             )}
                         </div>
                     )
                 })}
            </div>
        </div>

        {/* Content Display Area */}
        <div className='bg-white dark:bg-card border border-border shadow-sm rounded-3xl p-8 lg:p-12 overflow-hidden relative '>
           {/* Decorative background blob */}
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
           
           <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-start relative z-10'>
               {/* Left Side: Info */}
               <div className="space-y-6">
                   <div className="flex items-center gap-3">
                       <div className="p-3 bg-accent/10 rounded-xl">
                          {React.createElement(steps[activeStep].icon, { className: 'w-6 h-6 text-accent' })}
                       </div>
                       <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Step {activeStep + 1} of {steps.length}</span>
                   </div>
                   
                   <div>
                       <h3 className="text-3xl font-bold text-foreground mb-2">{steps[activeStep].title}</h3>
                       <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
                           ⏱️ Est. {steps[activeStep].timeframe}
                       </div>
                   </div>

                   <p className="text-lg text-muted-foreground leading-relaxed">
                       {steps[activeStep].description}
                   </p>
               </div>
               
               {/* Right Side: Checklist */}
               <div className="bg-secondary/30 rounded-2xl p-6 border border-border/50">
                   <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                       <FileCheck className="w-5 h-5 text-accent" /> Checklist
                   </h4>
                   <div className="grid gap-3">
                       {steps[activeStep].details.map((detail, idx) => (
                           <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-lg border border-border/50 shadow-sm">
                               <div className="mt-0.5 w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                                   <CheckCircle className="w-3.5 h-3.5 text-accent" />
                               </div>
                               <span className="text-sm font-medium text-foreground/80">{detail}</span>
                           </div>
                       ))}
                   </div>
               </div>
           </div>

           {/* Navigation Buttons */}
           <div className="flex justify-between items-center pt-8 mt-8 border-t border-border/50 relative z-10">
               <Button 
                 variant="outline" 
                 onClick={() => setActiveStep(p => Math.max(0, p - 1))}
                 disabled={activeStep === 0}
                 className="rounded-full px-6"
               >
                   Back
               </Button>

               <div className="flex gap-2">
                   {/* Mobile step indicator could go here if needed, or hidden */}
               </div>

               <Button 
                onClick={() => setActiveStep(p => Math.min(steps.length - 1, p + 1))}
                disabled={activeStep === steps.length - 1}
                className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90"
               >
                   {activeStep === steps.length - 1 ? 'Finish' : 'Next Step'} <ChevronRight className="w-4 h-4 ml-2" />
               </Button>
           </div>
        </div>
      </div>
    </section>
  )
}

export default RoadmapSection
