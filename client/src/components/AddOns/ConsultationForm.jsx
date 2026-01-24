// File: client/src/components/AddOns/ConsultationForm.jsx
import { motion } from 'framer-motion'
import { X, ArrowRight, CheckCircle } from 'lucide-react'
import { useState } from 'react'

// shadcn UI components
import { Button } from '@/components/ui/button'
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
        className='bg-background rounded-3xl shadow-[0_30px_100px_-20px_rgba(15,23,42,0.25)] w-full max-w-2xl relative overflow-hidden max-h-[95vh] flex flex-col border border-border/50'
      >
        {/* Premium Header */}
        <div className='bg-primary/5 dark:bg-card border-b border-border/40 px-8 py-8 flex justify-between items-center relative overflow-hidden'>
           {/* Subtle pattern overlay */}
           <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
           />
           
          <div className="relative z-10">
            <h3 className='text-3xl font-bold font-heading text-primary tracking-tight'>
              Book Your <span className="text-accent">Consultation</span>
            </h3>
            <p className="text-muted-foreground text-base mt-2 font-body max-w-md">
              Speak with Germany&apos;s leading mortgage experts to secure your future.
            </p>
          </div>
          <button
            onClick={onClose}
            className='relative z-10 text-muted-foreground hover:text-primary hover:bg-muted rounded-full p-2.5 transition-all duration-200 focus:outline-none'
          >
            <X className='w-6 h-6' />
          </button>
        </div>

        <div className='p-8 lg:p-10 overflow-y-auto font-body scrollbar-hide'>
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
                    className='grid grid-cols-3 gap-1 p-1 bg-secondary/80 dark:bg-card border border-border/40 rounded-2xl'
                    onValueChange={setContactMethod}
                    value={contactMethod}
                  >
                    {['email', 'phone', 'whatsapp'].map((method) => (
                        <div key={method} className="relative">
                            <RadioGroupItem value={method} id={`contact-${method}`} className="peer sr-only" />
                            <Label 
                                htmlFor={`contact-${method}`} 
                                className="flex items-center justify-center w-full py-2.5 rounded-xl cursor-pointer text-sm font-bold text-muted-foreground transition-all duration-300 peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:shadow-lg dark:peer-checked:shadow-none hover:text-primary"
                            >
                                {method.charAt(0).toUpperCase() + method.slice(1)}
                            </Label>
                        </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Dynamic fields based on contact method with smooth presence animation */}
                <div className="bg-secondary/40 dark:bg-card/40 rounded-2xl p-6 border border-border/40">
                    {contactMethod === 'email' && (
                      <div className='space-y-3'>
                        <Label htmlFor='preferredEmail' className="text-foreground/90 font-semibold mb-1 block">Preferred Email *</Label>
                        <Input
                          id='preferredEmail'
                          type='email'
                          placeholder='name@example.com'
                          required
                          className="h-12 bg-background border-border/80 focus:border-accent focus:ring-accent/20 rounded-xl"
                        />
                        <p className='text-xs text-muted-foreground font-medium'>
                          We&apos;ll send consultation details and calendar invites here.
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
                          className="bg-background border-border/60 focus:border-accent focus:ring-accent/20 rounded-xl"
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
                          We&apos;ll coordinate via WhatsApp.
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

                <div className='flex items-start gap-4 p-5 bg-accent/5 dark:bg-accent/10 rounded-2xl border border-accent/20'>
                  <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                     <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <p className='text-[13px] text-muted-foreground leading-relaxed font-medium'>
                    By scheduling, you agree to our privacy policy. One-on-one expert session, no hidden costs. Confirmation within 24 hours.
                  </p>
                </div>

                <div className='pt-4'>
                  <Button
                    type='submit'
                    size="lg"
                    className='w-full text-lg font-bold shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all rounded-full h-16 bg-primary text-primary-foreground'
                  >
                    Confirm Appointment
                    <ArrowRight className='ml-3 h-5 w-5' />
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
                We&apos;ll be in touch shortly to confirm your consultation time and details.
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

