import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PencilLine, Plus, Star, Trash2, X, Quote, User, MapPin, Briefcase } from 'lucide-react'
import Layout from './Layout'
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from '@/services/contentApi'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const emptyTestimonial = {
  name: '',
  role: 'Home Buyer',
  location: '',
  text: '',
  image: '',
  rating: 5,
  displayOrder: 0,
  isActive: true,
}

const inputClass =
  'h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-primary shadow-sm'

const TestimonialsAdminPage = () => {
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyTestimonial)

  const sortedTestimonials = useMemo(
    () => [...testimonials].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
    [testimonials]
  )

  useEffect(() => {
    const load = async () => {
      try {
        setTestimonials(await getTestimonials(true))
      } catch (error) {
        toast.error('Could not load testimonials')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyTestimonial)
    setIsModalOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item._id)
    setForm({
      name: item.name || '',
      role: item.role || 'Home Buyer',
      location: item.location || '',
      text: item.text || '',
      image: item.image || '',
      rating: item.rating ?? 5,
      displayOrder: item.displayOrder ?? 0,
      isActive: item.isActive !== false,
    })
    setIsModalOpen(true)
  }

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    const payload = { ...form, rating: Number(form.rating), displayOrder: Number(form.displayOrder) }
    try {
      if (editingId) {
        const updated = await updateTestimonial(editingId, payload)
        setTestimonials((prev) => prev.map((item) => (item._id === editingId ? updated : item)))
        toast.success('Updated')
      } else {
        const created = await createTestimonial(payload)
        setTestimonials((prev) => [...prev, created])
        toast.success('Added')
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error('Failed')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout>
      <div className='flex flex-col gap-6'>
        <section className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight text-slate-900 font-heading'>Service Impact</h1>
            <p className='mt-1 text-sm text-slate-500 max-w-2xl'>Manage client experiences and feedback.</p>
          </div>
          <button onClick={openCreate} className='inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-95 font-heading uppercase tracking-wider'>
            <Plus size={18} /> Capture Voice
          </button>
        </section>

        <section className='relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7'>
          <div className='overflow-x-auto -mx-6 sm:mx-0'>
            <table className='w-full border-separate border-spacing-y-2 px-6 sm:px-0'>
              <thead>
                <tr className='text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400'>
                  <th className='px-4 pb-2'>Client Context</th>
                  <th className='px-4 pb-2'>Role</th>
                  <th className='px-4 pb-2'>Region</th>
                  <th className='px-4 pb-2'>Rating</th>
                  <th className='px-4 pb-2'>Status</th>
                  <th className='px-4 pb-2 text-right'>Action</th>
                </tr>
              </thead>
              <tbody className='space-y-2'>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className='px-4 py-3'><div className='h-12 w-full animate-pulse rounded-2xl bg-slate-100' /></td></tr>
                  ))
                ) : sortedTestimonials.map((item) => (
                  <tr key={item._id} className='group'>
                    <td className='rounded-l-2xl bg-white p-4 border-y border-l border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className='flex items-center gap-3'>
                        <div className='relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-0.5 shadow-sm'>
                          {item.image ? <img src={item.image} alt={item.name} className='h-full w-full object-cover rounded-md' /> : <div className='flex h-full w-full items-center justify-center text-sm font-black text-slate-300 font-heading'>{item.name.charAt(0)}</div>}
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-sm font-bold text-slate-900 group-hover:text-primary transition-colors font-heading uppercase tracking-wide'>{item.name}</span>
                          <span className='mt-0.5 text-[10px] text-slate-400 font-bold italic line-clamp-1 max-w-[200px] block'>"{item.text}"</span>
                        </div>
                      </div>
                    </td>
                    <td className='bg-white p-4 border-y border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className='flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-600 tracking-wider'><Briefcase size={12} className='text-primary opacity-60' /> {item.role || 'Client'}</div>
                    </td>
                    <td className='bg-white p-4 border-y border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className='flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider'><MapPin size={12} className='text-primary opacity-60' /> {item.location || '-'}</div>
                    </td>
                    <td className='bg-white p-4 border-y border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className='flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700 border border-amber-200 w-fit'><Star size={10} className='fill-amber-600 text-amber-600' /> {item.rating}</div>
                    </td>
                    <td className='bg-white p-4 border-y border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border', item.isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 text-slate-400 border-slate-200')}>{item.isActive ? 'Visible' : 'Archived'}</div>
                    </td>
                    <td className='rounded-r-2xl bg-white p-4 text-right border-y border-r border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className='flex items-center justify-end gap-1.5'>
                        <button onClick={() => openEdit(item)} className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-primary hover:text-white transition-all'><PencilLine size={16} /></button>
                        <button onClick={async () => { if (!window.confirm('Delete?')) return; try { await deleteTestimonial(item._id); setTestimonials(prev => prev.filter(i => i._id !== item._id)); toast.success('Removed'); } catch { toast.error('Failed'); } }} className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-red-500 hover:text-white transition-all'><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='fixed inset-0 z-[100] grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6'>
            <motion.div initial={{ scale: 0.98, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, y: 10 }} className='relative w-full max-w-3xl rounded-[2rem] border border-slate-300 bg-white p-7 shadow-2xl'>
              <div className='absolute right-7 top-7'><button onClick={() => setIsModalOpen(false)} className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-500'><X size={20} /></button></div>
              <div className='mb-7'><h2 className='text-3xl font-bold text-slate-900 font-heading uppercase tracking-wide'>Edit Testimonial</h2></div>
              <form onSubmit={onSubmit} className='space-y-6'>
                <div className='grid gap-6 lg:grid-cols-2'>
                  <div className='space-y-4'>
                    <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Client Name</label><div className='relative'><User className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300' size={14} /><input name='name' value={form.name} onChange={onChange} placeholder='Full Name' className={cn(inputClass, 'pl-9')} required /></div></div>
                    <div className='grid grid-cols-2 gap-4'><div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Category</label><input name='role' value={form.role} onChange={onChange} placeholder='Home Buyer' className={inputClass} /></div><div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Location</label><input name='location' value={form.location} onChange={onChange} placeholder='Berlin' className={inputClass} /></div></div>
                    <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Portrait URL</label><input name='image' value={form.image} onChange={onChange} placeholder='URL' className={inputClass} required /></div>
                  </div>
                  <div className='space-y-4'>
                    <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Review Narrative</label><textarea name='text' value={form.text} onChange={onChange} placeholder='Narrative...' rows={5} className='w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none focus:border-primary' required /></div>
                    <div className='grid grid-cols-2 gap-4'><input name='rating' type='number' min='1' max='5' step='0.1' value={form.rating} onChange={onChange} className={cn(inputClass, 'text-center font-bold')} /><input name='displayOrder' type='number' value={form.displayOrder} onChange={onChange} className={cn(inputClass, 'text-center font-bold')} /></div>
                  </div>
                </div>
                <div className='flex items-center justify-between py-4 border-y border-slate-100'>
                  <label className='flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm'><input name='isActive' type='checkbox' checked={form.isActive} onChange={onChange} className='h-4 w-4 text-primary' /><span className='text-[10px] font-black uppercase tracking-widest text-slate-600'>Visible Online</span></label>
                  <div className='flex gap-3'><button type='button' onClick={() => setIsModalOpen(false)} className='px-6 h-11 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-500'>Cancel</button><button type='submit' className='px-10 h-11 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest font-heading shadow-lg'>{isSaving ? 'Processing...' : 'Save & Publish'}</button></div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default TestimonialsAdminPage
