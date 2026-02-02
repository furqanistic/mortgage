// File: client/src/pages/Contact/ContactPage.jsx
import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { Button } from '@/components/ui/button'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 100])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className='bg-background min-h-screen flex flex-col font-body text-foreground transition-colors duration-300'>
      <Navbar />

      <main className='flex-grow'>
        {/* Premium Compact Hero */}
        <section className='relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden border-b border-border/50'>
          <div className='absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40'>
             <div className='absolute -top-[10%] -right-[5%] w-[400px] h-[400px] bg-[#FAC51C]/10 rounded-full blur-[80px]' />
             <div className='absolute top-[20%] -left-[10%] w-[300px] h-[300px] bg-[#155FA0]/5 rounded-full blur-[60px]' />
          </div>

          <div className='max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center space-y-6'>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#155FA0]/10 text-[#155FA0] border border-[#155FA0]/20'
            >
              <MessageSquare size={12} className='text-[#FAC51C]' />
              <span className='text-[10px] font-bold tracking-widest uppercase'>Direct Line</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className='text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tighter leading-tight text-foreground'
            >
              Initiate <span className='text-[#155FA0] underline decoration-[#FAC51C]/30 underline-offset-8'>Dialog</span>
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
                    className='group flex items-center gap-5 p-5 bg-card border border-border rounded-3xl hover:border-[#155FA0]/30 hover:shadow-lg hover:shadow-[#155FA0]/5 transition-all duration-300'
                   >
                      <div className='w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-[#155FA0] group-hover:text-white transition-colors'>
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className='text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1'>{item.title}</p>
                        <p className='text-lg font-bold text-foreground leading-none mb-1 group-hover:text-[#155FA0] transition-colors'>{item.val}</p>
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
                 <div className='absolute top-0 right-0 w-64 h-64 bg-[#155FA0]/5 rounded-full blur-[80px] pointer-events-none' />

                 <div className='space-y-2 mb-8 relative z-10'>
                    <h3 className='text-2xl font-heading font-black text-foreground'>Secure Transmission</h3>
                    <p className='text-sm text-muted-foreground font-medium'>
                       Your details are processed via 256-bit encrypted protocol.
                    </p>
                 </div>

                 <form onSubmit={handleSubmit} className='space-y-4 relative z-10'>
                     <div className='space-y-1.5'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2'>Identity</label>
                        <input 
                          type="text" 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Full Name"
                          className='w-full h-12 px-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-[#155FA0] transition-all text-sm font-medium'
                        />
                     </div>
                     <div className='space-y-1.5'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2'>Contact</label>
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone Number"
                          className='w-full h-12 px-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-[#155FA0] transition-all text-sm font-medium'
                        />
                     </div>

                    <div className='space-y-1.5'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2'>Coordinates</label>
                        <input 
                          type="email" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email Address"
                          className='w-full h-12 px-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-[#155FA0] transition-all text-sm font-medium'
                        />
                    </div>

                    <div className='space-y-1.5'>
                        <label className='text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2'>Directive</label>
                        <textarea 
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="How can we assist your acquisition?"
                          rows={5}
                          className='w-full p-5 rounded-2xl bg-secondary border-none outline-none focus:ring-1 focus:ring-[#155FA0] transition-all text-sm font-medium resize-none'
                        />
                    </div>

                    <div className='flex items-center gap-3 px-2 py-2'>
                       <input 
                         type="checkbox" 
                         id="privacy" 
                         checked={agreedToPrivacy}
                         onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                         className='w-4 h-4 rounded border-border bg-secondary text-[#155FA0] focus:ring-[#155FA0]'
                       />
                       <label htmlFor="privacy" className='text-[11px] font-medium text-muted-foreground cursor-pointer select-none'>
                         I agree to the <span className='text-[#155FA0] font-bold'>Privacy Policy</span> and data processing terms.
                       </label>
                    </div>

                    <Button 
                      disabled={!agreedToPrivacy}
                      className='w-full h-14 bg-[#155FA0] text-primary-foreground rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#155FA0]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed select-none'
                    >
                       Send
                       <Send size={14} />
                    </Button>
                 </form>
              </div>
            </motion.div>

          </div>
        </section>

        {/* High-Contrast Bottom Section */}
        <section className='bg-[#155FA0] text-primary-foreground py-16 px-6 overflow-hidden'>
           <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10'>
              <div className='space-y-4 max-w-lg text-center md:text-left'>
                 <h2 className='text-3xl font-heading font-black text-slate-50'>Visit Our <span className='text-[#FAC51C]'>HQ</span></h2>
                 <p className='text-primary-foreground/70 font-medium leading-relaxed'>
                    Experience our workflow in person. Coffee is on us. 
                    <br />Open Mon-Fri, 09:00 - 18:00.
                 </p>
              </div>
              
              <div className='flex gap-4'>
                 <div className='p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center min-w-[120px]'>
                    <Zap size={24} className='text-[#FAC51C] mx-auto mb-2' />
                    <p className='text-2xl font-black text-slate-50'>&lt; 15</p>
                    <p className='text-[9px] font-bold uppercase tracking-widest text-slate-400'>Min Wait</p>
                 </div>
                 <div className='p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md text-center min-w-[120px]'>
                    <Clock size={24} className='text-[#FAC51C] mx-auto mb-2' />
                    <p className='text-2xl font-black text-slate-50'>24/7</p>
                    <p className='text-[9px] font-bold uppercase tracking-widest text-slate-400'>Support</p>
                 </div>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ContactPage
