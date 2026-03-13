import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { PencilLine, Plus, Star, Trash2, X } from 'lucide-react'
import Layout from './Layout'
import { createPartner, deletePartner, getPartners, updatePartner } from '@/services/contentApi'

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
  'h-11 w-full rounded-xl border border-[#d7ddd2] bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0f8a4a] focus:ring-2 focus:ring-[#0f8a4a]/20'

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
    const payload = {
      ...form,
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      displayOrder: Number(form.displayOrder),
    }

    try {
      if (editingId) {
        const updated = await updatePartner(editingId, payload)
        setPartners((prev) => prev.map((item) => (item._id === editingId ? updated : item)))
        toast.success('Partner updated')
      } else {
        const created = await createPartner(payload)
        setPartners((prev) => [...prev, created])
        toast.success('Partner created')
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save partner')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout>
      <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8'>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h1 className='font-heading text-2xl font-bold text-slate-900'>Partners</h1>
            <p className='mt-1 text-sm text-slate-500'>Manage partner records used in homepage and partners page.</p>
          </div>
          <button
            type='button'
            onClick={openCreate}
            className='inline-flex h-10 items-center justify-center rounded-xl bg-[#0f8a4a] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0d7a44] hover:shadow'
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Partner
          </button>
        </div>

        <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <table className='w-full'>
            <thead className='border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500'>
              <tr>
                <th className='px-4 py-3'>Name</th>
                <th className='px-4 py-3'>Category</th>
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
                : sortedPartners.map((partner) => (
                <tr key={partner._id} className='group border-b border-slate-100 last:border-none hover:bg-slate-50/80 transition-colors'>
                  <td className='px-4 py-4'>
                    <div className='flex items-center gap-3.5'>
                      <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm'>
                        {partner.logoUrl ? (
                          <img src={partner.logoUrl} alt={partner.name} className='max-h-full max-w-full object-contain' onError={(e) => { e.target.style.display='none' }} />
                        ) : (
                          <span className='text-xs font-bold text-slate-400'>N/A</span>
                        )}
                      </div>
                      <div>
                        <div className='font-medium text-slate-900 group-hover:text-[#0f8a4a] transition-colors'>{partner.name}</div>
                        <div className='text-[13px] text-slate-500'>Order: {partner.displayOrder || 0}</div>
                      </div>
                    </div>
                  </td>
                  <td className='px-4 py-4 text-sm font-medium text-slate-600 capitalize'>{partner.category}</td>
                  <td className='px-4 py-4 text-sm text-slate-600'>{partner.location || '-'}</td>
                  <td className='px-4 py-4'>
                    <span className='inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 border border-amber-200/60'>
                      <Star className='h-3 w-3 fill-amber-500 text-amber-500' />
                      {partner.rating}
                    </span>
                  </td>
                  <td className='px-4 py-4'>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${partner.isActive ? 'border-[#bcf0d4] bg-[#eefaf4] text-[#0d7a44]' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                      {partner.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className='px-4 py-4 text-right'>
                    <div className='inline-flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100'>
                      <button
                        type='button'
                        onClick={() => openEdit(partner)}
                        className='inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900'
                      >
                        <PencilLine className='mr-1.5 h-3.5 w-3.5 text-slate-400' />
                        Edit
                      </button>
                      <button
                        type='button'
                        onClick={async () => {
                          if (!window.confirm('Delete this partner?')) return
                          try {
                            await deletePartner(partner._id)
                            setPartners((prev) => prev.filter((item) => item._id !== partner._id))
                            toast.success('Partner deleted')
                          } catch (error) {
                            toast.error('Could not delete partner')
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
              <h2 className='font-heading text-2xl font-bold text-slate-900'>{editingId ? 'Edit Partner' : 'Add Partner'}</h2>
              <button type='button' onClick={() => setIsModalOpen(false)} className='rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'>
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={onSubmit} className='space-y-3'>
              <input name='name' value={form.name} onChange={onChange} placeholder='Partner name' className={inputClass} required />
              <div className='grid gap-3 sm:grid-cols-2'>
                <select name='category' value={form.category} onChange={onChange} className={inputClass}>
                  <option value='finance'>Banking</option>
                  <option value='brokers'>Real Estate</option>
                  <option value='legal'>Legal</option>
                  <option value='inspection'>Inspect</option>
                </select>
                <input name='location' value={form.location} onChange={onChange} placeholder='Location' className={inputClass} />
              </div>
              <input name='logoUrl' value={form.logoUrl} onChange={onChange} placeholder='Logo URL' className={inputClass} required />
              <textarea
                name='description'
                value={form.description}
                onChange={onChange}
                placeholder='Description'
                rows={3}
                className='w-full rounded-xl border border-[#d7ddd2] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#0f8a4a] focus:ring-2 focus:ring-[#0f8a4a]/20'
              />
              <div className='grid grid-cols-3 gap-3'>
                <input name='rating' type='number' min='0' max='5' step='0.1' value={form.rating} onChange={onChange} placeholder='Rating' className={inputClass} />
                <input name='reviews' type='number' min='0' value={form.reviews} onChange={onChange} placeholder='Reviews' className={inputClass} />
                <input name='displayOrder' type='number' min='0' value={form.displayOrder} onChange={onChange} placeholder='Order' className={inputClass} />
              </div>
              <div className='flex items-center gap-5 text-sm text-slate-600'>
                <label className='inline-flex items-center gap-2'>
                  <input name='featured' type='checkbox' checked={form.featured} onChange={onChange} className='h-4 w-4 rounded border-[#cfd8c8] text-[#0f8a4a] focus:ring-[#0f8a4a]/20' />
                  Featured
                </label>
                <label className='inline-flex items-center gap-2'>
                  <input name='isActive' type='checkbox' checked={form.isActive} onChange={onChange} className='h-4 w-4 rounded border-[#cfd8c8] text-[#0f8a4a] focus:ring-[#0f8a4a]/20' />
                  Active
                </label>
              </div>
              <div className='flex justify-end gap-2 pt-2'>
                <button type='button' onClick={() => setIsModalOpen(false)} className='h-10 rounded-xl border border-[#d7ddd2] bg-white px-4 text-sm font-medium text-slate-700'>
                  Cancel
                </button>
                <button type='submit' disabled={isSaving} className='h-10 rounded-xl bg-[#0f8a4a] px-4 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-70'>
                  {editingId ? 'Update Partner' : 'Create Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default PartnersAdminPage
