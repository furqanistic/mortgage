import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import JoditEditor from 'jodit-react'
import {
  AlertCircle,
  Bookmark,
  CheckCircle,
  Clock,
  FileDown,
  FileText,
  Image,
  LayoutTemplate,
  Link,
  List,
  RefreshCw,
  Save,
  Table,
  Tags,
  Trash2,
  Upload,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

const SAMPLE_TEMPLATES = [
  {
    id: 'tutorial',
    name: 'Tutorial',
    structure: `<h2>Introduction</h2>
<p>Explain what this tutorial will teach and why it's important.</p>
<h2>Prerequisites</h2>
<p>List what the reader should know or have installed before starting.</p>
<h2>Step 1: Getting Started</h2>
<p>Describe the first step in detail with examples.</p>
<h2>Step 2: Main Process</h2>
<p>Explain the core concept or technique.</p>
<h2>Step 3: Advanced Techniques</h2>
<p>Cover more complex aspects of the topic.</p>
<h2>Common Issues and Troubleshooting</h2>
<p>Address potential problems readers might encounter.</p>
<h2>Conclusion</h2>
<p>Summarize what was learned and suggest next steps.</p>`,
  },
  {
    id: 'review',
    name: 'Product Review',
    structure: `<h2>Product Overview</h2>
<p>Introduce the product and its basic features.</p>
<h2>Key Features</h2>
<ul>
<li>Feature 1 with description</li>
<li>Feature 2 with description</li>
<li>Feature 3 with description</li>
</ul>
<h2>Pros and Cons</h2>
<h3>Pros</h3>
<ul>
<li>Advantage 1</li>
<li>Advantage 2</li>
</ul>
<h3>Cons</h3>
<ul>
<li>Disadvantage 1</li>
<li>Disadvantage 2</li>
</ul>
<h2>Performance</h2>
<p>Discuss how well the product performs.</p>
<h2>Value for Money</h2>
<p>Is it worth the price?</p>
<h2>Final Verdict</h2>
<p>Summarize your opinion and give a rating.</p>`,
  },
  {
    id: 'listicle',
    name: 'List Article',
    structure: `<h2>Introduction</h2>
<p>Explain what this list covers and why it's valuable.</p>
<h2>1. First Item</h2>
<p>Detailed description of the first item.</p>
<h2>2. Second Item</h2>
<p>Detailed description of the second item.</p>
<h2>3. Third Item</h2>
<p>Detailed description of the third item.</p>
<h2>4. Fourth Item</h2>
<p>Detailed description of the fourth item.</p>
<h2>5. Fifth Item</h2>
<p>Detailed description of the fifth item.</p>
<h2>Summary</h2>
<p>Brief recap of the items covered and final thoughts.</p>`,
  },
]

const Editor = () => {
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [tags, setTags] = useState('')
  const [currentTag, setCurrentTag] = useState('')
  const [tagsList, setTagsList] = useState([])
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const editor = useRef(null)
  const fileInputRef = useRef(null)

  // Calculate word count and reading time when content changes
  useEffect(() => {
    if (content) {
      // Create a temporary div to parse HTML and get text content
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
      const text = tempDiv.textContent || tempDiv.innerText || ''

      // Count words (split by any whitespace and filter out empty strings)
      const words = text.split(/\s+/).filter((word) => word.length > 0)
      setWordCount(words.length)

      // Calculate reading time (average reading speed: 225 words per minute)
      const minutes = Math.max(1, Math.ceil(words.length / 225))
      setReadingTime(minutes)
    } else {
      setWordCount(0)
      setReadingTime(0)
    }
  }, [content])

  // Handle tags
  const handleAddTag = () => {
    if (currentTag && !tagsList.includes(currentTag)) {
      setTagsList([...tagsList, currentTag])
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTagsList(tagsList.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && currentTag) {
      e.preventDefault()
      handleAddTag()
    }
  }

  // Handle file upload simulation
  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)

      // Read the file as a base64 URL
      const reader = new FileReader()
      reader.onloadend = () => {
        if (editor.current && editor.current.editor) {
          // Insert the image at cursor position
          editor.current.editor.s.insertHTML(
            `<img src="${reader.result}" alt="${file.name}" style="max-width: 100%; height: auto;"/>`
          )
        }
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  // Apply template
  const handleApplyTemplate = (templateId) => {
    if (
      content &&
      !window.confirm(
        'Applying a template will replace your current content. Continue?'
      )
    ) {
      return
    }

    const template = SAMPLE_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setContent(template.structure)
      if (editor.current && editor.current.editor) {
        editor.current.editor.value = template.structure
      }
    }
    setSelectedTemplate('')
  }

  // Enhanced Jodit configuration
  const config = {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: 'en',
    toolbarButtonSize: 'middle',
    theme: 'default',
    saveModeInCookie: false,
    enter: 'br',
    useSplitMode: false,
    colorPickerDefaultTab: 'background',
    imageDefaultWidth: 300,
    disablePlugins: ['drag-and-drop-element', 'file'],
    removeButtons: ['file', 'video', 'print', 'about'],
    controls: {
      fontsize: {
        list: [
          '8',
          '10',
          '12',
          '14',
          '16',
          '18',
          '20',
          '24',
          '30',
          '36',
          '48',
          '60',
          '72',
          '96',
        ],
      },
      font: {
        command: 'fontname',
        list: {
          'Arial, Helvetica, sans-serif': 'Arial',
          'Georgia, serif': 'Georgia',
          'Impact, Charcoal, sans-serif': 'Impact',
          'Tahoma, Geneva, sans-serif': 'Tahoma',
          "'Times New Roman', Times, serif": 'Times New Roman',
          'Verdana, Geneva, sans-serif': 'Verdana',
          'Courier New, Courier, monospace': 'Courier New',
          'Open Sans, sans-serif': 'Open Sans',
        },
      },
      color: {
        icon: 'brush',
        tooltip: 'Text Color',
        popup: (editor, current, close, button) => {
          let container = document.createElement('div')
          container.classList.add('jodit-colorpicker')
          container.style.display = 'grid'
          container.style.gridTemplateColumns = 'repeat(7, 1fr)'
          container.style.gap = '5px'
          container.style.padding = '10px'

          const colors = [
            '#000000',
            '#434343',
            '#666666',
            '#999999',
            '#b7b7b7',
            '#cccccc',
            '#ffffff',
            '#ff0000',
            '#ff8c00',
            '#ffff00',
            '#00ff00',
            '#00ffff',
            '#0000ff',
            '#9900ff',
            '#ff00ff',
            '#663399',
            '#33cc33',
            '#990000',
            '#006666',
            '#3366cc',
            '#ff9999',
          ]

          colors.forEach((color) => {
            let button = document.createElement('button')
            button.setAttribute('type', 'button')
            button.setAttribute('data-color', color)
            button.style.width = '30px'
            button.style.height = '30px'
            button.style.backgroundColor = color
            button.style.border = '1px solid #ddd'
            button.style.cursor = 'pointer'
            button.style.padding = '0'
            button.style.margin = '0'

            button.addEventListener('click', () => {
              editor.execCommand('foreColor', false, color)
              close()
            })

            container.appendChild(button)
          })

          return container
        },
      },
      background: {
        icon: 'brush',
        tooltip: 'Background Color',
        popup: (editor, current, close, button) => {
          let container = document.createElement('div')
          container.classList.add('jodit-colorpicker')
          container.style.display = 'grid'
          container.style.gridTemplateColumns = 'repeat(7, 1fr)'
          container.style.gap = '5px'
          container.style.padding = '10px'

          const colors = [
            '#000000',
            '#434343',
            '#666666',
            '#999999',
            '#b7b7b7',
            '#cccccc',
            '#ffffff',
            '#ff0000',
            '#ff8c00',
            '#ffff00',
            '#00ff00',
            '#00ffff',
            '#0000ff',
            '#9900ff',
            '#ff00ff',
            '#663399',
            '#33cc33',
            '#990000',
            '#006666',
            '#3366cc',
            '#ff9999',
          ]

          colors.forEach((color) => {
            let button = document.createElement('button')
            button.setAttribute('type', 'button')
            button.setAttribute('data-color', color)
            button.style.width = '30px'
            button.style.height = '30px'
            button.style.backgroundColor = color
            button.style.border = '1px solid #ddd'
            button.style.cursor = 'pointer'
            button.style.padding = '0'
            button.style.margin = '0'

            button.addEventListener('click', () => {
              editor.execCommand('hiliteColor', false, color)
              close()
            })

            container.appendChild(button)
          })

          return container
        },
      },
    },
    buttons: [
      'paragraph',
      'fontsize',
      'font',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'color',
      'background',
      '|',
      'superscript',
      'subscript',
      '|',
      'ul',
      'ol',
      '|',
      'outdent',
      'indent',
      '|',
      'align',
      '|',
      'link',
      'image',
      'table',
      '|',
      'hr',
      'symbol',
      '|',
      'undo',
      'redo',
      '|',
      'eraser',
      'copyformat',
    ],
    showCharsCounter: true,
    showWordsCounter: true,
    width: '100%',
    height: 500,
    minHeight: 300,
    maxHeight: 800,
    uploader: {
      insertImageAsBase64URI: true,
    },
    style: {
      fontSize: '16px',
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
  }

  // Auto-save feature
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (title || content) {
        localStorage.setItem(
          'blog-draft',
          JSON.stringify({
            title,
            subtitle,
            content,
            tags: tagsList,
            lastSaved: new Date().toISOString(),
          })
        )
        setSaveMessage('Draft auto-saved')
        setTimeout(() => {
          setSaveMessage('')
        }, 2000)
      }
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [title, subtitle, content, tagsList])

  // Load draft from localStorage on initial load
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog-draft')
    if (savedDraft) {
      try {
        const {
          title: savedTitle,
          subtitle: savedSubtitle,
          content: savedContent,
          tags: savedTags,
        } = JSON.parse(savedDraft)
        setTitle(savedTitle || '')
        setSubtitle(savedSubtitle || '')
        setContent(savedContent || '')
        setTagsList(savedTags || [])
      } catch (err) {
        console.error('Error loading draft:', err)
      }
    }
  }, [])

  // Handle fullscreen mode
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
      }
    }

    if (isFullscreen) {
      document.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isFullscreen])

  // Handle save action
  const handleSave = () => {
    if (!title) {
      alert('Please add a title to your blog post')
      return
    }

    // Here you would typically save to backend
    localStorage.setItem(
      'blog-post',
      JSON.stringify({
        title,
        subtitle,
        content,
        tags: tagsList,
        wordCount,
        readingTime,
        createdAt: new Date().toISOString(),
      })
    )

    setIsSaved(true)
    setSaveMessage('Blog post saved successfully!')

    setTimeout(() => {
      setSaveMessage('')
    }, 3000)
  }

  // Export content as HTML
  const handleExport = () => {
    if (!title) {
      alert('Please add a title before exporting')
      return
    }

    const blogPost = {
      title,
      subtitle,
      content,
      tags: tagsList,
      wordCount,
      readingTime,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(blogPost, null, 2)], {
      type: 'application/json',
    })
    const href = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = href
    link.download = `${
      title.replace(/\s+/g, '-').toLowerCase() || 'blog-post'
    }.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Clear content with confirmation
  const handleClear = () => {
    if (
      window.confirm(
        'Are you sure you want to clear all content? This action cannot be undone.'
      )
    ) {
      setTitle('')
      setSubtitle('')
      setContent('')
      setTagsList([])
      setCurrentTag('')
      setIsSaved(false)
      if (editor.current && editor.current.editor) {
        editor.current.editor.value = ''
      }
      localStorage.removeItem('blog-draft')
      localStorage.removeItem('blog-post')
    }
  }

  // Component classes based on fullscreen mode
  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-white overflow-auto p-4'
    : 'w-full max-w-5xl mx-auto p-4'

  return (
    <div className={containerClasses}>
      <Card className='shadow-lg border rounded-lg overflow-hidden bg-white'>
        <CardHeader className='space-y-1  border-b'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-bold text-slate-800'>
              Blog Editor
            </CardTitle>
            <div className='flex items-center space-x-2'>
              {wordCount > 0 && (
                <Badge
                  variant='outline'
                  className='text-xs font-medium bg-slate-100'
                >
                  <FileText className='h-3 w-3 mr-1' />
                  {wordCount} words
                </Badge>
              )}
              {readingTime > 0 && (
                <Badge
                  variant='outline'
                  className='text-xs font-medium bg-slate-100'
                >
                  <Clock className='h-3 w-3 mr-1' />
                  {readingTime} min read
                </Badge>
              )}
              <Button
                size='sm'
                variant='ghost'
                onClick={() => setIsFullscreen(!isFullscreen)}
                className='p-1 h-8 w-8'
              >
                {isFullscreen ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M8 3v3a2 2 0 0 1-2 2H3'></path>
                    <path d='M21 8h-3a2 2 0 0 1-2-2V3'></path>
                    <path d='M3 16h3a2 2 0 0 1 2 2v3'></path>
                    <path d='M16 21v-3a2 2 0 0 1 2-2h3'></path>
                  </svg>
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='M15 3h6v6'></path>
                    <path d='M9 21H3v-6'></path>
                    <path d='M21 3l-7 7'></path>
                    <path d='M3 21l7-7'></path>
                  </svg>
                )}
              </Button>
            </div>
          </div>
          <CardDescription className='text-slate-500'>
            Create and format your blog post with rich text editing
          </CardDescription>
          {saveMessage && (
            <div className='flex items-center text-sm text-green-600 mt-1'>
              <CheckCircle className='h-4 w-4 mr-1' />
              {saveMessage}
            </div>
          )}
        </CardHeader>

        <CardContent className='p-6 space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label
                htmlFor='title'
                className='text-sm font-medium text-slate-700'
              >
                Blog Title
              </Label>
              <Input
                id='title'
                placeholder='Enter an engaging title for your blog post'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full text-lg font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500'
              />
            </div>
            <div className='space-y-2'>
              <Label
                htmlFor='subtitle'
                className='text-sm font-medium text-slate-700'
              >
                Subtitle (Optional)
              </Label>
              <Input
                id='subtitle'
                placeholder='Add a brief subtitle or description'
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className='w-full placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500'
              />
            </div>
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <Label
                htmlFor='tags'
                className='text-sm font-medium text-slate-700 flex items-center'
              >
                <Tags className='h-4 w-4 mr-1' />
                Tags
              </Label>
              <div className='flex gap-2'>
                <Select
                  value={selectedTemplate}
                  onValueChange={handleApplyTemplate}
                >
                  <SelectTrigger className='w-48 h-8 text-xs'>
                    <SelectValue placeholder='Apply Template' />
                  </SelectTrigger>
                  <SelectContent>
                    {SAMPLE_TEMPLATES.map((template) => (
                      <SelectItem
                        key={template.id}
                        value={template.id}
                        className='text-xs'
                      >
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8'
                        onClick={handleFileUpload}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <RefreshCw className='h-4 w-4 animate-spin' />
                        ) : (
                          <Upload className='h-4 w-4' />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Upload Image</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <input
                  type='file'
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept='image/*'
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-2 mb-2'>
              {tagsList.map((tag, index) => (
                <Badge
                  key={index}
                  className='bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors'
                >
                  {tag}
                  <button
                    className='ml-1 text-blue-800 hover:text-blue-950'
                    onClick={() => handleRemoveTag(tag)}
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {tagsList.length === 0 && (
                <span className='text-xs text-gray-500 italic'>
                  Add tags to categorize your post
                </span>
              )}
            </div>
            <div className='flex'>
              <Input
                placeholder='Add tags (press Enter)'
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleKeyDown}
                className='rounded-r-none text-sm'
              />
              <Button
                onClick={handleAddTag}
                disabled={!currentTag}
                type='button'
                className='rounded-l-none px-3'
              >
                Add
              </Button>
            </div>
          </div>

          <Tabs defaultValue='edit' className='w-full'>
            <TabsList className='grid w-full grid-cols-2 mb-6'>
              <TabsTrigger
                value='edit'
                className='data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700'
              >
                <FileText className='h-4 w-4 mr-2' />
                Editor
              </TabsTrigger>
              <TabsTrigger
                value='preview'
                className='data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700'
              >
                <LayoutTemplate className='h-4 w-4 mr-2' />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value='edit' className='mt-0'>
              <div className='border rounded-lg overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500'>
                <JoditEditor
                  ref={editor}
                  value={content}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) => setContent(newContent)}
                  onChange={(newContent) => {}}
                />
              </div>
              <div className='mt-2 flex flex-wrap justify-between text-xs text-slate-500'>
                <div className='flex items-center'>
                  <AlertCircle className='h-3 w-3 mr-1' />
                  <span>Use the toolbar above to format your content</span>
                </div>
                <div className='flex items-center space-x-2 text-xs'>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 text-xs flex items-center gap-1'
                    onClick={() => {
                      if (editor.current && editor.current.editor) {
                        editor.current.editor.execCommand('insertUnorderedList')
                      }
                    }}
                  >
                    <List className='h-3 w-3' />
                    Add List
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 text-xs flex items-center gap-1'
                    onClick={() => {
                      if (editor.current && editor.current.editor) {
                        editor.current.editor.execCommand(
                          'createLink',
                          'https://example.com'
                        )
                      }
                    }}
                  >
                    <Link className='h-3 w-3' />
                    Insert Link
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    className='h-6 text-xs flex items-center gap-1'
                    onClick={() => {
                      if (editor.current && editor.current.editor) {
                        editor.current.editor.execCommand('insertTable')
                      }
                    }}
                  >
                    <Table className='h-3 w-3' />
                    Insert Table
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value='preview' className='mt-0'>
              <div className='border rounded-lg bg-white shadow-sm p-8 min-h-[500px] prose max-w-none'>
                {title && (
                  <h1 className='text-3xl font-bold mb-1 text-slate-900'>
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className='text-xl text-slate-600 mb-4'>{subtitle}</p>
                )}

                {tagsList.length > 0 && (
                  <div className='flex flex-wrap gap-2 mb-6'>
                    {tagsList.map((tag, index) => (
                      <Badge
                        key={index}
                        variant='secondary'
                        className='bg-slate-100 text-slate-800'
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {content ? (
                  <div
                    className='text-slate-700'
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <div className='text-slate-400 italic flex flex-col items-center justify-center h-64'>
                    <Image className='h-16 w-16 mb-4 opacity-20' />
                    <p>Your blog post preview will appear here.</p>
                    <p className='text-sm'>Start writing in the Editor tab!</p>
                  </div>
                )}

                {(wordCount > 0 || readingTime > 0) && (
                  <div className='mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500 flex items-center space-x-4'>
                    {wordCount > 0 && (
                      <span className='flex items-center'>
                        <FileText className='h-4 w-4 mr-1' />
                        {wordCount} words
                      </span>
                    )}
                    {readingTime > 0 && (
                      <span className='flex items-center'>
                        <Clock className='h-4 w-4 mr-1' />
                        {readingTime} min read
                      </span>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className='flex justify-between items-center p-6 bg-slate-50 border-t'>
          <div className='flex items-center space-x-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='destructive'
                    size='sm'
                    onClick={handleClear}
                    className='flex items-center'
                  >
                    <Trash2 className='h-4 w-4 mr-1' />
                    Clear
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear all content</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleExport}
                    className='flex items-center'
                  >
                    <FileDown className='h-4 w-4 mr-1' />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export as JSON</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      localStorage.setItem(
                        'blog-draft',
                        JSON.stringify({
                          title,
                          subtitle,
                          content,
                          tags: tagsList,
                          lastSaved: new Date().toISOString(),
                        })
                      )
                      setSaveMessage('Draft saved successfully!')
                      setTimeout(() => {
                        setSaveMessage('')
                      }, 2000)
                    }}
                    className='flex items-center'
                  >
                    <Bookmark className='h-4 w-4 mr-1' />
                    Save Draft
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save as draft</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button
            onClick={handleSave}
            className='flex items-center bg-blue-600 hover:bg-blue-700'
            disabled={!title || !content}
          >
            <Save className='h-4 w-4 mr-1' />
            Publish Post
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Editor
