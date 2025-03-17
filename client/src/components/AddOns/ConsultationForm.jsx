import { motion } from 'framer-motion'
import { Calendar, X } from 'lucide-react'
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
    // Don't close the modal yet - we'll show confirmation first
  }

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative overflow-hidden max-h-[90vh] flex flex-col'
      >
        <div className='bg-[#155FA0] text-white px-6 py-4 flex justify-between items-center'>
          <h3 className='text-xl font-semibold'>
            Book Your Home-Buying Consultation
          </h3>
          <button
            onClick={onClose}
            className='text-white hover:text-gray-200 focus:outline-none'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        <div className='p-6 overflow-y-auto'>
          {!showConfirmation ? (
            <>
              <p className='text-gray-600 mb-6'>
                Let our experts guide you through your home-buying journey in
                Germany. Fill out this form to schedule a personalized
                consultation.
              </p>

              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='firstName'>First Name *</Label>
                    <Input
                      id='firstName'
                      placeholder='Your first name'
                      required
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='lastName'>Last Name *</Label>
                    <Input
                      id='lastName'
                      placeholder='Your last name'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='residency'>
                    Current Residency Status in Germany *
                  </Label>
                  <Select required>
                    <SelectTrigger id='residency'>
                      <SelectValue placeholder='Select your status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='citizen'>German Citizen</SelectItem>
                      <SelectItem value='permanent'>
                        Permanent Resident
                      </SelectItem>
                      <SelectItem value='temporary'>
                        Temporary Resident
                      </SelectItem>
                      <SelectItem value='eu'>EU Citizen</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label>Preferred Contact Method *</Label>
                  <RadioGroup
                    defaultValue='email'
                    className='flex flex-col space-y-1'
                    onValueChange={setContactMethod}
                    value={contactMethod}
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='email' id='contact-email' />
                      <Label htmlFor='contact-email'>Email</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='phone' id='contact-phone' />
                      <Label htmlFor='contact-phone'>Phone</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='whatsapp' id='contact-whatsapp' />
                      <Label htmlFor='contact-whatsapp'>WhatsApp</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Dynamic fields based on contact method */}
                {contactMethod === 'email' && (
                  <div className='space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-100'>
                    <Label htmlFor='preferredEmail'>
                      Preferred Email Address *
                    </Label>
                    <Input
                      id='preferredEmail'
                      type='email'
                      placeholder='Confirm your preferred email'
                      required
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      We'll send consultation details to this email address
                    </p>
                  </div>
                )}

                {contactMethod === 'phone' && (
                  <div className='space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-100'>
                    <Label htmlFor='phoneNumber'>
                      Phone Number for Calling *
                    </Label>
                    <Input
                      id='phoneNumber'
                      type='tel'
                      placeholder='Your phone number'
                      required
                      inputMode='numeric'
                      pattern='[0-9]*'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      Our consultants will call you to arrange your consultation
                    </p>
                  </div>
                )}

                {contactMethod === 'whatsapp' && (
                  <div className='space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-100'>
                    <Label htmlFor='whatsappNumber'>WhatsApp Number *</Label>
                    <Input
                      id='whatsappNumber'
                      type='tel'
                      placeholder='Your WhatsApp number'
                      required
                      inputMode='numeric'
                      pattern='[0-9]*'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      We'll send a WhatsApp message to confirm your consultation
                    </p>
                  </div>
                )}

                <div className='space-y-2'>
                  <Label htmlFor='language'>Preferred Language *</Label>
                  <Select required>
                    <SelectTrigger id='language'>
                      <SelectValue placeholder='Select language' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='german'>German</SelectItem>
                      <SelectItem value='english'>English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message'>
                    How can we help you? (Optional)
                  </Label>
                  <Textarea
                    id='message'
                    placeholder='Tell us about your home-buying goals or any specific questions'
                    className='min-h-[100px]'
                  />
                </div>

                <div className='bg-green-50 p-4 rounded-lg border border-green-100 mb-2'>
                  <p className='text-sm text-green-700'>
                    By scheduling a consultation, you'll receive personalized
                    guidance from our expert advisors, with no obligation. We'll
                    confirm your appointment within 24 hours.
                  </p>
                </div>

                <div className='pt-6'>
                  <Button
                    type='submit'
                    className='bg-[#155FA0] hover:bg-[#1A75C0] text-white w-full py-5 rounded-lg
                  flex items-center justify-center text-base font-medium transition-all duration-300 
                  hover:shadow-lg'
                  >
                    Schedule Consultation
                    <Calendar className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8 text-green-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              </div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>
                Consultation Booked!
              </h3>
              <p className='text-gray-600 mb-6 max-w-md'>
                Thank you for scheduling a consultation with us. We've received
                your request and will contact you shortly to confirm the
                details.
              </p>
              <Button
                onClick={onClose}
                className='bg-[#155FA0] hover:bg-[#1A75C0] text-white px-6 py-2 rounded-lg'
              >
                Close
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ConsultationForm
