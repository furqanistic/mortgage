import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { PencilLine, Plus, Star, Trash2, X, User, MapPin, Briefcase, UploadCloud, Image } from 'lucide-react'
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
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const imageInputRef = useRef(null)

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
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setEditingId(null)
    setForm(emptyTestimonial)
    setImageFile(null)
    setImagePreview('')
    setIsModalOpen(true)
  }

  const openEdit = (item) => {
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
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
    setImageFile(null)
    setImagePreview(item.image || '')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
    setIsModalOpen(false)
  }

  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const onImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setImageFile(null)
      setImagePreview(form.image || '')
      return
    }

    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const clearSelectedImage = () => {
    if (imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }
    setImageFile(null)
    setImagePreview(form.image || '')
    if (imageInputRef.current) {
      imageInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes = 0) => {
    if (!bytes) return '0 KB'
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!editingId && !imageFile && !form.image) {
      toast.error('Please upload an image or provide an image URL')
      return
    }
    setIsSaving(true)
    const payload = new FormData()
    payload.append('name', form.name)
    payload.append('role', form.role)
    payload.append('location', form.location || '')
    payload.append('text', form.text)
    payload.append('image', form.image || '')
    payload.append('rating', Number(form.rating))
    payload.append('displayOrder', Number(form.displayOrder))
    payload.append('isActive', Boolean(form.isActive))
    if (imageFile) {
      payload.append('imageFile', imageFile)
    }
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
      closeModal()
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

        <section className='relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'>
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[920px] table-fixed'>
              <colgroup>
                <col className='w-[43%]' />
                <col className='w-[14%]' />
                <col className='w-[10%]' />
                <col className='w-[8%]' />
                <col className='w-[10%]' />
                <col className='w-[15%]' />
              </colgroup>
              <thead className='border-b border-slate-200 bg-slate-50/80'>
                <tr className='text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400'>
                  <th className='px-4 py-4 sm:px-6'>Client Context</th>
                  <th className='px-3 py-4 sm:px-4'>Role</th>
                  <th className='px-3 py-4 sm:px-4'>Region</th>
                  <th className='px-3 py-4 sm:px-4'>Rating</th>
                  <th className='px-3 py-4 sm:px-4'>Status</th>
                  <th className='whitespace-nowrap px-4 py-4 text-right sm:px-6'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={6} className='px-6 py-4'>
                        <div className='h-14 w-full animate-pulse rounded-xl bg-slate-100' />
                      </td>
                    </tr>
                  ))
                ) : sortedTestimonials.map((item) => (
                  <tr key={item._id} className='group hover:bg-slate-50/70 transition-colors'>
                    <td className='px-4 py-4 sm:px-6'>
                      <div className='flex min-w-0 items-center gap-3'>
                        <div className='relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-0.5 shadow-sm'>
                          {item.image ? <img src={item.image} alt={item.name} className='h-full w-full rounded-lg object-cover' /> : <div className='flex h-full w-full items-center justify-center text-sm font-black text-slate-300 font-heading'>{item.name.charAt(0)}</div>}
                        </div>
                        <div className='min-w-0 max-w-full'>
                          <p className='truncate text-sm font-extrabold text-slate-900 font-heading uppercase tracking-tight'>{item.name}</p>
                          <p className='mt-1 truncate text-xs italic font-semibold text-slate-500'>"{item.text}"</p>
                        </div>
                      </div>
                    </td>
                    <td className='px-3 py-4 sm:px-4'>
                      <div className='inline-flex max-w-full items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-600'><Briefcase size={12} className='text-primary opacity-60' /> <span className='truncate'>{item.role || 'Client'}</span></div>
                    </td>
                    <td className='px-3 py-4 sm:px-4'>
                      <div className='inline-flex max-w-full items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500'><MapPin size={12} className='text-primary opacity-60' /> <span className='truncate'>{item.location || '-'}</span></div>
                    </td>
                    <td className='px-3 py-4 sm:px-4'>
                      <div className='inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black text-amber-700 border border-amber-200'><Star size={10} className='fill-amber-600 text-amber-600' /> {item.rating}</div>
                    </td>
                    <td className='px-3 py-4 sm:px-4'>
                      <div className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest border', item.isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-slate-100 text-slate-400 border-slate-200')}>{item.isActive ? 'Visible' : 'Archived'}</div>
                    </td>
                    <td className='whitespace-nowrap px-4 py-4 text-right sm:px-6'>
                      <div className='inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-2 py-1 shadow-sm'>
                        <button onClick={() => openEdit(item)} className='flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-primary hover:text-white transition-all'><PencilLine size={16} /></button>
                        <button onClick={async () => { if (!window.confirm('Delete?')) return; try { await deleteTestimonial(item._id); setTestimonials(prev => prev.filter(i => i._id !== item._id)); toast.success('Removed'); } catch { toast.error('Failed'); } }} className='flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-red-500 hover:text-white transition-all'><Trash2 size={16} /></button>
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
              <div className='absolute right-7 top-7'><button onClick={closeModal} className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-500'><X size={20} /></button></div>
              <div className='mb-7'><h2 className='text-3xl font-bold text-slate-900 font-heading uppercase tracking-wide'>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2></div>
              <form onSubmit={onSubmit} className='space-y-6'>
                <div className='grid gap-6 lg:grid-cols-2'>
                  <div className='space-y-4'>
                    <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Client Name</label><div className='relative'><User className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-300' size={14} /><input name='name' value={form.name} onChange={onChange} placeholder='Full Name' className={cn(inputClass, 'pl-9')} required /></div></div>
                    <div className='grid grid-cols-2 gap-4'><div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Category</label><input name='role' value={form.role} onChange={onChange} placeholder='Home Buyer' className={inputClass} /></div><div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Location</label><input name='location' value={form.location} onChange={onChange} placeholder='Berlin' className={inputClass} /></div></div>
                    <div className='space-y-2.5'>
                      <label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Client Image Upload</label>
                      <input ref={imageInputRef} type='file' accept='image/*' onChange={onImageChange} className='hidden' />
                      <div className='rounded-2xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/[0.04] to-slate-50 p-4'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <button type='button' onClick={() => imageInputRef.current?.click()} className='inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm ring-1 ring-primary/20 hover:bg-primary hover:text-white transition-colors'><UploadCloud size={14} /> {imageFile ? 'Replace File' : 'Choose File'}</button>
                          {imageFile && <button type='button' onClick={clearSelectedImage} className='inline-flex h-10 items-center rounded-xl bg-white px-4 text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm ring-1 ring-slate-200 hover:text-red-500 transition-colors'>Remove</button>}
                          <p className='text-[10px] font-bold text-slate-500'>Uploaded image is sent to Cloudinary automatically on save.</p>
                        </div>
                        <div className='mt-3 flex items-start gap-3'>
                          <div className='flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm'>
                            {imagePreview ? (
                              <img src={imagePreview} alt='Selected testimonial image' className='h-full w-full rounded-lg object-cover' />
                            ) : (
                              <div className='flex h-full w-full items-center justify-center rounded-lg bg-slate-50 text-slate-300'>
                                <Image size={18} />
                              </div>
                            )}
                          </div>
                          {imageFile && (
                            <div className='space-y-1 pt-1'>
                              <p className='text-[11px] font-black uppercase tracking-wider text-slate-700'>{imageFile.name}</p>
                              <p className='text-[10px] font-bold uppercase tracking-wider text-slate-500'>{formatFileSize(imageFile.size)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Image URL (Optional)</label><input name='image' value={form.image} onChange={onChange} placeholder='https://...' className={inputClass} /></div>
                  </div>
                  <div className='space-y-4'>
                    <div><label className='mb-1.5 block text-[10px] font-black uppercase tracking-widest text-slate-500 px-1'>Review Narrative</label><textarea name='text' value={form.text} onChange={onChange} placeholder='Narrative...' rows={8} className='min-h-[220px] w-full rounded-xl border border-slate-300 bg-white p-3 text-sm outline-none focus:border-primary' required /></div>
                    <div className='grid grid-cols-2 gap-4'><input name='rating' type='number' min='1' max='5' step='0.1' value={form.rating} onChange={onChange} className={cn(inputClass, 'text-center font-bold')} /><input name='displayOrder' type='number' value={form.displayOrder} onChange={onChange} className={cn(inputClass, 'text-center font-bold')} /></div>
                  </div>
                </div>
                <div className='flex items-center justify-between py-4 border-y border-slate-100'>
                  <label className='flex cursor-pointer items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm'><input name='isActive' type='checkbox' checked={form.isActive} onChange={onChange} className='h-4 w-4 text-primary' /><span className='text-[10px] font-black uppercase tracking-widest text-slate-600'>Visible Online</span></label>
                  <div className='flex gap-3'><button type='button' onClick={closeModal} className='px-6 h-11 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-500'>Cancel</button><button type='submit' className='px-10 h-11 rounded-xl bg-primary text-white font-bold text-xs uppercase tracking-widest font-heading shadow-lg'>{isSaving ? 'Processing...' : 'Save & Publish'}</button></div>
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
