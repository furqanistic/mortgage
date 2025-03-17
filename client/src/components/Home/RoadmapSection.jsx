import { Button } from '@/components/ui/button'
import {
  ArrowRight,
  BadgeDollarSign,
  Calculator,
  CheckCircle,
  FileCheck,
  FileText,
  Home,
  Key,
  MessageSquare,
  Search,
  Shield,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'

const RoadmapSection = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [hoveredStep, setHoveredStep] = useState(null)

  const steps = [
    {
      icon: Search,
      title: 'Precheck Your Needs',
      description: 'Define your requirements and check affordability.',
      details: [
        'Property requirements',
        'Location preferences',
        'Budget definition',
        'Initial consultation',
      ],
      timeframe: '1 hour',
    },
    {
      icon: Calculator,
      title: 'Financing Pre-Approval',
      description: 'Quick assessment of your financing options.',
      details: [
        'Document preparation',
        'Credit check',
        'Financing options',
        'Pre-approval letter',
      ],
      timeframe: '1 day',
    },
    {
      icon: Home,
      title: 'Property Search',
      description: 'Browse properties matching your criteria.',
      details: [
        'Custom property alerts',
        'Market analysis',
        'Property shortlisting',
        'Location assessment',
      ],
      timeframe: '2-4 weeks',
    },
    {
      icon: Users,
      title: 'Viewing Appointments',
      description: 'Schedule and attend property viewings.',
      details: [
        'Guided tours',
        'Property assessment',
        'Area exploration',
        'Detailed feedback',
      ],
      timeframe: '1-2 weeks',
    },
    {
      icon: BadgeDollarSign,
      title: 'Price Finalization',
      description: 'Negotiate and validate property value.',
      details: [
        'Price negotiation',
        'Property valuation',
        'Market comparison',
        'Final offer',
      ],
      timeframe: '1-2 weeks',
    },
    {
      icon: FileCheck,
      title: 'Mortgage Application',
      description: 'Complete financing process with the bank.',
      details: [
        'Document submission',
        'Bank processing',
        'Financing confirmation',
        'Terms agreement',
      ],
      timeframe: '2-3 weeks',
    },
    {
      icon: FileText,
      title: 'Purchase Agreement',
      description: 'Complete the notary process.',
      details: [
        'Contract review',
        'Notary appointment',
        'Document signing',
        'Legal verification',
      ],
      timeframe: '1-2 weeks',
    },
    {
      icon: BadgeDollarSign,
      title: 'Payments',
      description: 'Process all required payments.',
      details: ['Makler fee', 'Notary costs', 'Grundbuch amt', 'Finanzamt'],
      timeframe: '1-2 weeks',
    },
    {
      icon: Key,
      title: 'Property Handover',
      description: 'Receive keys and complete the transfer.',
      details: [
        'Final inspection',
        'Key handover',
        'Utility setup',
        'Move planning',
      ],
      timeframe: '1 day',
    },
    {
      icon: Shield,
      title: 'Secure Your Home',
      description: 'Set up necessary insurances.',
      details: [
        'Property insurance',
        'Liability coverage',
        'Contents insurance',
        'Policy setup',
      ],
      timeframe: '1-2 days',
    },
  ]

  return (
    <section className='py-20 relative overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0 bg-gradient-to-br from-[#155FA0]/5 via-white to-[#71C8DC]/5' />
      <div
        className='absolute inset-0 opacity-30'
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, #155FA0 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative'>
        {/* Section Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center justify-center space-x-2 mb-4'>
            <div className='h-px w-8 bg-[#155FA0]' />
            <span className='px-4 py-2 bg-[#155FA0] text-white rounded-full text-sm font-medium'>
              Your Journey to Homeownership
            </span>
            <div className='h-px w-8 bg-[#155FA0]' />
          </div>
          <h2 className='text-4xl sm:text-5xl font-bold bg-gradient-to-r from-[#155FA0] to-[#71C8DC] bg-clip-text text-transparent mb-4'>
            Follow Your Path Home
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Navigate the home-buying process with confidence. Our expert team
            guides you through every milestone, ensuring a smooth journey to
            your dream home.
          </p>
        </div>

        {/* Interactive Timeline */}
        <div className='relative mb-16'>
          <div className='h-3 bg-gradient-to-r from-[#155FA0]/10 to-[#71C8DC]/10 rounded-full shadow-inner'>
            <div
              className='h-full bg-gradient-to-r from-[#155FA0] to-[#71C8DC] rounded-full 
                transition-all duration-500 shadow-lg'
              style={{ width: `${(activeStep + 1) * (100 / steps.length)}%` }}
            />
          </div>
          <div className='absolute top-0 left-0 w-full flex justify-between transform -translate-y-1/2'>
            {steps.map((step, index) => (
              <button
                key={index}
                className='group relative'
                onClick={() => setActiveStep(index)}
                onMouseEnter={() => setHoveredStep(index)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300
                  ${
                    index <= activeStep
                      ? 'bg-gradient-to-r from-[#155FA0] to-[#71C8DC] border-white shadow-lg'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <div
                    className={`w-full h-full flex items-center justify-center
                    ${index <= activeStep ? 'text-white' : 'text-gray-400'}`}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Hover tooltip */}
                <div
                  className={`absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2
                  bg-gradient-to-br from-[#155FA0] to-[#71C8DC] text-white rounded-lg p-3 w-48 
                  transition-all duration-200 shadow-xl
                  ${
                    hoveredStep === index
                      ? 'opacity-100 visible'
                      : 'opacity-0 invisible'
                  }`}
                >
                  <div className='font-medium'>{step.title}</div>
                  <div className='text-sm opacity-90 mt-1'>
                    Est. {step.timeframe}
                  </div>
                  <div
                    className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 
                    rotate-45 w-2 h-2 bg-[#71C8DC]'
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Step Details */}
        <div className='bg-gradient-to-br from-[#155FA0] to-[#71C8DC] rounded-3xl shadow-xl p-8 mb-16 text-white'>
          <div className='max-w-3xl mx-auto'>
            <div className='flex items-center mb-6'>
              <div className='p-3 rounded-full bg-white/20'>
                {React.createElement(steps[activeStep].icon, {
                  className: 'w-6 h-6 text-white',
                })}
              </div>
              <span className='ml-3 font-medium'>
                Step {activeStep + 1} of {steps.length} • Est.{' '}
                {steps[activeStep].timeframe}
              </span>
            </div>
            <h3 className='text-3xl font-bold mb-4'>
              {steps[activeStep].title}
            </h3>
            <p className='text-lg opacity-90 mb-8'>
              {steps[activeStep].description}
            </p>
            <div className='grid sm:grid-cols-2 gap-4'>
              {steps[activeStep].details.map((detail, index) => (
                <div
                  key={index}
                  className='flex items-center bg-white/10 rounded-xl p-4'
                >
                  <CheckCircle className='w-5 h-5 mr-3 flex-shrink-0' />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
            {steps[activeStep].cta && (
              <div className='mt-8 flex justify-center'>
                <Button className='bg-white text-[#155FA0] hover:bg-white/90 px-6 py-3 rounded-full'>
                  {steps[activeStep].cta}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Step Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16'>
          {steps.map((step, index) => {
            const StepIcon = step.icon
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer
                  backdrop-blur-sm ${
                    index === activeStep
                      ? 'bg-gradient-to-br from-[#155FA0]/10 to-[#71C8DC]/10 shadow-lg border-2 border-[#155FA0]'
                      : 'bg-white/50 hover:bg-gradient-to-br hover:from-[#155FA0]/5 hover:to-[#71C8DC]/5 border border-gray-200'
                  }`}
                onClick={() => setActiveStep(index)}
              >
                <div className='flex items-center mb-4'>
                  <div
                    className={`p-3 rounded-full ${
                      index === activeStep
                        ? 'bg-gradient-to-br from-[#155FA0] to-[#71C8DC] text-white'
                        : 'bg-[#155FA0]/10'
                    }`}
                  >
                    <StepIcon
                      className={`w-6 h-6 ${
                        index === activeStep ? 'text-white' : 'text-[#155FA0]'
                      }`}
                    />
                  </div>
                  <span className='ml-3 text-sm font-medium'>
                    Est. {step.timeframe}
                  </span>
                </div>
                <h3 className='text-lg font-semibold mb-2 text-gray-900'>
                  {step.title}
                </h3>
                <p className='text-gray-600 text-sm'>{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default RoadmapSection
