import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowRight, ChevronRight, Download, FileText, Globe, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import {
  CompactIndexCard,
  DocumentMiniCard,
  EditorialFeatureCard,
  RailPostCard,
  getEditableExcerpt,
  getEditablePostImage,
  postHref,
} from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function topicLabel(section?: HomeTimeSection) {
  return section?.title || section?.eyebrow || 'Highlights'
}

function QuickTile({ post, href, icon, eyebrow }: { post?: SitePost; href: string; icon: ReactNode; eyebrow: string }) {
  return (
    <Link href={href} className="group grid gap-2 rounded-[1.2rem] px-1 py-2 transition hover:translate-x-1">
      <div className="flex items-start gap-3">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-[1rem] border border-[var(--editable-border)] bg-[var(--slot4-lavender)] text-[var(--slot4-accent)]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#2b67b5]">{eyebrow}</p>
          <h3 className="mt-1 line-clamp-2 text-[1.4rem] font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)]">{post?.title || 'Open this section'}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--slot4-soft-muted-text)]">
            {getEditableExcerpt(post, 82) || 'Browse this lane for polished public files and supporting pages.'}
          </p>
        </div>
      </div>
    </Link>
  )
}

function BrandChip({ label }: { label: string }) {
  return <span className="text-lg font-black tracking-[-0.04em] text-[var(--slot4-page-text)]/75 sm:text-2xl">{label}</span>
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroTitle = pagesContent.home.hero.title.join(' ') || `Your library of useful files, arranged with clarity and intent.`
  const featured = posts[0]
  const sidePosts = posts.slice(1, 7)

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 pb-10 pt-14 sm:px-6 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#2d65b3]">{pagesContent.home.hero.badge}</p>
          <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.08em] text-[var(--slot4-page-text)] sm:text-6xl lg:text-[5.4rem]">
            {heroTitle}
          </h1>
          <div className="mx-auto mt-6 h-1.5 w-10 rounded-full bg-[#ff3c3c]" />
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.home.hero.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href={primaryRoute} className={dc.button.primary}>Get Started</Link>
            <Link href="/search" className={dc.button.secondary}>Search archive</Link>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-0 overflow-hidden rounded-[1.6rem] border border-[var(--editable-border)] bg-white shadow-[0_24px_80px_rgba(17,34,84,0.08)] lg:grid-cols-[0.9fr_1.3fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-[#5a23af] p-6 text-white sm:p-8">
            <img src={getEditablePostImage(featured)} alt={featured?.title || ''} className="absolute inset-0 h-full w-full object-cover opacity-20" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(64,14,125,0.96))]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:44px_44px] opacity-25" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-[1.4rem] bg-white/10 text-white shadow-lg backdrop-blur">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-white/74">Featured library item</p>
                <h2 className="mt-4 max-w-sm text-4xl font-black leading-[0.98] tracking-[-0.06em]">{featured?.title || 'Document spotlight'}</h2>
                <p className="mt-4 max-w-md text-sm leading-7 text-white/82">
                  {getEditableExcerpt(featured, 132) || 'Featured guides, references, and public documents surface here with a stronger visual lead.'}
                </p>
                <Link href={featured ? postHref(primaryTask, featured, primaryRoute) : primaryRoute} className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-black">
                  Explore file <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--editable-border)] pb-5">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-[var(--slot4-page-text)]/68">Featured library lanes</p>
              
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <QuickTile post={sidePosts[0]} href={sidePosts[0] ? postHref(primaryTask, sidePosts[0], primaryRoute) : '/pdf'} icon={<Download className="h-5 w-5" />} eyebrow="Documents" />
             </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 10)
  if (!railPosts.length) return null

  return (
    <section className="bg-[#ffd400]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-black/65">All-in-one suite</p>
          <h2 className="mt-4 text-5xl font-black leading-[0.96] tracking-[-0.07em] text-black">Document-led discovery for teams and readers.</h2>
          <p className="mt-5 text-lg leading-9 text-black/78">
            Open featured files, browse supporting public pages, and move between categories without losing pace.
          </p>
          <Link href={primaryRoute} className="mt-8 inline-flex items-center gap-2 bg-[#ff2b2b] px-7 py-4 text-sm font-black uppercase tracking-[0.06em] text-white">
            Try the library <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="border-black/10 lg:border-l lg:pl-16">
          <p className="text-4xl leading-[1.45] tracking-[-0.04em] text-black">
            "Designed so readers can move from a featured PDF to the right supporting page in just a few clean steps."
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full bg-black/10">
              <img src={getEditablePostImage(railPosts[0])} alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-2xl font-black text-black">{taskLabel(primaryTask)} Desk</p>
              <p className="text-sm text-black/72">Premium archive experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts[0]
  const supporting = posts.slice(1, 7)
  if (!featured) return null

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-black/55">Brands that trust clean discovery</p>
          <div className="mx-auto mt-5 h-1 w-8 rounded-full bg-[#ff3c3c]" />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-10">
            {['IIFL Finance', 'SpiceJet', 'Tata Play', 'Max Life', 'Union Bank', 'ICICI'].map((brand) => <BrandChip key={brand} label={brand} />)}
          </div>
          <Link href={primaryRoute} className="mt-10 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#2b67b5]">
            Customer stories <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-16 overflow-hidden rounded-[1.6rem] border border-[var(--editable-border)] bg-[#050505] shadow-[0_24px_80px_rgba(0,0,0,0.18)]">
          <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="p-8 text-[#f4d086] sm:p-10">
              <p className="max-w-sm text-5xl font-black leading-[1] tracking-[-0.07em]">Built with patience. Guided by purpose.</p>
              <p className="mt-6 max-w-md text-lg leading-9 text-[#f2d99f]/86">
                Featured resources and supporting content are arranged for fast understanding rather than visual noise.
              </p>
              <Link href={postHref(primaryTask, featured, primaryRoute)} className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#ff9c43]">
                Read the story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative min-h-[280px]">
              <img src={getEditablePostImage(featured)} alt={featured.title} className="absolute inset-0 h-full w-full object-cover opacity-88" />
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#2d65b3]">Library edition</p>
            <h2 className="mt-4 text-5xl font-black leading-[0.96] tracking-[-0.07em]">A cleaner archive structure for public documents and supporting pages.</h2>
            <p className="mt-6 text-lg leading-9 text-[var(--slot4-muted-text)]">
              The layout uses stronger featured modules, quieter lists, and more legible content blocks so the archive feels distinct and easier to trust.
            </p>
            <Link href={primaryRoute} className="mt-8 inline-flex items-center gap-2 border border-[#2b67b5] px-7 py-4 text-sm font-black uppercase tracking-[0.06em] text-[#2b67b5]">
              Learn more <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4">
            {supporting.slice(0, 3).map((post, index) => (
              <CompactIndexCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const feed = timeSections.flatMap((section) => section.posts)
  const banner = feed[0] || posts[0]
  const left = posts.slice(0, 1)
  const right = feed.slice(0, 6).length ? feed.slice(0, 6) : posts.slice(1, 7)

  return (
    <>
      <section className="relative">
        <div className="mx-auto max-w-[var(--editable-container)] px-4 pt-8 sm:px-6 lg:px-8">
          <div className="relative min-h-[380px] overflow-hidden rounded-t-[1.5rem] bg-[var(--slot4-dark-bg)]">
            <img src={getEditablePostImage(banner)} alt={banner?.title || ''} className="absolute inset-0 h-full w-full object-cover opacity-78" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.52))]" />
          </div>
          <div className="relative z-10 mx-auto -mt-16 max-w-5xl rounded-[1.8rem] border border-[var(--editable-border)] bg-white p-8 shadow-[0_24px_80px_rgba(17,34,84,0.1)] sm:p-12">
            <h2 className="mx-auto max-w-2xl text-center text-5xl font-black leading-[1] tracking-[-0.07em]">The core values of a better archive experience.</h2>
            <div className="mx-auto mt-6 h-1.5 w-10 rounded-full bg-[#ff3c3c]" />
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-2xl font-black tracking-[-0.04em]">Long-term readability</h3>
                <p className="mt-3 text-base leading-8 text-[var(--slot4-muted-text)]">Spacing, contrast, and card variety are tuned so visitors can browse for longer without fatigue.</p>
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-[-0.04em]">Document-first clarity</h3>
                <p className="mt-3 text-base leading-8 text-[var(--slot4-muted-text)]">Featured PDFs, supporting details, and related pages stay visible instead of being buried beneath generic layouts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0d5dab] text-white">
        <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-center text-5xl font-black leading-[1.02] tracking-[-0.07em] sm:text-6xl">Made for public files. Made for the modern web.</h2>
          <div className="mx-auto mt-6 h-1 w-9 rounded-full bg-[#9de27f]" />
          <div className="mt-14 grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-5">
            {[
              ['150M+', 'Pages explored'],
              ['150+', 'Topics surfaced'],
              ['60+', 'Document categories'],
              ['30+', 'UI blocks refreshed'],
              ['19K+', 'Reading sessions'],
            ].map(([value, label]) => (
              <div key={label} className="border-white/12 lg:border-l lg:first:border-l-0">
                <p className="text-5xl font-black tracking-[-0.06em]">{value}</p>
                <p className="mt-2 text-sm font-semibold text-white/78">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--slot4-gray)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              {left[0] ? <EditorialFeatureCard post={left[0]} href={postHref(primaryTask, left[0], primaryRoute)} label={topicLabel(timeSections[0])} /> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {right.map((post, index) => (
                <DocumentMiniCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} number={index + 1} />
              ))}
            </div>
          </div>
          <div className="mt-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2d65b3]">Trending collection</p>
                <h2 className="mt-3 text-4xl font-black leading-[0.96] tracking-[-0.06em]">More ways to browse {taskLabel(primaryTask).toLowerCase()}.</h2>
              </div>
              <Link href={primaryRoute} className="hidden items-center gap-2 text-sm font-black uppercase tracking-[0.14em] text-[#2b67b5] md:inline-flex">
                View archive <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <Rail className="mt-8">
              {posts.slice(0, 10).map((post, index) => <RailPostCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </Rail>
          </div>
        </div>
      </section>
    </>
  )
}

function Rail({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`${dc.layout.rail} ${className}`}>{children}</div>
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute left-[10%] top-[15%] h-56 w-56 rounded-full bg-[var(--slot4-accent-soft)] blur-3xl" />
        <div className="absolute right-[12%] top-[35%] h-56 w-56 rounded-full bg-[var(--slot4-sky-soft)] blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-[#2d65b3]">{pagesContent.home.cta.badge}</p>
          <h2 className="mt-5 text-5xl font-black leading-[0.98] tracking-[-0.07em]">{pagesContent.home.cta.title}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">{pagesContent.home.cta.description}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href={pagesContent.home.cta.primaryCta.href} className={dc.button.primary}>{pagesContent.home.cta.primaryCta.label}</Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className={dc.button.secondary}>{pagesContent.home.cta.secondaryCta.label}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
