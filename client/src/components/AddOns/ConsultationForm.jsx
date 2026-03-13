// File: client/src/components/AddOns/ConsultationForm.jsx
import emailjs from '@emailjs/browser'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Mail, Smartphone, X } from 'lucide-react'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// shadcn UI components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_CONSULTATION_TEMPLATE_ID ||
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const ConsultationForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationality: '',
    residency: '',
    language: '',
    email: '',
    phone: '',
    message: ''
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submittedAt, setSubmittedAt] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        firstName: '',
        lastName: '',
        nationality: '',
        residency: '',
        language: '',
        email: '',
        phone: '',
        message: ''
      })
      setShowConfirmation(false)
      setSubmittedAt('')
      setPhoneError('')
      setIsSubmitting(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  const validateGermanPhone = (number) => {
    // German phone pattern: starts with +49 or 0, then digits.
    // Simple regex: ^(\+49|0)[1-9][0-9]{5,14}$
    const germanPhoneRegex = /^(\+49|0)[1-9][0-9]{5,14}$/
    return germanPhoneRegex.test(number.replace(/\s/g, ''))
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))

    if (id === 'phone') {
      if (value && !validateGermanPhone(value)) {
        setPhoneError('Please enter a valid German number (e.g. +49...)')
      } else {
        setPhoneError('')
      }
    }
  }

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset residency if nationality changes
      ...(name === 'nationality' ? { residency: '' } : {})
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateGermanPhone(formData.phone)) {
      setPhoneError('A valid German phone number is required.')
      return
    }

    const missingEmailConfig = [
      !EMAILJS_SERVICE_ID && 'VITE_EMAILJS_SERVICE_ID',
      !EMAILJS_TEMPLATE_ID &&
        'VITE_EMAILJS_TEMPLATE_ID (or VITE_EMAILJS_CONSULTATION_TEMPLATE_ID)',
      !EMAILJS_PUBLIC_KEY && 'VITE_EMAILJS_PUBLIC_KEY'
    ].filter(Boolean)

    if (missingEmailConfig.length) {
      console.warn('Missing EmailJS config:', missingEmailConfig)
      toast.error(
        `Email service is not configured: ${missingEmailConfig.join(', ')}`
      )
      return
    }

    setIsSubmitting(true)

    const currentSubmissionTime = new Date().toLocaleString()

    const templateParams = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      first_name: formData.firstName,
      last_name: formData.lastName,
      nationality: formData.nationality,
      residency: formData.residency || 'N/A',
      language: formData.language,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || 'No message provided',
      full_name: `${formData.firstName} ${formData.lastName}`,
      submitted_at: currentSubmissionTime
    }

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      )
      setSubmittedAt(currentSubmissionTime)
      setShowConfirmation(true)
      toast.success('Consultation request sent successfully.')
    } catch (error) {
      console.error('EmailJS error:', error)
      toast.error('Failed to send request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const residencyOptions = formData.nationality === 'eu'
    ? [
        { value: 'blue-card', label: 'Blue Card' },
        { value: 'visa', label: 'Visa Residency' },
        { value: 'permanent', label: 'Permanent Residency' },
        { value: 'limited', label: 'Limited Residency' }
      ]
    : [
        { value: 'permanent', label: 'Permanent Resident' },
        { value: 'temporary', label: 'Temporary Resident' },
        { value: 'student', label: 'Student Visa' },
        { value: 'other', label: 'Other' }
      ]

  const handleSubmitAnother = () => {
    setFormData({
      firstName: '',
      lastName: '',
      nationality: '',
      residency: '',
      language: '',
      email: '',
      phone: '',
      message: ''
    })
    setPhoneError('')
    setIsSubmitting(false)
    setSubmittedAt('')
    setShowConfirmation(false)
  }

  return (
    <AnimatePresence>
      <div className='fixed inset-0 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center z-50 p-0 sm:p-4'>
        <motion.div
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className='bg-background w-full max-w-lg relative overflow-hidden h-[90vh] sm:h-auto sm:max-h-[95vh] flex flex-col rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl border-t sm:border border-border/40'
        >
          {/* Native Mobile Feel Grabber */}
          <div className="w-12 h-1.5 bg-muted-foreground/20 rounded-full mx-auto mt-4 sm:hidden" />

          {/* Header */}
          <div className='px-6 py-4 flex justify-between items-center relative'>
            <div>
              <h3 className='text-2xl font-black font-heading text-primary dark:text-white tracking-tight leading-tight'>
                Book <span className="text-blue-600">Free</span> <br/>Consultation
              </h3>
            </div>
            <button
              onClick={onClose}
              className='bg-muted/50 hover:bg-muted p-2 rounded-xl transition-all duration-200'
            >
              <X className='w-4 h-4' />
            </button>
          </div>

          <div className='flex-1 overflow-y-auto px-6 pb-8 scrollbar-hide'>
            {!showConfirmation ? (
              <form onSubmit={handleSubmit} className='space-y-3.5'>
                <div className='grid grid-cols-2 gap-3'>
                  <Input
                    id='firstName'
                    placeholder='First Name'
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="h-11 bg-muted/20 border border-border/40 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-xl px-4 text-sm transition-all"
                  />
                  <Input
                    id='lastName'
                    placeholder='Last Name'
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="h-11 bg-muted/20 border border-border/40 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-xl px-4 text-sm transition-all"
                  />
                </div>

                <div className='space-y-3.5'>
                  <Select
                    required
                    onValueChange={(v) => handleSelectChange('nationality', v)}
                    value={formData.nationality}
                  >
                    <SelectTrigger className="h-11 w-full bg-muted/20 border border-border/40 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 text-sm text-left transition-all">
                      <SelectValue placeholder='Nationality' />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value='eu'>EU Citizen</SelectItem>
                      <SelectItem value='non-eu'>Non-EU Citizen</SelectItem>
                    </SelectContent>
                  </Select>

                  {formData.nationality === 'eu' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full"
                    >
                      <Select
                        required
                        onValueChange={(v) => handleSelectChange('residency', v)}
                        value={formData.residency}
                      >
                        <SelectTrigger className="h-11 w-full bg-muted/20 border border-border/40 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 text-sm text-left transition-all">
                          <SelectValue placeholder='Residency Status' />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {residencyOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </div>

                <Select
                  required
                  onValueChange={(v) => handleSelectChange('language', v)}
                  value={formData.language}
                >
                  <SelectTrigger className="h-11 bg-muted/20 border border-border/40 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 text-sm text-left transition-all">
                    <SelectValue placeholder='Preferred Language' />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value='german'>Deutsch (German)</SelectItem>
                    <SelectItem value='english'>English</SelectItem>
                    <SelectItem value='urdu'>اردو (Urdu)</SelectItem>
                    <SelectItem value='punjabi'>ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                    <SelectItem value='hindi'>हिन्दी (Hindi)</SelectItem>
                  </SelectContent>
                </Select>

                <div className="space-y-3.5">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id='email'
                      type='email'
                      placeholder='Email Address'
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-11 bg-muted/20 border border-border/40 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-xl pl-11 text-sm transition-all"
                    />
                  </div>

                  <div className="relative group">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                    <Input
                      id='phone'
                      type='tel'
                      placeholder='Phone Number (+49...)'
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`h-11 bg-muted/20 border border-border/40 focus-visible:ring-2 ${phoneError ? 'focus-visible:ring-red-500/20 border-red-500/50' : 'focus-visible:ring-blue-500/20'} rounded-xl pl-11 text-sm transition-all`}
                    />
                    {phoneError && <p className="text-[10px] text-red-500 mt-1 ml-4 font-semibold">{phoneError}</p>}
                  </div>
                </div>

                <Textarea
                  id='message'
                  placeholder='How can we help you? (Optional)'
                  value={formData.message}
                  onChange={handleInputChange}
                  className='min-h-[80px] bg-muted/20 border border-border/40 focus:ring-2 focus:ring-blue-500/20 rounded-xl p-4 text-sm resize-none transition-all'
                />

                <Button
                  type='submit'
                  size="lg"
                  disabled={isSubmitting}
                  className='w-full text-base font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all rounded-xl h-13 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-70 disabled:cursor-not-allowed'
                >
                  {isSubmitting ? 'Sending...' : 'Schedule Now'}
                  {!isSubmitting && <ArrowRight className='ml-2 h-4 w-4' />}
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className='flex flex-col items-center justify-center py-10 text-center'
              >
                <div className='w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[1.5rem] flex items-center justify-center mb-5'>
                  <CheckCircle className='h-10 w-10 text-blue-600' />
                </div>
                <h3 className='text-2xl font-black text-foreground mb-2 font-heading'>
                  Success!
                </h3>
                <p className='text-muted-foreground mb-6 max-w-xs text-sm leading-relaxed'>
                  Your consultation request was submitted successfully. Our experts
                  will review your details and contact you within 24 hours.
                </p>
                {submittedAt && (
                  <p className='text-xs text-muted-foreground/80 mb-4'>
                    Submitted at: {submittedAt}
                  </p>
                )}
                <Button
                  type='button'
                  onClick={handleSubmitAnother}
                  variant='outline'
                  className='w-full h-12 rounded-xl font-bold text-base mb-3'
                >
                  Submit Another Request
                </Button>
                <Button
                  type='button'
                  onClick={onClose}
                  className='w-full h-12 rounded-xl bg-foreground text-background font-bold text-base'
                >
                  Back Home
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

ConsultationForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default ConsultationForm
