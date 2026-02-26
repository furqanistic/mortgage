import Navbar from '@/components/Home/Navbar'
import Footer from '@/components/Layout/Footer'
import { Calendar, ChevronLeft, Clock, Lock } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'

const toSectionId = (heading) =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const blogPosts = [
  {
    id: 1,
    slug: 'germany-heating-law-reform-2026',
    title: 'Germany Heating Law Reform 2026: Strategic Implications for Property Owners & Investors',
    excerpt:
      'A strategic breakdown of the 2026 heating law update, including what changed, cost implications, valuation effects, and financing decisions for buyers and owners.',
    category: 'Policy Update',
    date: 'February 25, 2026',
    readTime: '8 min',
    image: '/blog/berlin_altbau.png',
    isLive: true,
  },
  {
    id: 2,
    slug: 'strategic-home-buying-guide',
    title: 'Strategic Home Buying Guide',
    excerpt: 'Navigate the German bidding process with a practical first-time buyer roadmap.',
    category: 'Guides',
    date: 'Coming soon',
    readTime: '—',
    image: '/blog/berlin_modern.png',
    isLive: false,
  },
  {
    id: 3,
    slug: 'tax-optimization-real-estate',
    title: 'Tax Optimization for Real Estate',
    excerpt: 'How tax structure can shape long-term returns for owner-occupiers and investors.',
    category: 'Strategy',
    date: 'Coming soon',
    readTime: '—',
    image: '/blog/berlin_villa.png',
    isLive: false,
  },
  {
    id: 4,
    slug: 'renovation-financing-structures',
    title: 'Modern Renovation Financing',
    excerpt: 'A practical financing model for energy-efficiency upgrades and retrofit planning.',
    category: 'Finance',
    date: 'Coming soon',
    readTime: '—',
    image: '/blog/berlin_townhouse.png',
    isLive: false,
  },
]

const heatingLawArticle = {
  lead: [
    'Germany is planning changes to its heating law. The reform of the Building Energy Act (GEG) could give homeowners more flexibility when replacing old heating systems.',
    'But what does this really mean for you as a property owner, buyer, or investor? At Baufiking, we focus on how this affects your money, your property value, and your long-term costs, not just the legal details.',
  ],
  sections: [
    {
      heading: 'What Was the Rule Until Now?',
      paragraphs: ['Since 2023, new heating systems had to use at least 65% renewable energy. This mainly meant installing:'],
      bullets: [
        'Heat pumps',
        'Hybrid systems',
        'Biomass heating',
        'District heating',
        'Solar-supported systems',
        'Installing new gas or oil heating systems became very limited.',
      ],
    },
    {
      heading: 'What Is Changing in 2026?',
      paragraphs: [
        'The coalition between CDU/CSU and SPD wants to change the rules.',
        'The Federal Government of Germany is proposing more technology openness. This could allow homeowners to choose their heating system more freely, possibly including gas systems again. The proposal still needs approval from the German Parliament (Bundestag).',
      ],
    },
    {
      heading: 'Does This Mean Gas Heating Is Safe Again?',
      paragraphs: ['Not necessarily. Even if gas systems are allowed again:'],
      bullets: [
        'CO2 prices are expected to rise.',
        'Energy costs remain unpredictable.',
        'EU climate targets still exist.',
        'So while the law may become more flexible, long-term costs could still increase.',
      ],
    },
    {
      heading: 'What Does This Mean for Property Owners?',
      paragraphs: ['Heating decisions are no longer just technical. They are financial.'],
      cards: [
        {
          title: 'Installation Costs vs. Running Costs',
          text: 'Gas heating may be cheaper to install. Heat pumps may cost more upfront but can be cheaper over time. The key question is: what will cost you less over 20 years?',
        },
        {
          title: 'Property Value',
          text: 'Energy-efficient homes are easier to sell and often achieve better prices. Buyers and banks pay attention to energy efficiency ratings, monthly heating costs, and future upgrade risks.',
        },
        {
          title: 'Financing',
          text: 'Banks increasingly look at energy efficiency when approving loans. If a property has high future heating costs, it may influence loan approval, financing terms, and long-term affordability.',
        },
      ],
    },
    {
      heading: "Baufiking's Approach",
      paragraphs: [
        "We do not just ask, 'What is allowed?' We ask, 'What makes financial sense for you?'",
        'More legal flexibility does not automatically mean better financial outcomes.',
      ],
      bullets: [
        'The real long-term cost of your heating choice',
        'How rising CO2 costs could affect you',
        'Which subsidies can reduce your investment',
        'How your decision impacts resale value',
      ],
    },
    {
      heading: 'Final Thought',
      paragraphs: [
        'The Germany Heating Law Reform 2026 may give homeowners more freedom. But smart property decisions are still based on long-term planning, stable costs, and protecting asset value.',
        'If you are buying, refinancing, or modernizing a property in Germany, Baufiking helps you make decisions that are financially sound, not just legally compliant.',
      ],
    },
  ],
}

