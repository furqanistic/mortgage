import { cn } from '@/lib/utils'
import { renderLegacyArticleToHtml } from '@/pages/Blog/BlogPage'
import { createBlog, deleteBlog, getBlogs, updateBlog } from '@/services/contentApi'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Clock, Eye, ExternalLink, Filter, Image, Layers, MoreVertical, PencilLine, Plus, Search, Settings, Trash2, UploadCloud, User, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Layout from './Layout'

const createEmptyCard = () => ({
  title: '',
  text: '',
})

const createEmptyTableRow = () => ({
  label: '',
  value: '',
  tone: '',
})

const createEmptySectionImage = () => ({
  url: '',
  caption: '',
  alt: '',
  publicId: '',
})

const createEmptyTocEntry = () => ({
  title: '',
  focus: '',
})

const createEmptySection = () => ({
  heading: '',
  paragraphs: [''],
  bullets: [],
  paragraphsAfterBullets: [],
  images: [],
  cards: [],
  tableRows: [],
  quote: '',
  paragraphsAfterQuote: [],
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
    toc: [createEmptyTocEntry()],
  },
})

const inputClass =
  'h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-all duration-300 focus:border-primary focus:ring-4 focus:ring-primary/5 shadow-sm hover:border-slate-400'

const normalizeSlug = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/-+$/, '')

