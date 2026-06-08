import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Globe2, Image as ImageIcon, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { getEditableExcerpt, getEditablePostImage, getEditableCategory, postHref } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; promise: string; badge: string }> = {
  article: { icon: FileText, promise: 'Feature stories, reading cards, and supporting lists in one composed archive.', badge: 'Read' },
  listing: { icon: Building2, promise: 'Directory cards highlight identity, location, and direct business details.', badge: 'Business' },
  classified: { icon: Megaphone, promise: 'Compact offer surfaces keep practical details up front.', badge: 'Offer' },
  image: { icon: Camera, promise: 'A gallery-led grid balances image-first posts with supporting captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, promise: 'Reference links are grouped like useful shelves instead of generic feed cards.', badge: 'Bookmark' },
  pdf: { icon: Download, promise: 'Document cards foreground file context, titles, summaries, and clear open paths.', badge: 'PDF' },
  profile: { icon: UserRound, promise: 'Profile cards prioritize identity, role, and recognisable visual cues.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as never)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = {
    '--archive-bg': preset.colors.background,
    '--archive-text': '#12172b',
    '--archive-surface': '#ffffff',
    '--archive-accent': '#9fa1ff',
  } as CSSProperties
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const featured = posts[0]
  const rest = posts.slice(1)
  const chips = voice.chips || []

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-7 shadow-[0_24px_80px_rgba(17,34,84,0.08)] sm:p-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-lavender)] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#2b67b5]">
                <Icon className="h-4 w-4" />
                {voice.eyebrow}
              </div>
              <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.08em] sm:text-6xl">{voice.headline}</h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{voice.description}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span key={chip} className="rounded-full border border-[var(--editable-border)] bg-[#f7f9ff] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)]/75">
                    {chip}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                
                <Link href="/search" className="inline-flex items-center gap-2 border border-[var(--editable-border)] px-7 py-3.5 text-sm font-black uppercase tracking-[0.06em]">
                  Search archive
                </Link>
              </div>
            </div>

            <div className="grid gap-5">
              <form action={basePath} className="rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-[#2b67b5]">
                  <Filter className="h-4 w-4" />
                  {voice.filterLabel}
                </div>
                <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-2xl border border-[var(--editable-border)] bg-[#f7f9ff] px-4 text-sm font-bold outline-none">
                  <option value="all">All categories</option>
                  {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="mt-3 h-12 w-full rounded-2xl bg-[var(--slot4-page-text)] text-sm font-black text-white">Apply filters</button>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">Showing: {categoryLabel}</p>
              </form>
              <div className="rounded-[2rem] border border-[var(--editable-border)] bg-[#ffd400] p-6">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-black/65">{deck.badge} edition</p>
                <p className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em] text-black">{deck.promise}</p>
                <p className="mt-4 text-sm leading-7 text-black/72">{voice.secondaryNote}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-16 sm:px-6 lg:px-8">
          {featured ? <FeaturedArchiveCard post={featured} task={task} basePath={basePath} /> : null}

          {rest.length ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
              {rest.map((post, index) => <ArchivePostCard key={post.id || post.slug || `${task}-${index}`} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : !featured ? (
            <div className="rounded-[2rem] border border-dashed border-[var(--editable-border)] bg-white/70 p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm opacity-65">Try another category or refresh after publishing new content.</p>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function FeaturedArchiveCard({ post, task, basePath }: { post: SitePost; task: TaskKey; basePath: string }) {
  const href = postHref(task, post, basePath)
  return (
    <Link href={href} className="group grid overflow-hidden rounded-[2.3rem] border border-[var(--editable-border)] bg-white shadow-[0_24px_80px_rgba(17,34,84,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_95px_rgba(17,34,84,0.14)] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative min-h-[320px] overflow-hidden bg-[var(--slot4-dark-bg)] p-8 text-white sm:p-10">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-28 transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(13,15,25,0.88))]" />
        <div className="relative z-10 flex h-full flex-col justify-end">
          <span className="w-fit rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em]">Featured {getEditableCategory(post)}</span>
          <h2 className="mt-6 max-w-2xl text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-5xl">{post.title}</h2>
          <p className="mt-4 max-w-xl text-sm leading-8 text-white/78">{getEditableExcerpt(post, 170) || 'Open this feature for the full details, preview, and supporting context.'}</p>
        </div>
      </div>
      <div className="p-7 sm:p-10">
        <div className="grid gap-4 sm:grid-cols-2">
          <ArchiveMeta label="Category" value={getEditableCategory(post)} />
          <ArchiveMeta label="Published" value={post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Available now'} />
          <ArchiveMeta label="Title" value={post.title} />
          <ArchiveMeta label="Route" value={basePath.replace('/', '') || 'home'} />
        </div>
        <div className="mt-8 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#2b67b5]">
          Open entry <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  )
}

function ArchiveMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[var(--editable-border)] bg-[#f7f9ff] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">{label}</p>
      <p className="mt-2 text-sm font-bold leading-6 text-[var(--slot4-page-text)]">{value}</p>
    </div>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const mode = index % 4
  if (task === 'image') return <ImageArchiveCard post={post} href={postHref(task, post, basePath)} index={index} />
  if (task === 'listing') return mode === 0 ? <ListingArchiveCard post={post} href={postHref(task, post, basePath)} /> : <HorizontalArchiveCard post={post} href={postHref(task, post, basePath)} eyebrow="Listing" />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={postHref(task, post, basePath)} />
  if (task === 'sbm') return mode === 0 ? <BookmarkArchiveCard post={post} href={postHref(task, post, basePath)} index={index} /> : <EditorialArchiveCard post={post} href={postHref(task, post, basePath)} eyebrow="Reference" />
  if (task === 'pdf') {
    if (mode === 0) return <DocumentArchiveCard post={post} href={postHref(task, post, basePath)} />
    if (mode === 1) return <HorizontalArchiveCard post={post} href={postHref(task, post, basePath)} eyebrow="Document" />
    if (mode === 2) return <EditorialArchiveCard post={post} href={postHref(task, post, basePath)} eyebrow="Library pick" />
    return <CompactArchiveCard post={post} href={postHref(task, post, basePath)} number={index + 2} />
  }
  if (task === 'profile') return mode === 0 ? <ProfileArchiveCard post={post} href={postHref(task, post, basePath)} /> : <EditorialArchiveCard post={post} href={postHref(task, post, basePath)} eyebrow="Profile" />
  if (mode === 0) return <ImageFirstArchiveCard post={post} href={postHref(task, post, basePath)} />
  if (mode === 1) return <HorizontalArchiveCard post={post} href={postHref(task, post, basePath)} eyebrow="Editorial" />
  if (mode === 2) return <EditorialArchiveCard post={post} href={postHref(task, post, basePath)} eyebrow="Spotlight" />
  return <CompactArchiveCard post={post} href={postHref(task, post, basePath)} number={index + 2} />
}

function ImageFirstArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/11] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">{getEditableCategory(post)}</span>
      </div>
      <div className="p-5">
        <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 125)}</p>
      </div>
    </Link>
  )
}

