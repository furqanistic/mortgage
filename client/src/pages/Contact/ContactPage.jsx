// File: client/src/pages/Contact/ContactPage.jsx
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { submitConsultationRequest } from '@/services/contactApi'
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
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    RotateCcw,
} from 'lucide-react'
import { useState } from 'react'
import PropTypes from 'prop-types'

const ContactPage = ({ language = 'de', onLanguageChange }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    euCitizen: '',
    residencyStatus: '',
    preferredLanguage: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [submittedAt, setSubmittedAt] = useState('')
  const { scrollY } = useScroll()
  useTransform(scrollY, [0, 500], [0, 100])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (formError) setFormError('')
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    if (formError) setFormError('')
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateGermanPhone = (number) => {
    const germanPhoneRegex = /^(\+49|0)[1-9][0-9]{5,14}$/
    return germanPhoneRegex.test(number.replace(/\s/g, ''))
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      euCitizen: '',
      residencyStatus: '',
      preferredLanguage: '',
      email: '',
      phone: '',
      message: '',
    })
    setIsSubmitting(false)
    setFormError('')
    setShowConfirmation(false)
    setSubmittedAt('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.euCitizen || !formData.preferredLanguage) {
      setFormError('Please select citizenship status and preferred language.')
      return
    }

    if (formData.euCitizen === 'non-eu' && !formData.residencyStatus) {
      setFormError('Please select your residency status.')
      return
    }

    if (!validateGermanPhone(formData.phone)) {
      setFormError('Please enter a valid German phone number (e.g. +49...)')
      return
    }

    const currentSubmissionTime = new Date().toLocaleString()

    setIsSubmitting(true)

    try {
      await submitConsultationRequest({
        ...formData,
        submittedAt: currentSubmissionTime,
      })
      setSubmittedAt(currentSubmissionTime)
      setShowConfirmation(true)
    } catch (error) {
      console.error('Consultation submit error:', error)
      const reason =
        error?.response?.data?.message || error?.message || 'Unknown error'
      setFormError(`Failed to send request. ${reason}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isNonEUCitizen = formData.euCitizen === 'non-eu'
  const copy = language === 'en'
    ? {
        successTitle: 'Request Received',
        successText:
          'Thank you. Our team will review your details and reach out within 24 hours.',
        submittedAtLabel: 'Submitted at',
        submitAnother: 'Submit Another Request',
        firstName: 'First Name',
        lastName: 'Last Name',
        euCitizen: 'EU Citizen Status',
        residencyStatus: 'Residency Status',
        preferredLanguage: 'Preferred Language',
        email: 'Email Address',
        phone: 'Phone Number (+49...)',
        message: 'How can we help you? (Optional)',
        submit: 'Schedule Now',
        euOptions: [
          { value: 'eu', label: 'EU Citizen' },
          { value: 'non-eu', label: 'Non-EU Citizen' },
        ],
        residencyOptions: [
          { value: 'blue-card', label: 'Blue Card' },
          { value: 'visa', label: 'Visa Residency' },
          { value: 'permanent', label: 'Permanent Residency' },
          { value: 'limited', label: 'Limited Residency' },
        ],
        languageOptions: [
          { value: 'german', label: 'Deutsch (German)' },
          { value: 'english', label: 'English' },
          { value: 'urdu', label: 'Urdu (اردو)' },
          { value: 'punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)' },
          { value: 'hindi', label: 'Hindi (हिन्दी)' },
        ],
      }
    : {
        successTitle: 'Anfrage Erfolgreich Gesendet',
        successText:
          'Vielen Dank. Unser Team prüft Ihre Angaben und meldet sich innerhalb von 24 Stunden bei Ihnen.',
        submittedAtLabel: 'Gesendet um',
        submitAnother: 'Neue Anfrage senden',
        firstName: 'Vorname',
        lastName: 'Nachname',
        euCitizen: 'EU-Staatsangehörigkeit',
        residencyStatus: 'Aufenthaltsstatus',
        preferredLanguage: 'Bevorzugte Sprache',
        email: 'E-Mail-Adresse',
        phone: 'Telefonnummer (+49...)',
        message: 'Wie können wir Ihnen helfen? (Optional)',
        submit: 'Jetzt terminieren',
        euOptions: [
          { value: 'eu', label: 'EU-Bürger' },
          { value: 'non-eu', label: 'Nicht-EU-Bürger' },
        ],
        residencyOptions: [
          { value: 'blue-card', label: 'Blaue Karte' },
          { value: 'visa', label: 'Visum-Aufenthalt' },
          { value: 'permanent', label: 'Unbefristeter Aufenthalt' },
          { value: 'limited', label: 'Befristeter Aufenthalt' },
        ],
        languageOptions: [
          { value: 'german', label: 'Deutsch (German)' },
          { value: 'english', label: 'English' },
          { value: 'urdu', label: 'Urdu (اردو)' },
          { value: 'punjabi', label: 'Punjabi (ਪੰਜਾਬੀ)' },
          { value: 'hindi', label: 'Hindi (हिन्दी)' },
        ],
      }

  return (
    <div className='bg-background min-h-screen flex flex-col font-body text-foreground transition-colors duration-300'>
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main className='flex-grow'>
        {/* Premium Compact Hero */}
        <section className='relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-border/50'>
          <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40'>
             <div className='absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[80px]' />
             <div className='absolute top-[20%] -left-[10%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[60px]' />
          </div>

          <div className='max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center space-y-6'>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20'
            >
              <MessageSquare size={12} className='text-accent' />
              <span className='text-[10px] font-bold tracking-widest uppercase'>Direct Line</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tighter leading-tight text-foreground'
            >
              Initiate <span className='text-primary underline decoration-accent/30 underline-offset-8'>Dialog</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium'
            >
              Our team of expert advisors is ready to engineer your path to German property ownership.
              Available 24/7.
            </motion.p>
          </div>
        </section>

        {/* Unified Contact Grid */}
        <section className='py-12 sm:py-20 px-6 lg:px-8 max-w-7xl mx-auto'>
          <div className='grid lg:grid-cols-12 gap-12'>
            
            {/* Left Column: Contact Cards & Info */}
            <motion.div 
               variants={containerVariants}
               initial='hidden'
               animate='visible'
               className='lg:col-span-5 space-y-6'
            >
              <div className='grid gap-4'>
                 {[
                   { icon: Phone, title: 'Priority Line', val: '+49 151 7161 8082', sub: 'Instant Response' },
                   { icon: Mail, title: 'Digital Drop', val: 'ravinder.singh@baufiking.de', sub: '< 24h Response' },
                   { icon: MapPin, title: 'Headquarters', val: 'Berlin, Germany', sub: 'Schulzendorf 15732' }
                 ].map((item, i) => (
                   <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className='group flex items-center gap-5 p-5 bg-card border border-border rounded-3xl hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300'
                   >
                      <div className='w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-colors'>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className='text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1'>{item.title}</p>
                        <p className='text-lg font-bold text-foreground leading-none mb-1 group-hover:text-primary transition-colors'>{item.val}</p>
                        <p className='text-xs font-medium text-muted-foreground/70'>{item.sub}</p>
                      </div>
                   </motion.div>
                 ))}
              </div>

              {/* Compact Map */}
              <div className='relative aspect-video lg:aspect-[4/3] w-full rounded-[2rem] overflow-hidden border border-border shadow-xl'>
                 <iframe
                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.7433372844675!2d13.5842685!3d52.3569402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a838af000eba8b%3A0x8db91df7ade18b76!2sKr%C3%A4uterpl.%205%2C%2015732%20Schulzendorf%2C%20Germany!5e0!3m2!1sen!2s!4v1740498946518!5m2!1sen!2s'
                    width='100%'
                    height='100%'
                    style={{ border: 0 }}
                    allowFullScreen=''
                    loading='lazy'
                    referrerPolicy='no-referrer-when-downgrade'
                    className='w-full h-full grayscale hover:grayscale-0 transition-all duration-700 dark:invert-[0.9] dark:hue-rotate-180'
                  ></iframe>
              </div>
            </motion.div>

            {/* Right Column: Compact Form */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className='lg:col-span-7'
            >
              <div className='bg-card p-6 sm:p-10 rounded-[2.5rem] border border-border/50 shadow-2xl relative overflow-hidden'>
                 {/* Decorative background blob */}
                 <div className='absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none' />

                 <div className='space-y-2 mb-8 relative z-10'>
                    <h3 className='text-2xl font-heading font-black text-foreground'>Secure Transmission</h3>
                    <p className='text-sm text-muted-foreground font-medium'>
                       Your details are processed via 256-bit encrypted protocol.
                    </p>
                 </div>

                 <AnimatePresence mode='wait'>
                   {!showConfirmation ? (
                     <motion.form
                       key='form'
                       onSubmit={handleSubmit}
                       className='space-y-4 relative z-10'
                       initial={{ opacity: 0, y: 12 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -12 }}
                     >
                       {formError && (
                         <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-200'>
                           {formError}
                         </div>
                       )}

                       <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                         <Input
                           name='firstName'
                           value={formData.firstName}
                           onChange={handleChange}
                           placeholder={copy.firstName}
                           className='h-12 px-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium'
                           required
                         />
                         <Input
                           name='lastName'
                           value={formData.lastName}
                           onChange={handleChange}
                           placeholder={copy.lastName}
                           className='h-12 px-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium'
                           required
                         />
                       </div>

                       <Select onValueChange={(val) => handleSelectChange('euCitizen', val)} value={formData.euCitizen}>
                         <SelectTrigger className='h-12 px-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium text-muted-foreground'>
                           <SelectValue placeholder={copy.euCitizen} />
                         </SelectTrigger>
                         <SelectContent className='rounded-2xl border-border bg-popover'>
                           {copy.euOptions.map((opt) => (
                             <SelectItem key={opt.value} value={opt.value} className='focus:bg-primary focus:text-white rounded-xl mx-1 my-0.5'>
                               {opt.label}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>

                       <AnimatePresence>
                         {isNonEUCitizen && (
                           <motion.div
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: 'auto' }}
                             exit={{ opacity: 0, height: 0 }}
                           >
                             <Select onValueChange={(val) => handleSelectChange('residencyStatus', val)} value={formData.residencyStatus}>
                               <SelectTrigger className='h-12 px-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium text-muted-foreground'>
                                 <SelectValue placeholder={copy.residencyStatus} />
                               </SelectTrigger>
                               <SelectContent className='rounded-2xl border-border bg-popover'>
                                 {copy.residencyOptions.map((opt) => (
                                   <SelectItem key={opt.value} value={opt.value} className='focus:bg-primary focus:text-white rounded-xl mx-1 my-0.5'>
                                     {opt.label}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                           </motion.div>
                         )}
                       </AnimatePresence>

                       <Select onValueChange={(val) => handleSelectChange('preferredLanguage', val)} value={formData.preferredLanguage}>
                         <SelectTrigger className='h-12 px-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium text-muted-foreground'>
                           <SelectValue placeholder={copy.preferredLanguage} />
                         </SelectTrigger>
                         <SelectContent className='rounded-2xl border-border bg-popover'>
                           {copy.languageOptions.map((opt) => (
                             <SelectItem key={opt.value} value={opt.value} className='focus:bg-primary focus:text-white rounded-xl mx-1 my-0.5'>
                               {opt.label}
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>

                       <div className='relative'>
                         <Mail className='absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-4' />
                         <Input
                           type='email'
                           name='email'
                           value={formData.email}
                           onChange={handleChange}
                           placeholder={copy.email}
                           className='h-12 pl-12 pr-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium'
                           required
                         />
                       </div>

                       <div className='relative'>
                         <Phone className='absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-4' />
                         <Input
                           type='tel'
                           name='phone'
                           value={formData.phone}
                           onChange={handleChange}
                           placeholder={copy.phone}
                           className='h-12 pl-12 pr-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium'
                           required
                         />
                       </div>

                       <Textarea
                         name='message'
                         value={formData.message}
                         onChange={handleChange}
                         placeholder={copy.message}
                         className='min-h-[100px] p-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium resize-none'
                       />

                       <Button
                         type='submit'
                         disabled={isSubmitting}
                         className='w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-80 disabled:hover:scale-100'
                       >
                         {isSubmitting ? 'Sending...' : copy.submit}
                         <ArrowRight className='size-5' />
                       </Button>
                     </motion.form>
                   ) : (
                     <motion.div
                       key='success'
                       className='text-center relative z-10'
                       initial={{ opacity: 0, scale: 0.96, y: 8 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.96, y: -8 }}
                     >
                       <div className='rounded-[2rem] border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-xl shadow-blue-500/10 dark:border-blue-500/30 dark:from-blue-950/40 dark:via-slate-950 dark:to-indigo-950/40'>
                         <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30'>
                           <CheckCircle2 className='h-8 w-8' />
                         </div>
                         <h4 className='text-2xl font-heading font-black text-primary dark:text-white'>
                           {copy.successTitle}
                         </h4>
                         <p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
                           {copy.successText}
                         </p>
                         <p className='mt-4 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300'>
                           {copy.submittedAtLabel}: {submittedAt}
                         </p>
                       </div>
                       <Button
                         type='button'
                         variant='outline'
                         onClick={resetForm}
                         className='mt-5 h-12 rounded-2xl font-semibold'
                       >
                         <RotateCcw className='mr-2 h-4 w-4' />
                         {copy.submitAnother}
                       </Button>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </motion.div>

          </div>
        </section>

        {/* High-Contrast Bottom Section */}
        <section className='bg-primary text-primary-foreground py-16 px-6 overflow-hidden'>
           <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10'>
              <div className='space-y-4 max-w-lg text-center md:text-left'>
                 <h2 className='text-3xl font-heading font-black text-slate-50'>Visit Our <span className='text-accent'>HQ</span></h2>
                 <p className='text-primary-foreground/70 font-medium leading-relaxed'>
                    Experience our workflow in person. Coffee is on us. 
                    <br />Open Mon-Fri, 09:00 - 18:00.
                 </p>
              </div>
              
              <div className='flex gap-4'>
                 <div className='p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center min-w-[120px]'>
                    <Clock size={24} className='text-accent mx-auto mb-2' />
                    <p className='text-2xl font-black text-slate-50'>24/7</p>
                    <p className='text-[9px] font-bold uppercase tracking-widest text-slate-400'>Support</p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer language={language} />
    </div>
  )
}

export default ContactPage

ContactPage.propTypes = {
  language: PropTypes.string,
  onLanguageChange: PropTypes.func,
}