const formatDate = (iso) => {
  if (!iso) return 'Draft'
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

const deepClone = (obj) => JSON.parse(JSON.stringify(obj))
const cleanTextList = (value) =>
  (Array.isArray(value) ? value : [])
    .map((item) => String(item ?? '').trim())
    .filter(Boolean)

const buildDefaultTocFocus = (section) => {
  const paragraph = (Array.isArray(section?.paragraphs) ? section.paragraphs : []).find((item) => String(item || '').trim())
  if (paragraph) return String(paragraph).trim()
  return '—'
}

const buildTocFromSections = (sections = [], toc = []) =>
  sections.map((section, index) => {
    const existing = toc[index] || createEmptyTocEntry()
    const defaultTitle = String(section?.heading || '').trim() || `Section ${index + 1}`
    const defaultFocus = buildDefaultTocFocus(section)
    return {
      title: String(existing.title || '').trim() || defaultTitle,
      focus: String(existing.focus || '').trim() || defaultFocus,
    }
  })

const syncTocWithSections = (structuredContent) => {
  const sections = Array.isArray(structuredContent?.sections) ? structuredContent.sections : []
  const toc = Array.isArray(structuredContent?.toc) ? structuredContent.toc : []
  structuredContent.toc = buildTocFromSections(sections, toc)
  return structuredContent
}

const sanitizeStructuredContent = (structuredContent, fallbackExcerpt = '', hasPendingImageFile = () => false) => {
  const source = structuredContent && typeof structuredContent === 'object' ? deepClone(structuredContent) : {}
  const lead = cleanTextList(source.lead)
  const sections = Array.isArray(source.sections) ? source.sections : []
  const existingToc = Array.isArray(source.toc) ? source.toc : []

  const normalizedSections = sections
    .map((section, sectionIndex) => ({
      heading: String(section?.heading || '').trim(),
      paragraphs: cleanTextList(section?.paragraphs),
      bullets: cleanTextList(section?.bullets),
      paragraphsAfterBullets: cleanTextList(section?.paragraphsAfterBullets),
      images: Array.isArray(section?.images)
        ? section.images
            .map((image, imageIndex) => ({
              url: String(image?.url || '').trim(),
              caption: String(image?.caption || '').trim(),
              alt: String(image?.alt || '').trim(),
              publicId: String(image?.publicId || '').trim(),
              hasPendingUpload: hasPendingImageFile(sectionIndex, imageIndex),
            }))
            .filter((image) => image.url || image.caption || image.alt || image.publicId || image.hasPendingUpload)
            .map(({ url, caption, alt, publicId }) => ({ url, caption, alt, publicId }))
        : [],
      cards: Array.isArray(section?.cards)
        ? section.cards.map((card) => ({
            title: String(card?.title || '').trim(),
            text: String(card?.text || '').trim(),
          }))
            .filter((card) => card.title || card.text)
        : [],
      tableRows: Array.isArray(section?.tableRows)
        ? section.tableRows.map((row) => ({
            label: String(row?.label || '').trim(),
            value: String(row?.value || '').trim(),
            tone: String(row?.tone || '').trim(),
          }))
            .filter((row) => row.label || row.value)
        : [],
      quote: String(section?.quote || '').trim(),
      paragraphsAfterQuote: cleanTextList(section?.paragraphsAfterQuote),
      tip: String(section?.tip || '').trim(),
    }))
    .filter(
      (section) =>
        section.heading ||
        section.paragraphs.length ||
        section.bullets.length ||
        section.paragraphsAfterBullets.length ||
        section.images.length ||
        section.cards.length ||
        section.tableRows.length ||
        section.quote ||
        section.paragraphsAfterQuote.length ||
        section.tip
    )

  if (normalizedSections.length === 0) {
    normalizedSections.push({
      heading: '',
      paragraphs: [''],
      bullets: [],
      paragraphsAfterBullets: [],
      images: [],
      cards: [],
      tableRows: [],
      quote: '',
      paragraphsAfterQuote: [],
      tip: '',
    })
  }

  const normalizedToc = buildTocFromSections(normalizedSections, existingToc)

  return {
    lead: lead.length ? lead : [fallbackExcerpt || 'Write a short intro banner here.'],
    sections: normalizedSections,
    toc: normalizedToc,
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
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingIds, setDeletingIds] = useState(new Set())
  const [coverImageFile, setCoverImageFile] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState('')
  const [inlineImageFiles, setInlineImageFiles] = useState({})
  const [inlineImagePreviews, setInlineImagePreviews] = useState({})
  const [isTocModalOpen, setIsTocModalOpen] = useState(false)
  const coverImageInputRef = useRef(null)

  const stats = useMemo(() => {
    const published = blogs.filter((item) => item.isLive).length
    const drafts = blogs.length - published
    return { total: blogs.length, published, drafts }
  }, [blogs])

  const filteredBlogs = useMemo(() => {
    let result = blogs.filter((blog) => 
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return result.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
  }, [blogs, searchTerm])

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
    if (coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview)
    }
    Object.values(inlineImagePreviews).forEach((value) => {
      if (String(value).startsWith('blob:')) URL.revokeObjectURL(value)
    })
    setEditingId(null)
    setForm(createEmptyBlogForm())
    setCoverImageFile(null)
    setCoverImagePreview('')
    setInlineImageFiles({})
    setInlineImagePreviews({})
    setIsTocModalOpen(false)
    setIsModalOpen(true)
  }

  const openEdit = (blog) => {
    if (coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview)
    }
    Object.values(inlineImagePreviews).forEach((value) => {
      if (String(value).startsWith('blob:')) URL.revokeObjectURL(value)
    })
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
    setCoverImageFile(null)
    setCoverImagePreview(blog.coverImage || '')
    setInlineImageFiles({})
    setInlineImagePreviews({})
    setIsTocModalOpen(false)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    if (coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview)
    }
    Object.values(inlineImagePreviews).forEach((value) => {
      if (String(value).startsWith('blob:')) URL.revokeObjectURL(value)
    })
    setCoverImageFile(null)
    setInlineImageFiles({})
    setInlineImagePreviews({})
    setIsTocModalOpen(false)
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = ''
    }
    setIsModalOpen(false)
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

    if (name === 'coverImage' && !coverImageFile) {
      setCoverImagePreview(value)
    }

    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const updateStructuredContent = (updater) => {
    setForm((prev) => ({
      ...prev,
      structuredContent: syncTocWithSections(updater(deepClone(prev.structuredContent))),
    }))
  }

  const revokeInlineImagePreviewMap = (map) => {
    Object.values(map).forEach((value) => {
      if (String(value).startsWith('blob:')) {
        URL.revokeObjectURL(value)
      }
    })
  }

  const resetInlineImageLocalState = () => {
    setInlineImageFiles({})
    setInlineImagePreviews((prev) => {
      revokeInlineImagePreviewMap(prev)
      return {}
    })
  }

  const getInlineImageKey = (sectionIndex, imageIndex) => `${sectionIndex}-${imageIndex}`

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
    resetInlineImageLocalState()
    updateStructuredContent((structuredContent) => {
      structuredContent.sections.push(createEmptySection())
      return structuredContent
    })
  }

  const removeSection = (sectionIndex) => {
    resetInlineImageLocalState()
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

  const addTableRow = (sectionIndex) => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex].tableRows.push(createEmptyTableRow())
      return structuredContent
    })
  }

  const removeTableRow = (sectionIndex, rowIndex) => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex].tableRows.splice(rowIndex, 1)
      return structuredContent
    })
  }

  const updateCard = (sectionIndex, cardIndex, key, value) => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex].cards[cardIndex][key] = value
      return structuredContent
    })
  }

  const addCard = (sectionIndex) => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex].cards.push(createEmptyCard())
      return structuredContent
    })
  }

  const removeCard = (sectionIndex, cardIndex) => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex].cards.splice(cardIndex, 1)
      return structuredContent
    })
  }

  const updateSectionImage = (sectionIndex, imageIndex, key, value) => {
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex].images[imageIndex][key] = value
      return structuredContent
    })
  }

  const addSectionImage = (sectionIndex) => {
    resetInlineImageLocalState()
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex].images.push(createEmptySectionImage())
      return structuredContent
    })
  }

  const removeSectionImage = (sectionIndex, imageIndex) => {
    resetInlineImageLocalState()
    updateStructuredContent((structuredContent) => {
      structuredContent.sections[sectionIndex].images.splice(imageIndex, 1)
      return structuredContent
    })
  }

  const onInlineImageFileChange = (sectionIndex, imageIndex, event) => {
    const file = event.target.files?.[0]
    const key = getInlineImageKey(sectionIndex, imageIndex)

    if (!file) {
      setInlineImageFiles((prev) => {
        const next = { ...prev }
        delete next[key]
        return next
      })
      setInlineImagePreviews((prev) => {
        const next = { ...prev }
        if (String(next[key]).startsWith('blob:')) URL.revokeObjectURL(next[key])
        delete next[key]
        return next
      })
      return
    }

    setInlineImageFiles((prev) => ({ ...prev, [key]: file }))
    setInlineImagePreviews((prev) => {
      const next = { ...prev }
      if (String(next[key]).startsWith('blob:')) URL.revokeObjectURL(next[key])
      next[key] = URL.createObjectURL(file)
      return next
    })
  }

  const clearInlineImageFile = (sectionIndex, imageIndex) => {
    const key = getInlineImageKey(sectionIndex, imageIndex)
    setInlineImageFiles((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
    setInlineImagePreviews((prev) => {
      const next = { ...prev }
      if (String(next[key]).startsWith('blob:')) URL.revokeObjectURL(next[key])
      delete next[key]
      return next
    })
  }

  const updateTocItem = (index, key, value) => {
    updateStructuredContent((structuredContent) => {
      if (!Array.isArray(structuredContent.toc)) {
        structuredContent.toc = buildTocFromSections(structuredContent.sections, [])
      }
      if (!structuredContent.toc[index]) {
        structuredContent.toc[index] = createEmptyTocEntry()
      }
      structuredContent.toc[index][key] = value
      return structuredContent
    })
  }

  const onCoverImageChange = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      setCoverImageFile(null)
      setCoverImagePreview(form.coverImage || '')
      return
    }

    if (coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview)
    }

    setCoverImageFile(file)
    setCoverImagePreview(URL.createObjectURL(file))
  }

  const clearCoverImageSelection = () => {
    if (coverImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverImagePreview)
    }
    setCoverImageFile(null)
    setCoverImagePreview(form.coverImage || '')
    if (coverImageInputRef.current) {
      coverImageInputRef.current.value = ''
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)

    const hasPendingInlineImageFile = (sectionIndex, imageIndex) =>
      Boolean(inlineImageFiles[getInlineImageKey(sectionIndex, imageIndex)])
    const normalizedStructuredContent = sanitizeStructuredContent(form.structuredContent, form.excerpt, hasPendingInlineImageFile)
    const normalizedSlug = normalizeSlug(form.slug || form.title)
    const payload = new FormData()
    payload.append('title', form.title)
    payload.append('slug', normalizedSlug)
    payload.append('excerpt', form.excerpt || '')
    payload.append('category', form.category || '')
    payload.append('coverImage', form.coverImage || '')
    payload.append('readTime', form.readTime || '')
    payload.append('isLive', Boolean(form.isLive))
    payload.append('displayOrder', Number(form.displayOrder) || 0)
    payload.append('authorName', form.authorName || '')
    payload.append('structuredContent', JSON.stringify(normalizedStructuredContent))
    payload.append('contentHtml', renderLegacyArticleToHtml(normalizedStructuredContent))
    if (coverImageFile) {
      payload.append('coverImageFile', coverImageFile)
    }
    normalizedStructuredContent.sections.forEach((section, sectionIndex) => {
      ;(section.images || []).forEach((_, imageIndex) => {
        const imageFile = inlineImageFiles[getInlineImageKey(sectionIndex, imageIndex)]
        if (imageFile) {
          payload.append(`sectionImageFile_${sectionIndex}_${imageIndex}`, imageFile)
        }
      })
    })

    if (!normalizedSlug) {
      toast.error('Please add a title or slug')
      setIsSaving(false)
      return
    }

    try {
      if (editingId) {
        const updated = await updateBlog(editingId, payload)
        setBlogs((prev) => prev.map((item) => (item._id === editingId ? updated : item)))
        toast.success('Blog updated successfully')
      } else {
        const created = await createBlog(payload)
        setBlogs((prev) => [...prev, created])
        toast.success('New blog post created')
      }
      closeModal()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Layout>
      <div className='flex flex-col gap-6'>
        {/* Header Section */}
        <section className='flex flex-col lg:flex-row lg:items-center justify-between gap-4'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight text-slate-900 font-heading sm:text-3xl'>Editorial Studio</h1>
            <p className='mt-1 text-sm text-slate-500 max-w-2xl'>Draft and manage your platform's publications.</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreate}
            className='inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-md transition-all hover:brightness-110 active:scale-95'
          >
            <Plus size={18} />
            New Blog Post
          </motion.button>
        </section>

        {/* Stats Row */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[
            { label: 'Total Posts', value: stats.total, icon: Layers, color: 'primary' },
            { label: 'Published', value: stats.published, icon: Eye, color: 'accent' },
            { label: 'Drafts', value: stats.drafts, icon: PencilLine, color: 'slate' },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={stat.label}
              className='group relative rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 shadow-sm hover:shadow-md'
            >
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-slate-400'>{stat.label}</p>
                  <p className='text-2xl font-black text-slate-900'>{stat.value}</p>
                </div>
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110',
                  stat.color === 'primary' ? 'bg-primary/10 text-primary' : 
                  stat.color === 'accent' ? 'bg-accent/10 text-accent' : 'bg-slate-100 text-slate-500'
                )}>
                  <stat.icon size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Card */}
        <section className='relative rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6'>
          {/* Controls */}
          <div className='mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='relative w-full md:w-80'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' size={16} />
              <input 
                type='text' 
                placeholder='Search articles...' 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all focus:border-primary/30 focus:bg-white'
              />
            </div>
            <div className='flex items-center gap-2'>
              <button className='flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50'>
                <Filter size={14} />
                Filter
              </button>
            </div>
          </div>

          {/* Table */}
          <div className='overflow-x-auto -mx-5 sm:mx-0'>
            <table className='w-full border-separate border-spacing-y-2 px-5 sm:px-0'>
              <thead>
                <tr className='text-left text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400'>
                  <th className='px-4 pb-2'>Content</th>
                  <th className='px-4 pb-2 text-center'>Category</th>
                  <th className='px-4 pb-2 text-center'>Status</th>
                  <th className='px-4 pb-2 text-center'>Date</th>
                  <th className='px-4 pb-2 text-right'>Actions</th>
                </tr>
              </thead>
              <tbody className='space-y-2'>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className='px-4 py-3'>
                        <div className='h-12 w-full animate-pulse rounded-2xl bg-slate-100' />
                      </td>
                    </tr>
                  ))
                ) : filteredBlogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className='px-4 py-12 text-center'>
                      <div className='flex flex-col items-center gap-2 opacity-30'>
                        <Layers size={40} />
                        <p className='text-sm font-bold text-slate-500'>No results found</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredBlogs.map((blog) => (
                  <tr key={blog._id} className='group'>
                    <td className='rounded-l-2xl bg-white p-4 transition-colors group-hover:bg-slate-50 border-y border-l border-slate-200'>
                      <div className='flex flex-col'>
                        <span className='text-sm font-bold text-slate-900 group-hover:text-primary transition-colors'>{blog.title}</span>
                        <span className='mt-0.5 text-[11px] text-slate-400 line-clamp-1 max-w-sm'>{blog.excerpt}</span>
                      </div>
                    </td>
                    <td className='bg-white p-4 text-center transition-colors group-hover:bg-slate-50 border-y border-slate-200'>
                      <span className='inline-flex items-center gap-2 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600'>
                        {blog.category || 'General'}
                      </span>
                    </td>
                    <td className='bg-white p-4 text-center transition-colors group-hover:bg-slate-50 border-y border-slate-200'>
                      <div className={cn(
                        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest',
                        blog.isLive 
                          ? 'bg-primary/10 text-primary border border-primary/20' 
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      )}>
                        <div className={cn('h-1 w-1 rounded-full', blog.isLive ? 'bg-primary' : 'bg-slate-400')} />
                        {blog.isLive ? 'Live' : 'Draft'}
                      </div>
                    </td>
                    <td className='bg-white p-4 text-center transition-colors group-hover:bg-slate-50 border-y border-slate-200'>
                      <span className='text-[10px] font-bold text-slate-500'>
                        {formatDate(blog.datePublished)}
                      </span>
                    </td>
                    <td className='rounded-r-2xl bg-white p-4 text-right transition-colors group-hover:bg-slate-50 border-y border-r border-slate-200'>
                      <div className='flex items-center justify-end gap-1'>
                        <motion.button onClick={() => setActivePreview(blog)} className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-primary hover:text-white transition-all'>
                          <Eye size={16} />
                        </motion.button>
                        <motion.button onClick={() => openEdit(blog)} className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-primary hover:text-white transition-all'>
                          <PencilLine size={16} />
                        </motion.button>
                        <motion.button
                          disabled={deletingIds.has(blog._id)}
                          onClick={async () => {
                            if (!window.confirm('Delete this article?')) return
                            if (deletingIds.has(blog._id)) return

                            setDeletingIds((prev) => {
                              const next = new Set(prev)
                              next.add(blog._id)
                              return next
                            })

                            try {
                              await deleteBlog(blog._id)
                              setBlogs((prev) => prev.filter((row) => row._id !== blog._id))
                              toast.success('Deleted')
                            } catch (error) {
                              toast.error('Failed')
                            } finally {
                              setDeletingIds((prev) => {
                                const next = new Set(prev)
                                next.delete(blog._id)
                                return next
                              })
                            }
                          }}
                          className='flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-500 border border-slate-200 hover:bg-red-500 hover:text-white transition-all disabled:cursor-not-allowed disabled:opacity-50'
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Editor Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm sm:p-6'
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className='relative w-full max-w-7xl rounded-[2rem] border border-slate-300 bg-white p-6 shadow-2xl sm:p-8'
            >
              <div className='absolute right-6 top-6 flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => setIsTocModalOpen(true)}
                  className='inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-[10px] font-black uppercase tracking-widest text-primary shadow-sm hover:bg-primary hover:text-white transition-colors'
                >
                  View Table of Content
                </button>
                <button
                  type='button'
                  onClick={closeModal}
                  className='flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-500'
                >
                  <X size={20} />
                </button>
              </div>

              <div className='mb-8'>
                <h2 className='text-3xl font-bold text-slate-900 font-heading'>{editingId ? 'Edit Article' : 'New Publication'}</h2>
              </div>

              <form onSubmit={onSubmit} className='grid gap-8 lg:grid-cols-[320px_1fr]'>
                <aside className='space-y-6'>
                  <div className='rounded-2xl bg-slate-50 p-6 border border-slate-200'>
                    <h3 className='admin-label flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.14em] text-primary font-heading'>
                      <Settings size={14} />
                      Configuration
                    </h3>
                    <div className='mt-6 space-y-4'>
                      {[
                        { label: 'Article Title', name: 'title', placeholder: 'Title...', icon: PencilLine },
                        { label: 'Slug / URL', name: 'slug', placeholder: 'slug...', icon: ExternalLink },
                        { label: 'Category', name: 'category', placeholder: 'Category...', icon: Layers },
                        { label: 'Read Time', name: 'readTime', placeholder: '5 min', icon: Clock },
                        { label: 'Author', name: 'authorName', placeholder: 'Author...', icon: User },
                        { label: 'Order', name: 'displayOrder', placeholder: '0', type: 'number', icon: MoreVertical },
                      ].map((field) => (
                        <div key={field.name}>
                          <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500'>{field.label}</label>
                          <div className='group relative'>
                            <field.icon size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors' />
                            <input
                              type={field.type || 'text'}
                              name={field.name}
                              value={form[field.name]}
                              onChange={onChange}
                              placeholder={field.placeholder}
                              className={cn(inputClass, 'pl-9 h-9 text-xs rounded-lg')}
                              required={field.name === 'title' || field.name === 'slug'}
                            />
                          </div>
                        </div>
                      ))}

                      <div>
                        <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500'>Excerpt</label>
                        <textarea
                          name='excerpt'
                          value={form.excerpt}
                          onChange={onChange}
                          rows={3}
                          className='w-full rounded-lg border border-slate-300 bg-white p-3 text-xs text-slate-800 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary'
                          placeholder='Summary...'
                        />
                      </div>

                      <div className='space-y-2.5'>
                        <label className='mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-500'>Cover Image</label>
                        <input ref={coverImageInputRef} type='file' accept='image/*' onChange={onCoverImageChange} className='hidden' />
                        <div className='rounded-2xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/[0.04] to-slate-50 p-4'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <button type='button' onClick={() => coverImageInputRef.current?.click()} className='inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm ring-1 ring-primary/20 hover:bg-primary hover:text-white transition-colors'>
                              <UploadCloud size={12} />
                              {coverImageFile ? 'Replace File' : 'Choose File'}
                            </button>
                            {coverImageFile && (
                              <button type='button' onClick={clearCoverImageSelection} className='inline-flex h-9 items-center rounded-lg bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-sm ring-1 ring-slate-200 hover:text-red-500 transition-colors'>
                                Remove
                              </button>
                            )}
                            <p className='text-[10px] font-bold text-slate-500'>Uploaded image goes to Cloudinary on save.</p>
                          </div>
                          <div className='mt-3 flex items-start gap-3'>
                            <div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-0.5 shadow-sm'>
                              {coverImagePreview ? (
                                <img src={coverImagePreview} alt='Blog cover preview' className='h-full w-full rounded-lg object-cover' />
                              ) : (
                                <div className='flex h-full w-full items-center justify-center rounded-lg bg-slate-50 text-slate-300'>
                                  <Image size={16} />
                                </div>
                              )}
                            </div>
                            <div className='flex-1'>
                              <input
                                name='coverImage'
                                value={form.coverImage}
                                onChange={onChange}
                                placeholder='or paste image URL...'
                                className={cn(inputClass, 'h-9 text-xs')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='pt-2'>
                        <label className='flex cursor-pointer items-center justify-between rounded-xl bg-white p-3 border border-slate-200 shadow-sm'>
                          <span className='text-xs font-bold text-primary font-heading uppercase tracking-wider'>Live Status</span>
                          <div className='relative'>
                            <input
                              type='checkbox'
                              name='isLive'
                              checked={form.isLive}
                              onChange={onChange}
                              className='peer sr-only'
                            />
                            <div className='h-5 w-9 rounded-full bg-slate-300 ring-0 transition-all peer-checked:bg-primary' />
                            <div className='absolute left-1 top-1 h-3 w-3 rounded-full bg-white shadow transition-all peer-checked:translate-x-4' />
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </aside>

                <div className='space-y-6'>
                  <div className='rounded-2xl bg-slate-50 p-6 border border-slate-200'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='admin-label text-sm font-extrabold text-slate-900 font-heading tracking-[0.08em] uppercase'>Hero Intro</h3>
                      <button
                        type='button'
                        onClick={addLeadItem}
                        className='inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[10px] font-bold text-white shadow-sm hover:brightness-110 transition-all'
                      >
                        <Plus size={12} /> Add Paragraph
                      </button>
                    </div>
                    <div className='space-y-3'>
                      {form.structuredContent.lead.map((text, i) => (
                        <div key={`lead-${i}`} className='relative group'>
                          <textarea
                            value={text}
                            onChange={(e) => updateLeadItem(i, e.target.value)}
                            placeholder='Intro text...'
                            className='w-full rounded-xl border border-slate-300 bg-white p-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                            rows={2}
                          />
                          {form.structuredContent.lead.length > 1 && (
                            <button
                              type='button'
                              onClick={() => removeLeadItem(i)}
                              className='absolute -right-2 -top-2 hidden h-6 w-6 rounded-full bg-red-600 text-white group-hover:flex items-center justify-center shadow-lg transition-all'
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className='space-y-6'>
                    {form.structuredContent.sections.map((section, si) => (
                      <div
                        key={`section-${si}`}
                        className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm relative'
                      >
                        <div className='flex items-center justify-between mb-6'>
                          <div className='flex items-center gap-3'>
                            <div className='h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs'>
                              {si + 1}
                            </div>
                            <h4 className='font-bold text-sm text-slate-900 font-heading uppercase tracking-widest'>Section Content</h4>
                          </div>
                          <button
                            type='button'
                            onClick={() => removeSection(si)}
                            className='text-[10px] font-bold text-red-600 hover:text-red-700 uppercase tracking-widest'
                          >
                            Remove
                          </button>
                        </div>

                        <div className='space-y-5'>
                          <div className='space-y-1.5'>
                            <label className='text-[10px] font-bold uppercase tracking-widest text-slate-500 px-1'>Sub-Heading</label>
                            <input
                              value={section.heading}
                              onChange={(e) => updateSection(si, 'heading', e.target.value)}
                              placeholder='Section Title...'
                              className='h-10 w-full rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm font-bold text-primary outline-none focus:border-primary focus:bg-white transition-all'
                            />
                          </div>

                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <p className='text-[10px] font-black uppercase tracking-widest text-slate-500'>Body Text</p>
                              <button type='button' onClick={() => addSectionListItem(si, 'paragraphs')} className='text-[10px] font-bold text-primary hover:underline'>+ Add Paragraph</button>
                            </div>
                            {section.paragraphs.map((p, pi) => (
                              <div key={pi} className='group relative'>
                                <textarea
                                  value={p}
                                  onChange={(e) => updateSectionListItem(si, 'paragraphs', pi, e.target.value)}
                                  className='w-full rounded-xl border border-slate-300 bg-white p-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                                  rows={3}
                                />
                                {section.paragraphs.length > 1 && (
                                  <button type='button' onClick={() => removeSectionListItem(si, 'paragraphs', pi)} className='absolute right-2 top-2 h-5 w-5 rounded bg-red-600 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg transition-all'><X size={10} /></button>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <p className='text-[10px] font-black uppercase tracking-widest text-slate-500'>Bullets</p>
                              <button type='button' onClick={() => addSectionListItem(si, 'bullets')} className='text-[10px] font-bold text-primary hover:underline'>+ Add Point</button>
                            </div>
                            <div className='grid gap-2 sm:grid-cols-2'>
                              {section.bullets.map((b, bi) => (
                                <div key={bi} className='flex items-center gap-2 group'>
                                  <div className='h-1.5 w-1.5 rounded-full bg-accent shrink-0' />
                                  <input
                                    value={b}
                                    onChange={(e) => updateSectionListItem(si, 'bullets', bi, e.target.value)}
                                    placeholder='Bullet point...'
                                    className='h-8 w-full rounded-lg border border-slate-300 px-2 text-xs focus:border-primary transition-all'
                                  />
                                  <button type='button' onClick={() => removeSectionListItem(si, 'bullets', bi)} className='text-red-600 opacity-0 group-hover:opacity-100 transition-opacity'><X size={12}/></button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <p className='text-[10px] font-black uppercase tracking-widest text-slate-500'>Paragraphs After Bullets</p>
                              <button type='button' onClick={() => addSectionListItem(si, 'paragraphsAfterBullets')} className='text-[10px] font-bold text-primary hover:underline'>+ Add Paragraph</button>
                            </div>
                            {(section.paragraphsAfterBullets || []).map((p, pi) => (
                              <div key={`after-bullets-${pi}`} className='group relative'>
                                <textarea
                                  value={p}
                                  onChange={(e) => updateSectionListItem(si, 'paragraphsAfterBullets', pi, e.target.value)}
                                  className='w-full rounded-xl border border-slate-300 bg-white p-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                                  rows={2}
                                />
                                <button type='button' onClick={() => removeSectionListItem(si, 'paragraphsAfterBullets', pi)} className='absolute right-2 top-2 h-5 w-5 rounded bg-red-600 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg transition-all'><X size={10} /></button>
                              </div>
                            ))}
                          </div>

                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <p className='text-[10px] font-black uppercase tracking-widest text-slate-500'>Inline Images</p>
                              <button type='button' onClick={() => addSectionImage(si)} className='text-[10px] font-bold text-primary hover:underline'>+ Add Image</button>
                            </div>
                            {(section.images || []).map((image, imageIndex) => {
                              const imageKey = getInlineImageKey(si, imageIndex)
                              const previewSrc = inlineImagePreviews[imageKey] || image.url || ''
                              return (
                                <div key={`section-image-${imageIndex}`} className='rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2'>
                                  <div className='flex items-center justify-end gap-2'>
                                    {inlineImageFiles[imageKey] && (
                                      <button type='button' onClick={() => clearInlineImageFile(si, imageIndex)} className='text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-600'>Clear File</button>
                                    )}
                                    <button type='button' onClick={() => removeSectionImage(si, imageIndex)} className='text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700'>Remove</button>
                                  </div>
                                  <input
                                    value={image.url}
                                    onChange={(e) => updateSectionImage(si, imageIndex, 'url', e.target.value)}
                                    placeholder='Image URL...'
                                    className='h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs outline-none focus:border-primary'
                                  />
                                  <div className='grid gap-2 sm:grid-cols-2'>
                                    <input
                                      value={image.caption || ''}
                                      onChange={(e) => updateSectionImage(si, imageIndex, 'caption', e.target.value)}
                                      placeholder='Caption (optional)'
                                      className='h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs outline-none focus:border-primary'
                                    />
                                    <input
                                      value={image.alt || ''}
                                      onChange={(e) => updateSectionImage(si, imageIndex, 'alt', e.target.value)}
                                      placeholder='Alt text (optional)'
                                      className='h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs outline-none focus:border-primary'
                                    />
                                  </div>
                                  <div className='flex items-center gap-2'>
                                    <input
                                      type='file'
                                      accept='image/*'
                                      onChange={(e) => onInlineImageFileChange(si, imageIndex, e)}
                                      className='block w-full text-[11px] text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-[10px] file:font-bold file:uppercase file:tracking-wider file:text-primary'
                                    />
                                  </div>
                                  {previewSrc && (
                                    <div className='overflow-hidden rounded-lg border border-slate-200 bg-white'>
                                      <img src={previewSrc} alt={image.alt || 'Section image'} className='h-40 w-full object-cover' />
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>

                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <p className='text-[10px] font-black uppercase tracking-widest text-slate-500'>Cards</p>
                              <button type='button' onClick={() => addCard(si)} className='text-[10px] font-bold text-primary hover:underline'>+ Add Card</button>
                            </div>
                            {(section.cards || []).map((card, ci) => (
                              <div key={`card-${ci}`} className='rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2'>
                                <div className='flex items-center justify-end'>
                                  <button type='button' onClick={() => removeCard(si, ci)} className='text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700'>Remove</button>
                                </div>
                                <input
                                  value={card.title}
                                  onChange={(e) => updateCard(si, ci, 'title', e.target.value)}
                                  placeholder='Card title...'
                                  className='h-9 w-full rounded-lg border border-slate-300 bg-white px-2 text-xs outline-none focus:border-primary'
                                />
                                <textarea
                                  value={card.text}
                                  onChange={(e) => updateCard(si, ci, 'text', e.target.value)}
                                  placeholder='Card text...'
                                  className='w-full rounded-lg border border-slate-300 bg-white p-2 text-xs outline-none focus:border-primary'
                                  rows={2}
                                />
                              </div>
                            ))}
                          </div>

                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <p className='text-[10px] font-black uppercase tracking-widest text-slate-500'>Table Rows</p>
                              <button type='button' onClick={() => addTableRow(si)} className='text-[10px] font-bold text-primary hover:underline'>+ Add Row</button>
                            </div>
                            {(section.tableRows || []).map((row, ri) => (
                              <div key={`row-${ri}`} className='rounded-xl border border-slate-200 bg-white p-3 space-y-2'>
                                <div className='grid gap-2 sm:grid-cols-2'>
                                  <input
                                    value={row.label}
                                    onChange={(e) => updateTableRow(si, ri, 'label', e.target.value)}
                                    placeholder='Label...'
                                    className='h-9 w-full rounded-lg border border-slate-300 px-2 text-xs outline-none focus:border-primary'
                                  />
                                  <input
                                    value={row.value}
                                    onChange={(e) => updateTableRow(si, ri, 'value', e.target.value)}
                                    placeholder='Value...'
                                    className='h-9 w-full rounded-lg border border-slate-300 px-2 text-xs outline-none focus:border-primary'
                                  />
                                </div>
                                <div className='flex items-center justify-between'>
                                  <select
                                    value={row.tone || ''}
                                    onChange={(e) => updateTableRow(si, ri, 'tone', e.target.value)}
                                    className='h-8 rounded-lg border border-slate-300 px-2 text-[10px] font-bold uppercase tracking-wider text-slate-600'
                                  >
                                    <option value=''>Default</option>
                                    <option value='success'>Success</option>
                                    <option value='warning'>Warning</option>
                                  </select>
                                  <button type='button' onClick={() => removeTableRow(si, ri)} className='text-[10px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700'>Remove</button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className='grid gap-4 sm:grid-cols-2 pt-2'>
                            <div className='space-y-2 text-primary'>
                              <p className='text-[9px] font-black uppercase tracking-widest text-primary/60'>Block Quote</p>
                              <textarea
                                value={section.quote}
                                onChange={(e) => updateSection(si, 'quote', e.target.value)}
                                rows={2}
                                className='w-full rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs italic outline-none focus:bg-white transition-all'
                                placeholder='Quote...'
                              />
                            </div>
                            <div className='space-y-2 text-accent'>
                              <p className='text-[9px] font-black uppercase tracking-widest text-accent/60'>Expert Tip</p>
                              <textarea
                                value={section.tip}
                                onChange={(e) => updateSection(si, 'tip', e.target.value)}
                                rows={2}
                                className='w-full rounded-xl border border-accent/20 bg-accent/5 px-3 py-2 text-xs outline-none focus:bg-white transition-all'
                                placeholder='Helpful tip...'
                              />
                            </div>
                          </div>

                          <div className='space-y-3'>
                            <div className='flex items-center justify-between'>
                              <p className='text-[10px] font-black uppercase tracking-widest text-slate-500'>Paragraphs After Quote</p>
                              <button type='button' onClick={() => addSectionListItem(si, 'paragraphsAfterQuote')} className='text-[10px] font-bold text-primary hover:underline'>+ Add Paragraph</button>
                            </div>
                            {(section.paragraphsAfterQuote || []).map((p, pi) => (
                              <div key={`after-quote-${pi}`} className='group relative'>
                                <textarea
                                  value={p}
                                  onChange={(e) => updateSectionListItem(si, 'paragraphsAfterQuote', pi, e.target.value)}
                                  className='w-full rounded-xl border border-slate-300 bg-white p-3 text-xs outline-none focus:border-primary focus:ring-1 focus:ring-primary'
                                  rows={2}
                                />
                                <button type='button' onClick={() => removeSectionListItem(si, 'paragraphsAfterQuote', pi)} className='absolute right-2 top-2 h-5 w-5 rounded bg-red-600 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center shadow-lg transition-all'><X size={10} /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type='button'
                      onClick={addSection}
                      className='w-full py-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white text-slate-500 font-bold text-xs hover:border-primary hover:text-primary hover:bg-slate-50 transition-all uppercase tracking-widest'
                    >
                      + Add New Article Section
                    </button>
                  </div>

                  <div className='flex items-center justify-end gap-3 pt-6 border-t border-slate-200'>
                    <button
                      type='button'
                      onClick={closeModal}
                      className='px-6 h-11 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-50'
                    >
                      Discard Changes
                    </button>
                    <motion.button
                      type='submit'
                      disabled={isSaving}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className='px-10 h-11 rounded-xl bg-primary text-white font-bold text-xs shadow-lg'
                    >
                      {isSaving ? 'Saving...' : 'Publish & Update'}
                    </motion.button>
                  </div>
                </div>
              </form>

              <AnimatePresence>
                {isTocModalOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='absolute inset-0 z-20 overflow-y-auto rounded-[2rem] bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6'
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className='mx-auto mt-2 w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl'
                    >
                      <div className='mb-4 flex items-center justify-between'>
                        <div>
                          <h3 className='text-lg font-bold text-slate-900 font-heading'>Table of Contents Preview</h3>
                          <p className='text-xs text-slate-500'>Rows are auto-generated from sections. You can edit text only.</p>
                        </div>
                        <button
                          type='button'
                          onClick={() => setIsTocModalOpen(false)}
                          className='flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 hover:text-red-500'
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className='rounded-xl overflow-hidden' style={{ border: '1px solid rgba(26,77,46,0.12)' }}>
                        <table className='w-full text-left text-sm'>
                          <thead className='bg-primary/5'>
                            <tr>
                              <th className='px-4 py-2.5 font-semibold text-primary'>Section</th>
                              <th className='px-4 py-2.5 font-semibold text-primary'>Focus</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(form.structuredContent.toc || []).map((tocItem, index) => (
                              <tr key={`toc-row-${index}`} className='border-t border-primary/10 hover:bg-primary/5 transition-colors'>
                                <td className='px-4 py-2.5'>
                                  <input
                                    value={tocItem.title || `Section ${index + 1}`}
                                    onChange={(e) => updateTocItem(index, 'title', e.target.value)}
                                    className='h-9 w-full rounded-lg border border-slate-300 px-2 text-xs font-semibold text-primary outline-none focus:border-primary'
                                  />
                                </td>
                                <td className='px-4 py-2.5'>
                                  <input
                                    value={tocItem.focus || ''}
                                    onChange={(e) => updateTocItem(index, 'focus', e.target.value)}
                                    className='h-9 w-full rounded-lg border border-slate-300 px-2 text-xs text-muted-foreground outline-none focus:border-primary'
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <AnimatePresence>
        {activePreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 z-[110] grid place-items-center bg-slate-900/40 p-4 backdrop-blur-md'
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className='relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-[2rem] bg-white shadow-2xl shrink-0'
            >
              <div className='flex h-full flex-col'>
                <div className='p-6 pb-4 flex items-start justify-between border-b border-slate-200'>
                  <div>
                    <span className='text-[10px] font-black uppercase tracking-[0.2em] text-accent'>{activePreview.category}</span>
                    <h3 className='mt-0.5 text-2xl font-bold text-slate-900 font-heading'>{activePreview.title}</h3>
                  </div>
                  <button onClick={() => setActivePreview(null)} className='flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500'>
                    <X size={18} />
                  </button>
                </div>
                <div className='flex-1 overflow-y-auto p-8 pt-6 pb-16'>
                  <div 
                    className='blog-rich-content prose prose-slate prose-sm max-w-none'
                    dangerouslySetInnerHTML={{ __html: activePreview.contentHtml || '' }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  )
}

export default BlogsAdminPage