function CompactArchiveCard({ post, href, number }: { post: SitePost; href: string; number: number }) {
  return (
    <Link href={href} className="group rounded-[1.8rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[var(--slot4-lavender)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">No. {String(number).padStart(2, '0')}</span>
        <ArrowRight className="h-4 w-4 text-[#2b67b5]" />
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 110)}</p>
    </Link>
  )
}

function HorizontalArchiveCard({ post, href, eyebrow }: { post: SitePost; href: string; eyebrow: string }) {
  return (
    <Link href={href} className="group grid gap-4 overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[170px_minmax(0,1fr)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-[var(--slot4-media-bg)] sm:aspect-auto sm:min-h-[150px]">
        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 py-1">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#2b67b5]">{eyebrow}</p>
        <h2 className="mt-2 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 145)}</p>
      </div>
    </Link>
  )
}

function EditorialArchiveCard({ post, href, eyebrow }: { post: SitePost; href: string; eyebrow: string }) {
  return (
    <Link href={href} className="group rounded-[2rem] border border-[var(--editable-border)] bg-[#f7f9ff] p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white hover:shadow-xl">
      <p className="text-[11px] font-black uppercase tracking-[0.26em] text-[#2b67b5]">{eyebrow}</p>
      <h2 className="mt-5 text-3xl font-black leading-[0.98] tracking-[-0.06em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-8 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 165)}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-black">Open entry <ArrowRight className="h-4 w-4" /></span>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[var(--editable-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[110px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--slot4-lavender)] ring-1 ring-[var(--editable-border)]">
        <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--slot4-page-text)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[var(--editable-border)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 120)}</p>
        {phone ? <p className="mt-4 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">Phone: {phone}</p> : null}
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget']) || 'Open offer'
  const location = getField(post, ['location', 'address', 'city']) || 'Details inside'
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[var(--slot4-page-text)] p-5 text-white">
          <span className="rounded-full bg-white/14 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price}</h2>
          <p className="mt-4 text-sm font-bold opacity-75">{location}</p>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 150)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#2b67b5]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-lavender)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.8rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[var(--slot4-page-text)] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 opacity-80">{getEditableExcerpt(post, 150)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-65">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function DocumentArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--slot4-page-text)] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--slot4-lavender)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{getEditableCategory(post)}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 140)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#2b67b5]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-lavender)] ring-1 ring-[var(--editable-border)]">
        <img src={getEditablePostImage(post)} alt="" className="h-full w-full object-cover" />
      </div>
      <h2 className="mt-5 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[#2b67b5]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 110)}</p>
    </Link>
  )
}
