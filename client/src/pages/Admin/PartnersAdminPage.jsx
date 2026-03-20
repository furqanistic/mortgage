import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PencilLine, Plus, Star, Trash2, X, Building2, MapPin, Layers, Globe } from 'lucide-react'
import Layout from './Layout'
import { createPartner, deletePartner, getPartners, updatePartner } from '@/services/contentApi'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const emptyPartner = {
  name: '',
  category: 'finance',
  description: '',
  logoUrl: '',
  rating: 4.8,
  reviews: 0,
  featured: false,
  location: 'Nationwide',
  displayOrder: 0,
  isActive: true,
}

const inputClass =
  'h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 outline-none transition-all duration-300 focus:border-primary focus:ring-1 focus:ring-primary shadow-sm'

const PartnersAdminPage = () => {
  const [partners, setPartners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyPartner)

  const sortedPartners = useMemo(
    () => [...partners].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)),
    [partners]
  )

  useEffect(() => {
    const load = async () => {
      try {
        setPartners(await getPartners(true))
      } catch (error) {
        toast.error('Could not load partners')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyPartner)
    setIsModalOpen(true)
  }

  const openEdit = (partner) => {
    setEditingId(partner._id)
    setForm({
      name: partner.name || '',
      category: partner.category || 'finance',
      description: partner.description || '',
      logoUrl: partner.logoUrl || '',
      rating: partner.rating ?? 4.8,
      reviews: partner.reviews ?? 0,
      featured: Boolean(partner.featured),
      location: partner.location || '',
      displayOrder: partner.displayOrder ?? 0,
      isActive: partner.isActive !== false,
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
    const payload = { ...form, rating: Number(form.rating), reviews: Number(form.reviews), displayOrder: Number(form.displayOrder) }
    try {
      if (editingId) {
        const updated = await updatePartner(editingId, payload)
        setPartners((prev) => prev.map((item) => (item._id === editingId ? updated : item)))
        toast.success('Updated')
      } else {
        const created = await createPartner(payload)
        setPartners((prev) => [...prev, created])
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
            <h1 className='text-3xl font-bold tracking-tight text-slate-900 font-heading'>Partner Network</h1>
            <p className='mt-1 text-sm text-slate-500'>Manage service providers and institutions.</p>
          </div>
          <button onClick={openCreate} className='inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-md hover:brightness-110 transition-all font-heading uppercase tracking-wider'>
            <Plus size={18} /> Add Partner
          </button>
        </section>

        <section className='relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7'>
          <div className='overflow-x-auto -mx-6 sm:mx-0'>
            <table className='w-full border-separate border-spacing-y-2 px-6 sm:px-0'>
              <thead>
                <tr className='text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400'>
                  <th className='px-4 pb-2'>Identity</th>
                  <th className='px-4 pb-2'>Sector</th>
                  <th className='px-4 pb-2'>Region</th>
                  <th className='px-4 pb-2'>Score</th>
                  <th className='px-4 pb-2'>Status</th>
                  <th className='px-4 pb-2 text-right'>Action</th>
                </tr>
              </thead>
              <tbody className='space-y-2'>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={6} className='px-4 py-3'><div className='h-12 w-full animate-pulse rounded-2xl bg-slate-100' /></td></tr>
                  ))
                ) : sortedPartners.map((partner) => (
                  <tr key={partner._id} className='group'>
                    <td className='rounded-l-2xl bg-white p-4 border-y border-l border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm'>
                          {partner.logoUrl ? <img src={partner.logoUrl} alt={partner.name} className='max-h-full max-w-full object-contain' /> : <Building2 className='text-slate-200' size={18} />}
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-sm font-bold text-slate-900 group-hover:text-primary transition-colors font-heading uppercase'>{partner.name}</span>
                          <span className='text-[10px] text-slate-400 font-bold tracking-widest uppercase'>Order: {partner.displayOrder}</span>
                        </div>
                      </div>
                    </td>
                    <td className='bg-white p-4 border-y border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <span className='inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase text-slate-600 tracking-wider'>{partner.category}</span>
                    </td>
                    <td className='bg-white p-4 border-y border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className='flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider'>
                        <MapPin size={12} className='text-primary' /> {partner.location || 'Nationwide'}
                      </div>
                    </td>
                    <td className='bg-white p-4 border-y border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className='flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700 border border-amber-200 w-fit'>
                        <Star size={10} className='fill-amber-600 text-amber-600' /> {partner.rating}
                      </div>
                    </td>
                    <td className='bg-white p-4 border-y border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border', partner.isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 text-slate-400 border-slate-200')}>{partner.isActive ? 'Active' : 'Hidden'}</div>
                    </td>
                    <td className='rounded-r-2xl bg-white p-4 text-right border-y border-r border-slate-200 group-hover:bg-slate-50 transition-colors'>
                      <div className='flex items-center justify-end gap-1.5'>
                        <button onClick={() => openEdit(partner)} className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-primary hover:text-white transition-all'><PencilLine size={16} /></button>
                        <button onClick={async () => { if (!window.confirm('Delete?')) return; try { await deletePartner(partner._id); setPartners(prev => prev.filter(i => i._id !== partner._id)); toast.success('Removed'); } catch { toast.error('Failed'); } }} className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-red-500 hover:text-white transition-all'><Trash2 size={16} /></button>
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
              <div className='absolute right-7 top-7'>
                <button onClick={() => setIsModalOpen(false)} className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-500'><X size={20} /></button>
              </div>
              <div className='mb-7'><h2 className='text-3xl font-bold text-slate-900 font-heading tracking-wide uppercase'>Edit Partner</h2></div>
              <form onSubmit={onSubmit} className='space-y-6'>
                <div className='grid gap-6 lg:grid-cols-2'>
                  <div className='space-y-4'>
                    <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Name</label><input name='name' value={form.name} onChange={onChange} placeholder='Organization Name' className={inputClass} required /></div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Sector</label><select name='category' value={form.category} onChange={onChange} className={cn(inputClass, 'appearance-none')}><option value='finance'>Finance</option><option value='brokers'>Brokers</option><option value='legal'>Legal</option><option value='inspection'>Inspection</option></select></div>
                      <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Region</label><input name='location' value={form.location} onChange={onChange} placeholder='Nationwide' className={inputClass} /></div>
                    </div>
                    <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Logo URL</label><input name='logoUrl' value={form.logoUrl} onChange={onChange} placeholder='URL' className={inputClass} required /></div>
                  </div>
                  <div className='space-y-4'>
                    <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Metrics</label><div className='grid grid-cols-3 gap-3'><input name='rating' type='number' step='0.1' value={form.rating} onChange={onChange} className={cn(inputClass, 'text-center font-bold')} /><input name='reviews' type='number' value={form.reviews} onChange={onChange} className={cn(inputClass, 'text-center font-bold')} /><input name='displayOrder' type='number' value={form.displayOrder} onChange={onChange} className={cn(inputClass, 'text-center font-bold')} /></div></div>
                    <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Summary</label><textarea name='description' value={form.description} onChange={onChange} placeholder='Details...' rows={3} className='w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none focus:border-primary' /></div>
                  </div>
                </div>
                <div className='flex items-center gap-4 py-4 border-y border-slate-100'>
                  <label className='flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm'><input name='featured' type='checkbox' checked={form.featured} onChange={onChange} className='h-4 w-4 text-primary' /><span className='text-[10px] font-black uppercase tracking-widest text-slate-600'>Featured</span></label>
                  <label className='flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm'><input name='isActive' type='checkbox' checked={form.isActive} onChange={onChange} className='h-4 w-4 text-primary' /><span className='text-[10px] font-black uppercase tracking-widest text-slate-600'>Active Profile</span></label>
                </div>
                <div className='flex justify-end gap-3'>
                  <button type='button' onClick={() => setIsModalOpen(false)} className='px-6 h-11 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-500'>Cancel</button>
                  <button type='submit' className='px-10 h-11 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest font-heading shadow-lg'>{isSaving ? 'Saving...' : 'Save Partner'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default PartnersAdminPage
