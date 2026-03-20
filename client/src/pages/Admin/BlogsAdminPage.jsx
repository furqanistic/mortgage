import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Eye, PencilLine, Plus, Trash2, X } from 'lucide-react'
import Layout from './Layout'
import { createBlog, deleteBlog, getBlogs, updateBlog } from '@/services/contentApi'
import { renderLegacyArticleToHtml } from '@/pages/Blog/BlogPage'

const createEmptySection = () => ({
  heading: '',
  paragraphs: [''],
  bullets: [],
  tableRows: [],
  quote: '',
  tip: '',
})

const createEmptyBlogForm = () => ({
  title: '',
  slug: '',
  excerpt: '',
  category: '',
  coverImage: '',
  readTime: '',
  isLive: true,
  displayOrder: 0,
  authorName: '',
  structuredContent: {
    lead: [''],
    sections: [createEmptySection()],
  },
})

const inputClass =
  'h-11 w-full rounded-xl border border-[#d7ddd2] bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0f8a4a] focus:ring-2 focus:ring-[#0f8a4a]/20'

const normalizeSlug = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

const formatDate = (iso) => {
  if (!iso) return 'Draft'
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))

const sanitizeStructuredContent = (structuredContent, fallbackExcerpt = '') => {
  const source = structuredContent && typeof structuredContent === 'object' ? deepClone(structuredContent) : {}
  const lead = Array.isArray(source.lead) ? source.lead : []
  const sections = Array.isArray(source.sections) ? source.sections : []

  const normalizedSections = sections
    .map((section) => ({
      heading: section?.heading || '',
      paragraphs: Array.isArray(section?.paragraphs) ? section.paragraphs : [],
      bullets: Array.isArray(section?.bullets) ? section.bullets : [],
      tableRows: Array.isArray(section?.tableRows)
        ? section.tableRows.map((row) => ({
            label: row?.label || '',
            value: row?.value || '',
            tone: row?.tone || '',
          }))
        : [],
      quote: section?.quote || '',
      tip: section?.tip || '',
    }))
    .filter((section) => section.heading || section.paragraphs.length || section.bullets.length || section.tableRows.length || section.quote || section.tip)

  if (normalizedSections.length === 0) {
    normalizedSections.push({
      heading: '',
      paragraphs: [fallbackExcerpt || ''],
      bullets: [],
      tableRows: [],
      quote: '',
      tip: '',
    })
  }

  return {
    lead: lead.length ? lead : [fallbackExcerpt || 'Write a short intro banner here.'],
    sections: normalizedSections,
  }
}

