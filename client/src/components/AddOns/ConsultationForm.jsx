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
        className='bg-background rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden max-h-[95vh] flex flex-col border border-border/50'
      >
        {/* Premium Header - Compact */}
        <div className='bg-primary/5 dark:bg-card border-b border-border/40 px-6 py-5 flex justify-between items-center relative overflow-hidden'>
           {/* Subtle pattern overlay */}
           <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
                style={{ backgroundImage: 'radial-gradient(var(--color-primary) 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
           />
           
          <div className="relative z-10">
            <h3 className='text-2xl font-bold font-heading text-primary tracking-tight'>
              Book Your <span className="text-accent">Consultation</span>
            </h3>
            <p className="text-muted-foreground text-sm mt-1 font-body">
              Expert advice to secure your future.
            </p>
          </div>
          <button
            onClick={onClose}
            className='relative z-10 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-full p-2 transition-all duration-200 focus:outline-none'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-6 overflow-y-auto font-body scrollbar-hide'>
          {!showConfirmation ? (
            <>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='firstName' className="text-foreground/80 font-medium text-xs uppercase tracking-wide">First Name</Label>
                    <Input
                      id='firstName'
                      placeholder='Thomas'
                      required
                      className="h-10 bg-muted/30 border-input focus:border-accent focus:ring-accent/20 transition-all rounded-lg text-sm"
                    />
                  </div>

                  <div className='space-y-1.5'>
                    <Label htmlFor='lastName' className="text-foreground/80 font-medium text-xs uppercase tracking-wide">Last Name</Label>
                    <Input
                      id='lastName'
                      placeholder='Weber'
                      required
                      className="h-10 bg-muted/30 border-input focus:border-accent focus:ring-accent/20 transition-all rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Grouped Residency and Language */}
                <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1.5'>
                      <Label htmlFor='residency' className="text-foreground/80 font-medium text-xs uppercase tracking-wide">
                        Residency
                      </Label>
                      <Select required>
                        <SelectTrigger id='residency' className="h-10 bg-muted/30 border-input focus:ring-accent/20 rounded-lg text-sm">
                          <SelectValue placeholder='Select status' />
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

                    <div className='space-y-1.5'>
                      <Label htmlFor='language' className="text-foreground/80 font-medium text-xs uppercase tracking-wide">Language</Label>
                      <Select required>
                        <SelectTrigger id='language' className="h-10 bg-muted/30 border-input focus:ring-accent/20 rounded-lg text-sm">
                          <SelectValue placeholder='Select language' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='german'>German / Deutsch</SelectItem>
                          <SelectItem value='english'>English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                </div>

                <div className='space-y-2'>
                  <Label className="text-foreground/80 font-medium text-xs uppercase tracking-wide">Contact Method</Label>
                  <RadioGroup
                    defaultValue='email'
                    className='grid grid-cols-3 gap-1 p-1 bg-secondary/50 dark:bg-card border border-border/40 rounded-xl'
                    onValueChange={setContactMethod}
                    value={contactMethod}
                  >
                    {['email', 'phone', 'whatsapp'].map((method) => (
                        <div key={method} className="relative">
                            <RadioGroupItem value={method} id={`contact-${method}`} className="peer sr-only" />
                            <Label 
                                htmlFor={`contact-${method}`} 
                                className="flex items-center justify-center w-full py-2 rounded-lg cursor-pointer text-xs font-bold text-muted-foreground transition-all duration-300 peer-checked:bg-primary peer-checked:text-primary-foreground peer-checked:shadow-sm hover:text-primary"
                            >
                                {method.charAt(0).toUpperCase() + method.slice(1)}
                            </Label>
                        </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Dynamic fields based on contact method */}
                <div className="bg-secondary/30 dark:bg-card/30 rounded-xl p-4 border border-border/30">
                    {contactMethod === 'email' && (
                      <div className='space-y-1.5'>
                        <Label htmlFor='preferredEmail' className="text-foreground/90 font-medium text-xs">Preferred Email</Label>
                        <Input
                          id='preferredEmail'
                          type='email'
                          placeholder='name@example.com'
                          required
                          className="h-10 bg-background border-border/80 focus:border-accent focus:ring-accent/20 rounded-lg text-sm"
                        />
                      </div>
                    )}

                    {contactMethod === 'phone' && (
                      <div className='space-y-1.5'>
                        <Label htmlFor='phoneNumber' className="text-foreground/80 text-xs">Phone Number</Label>
                        <Input
                          id='phoneNumber'
                          type='tel'
                          placeholder='+49 123 456789'
                          required
                          className="h-10 bg-background border-border/60 focus:border-accent focus:ring-accent/20 rounded-lg text-sm"
                        />
                      </div>
                    )}

                    {contactMethod === 'whatsapp' && (
                      <div className='space-y-1.5'>
                        <Label htmlFor='whatsappNumber' className="text-foreground/80 text-xs">WhatsApp Number</Label>
                        <Input
                          id='whatsappNumber'
                          type='tel'
                          placeholder='+49 123 456789'
                          required
                          className="h-10 bg-white border-border/60 focus:border-accent focus:ring-accent/20 rounded-lg text-sm"
                        />
                      </div>
                    )}
                </div>

                <div className='space-y-1.5'>
                  <Label htmlFor='message' className="text-foreground/80 font-medium text-xs uppercase tracking-wide">
                    Message <span className="text-muted-foreground font-normal normal-case">(Optional)</span>
                  </Label>
                  <Textarea
                    id='message'
                    placeholder='Tell us about your goals...'
                    className='min-h-[80px] bg-muted/30 border-input focus:border-accent focus:ring-accent/20 rounded-lg resize-none text-sm'
                  />
                </div>

                <div className='flex items-start gap-3 p-3 bg-accent/5 dark:bg-accent/10 rounded-xl border border-accent/20'>
                  <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                     <CheckCircle className="w-3 h-3" />
                  </div>
                  <p className='text-[11px] text-muted-foreground leading-relaxed font-medium pt-0.5'>
                    By scheduling, you agree to our privacy policy. One-on-one session, no hidden costs.
                  </p>
                </div>

                <div className='pt-2'>
                  <Button
                    type='submit'
                    size="lg"
                    className='w-full text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all rounded-xl h-12 bg-primary text-primary-foreground'
                  >
                    Confirm Appointment
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <div className='w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500'>
                <CheckCircle className='h-8 w-8 text-emerald-600 dark:text-emerald-400' />
              </div>
              <h3 className='text-xl font-bold text-foreground mb-2 font-heading'>
                Request Received!
              </h3>
              <p className='text-muted-foreground mb-6 max-w-xs text-sm leading-relaxed'>
                We&apos;ll be in touch shortly to confirm your consultation.
              </p>
              <Button
                onClick={onClose}
                variant="outline"
                className='px-6 h-10 rounded-xl border-primary/20 hover:bg-muted text-sm'
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