const BlogPage = ({ language = 'de', onLanguageChange }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { slug } = useParams()
  const isEnglish = language === 'en'

  const activePost = useMemo(() => blogPosts.find((post) => post.slug === slug), [slug])

  const listCopy = {
    badge: isEnglish ? 'Baufiking Insights' : 'Baufiking Einblicke',
    title: isEnglish ? 'Market Intelligence Blog' : 'Markt-Intelligenz Blog',
    subtitle: isEnglish
      ? 'Clear, practical analysis for buyers, owners, and investors in Germany.'
      : 'Klare, praktische Analysen fuer Kaeufer, Eigentuemer und Investoren in Deutschland.',
    open: isEnglish ? 'Open article' : 'Artikel oeffnen',
    comingSoon: isEnglish ? 'Coming soon' : 'Demnaechst',
    unavailable: isEnglish ? 'This article is not published yet.' : 'Dieser Artikel ist noch nicht veroeffentlicht.',
  }

  useEffect(() => {
    const defaultTitle = 'Baufiking Blog | German Property Insights'
    const title = activePost?.isLive
      ? `${activePost.title} | Baufiking`
      : defaultTitle
    const description = activePost?.isLive
      ? activePost.excerpt
      : 'Strategic insights for buying, financing, and owning property in Germany.'
    const canonicalUrl = `${window.location.origin}${location.pathname}`
    const imageUrl = `${window.location.origin}${(activePost?.image || '/blog/berlin_altbau.png')}`

    document.title = title

    const upsertMeta = (selector, attributes) => {
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        document.head.appendChild(el)
      }
      Object.entries(attributes).forEach(([key, value]) => {
        el.setAttribute(key, value)
      })
    }

    const upsertLink = (selector, attributes) => {
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('link')
        document.head.appendChild(el)
      }
      Object.entries(attributes).forEach(([key, value]) => {
        el.setAttribute(key, value)
      })
    }

    upsertMeta('meta[name="description"]', { name: 'description', content: description })
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title })
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description })
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: activePost?.isLive ? 'article' : 'website' })
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl })
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: imageUrl })
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' })
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title })
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description })
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: imageUrl })
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl })

    let jsonLdScript = document.head.querySelector('script[data-seo="blog-jsonld"]')
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script')
      jsonLdScript.setAttribute('type', 'application/ld+json')
      jsonLdScript.setAttribute('data-seo', 'blog-jsonld')
      document.head.appendChild(jsonLdScript)
    }
    const jsonLd = activePost?.isLive
      ? {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: activePost.title,
          description: activePost.excerpt,
          datePublished: '2026-02-25',
          dateModified: '2026-02-25',
          author: { '@type': 'Person', name: 'Ravinder Singh' },
          publisher: { '@type': 'Organization', name: 'Baufiking' },
          mainEntityOfPage: canonicalUrl,
          image: imageUrl,
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Baufiking Blog',
          url: canonicalUrl,
        }
    jsonLdScript.textContent = JSON.stringify(jsonLd)
  }, [activePost, location.pathname])

  return (
    <div className="min-h-screen bg-background font-body text-foreground overflow-x-hidden selection:bg-primary/20">
      <Navbar language={language} onLanguageChange={onLanguageChange} />

      <main>
        {!slug && (
          <>
            <section
              className="relative overflow-hidden py-16 sm:py-20 border-b border-primary/10"
              style={{ background: 'linear-gradient(135deg, rgba(26,77,46,0.06) 0%, rgba(193,154,107,0.08) 100%)' }}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16">
                <p className="text-[11px] uppercase tracking-[0.24em] font-semibold" style={{ color: '#c19a6b' }}>
                  {listCopy.badge}
                </p>
                <h1 className="mt-2 text-3xl sm:text-5xl font-heading font-bold text-primary leading-tight">
                  {listCopy.title}
                </h1>
                <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
                  {listCopy.subtitle}
                </p>
              </div>
            </section>

            <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 py-12 sm:py-16">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((post) => (
                  <article
                    key={post.id}
                    className={`group relative h-full rounded-2xl bg-white overflow-hidden ${post.isLive ? 'cursor-pointer' : ''}`}
                    style={{
                      border: '1.5px solid rgba(26,77,46,0.10)',
                      boxShadow: '0 2px 8px rgba(26,77,46,0.07)',
                    }}
                    onClick={() => {
                      if (post.isLive) {
                        navigate(`/blogs/${post.slug}`)
                      }
                    }}
                    onKeyDown={(event) => {
                      if (!post.isLive) return
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        navigate(`/blogs/${post.slug}`)
                      }
                    }}
                    role={post.isLive ? 'button' : undefined}
                    tabIndex={post.isLive ? 0 : undefined}
                  >
                    <div className="h-[3px]" style={{ background: 'linear-gradient(90deg,#1a4d2e,#c19a6b)' }} />

                    <div className="aspect-[16/10] overflow-hidden">
                      <img src={post.image} alt={post.title} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                    </div>

                    <div className="flex h-[calc(100%-3px)] flex-col p-5">
                      <div className="mb-3 flex items-center justify-between gap-2 text-[10px] uppercase tracking-[0.18em] font-semibold">
                        <span style={{ color: '#c19a6b' }}>{post.category}</span>
                        {!post.isLive && (
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5" style={{ background: 'rgba(26,77,46,0.08)', color: '#1a4d2e' }}>
                            <Lock className="h-3 w-3" />
                            {listCopy.comingSoon}
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg font-heading font-bold text-primary leading-snug mb-2 min-h-[56px]">
                        {post.title}
                      </h2>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[66px]">
                        {post.excerpt}
                      </p>

                      <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" style={{ color: '#c19a6b' }} />
                          {post.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" style={{ color: '#c19a6b' }} />
                          {post.readTime}
                        </span>
                      </div>

                      <div className="mt-auto pt-3" style={{ borderTop: '1px solid rgba(26,77,46,0.07)' }}>
                        {post.isLive ? (
                          <span className="inline-flex items-center rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white group-hover:bg-primary/90 transition-colors">
                            {isEnglish ? 'Read article' : 'Artikel lesen'}
                          </span>
                        ) : (
                          <button
                            type="button"
                            disabled
                            title={listCopy.unavailable}
                            className="text-sm font-semibold text-muted-foreground cursor-not-allowed"
                          >
                            {listCopy.comingSoon}
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}

        {slug && activePost?.isLive && (
          <>
            <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10 xl:px-12 pt-10 pb-8">
              <Link
                to="/blogs"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:opacity-75 transition-opacity"
              >
                <ChevronLeft className="h-4 w-4" />
                {isEnglish ? 'Back to all blogs' : 'Zurueck zur Blog-uebersicht'}
              </Link>

              <p className="mt-5 text-[11px] uppercase tracking-[0.24em] font-semibold" style={{ color: '#c19a6b' }}>
                {activePost.category}
              </p>
              <h1 className="mt-2 text-3xl sm:text-5xl font-heading font-bold text-primary leading-tight">
                {activePost.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" style={{ color: '#c19a6b' }} />
                  {activePost.date}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4" style={{ color: '#c19a6b' }} />
                  {activePost.readTime}
                </span>
              </div>
            </section>

            <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10 xl:px-12 pb-14">
              <div className="mx-auto w-full max-w-5xl rounded-2xl overflow-hidden mb-8" style={{ border: '1px solid rgba(26,77,46,0.12)' }}>
                <img
                  src={activePost.image}
                  alt={activePost.title}
                  className="w-full h-[240px] sm:h-[320px] lg:h-[380px] object-cover"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <article className="rounded-2xl bg-white p-6 sm:p-10 lg:p-12" style={{ border: '1.5px solid rgba(26,77,46,0.10)' }}>
              

                <div className="rounded-xl bg-primary/5 p-5 sm:p-6 mb-8" style={{ border: '1px solid rgba(26,77,46,0.12)' }}>
                  {heatingLawArticle.lead.map((paragraph, index) => (
                    <p key={`lead-${index}`} className="text-sm sm:text-base text-foreground/90 leading-relaxed mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <section className="mb-10">
                  <h2 className="text-lg sm:text-xl font-heading font-bold text-primary mb-1">
                    {isEnglish ? 'Table of Contents' : 'Inhaltsverzeichnis'}
                  </h2>
                  <p className="text-xs text-muted-foreground mb-3">
                    {isEnglish ? 'Click any section to jump directly.' : 'Klicken Sie auf einen Abschnitt, um direkt zu springen.'}
                  </p>
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(26,77,46,0.12)' }}>
                    <table className="w-full text-left text-sm">
                      <thead className="bg-primary/5">
                        <tr>
                          <th className="px-4 py-2.5 font-semibold text-primary">{isEnglish ? 'Section' : 'Abschnitt'}</th>
                          <th className="px-4 py-2.5 font-semibold text-primary">{isEnglish ? 'Focus' : 'Fokus'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {heatingLawArticle.sections.map((section, index) => (
                          <tr key={`toc-row-${section.heading}`} className="border-t border-primary/10 hover:bg-primary/5 transition-colors">
                            <td className="px-4 py-2.5">
                              <a
                                href={`#${toSectionId(section.heading)}`}
                                className="group inline-flex w-full items-center justify-between rounded-md px-2 py-1.5 font-semibold text-primary hover:bg-primary/10 hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                              >
                                <span className="group-hover:text-primary/90">{index + 1}. {section.heading}</span>
                              </a>
                            </td>
                            <td className="px-4 py-2.5 text-muted-foreground">
                              {(section.paragraphs && section.paragraphs[0]) || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <div className="space-y-10">
                  {heatingLawArticle.sections.map((section) => (
                    <section key={section.heading} id={toSectionId(section.heading)} className="scroll-mt-24">
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-3">
                        {section.heading}
                      </h2>
                      <div className="space-y-3 text-sm sm:text-base text-foreground/90 leading-relaxed">
                        {section.paragraphs?.map((paragraph, index) => (
                          <p key={`${section.heading}-${index}`}>{paragraph}</p>
                        ))}
                      </div>

                      {section.bullets && (
                        <ul className="mt-4 space-y-2">
                          {section.bullets.map((item, index) => (
                            <li key={`${section.heading}-bullet-${index}`} className="flex items-start gap-2.5 text-sm sm:text-base text-foreground/90">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#c19a6b]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {section.cards && (
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                          {section.cards.map((card) => (
                            <div
                              key={card.title}
                              className="rounded-xl bg-white p-4"
                              style={{ border: '1px solid rgba(26,77,46,0.12)', boxShadow: '0 1px 4px rgba(26,77,46,0.05)' }}
                            >
                              <h3 className="text-sm font-bold text-primary mb-2">{card.title}</h3>
                              <p className="text-sm text-muted-foreground leading-relaxed">{card.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              </article>
            </section>
          </>
        )}

        {slug && (!activePost || !activePost.isLive) && (
          <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10 xl:px-12 py-16">
            <div className="rounded-2xl bg-white p-8 text-center" style={{ border: '1.5px solid rgba(26,77,46,0.10)' }}>
              <h2 className="text-2xl font-heading font-bold text-primary mb-2">
                {isEnglish ? 'Article not available yet' : 'Artikel noch nicht verfuegbar'}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {isEnglish
                  ? 'This post is currently in draft mode and will be published soon.'
                  : 'Dieser Beitrag befindet sich im Entwurfsmodus und wird bald veroeffentlicht.'}
              </p>
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
              >
                {isEnglish ? 'Go to blog list' : 'Zur Blogliste'}
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer language={language} />
    </div>
  )
}

export default BlogPage
