import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PencilLine, Plus, Star, Trash2, X } from 'lucide-react'
import Layout from './Layout'
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from '@/services/contentApi'

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
  'h-11 w-full rounded-xl border border-[#d7ddd2] bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0f8a4a] focus:ring-2 focus:ring-[#0f8a4a]/20'

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
    const payload = {
      ...form,
      rating: Number(form.rating),
      displayOrder: Number(form.displayOrder),
    }

    try {
      if (editingId) {
        const updated = await updateTestimonial(editingId, payload)
        setTestimonials((prev) => prev.map((item) => (item._id === editingId ? updated : item)))
        toast.success('Testimonial updated')
      } else {
        const created = await createTestimonial(payload)
        setTestimonials((prev) => [...prev, created])
        toast.success('Testimonial created')
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save testimonial')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout>
      <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='font-heading text-2xl font-bold text-slate-900'>Testimonials</h1>
            <p className='mt-1 text-sm text-slate-500'>Manage “What Our Clients Say” content including location.</p>
          </div>
          <button
            type='button'
            onClick={openCreate}
            className='inline-flex h-10 items-center justify-center rounded-xl bg-[#0f8a4a] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0d7a44] hover:shadow'
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Testimonial
          </button>
        </div>

        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <table className='w-full'>
            <thead className='border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500'>
              <tr>
                <th className='px-4 py-3'>Client</th>
                <th className='px-4 py-3'>Role</th>
                <th className='px-4 py-3'>Location</th>
                <th className='px-4 py-3'>Rating</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[#edf1ea] bg-white'>
              {isLoading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <tr key={index}>
                      <td className='px-4 py-3' colSpan={6}>
                        <div className='h-10 w-full animate-pulse rounded-lg bg-[#f2f5ef]' />
                      </td>
                    </tr>
                  ))
                : sortedTestimonials.map((item) => (
                <tr key={item._id} className='group border-b border-slate-100 last:border-none hover:bg-slate-50/80 transition-colors'>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-3.5'>
                      <div className='flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-sm'>
                        {item.image ? (
                          <img src={item.image} alt={item.name} className='h-full w-full object-cover' onError={(e) => { e.target.style.display='none' }} />
                        ) : (
                          <div className='text-sm font-bold text-slate-400'>{item.name.charAt(0)}</div>
                        )}
                      </div>
                      <div>
                        <div className='font-medium text-slate-900 group-hover:text-[#0f8a4a] transition-colors'>{item.name}</div>
                        <div className='max-w-[280px] truncate text-[13px] text-slate-500'>{item.text}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-sm font-medium text-slate-600'>{item.role || '-'}</td>
                  <td className='px-4 py-4 text-sm text-slate-600'>{item.location || '-'}</td>
                  <td className='px-4 py-4'>
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200/60'>
                      <Star className='h-3 w-3 fill-amber-500 text-amber-500' />
                      {item.rating}
                    </span>
                  </td>
                  <td className='px-4 py-4'>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${item.isActive ? 'border-[#bcf0d4] bg-[#eefaf4] text-[#0d7a44]' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                      {item.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className='px-4 py-4 text-right'>
                    <div className='inline-flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                      <button
                        type='button'
                        onClick={() => openEdit(item)}
                        className='inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900'
                      >
                        <PencilLine className='mr-1.5 h-3.5 w-3.5 text-slate-400' />
                        Edit
                      </button>
                      <button
                        type='button'
                        onClick={async () => {
                          if (!window.confirm('Delete this testimonial?')) return
                          try {
                            await deleteTestimonial(item._id)
                            setTestimonials((prev) => prev.filter((row) => row._id !== item._id))
                            toast.success('Testimonial deleted')
                          } catch (error) {
                            toast.error('Could not delete testimonial')
                          }
                        }}
                        className='inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-white px-3 text-xs font-medium text-red-600 shadow-sm transition-all hover:bg-red-50'
                      >
                        <Trash2 className='mr-1.5 h-3.5 w-3.5 text-red-500' />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm transition-all'>
          <div className='w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='font-heading text-2xl font-bold text-slate-900'>{editingId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button type='button' onClick={() => setIsModalOpen(false)} className='rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'>
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={onSubmit} className='space-y-3'>
              <input name='name' value={form.name} onChange={onChange} placeholder='Client name' className={inputClass} required />
              <div className='grid gap-3 sm:grid-cols-2'>
                <input name='role' value={form.role} onChange={onChange} placeholder='Role' className={inputClass} />
                <input name='location' value={form.location} onChange={onChange} placeholder='Location' className={inputClass} />
              </div>
              <input name='image' value={form.image} onChange={onChange} placeholder='Image URL' className={inputClass} required />
              <textarea
                name='text'
                value={form.text}
                onChange={onChange}
                placeholder='Testimonial text'
                rows={4}
                className='w-full rounded-xl border border-[#d7ddd2] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#0f8a4a] focus:ring-2 focus:ring-[#0f8a4a]/20'
                required
              />
              <div className='grid grid-cols-3 gap-3'>
                <input name='rating' type='number' min='1' max='5' step='0.1' value={form.rating} onChange={onChange} placeholder='Rating' className={inputClass} />
                <input name='displayOrder' type='number' min='0' value={form.displayOrder} onChange={onChange} placeholder='Order' className={inputClass} />
                <label className='inline-flex h-11 items-center gap-2 rounded-xl border border-[#d7ddd2] bg-white px-3 text-sm text-slate-700'>
                  <input name='isActive' type='checkbox' checked={form.isActive} onChange={onChange} className='h-4 w-4 rounded border-[#cfd8c8] text-[#0f8a4a] focus:ring-[#0f8a4a]/20' />
                  Active
                </label>
              </div>
              <div className='flex justify-end gap-2 pt-2'>
                <button type='button' onClick={() => setIsModalOpen(false)} className='h-10 rounded-xl border border-[#d7ddd2] bg-white px-4 text-sm font-medium text-slate-700'>
                  Cancel
                </button>
                <button type='submit' disabled={isSaving} className='h-10 rounded-xl bg-[#0f8a4a] px-4 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-70'>
                  {editingId ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default TestimonialsAdminPage
