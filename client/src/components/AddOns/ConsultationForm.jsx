// File: client/src/components/AddOns/ConsultationForm.jsx
import { motion } from 'framer-motion'
import { Calendar, X, ArrowRight, CheckCircle } from 'lucide-react'
import React, { useState } from 'react'

// shadcn UI components
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const ConsultationForm = ({ isOpen, onClose }) => {
  const [contactMethod, setContactMethod] = useState('email')
  const [showConfirmation, setShowConfirmation] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission logic would go here
    setShowConfirmation(true)
  }

  return (
    <div className='fixed inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className='bg-background rounded-3xl shadow-2xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] flex flex-col border border-border/50'
      >
        {/* Premium Header */}
        <div className='bg-primary text-primary-foreground px-8 py-6 flex justify-between items-center relative overflow-hidden'>
           {/* Subtle pattern overlay */}
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--color-accent),transparent_50%)]" />
           
          <div className="relative z-10">
            <h3 className='text-2xl font-bold font-heading tracking-tight'>
              Book Your Consultation
            </h3>
            <p className="text-primary-foreground/80 text-sm mt-1 font-body">
              Expert guidance for your German home-buying journey
            </p>
          </div>
          <button
            onClick={onClose}
            className='relative z-10 text-primary-foreground/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors focus:outline-none'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        <div className='p-8 overflow-y-auto font-body'>
          {!showConfirmation ? (
            <>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div className='space-y-2.5'>
                    <Label htmlFor='firstName' className="text-foreground/80 font-medium">First Name *</Label>
                    <Input
                      id='firstName'
                      placeholder='e.g. Thomas'
                      required
                      className="h-12 bg-muted/30 border-input focus:border-accent focus:ring-accent/20 transition-all rounded-xl"
                    />
                  </div>

                  <div className='space-y-2.5'>
                    <Label htmlFor='lastName' className="text-foreground/80 font-medium">Last Name *</Label>
                    <Input
                      id='lastName'
                      placeholder='e.g. Weber'
                      required
                      className="h-12 bg-muted/30 border-input focus:border-accent focus:ring-accent/20 transition-all rounded-xl"
                    />
                  </div>
                </div>

                <div className='space-y-2.5'>
                  <Label htmlFor='residency' className="text-foreground/80 font-medium">
                    Current Residency Status *
                  </Label>
                  <Select required>
                    <SelectTrigger id='residency' className="h-12 bg-muted/30 border-input focus:ring-accent/20 rounded-xl">
                      <SelectValue placeholder='Select your status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='citizen'>German Citizen</SelectItem>
                      <SelectItem value='permanent'>Permanent Resident</SelectItem>
                      <SelectItem value='temporary'>Temporary Resident</SelectItem>
                      <SelectItem value='eu'>EU Citizen</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-3'>
                  <Label className="text-foreground/80 font-medium">Preferred Contact Method *</Label>
                  <RadioGroup
                    defaultValue='email'
                    className='grid grid-cols-3 gap-0 p-1 bg-muted/50 rounded-xl'
                    onValueChange={setContactMethod}
                    value={contactMethod}
                  >
                    {['email', 'phone', 'whatsapp'].map((method) => (
                        <div key={method} className="relative">
                            <RadioGroupItem value={method} id={`contact-${method}`} className="peer sr-only" />
                            <Label 
                                htmlFor={`contact-${method}`} 
                                className="flex items-center justify-center w-full py-2.5 rounded-lg cursor-pointer text-sm font-medium text-muted-foreground transition-all peer-checked:bg-white peer-checked:text-primary peer-checked:shadow-sm"
                            >
                                {method.charAt(0).toUpperCase() + method.slice(1)}
                            </Label>
                        </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Dynamic fields based on contact method with smooth presence animation */}
                <div className="bg-secondary/30 rounded-xl p-5 border border-border/50">
                    {contactMethod === 'email' && (
                      <div className='space-y-2.5'>
                        <Label htmlFor='preferredEmail' className="text-foreground/80">Preferred Email *</Label>
                        <Input
                          id='preferredEmail'
                          type='email'
                          placeholder='name@example.com'
                          required
                          className="bg-white border-border/60 focus:border-accent focus:ring-accent/20"
                        />
                        <p className='text-xs text-muted-foreground'>
                          We'll send consultation details here.
                        </p>
                      </div>
                    )}

                    {contactMethod === 'phone' && (
                      <div className='space-y-2.5'>
                        <Label htmlFor='phoneNumber' className="text-foreground/80">Phone Number *</Label>
                        <Input
                          id='phoneNumber'
                          type='tel'
                          placeholder='+49 123 456789'
                          required
                          className="bg-white border-border/60 focus:border-accent focus:ring-accent/20"
                        />
                         <p className='text-xs text-muted-foreground'>
                          Our advisors will call you shortly.
                        </p>
                      </div>
                    )}

                    {contactMethod === 'whatsapp' && (
                      <div className='space-y-2.5'>
                        <Label htmlFor='whatsappNumber' className="text-foreground/80">WhatsApp Number *</Label>
                        <Input
                          id='whatsappNumber'
                          type='tel'
                          placeholder='+49 123 456789'
                          required
                          className="bg-white border-border/60 focus:border-accent focus:ring-accent/20"
                        />
                         <p className='text-xs text-muted-foreground'>
                          We'll coordinate via WhatsApp.
                        </p>
                      </div>
                    )}
                </div>

                <div className='space-y-2.5'>
                  <Label htmlFor='language' className="text-foreground/80 font-medium">Preferred Language *</Label>
                  <Select required>
                    <SelectTrigger id='language' className="h-12 bg-muted/30 border-input focus:ring-accent/20 rounded-xl">
                      <SelectValue placeholder='Select language' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='german'>German / Deutsch</SelectItem>
                      <SelectItem value='english'>English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2.5'>
                  <Label htmlFor='message' className="text-foreground/80 font-medium">
                    How can we help? <span className="text-muted-foreground font-normal">(Optional)</span>
                  </Label>
                  <Textarea
                    id='message'
                    placeholder='Tell us about your goals...'
                    className='min-h-[100px] bg-muted/30 border-input focus:border-accent focus:ring-accent/20 rounded-xl resize-none'
                  />
                </div>

                <div className='flex items-start gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100/50 dark:border-emerald-900/20'>
                  <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                     <CheckCircle className="w-3 h-3" />
                  </div>
                  <p className='text-xs text-muted-foreground leading-relaxed'>
                    By scheduling, you agree to our privacy policy. Personalized guidance, no obligation. Confirmation within 24h.
                  </p>
                </div>

                <div className='pt-2'>
                  <Button
                    type='submit'
                    size="lg"
                    className='w-full text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all rounded-xl h-14'
                  >
                    Confirm Appointment
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center py-12 text-center'>
              <div className='w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500'>
                <CheckCircle className='h-10 w-10 text-emerald-600 dark:text-emerald-400' />
              </div>
              <h3 className='text-2xl font-bold text-foreground mb-3 font-heading'>
                Request Received!
              </h3>
              <p className='text-muted-foreground mb-8 max-w-sm leading-relaxed'>
                We'll be in touch shortly to confirm your consultation time and details.
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                className='px-8 rounded-xl border-primary/20 hover:bg-muted'
              >
                Return to Site
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ConsultationForm

// Helper icon component since we removed some imports