const BlogsAdminPage = () => {
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(createEmptyBlogForm())
  const [activePreview, setActivePreview] = useState(null)

  const sortedBlogs = useMemo(
    () => [...blogs].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)),
    [blogs]
  )
  const stats = useMemo(() => {
    const published = blogs.filter((item) => item.isLive).length
    const drafts = blogs.length - published
    return { total: blogs.length, published, drafts }
  }, [blogs])

  useEffect(() => {
    const load = async () => {
      try {
        setBlogs(await getBlogs(true))
      } catch (error) {
        toast.error('Could not load blogs')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(createEmptyBlogForm())
    setIsModalOpen(true)
  }

  const openEdit = (blog) => {
    const structuredContent = sanitizeStructuredContent(
      blog.structuredContent,
      blog.excerpt || ''
    )

    setEditingId(blog._id)
    setForm({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      category: blog.category || '',
      coverImage: blog.coverImage || '',
      readTime: blog.readTime || '',
      isLive: Boolean(blog.isLive),
      displayOrder: blog.displayOrder ?? 0,
      authorName: blog.authorName || '',
      structuredContent,
    })
    setIsModalOpen(true)
  }

  const onChange = (event) => {
    const { name, value, type, checked } = event.target

    if (name === 'title') {
      setForm((prev) => {
        const next = { ...prev, title: value }
        if (!editingId || prev.slug === normalizeSlug(prev.title)) {
          next.slug = normalizeSlug(value)
        }
        return next
      })
      return
    }

    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const updateStructuredContent = (updater) => {
    setForm((prev) => ({
      ...prev,
      structuredContent: updater(deepClone(prev.structuredContent)),
    }))
  }

  const updateLeadItem = (index, value) => {
    updateStructuredContent((structuredContent) => {
      structuredContent.lead[index] = value
      return structuredContent
    })
  }

  const addLeadItem = () => {
    updateStructuredContent((structuredContent) => {
      structuredContent.lead.push('')
      return structuredContent
    })
  }

  const removeLeadItem = (index) => {
    updateStructuredContent((structuredContent) => {
      if (structuredContent.lead.length <= 1) return structuredContent
      structuredContent.lead.splice(index, 1)
      return structuredContent
    })
  }

  const updateSection = (sectionIndex, key, value) => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex][key] = value
      return structuredContent
    })
  }

  const addSection = () => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections.push(createEmptySection())
      return structuredContent
    })
  }

  const removeSection = (sectionIndex) => {
    updateStructuredContent((structuredContent) => {
      if (structuredContent.sections.length <= 1) return structuredContent
      structuredContent.sections.splice(sectionIndex, 1)
      return structuredContent
    })
  }

  const updateSectionListItem = (sectionIndex, key, itemIndex, value) => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex][key][itemIndex] = value
      return structuredContent
    })
  }

  const addSectionListItem = (sectionIndex, key, defaultValue = '') => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex][key].push(defaultValue)
      return structuredContent
    })
  }

  const removeSectionListItem = (sectionIndex, key, itemIndex, keepOne = false) => {
    updateStructuredContent((structuredContent) => {
      const list = structuredContent.sections[sectionIndex][key]
      if (keepOne && list.length <= 1) return structuredContent
      list.splice(itemIndex, 1)
      return structuredContent
    })
  }

  const updateTableRow = (sectionIndex, rowIndex, key, value) => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex].tableRows[rowIndex][key] = value
      return structuredContent
    })
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)

    const normalizedStructuredContent = sanitizeStructuredContent(form.structuredContent, form.excerpt)
    const payload = {
      ...form,
      slug: normalizeSlug(form.slug || form.title),
      displayOrder: Number(form.displayOrder) || 0,
      structuredContent: normalizedStructuredContent,
      contentHtml: renderLegacyArticleToHtml(normalizedStructuredContent),
    }

    if (!payload.slug) {
      toast.error('Please add a title or slug')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        const updated = await updateBlog(editingId, payload)
        setBlogs((prev) => prev.map((item) => (item._id === editingId ? updated : item)))
        toast.success('Blog updated')
      } else {
        const created = await createBlog(payload)
        setBlogs((prev) => [...prev, created])
        toast.success('Blog created')
      }
      setIsModalOpen(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save blog')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout>
      <div className='relative overflow-hidden rounded-3xl border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbf7_100%)] p-6 shadow-sm sm:p-8'>
        <div className='pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#0f8a4a]/10 blur-3xl' />
        <div className='pointer-events-none absolute -left-12 bottom-0 h-44 w-44 rounded-full bg-[#c19a6b]/10 blur-3xl' />

        <div className='relative mb-6 flex flex-wrap items-end justify-between gap-4'>
          <div>
            <p className='text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0f8a4a]'>Editorial Studio</p>
            <h1 className='mt-1 font-heading text-[clamp(1.6rem,3vw,2.3rem)] font-bold text-slate-900'>Blogs</h1>
            <p className='mt-1 text-sm text-slate-600'>Structured writer flow that keeps every article consistent with your live blog design.</p>
          </div>
          <div className='flex items-center gap-2'>
            <div className='hidden rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 sm:block'>
              {stats.total} total · {stats.published} live · {stats.drafts} drafts
            </div>
            <button
              type='button'
              onClick={openCreate}
              className='inline-flex h-10 items-center justify-center rounded-xl bg-[#0f8a4a] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0d7a44] hover:shadow'
            >
              <Plus className='mr-2 h-4 w-4' />
              New Blog
            </button>
          </div>
        </div>

        <div className='relative overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm'>
          <table className='w-full min-w-[920px]'>
            <thead className='border-b border-slate-200 bg-[#f6f8f5] text-left text-xs font-semibold uppercase tracking-wider text-slate-500'>
              <tr>
                <th className='px-4 py-3'>Title</th>
                <th className='px-4 py-3'>Category</th>
                <th className='px-4 py-3'>Status</th>
                <th className='px-4 py-3'>Published</th>
                <th className='px-4 py-3'>Slug</th>
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
                : sortedBlogs.map((blog) => (
                    <tr key={blog._id} className='border-b border-slate-100 last:border-none hover:bg-[#f8fbf7] transition-colors'>
                      <td className='px-4 py-4'>
                        <div className='font-medium text-slate-900 transition-colors'>{blog.title}</div>
                        <div className='max-w-[360px] truncate text-[13px] text-slate-500'>{blog.excerpt || 'No excerpt'}</div>
                      </td>
                      <td className='px-4 py-4 text-sm text-slate-600'>{blog.category || '-'}</td>
                      <td className='px-4 py-4'>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${blog.isLive ? 'border-[#bcf0d4] bg-[#eefaf4] text-[#0d7a44]' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                          {blog.isLive ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className='px-4 py-4 text-sm text-slate-600'>{formatDate(blog.datePublished)}</td>
                      <td className='px-4 py-4 text-sm text-slate-600'>{blog.slug}</td>
                      <td className='sticky right-0 bg-white/95 px-4 py-4 text-right backdrop-blur-sm'>
                        <div className='flex flex-wrap items-center justify-end gap-2'>
                          <button
                            type='button'
                            onClick={() => setActivePreview(blog)}
                            className='inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900'
                          >
                            <Eye className='mr-1.5 h-3.5 w-3.5 text-slate-400' />
                            Preview
                          </button>
                          <button
                            type='button'
                            onClick={() => openEdit(blog)}
                            className='inline-flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900'
                          >
                            <PencilLine className='mr-1.5 h-3.5 w-3.5 text-slate-400' />
                            Edit
                          </button>
                          <button
                            type='button'
                            onClick={async () => {
                              if (!window.confirm('Delete this blog post?')) return
                              try {
                                await deleteBlog(blog._id)
                                setBlogs((prev) => prev.filter((row) => row._id !== blog._id))
                                toast.success('Blog deleted')
                              } catch (error) {
                                toast.error('Could not delete blog')
                              }
                            }}
                            className='inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-white px-2.5 text-xs font-medium text-red-600 shadow-sm transition-all hover:bg-red-50'
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
        <div className='fixed inset-0 z-50 overflow-y-auto bg-slate-900/55 p-4 backdrop-blur-sm'>
          <div className='mx-auto w-full max-w-7xl rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-7'>
            <div className='mb-6 flex items-center justify-between'>
              <h2 className='font-heading text-2xl font-bold text-slate-900'>{editingId ? 'Edit Blog' : 'New Blog'}</h2>
              <button type='button' onClick={() => setIsModalOpen(false)} className='rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'>
                <X className='h-5 w-5' />
              </button>
            </div>

            <form onSubmit={onSubmit} className='grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]'>
              <aside className='h-fit rounded-2xl border border-[#d7ddd2] bg-[#f8fbf7] p-4 lg:sticky lg:top-5'>
                <h3 className='font-heading text-lg font-bold text-slate-900'>Post Setup</h3>
                <p className='mt-1 text-xs text-slate-600'>Set metadata first, then compose sections on the right.</p>

                <div className='mt-4 space-y-3'>
                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600'>Blog Title</label>
                    <input name='title' value={form.title} onChange={onChange} placeholder='Example: How to buy property in Berlin' className={inputClass} required />
                  </div>

                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600'>Page Link (URL)</label>
                    <input name='slug' value={form.slug} onChange={onChange} placeholder='Example: how-to-buy-property-in-berlin' className={inputClass} required />
                    <p className='mt-1 text-[11px] text-slate-500'>This is the website link part. It is auto-created from the title, but you can edit it.</p>
                  </div>

                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600'>Short Summary</label>
                    <textarea
                      name='excerpt'
                      value={form.excerpt}
                      onChange={onChange}
                      placeholder='1-2 short lines people see in the blog list.'
                      rows={4}
                      className='w-full rounded-xl border border-[#d7ddd2] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#0f8a4a] focus:ring-2 focus:ring-[#0f8a4a]/20'
                      required
                    />
                  </div>

                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600'>Category Label</label>
                    <input name='category' value={form.category} onChange={onChange} placeholder='Example: Buyer Guide' className={inputClass} />
                  </div>

                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600'>Estimated Reading Time</label>
                    <input name='readTime' value={form.readTime} onChange={onChange} placeholder='Example: 8 min' className={inputClass} />
                  </div>

                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600'>Author Name</label>
                    <input name='authorName' value={form.authorName} onChange={onChange} placeholder='Who wrote this blog?' className={inputClass} />
                  </div>

                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600'>Display Order</label>
                    <input name='displayOrder' type='number' min='0' value={form.displayOrder} onChange={onChange} placeholder='0' className={inputClass} />
                    <p className='mt-1 text-[11px] text-slate-500'>Smaller number appears higher in blog list.</p>
                  </div>

                  <div>
                    <label className='mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600'>Cover Image Link</label>
                    <input name='coverImage' value={form.coverImage} onChange={onChange} placeholder='Paste image URL or /blog/your-image.png' className={inputClass} />
                  </div>

                  <label className='inline-flex h-11 items-center gap-2 rounded-xl border border-[#d7ddd2] bg-white px-3 text-sm text-slate-700'>
                    <input name='isLive' type='checkbox' checked={form.isLive} onChange={onChange} className='h-4 w-4 rounded border-[#cfd8c8] text-[#0f8a4a] focus:ring-[#0f8a4a]/20' />
                    Publish now (show on blog page)
                  </label>
                </div>
              </aside>

              <div className='space-y-5'>

              <section className='rounded-2xl border border-[#d7ddd2] bg-[#f9fbf8] p-4'>
                <div className='mb-3 flex items-center justify-between'>
                  <h3 className='font-heading text-lg font-bold text-slate-900'>Intro Banner (Before TOC)</h3>
                  <button type='button' onClick={addLeadItem} className='rounded-lg border border-[#d7ddd2] bg-white px-3 py-1 text-xs font-semibold text-slate-700'>
                    + Add Intro Paragraph
                  </button>
                </div>
                <div className='space-y-3'>
                  {form.structuredContent.lead.map((paragraph, leadIndex) => (
                    <div key={`lead-${leadIndex}`} className='rounded-xl border border-[#d7ddd2] bg-white p-3'>
                      <div className='mb-2 flex items-center justify-between text-xs font-semibold text-slate-500'>
                        <span>Intro Paragraph {leadIndex + 1}</span>
                        <button type='button' onClick={() => removeLeadItem(leadIndex)} className='text-red-600'>
                          Remove
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={paragraph}
                        onChange={(event) => updateLeadItem(leadIndex, event.target.value)}
                        className='w-full rounded-lg border border-[#d7ddd2] px-3 py-2 text-sm outline-none focus:border-[#0f8a4a]'
                        placeholder='Write intro paragraph...'
                      />
                    </div>
                  ))}
                </div>
              </section>

              <section className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-heading text-lg font-bold text-slate-900'>Sections</h3>
                  <button type='button' onClick={addSection} className='rounded-lg bg-[#0f8a4a] px-3 py-1.5 text-xs font-semibold text-white'>
                    + Add Section
                  </button>
                </div>

                {form.structuredContent.sections.map((section, sectionIndex) => (
                  <div key={`section-${sectionIndex}`} className='rounded-2xl border border-[#d7ddd2] bg-white p-4'>
                    <div className='mb-3 flex items-center justify-between'>
                      <h4 className='text-sm font-bold text-slate-900'>Section {sectionIndex + 1}</h4>
                      <button type='button' onClick={() => removeSection(sectionIndex)} className='text-xs font-semibold text-red-600'>
                        Remove Section
                      </button>
                    </div>

                    <input
                      value={section.heading}
                      onChange={(event) => updateSection(sectionIndex, 'heading', event.target.value)}
                      className={inputClass}
                      placeholder='Section Heading'
                      required
                    />

                    <div className='mt-3 rounded-xl border border-[#e1e7db] bg-[#f9fbf8] p-3'>
                      <div className='mb-2 flex items-center justify-between'>
                        <p className='text-xs font-semibold text-slate-600'>Paragraphs</p>
                        <button type='button' onClick={() => addSectionListItem(sectionIndex, 'paragraphs', '')} className='text-xs font-semibold text-[#0f8a4a]'>
                          + Add Paragraph
                        </button>
                      </div>
                      <div className='space-y-2'>
                        {section.paragraphs.map((paragraph, paragraphIndex) => (
                          <div key={`section-${sectionIndex}-paragraph-${paragraphIndex}`} className='rounded-lg border border-[#d7ddd2] bg-white p-2'>
                            <div className='mb-1 flex items-center justify-between text-xs text-slate-500'>
                              <span>Paragraph {paragraphIndex + 1}</span>
                              <button
                                type='button'
                                onClick={() => removeSectionListItem(sectionIndex, 'paragraphs', paragraphIndex, true)}
                                className='text-red-600'
                              >
                                Remove
                              </button>
                            </div>
                            <textarea
                              rows={3}
                              value={paragraph}
                              onChange={(event) => updateSectionListItem(sectionIndex, 'paragraphs', paragraphIndex, event.target.value)}
                              className='w-full rounded-lg border border-[#d7ddd2] px-2 py-1.5 text-sm outline-none focus:border-[#0f8a4a]'
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='mt-3 rounded-xl border border-[#e1e7db] bg-[#f9fbf8] p-3'>
                      <div className='mb-2 flex items-center justify-between'>
                        <p className='text-xs font-semibold text-slate-600'>Bullet Points</p>
                        <button type='button' onClick={() => addSectionListItem(sectionIndex, 'bullets', '')} className='text-xs font-semibold text-[#0f8a4a]'>
                          + Add Bullet
                        </button>
                      </div>
                      <div className='space-y-2'>
                        {section.bullets.map((bullet, bulletIndex) => (
                          <div key={`section-${sectionIndex}-bullet-${bulletIndex}`} className='flex items-center gap-2'>
                            <input
                              value={bullet}
                              onChange={(event) => updateSectionListItem(sectionIndex, 'bullets', bulletIndex, event.target.value)}
                              className='h-10 w-full rounded-lg border border-[#d7ddd2] px-3 text-sm outline-none focus:border-[#0f8a4a]'
                              placeholder='Bullet point text'
                            />
                            <button type='button' onClick={() => removeSectionListItem(sectionIndex, 'bullets', bulletIndex)} className='text-xs font-semibold text-red-600'>
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='mt-3 rounded-xl border border-[#e1e7db] bg-[#f9fbf8] p-3'>
                      <div className='mb-2 flex items-center justify-between'>
                        <p className='text-xs font-semibold text-slate-600'>Table Rows</p>
                        <button
                          type='button'
                          onClick={() => addSectionListItem(sectionIndex, 'tableRows', { label: '', value: '', tone: '' })}
                          className='text-xs font-semibold text-[#0f8a4a]'
                        >
                          + Add Table Row
                        </button>
                      </div>
                      <div className='space-y-2'>
                        {section.tableRows.map((row, rowIndex) => (
                          <div key={`section-${sectionIndex}-row-${rowIndex}`} className='grid gap-2 sm:grid-cols-12'>
                            <input
                              value={row.label}
                              onChange={(event) => updateTableRow(sectionIndex, rowIndex, 'label', event.target.value)}
                              className='h-10 rounded-lg border border-[#d7ddd2] px-3 text-sm outline-none focus:border-[#0f8a4a] sm:col-span-4'
                              placeholder='Label'
                            />
                            <input
                              value={row.value}
                              onChange={(event) => updateTableRow(sectionIndex, rowIndex, 'value', event.target.value)}
                              className='h-10 rounded-lg border border-[#d7ddd2] px-3 text-sm outline-none focus:border-[#0f8a4a] sm:col-span-5'
                              placeholder='Value'
                            />
                            <select
                              value={row.tone || ''}
                              onChange={(event) => updateTableRow(sectionIndex, rowIndex, 'tone', event.target.value)}
                              className='h-10 rounded-lg border border-[#d7ddd2] bg-white px-2 text-sm outline-none focus:border-[#0f8a4a] sm:col-span-2'
                            >
                              <option value=''>Normal</option>
                              <option value='success'>Success</option>
                              <option value='warning'>Warning</option>
                            </select>
                            <button
                              type='button'
                              onClick={() => removeSectionListItem(sectionIndex, 'tableRows', rowIndex)}
                              className='h-10 text-xs font-semibold text-red-600 sm:col-span-1'
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='mt-3 grid gap-3 sm:grid-cols-2'>
                      <textarea
                        rows={3}
                        value={section.quote}
                        onChange={(event) => updateSection(sectionIndex, 'quote', event.target.value)}
                        className='w-full rounded-xl border border-[#d7ddd2] px-3 py-2 text-sm outline-none focus:border-[#0f8a4a]'
                        placeholder='Quote (optional)'
                      />
                      <textarea
                        rows={3}
                        value={section.tip}
                        onChange={(event) => updateSection(sectionIndex, 'tip', event.target.value)}
                        className='w-full rounded-xl border border-[#d7ddd2] px-3 py-2 text-sm outline-none focus:border-[#0f8a4a]'
                        placeholder='Baufiking tip (optional)'
                      />
                    </div>
                  </div>
                ))}
              </section>

              <div className='flex justify-end gap-2 pt-2'>
                <button type='button' onClick={() => setIsModalOpen(false)} className='h-10 rounded-xl border border-[#d7ddd2] bg-white px-4 text-sm font-medium text-slate-700'>
                  Cancel
                </button>
                <button type='submit' disabled={isSaving} className='h-10 rounded-xl bg-[#0f8a4a] px-4 text-sm font-semibold text-white hover:brightness-105 disabled:opacity-70'>
                  {editingId ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {activePreview && (
        <div className='fixed inset-0 z-[60] overflow-y-auto bg-slate-900/55 p-4 backdrop-blur-sm'>
          <div className='mx-auto w-full max-w-4xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8'>
            <div className='mb-4 flex items-start justify-between gap-4'>
              <div>
                <p className='text-[11px] uppercase tracking-[0.22em] text-[#946b33]'>{activePreview.category}</p>
                <h3 className='font-heading text-2xl font-bold text-slate-900'>{activePreview.title}</h3>
                <p className='mt-1 text-sm text-slate-500'>{activePreview.excerpt}</p>
              </div>
              <button type='button' onClick={() => setActivePreview(null)} className='rounded-xl p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600'>
                <X className='h-5 w-5' />
              </button>
            </div>
            <div
              className='blog-rich-content max-h-[68vh] overflow-y-auto rounded-2xl border border-slate-200 p-6'
              dangerouslySetInnerHTML={{ __html: activePreview.contentHtml || '' }}
            />
          </div>
        </div>
      )}
    </Layout>
  )
}

export default BlogsAdminPage
