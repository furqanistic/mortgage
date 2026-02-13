// File: client/src/components/Home/ConsultationModal.jsx
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Mail, Phone, X } from 'lucide-react'
import React, { useState } from 'react'

const ConsultationModal = ({ isOpen, onClose, language = 'de' }) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Consultation Form Submitted:', formData)
    // Here you would typically send the data to your backend
    onClose()
  }

  const isNonEUCitizen = formData.euCitizen === 'non-eu'

  const copy = language === 'en' 
    ? {
        title: 'Book Free Consultation',
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
        title: 'Kostenlose Beratung vereinbaren',
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden border-none bg-white dark:bg-slate-950 shadow-2xl fixed bottom-0 left-0 right-0 top-auto translate-x-0 translate-y-0 w-full max-w-none rounded-t-[2rem] rounded-b-none data-[state=open]:slide-in-from-bottom-6 data-[state=closed]:slide-out-to-bottom-6 sm:fixed sm:top-[50%] sm:left-[50%] sm:bottom-auto sm:right-auto sm:w-full sm:max-w-[500px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-[2.5rem]">
        <div className="p-8 sm:p-10 relative">
          <DialogHeader className="mb-8 pr-6">
            <DialogTitle className="text-3xl sm:text-4xl font-heading font-black text-primary dark:text-white leading-tight">
              Book <span className="text-accent">Free</span> Consultation
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={copy.firstName}
                  className="h-12 px-5 rounded-2xl bg-secondary dark:bg-slate-900 border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                  required
                />
              </div>
              <div className="space-y-1">
                <Input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={copy.lastName}
                  className="h-12 px-5 rounded-2xl bg-secondary dark:bg-slate-900 border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                  required
                />
              </div>
            </div>

            <Select onValueChange={(val) => handleSelectChange('euCitizen', val)} value={formData.euCitizen}>
              <SelectTrigger className="h-12 px-5 rounded-2xl bg-secondary dark:bg-slate-900 border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium text-muted-foreground">
                <SelectValue placeholder={copy.euCitizen} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border bg-popover">
                {copy.euOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="focus:bg-primary focus:text-white rounded-xl mx-1 my-0.5">
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
                  transition={{ duration: 0.3 }}
                >
                  <Select onValueChange={(val) => handleSelectChange('residencyStatus', val)} value={formData.residencyStatus}>
                    <SelectTrigger className="h-12 px-5 rounded-2xl bg-secondary dark:bg-slate-900 border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium text-muted-foreground">
                      <SelectValue placeholder={copy.residencyStatus} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border bg-popover">
                      {copy.residencyOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="focus:bg-primary focus:text-white rounded-xl mx-1 my-0.5">
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </AnimatePresence>

            <Select onValueChange={(val) => handleSelectChange('preferredLanguage', val)} value={formData.preferredLanguage}>
              <SelectTrigger className="h-12 px-5 rounded-2xl bg-secondary dark:bg-slate-900 border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium text-muted-foreground">
                <SelectValue placeholder={copy.preferredLanguage} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-border bg-popover">
                {copy.languageOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="focus:bg-primary focus:text-white rounded-xl mx-1 my-0.5">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={copy.email}
                className="h-12 pl-12 pr-5 rounded-2xl bg-secondary dark:bg-slate-900 border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                required
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={copy.phone}
                className="h-12 pl-12 pr-5 rounded-2xl bg-secondary dark:bg-slate-900 border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium"
                required
              />
            </div>

            <Textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={copy.message}
              className="min-h-[100px] p-5 rounded-2xl bg-secondary dark:bg-slate-900 border-none outline-none focus:ring-1 focus:ring-primary transition-all text-sm font-medium resize-none"
            />

            <Button
              type="submit"
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              {copy.submit}
              <ArrowRight className="size-5" />
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConsultationModal
