import Link from 'next/link'
import { ArrowRight, Clock3, Download, FileText } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

const placeholder = '/placeholder.svg?height=900&width=1400'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const fallbackImage = [content.image, content.featuredImage, content.thumbnail, content.logo, content.avatar].find((value) => typeof value === 'string' && value) as string | undefined
  return mediaUrl || contentImage || fallbackImage || placeholder
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    (typeof content.body === 'string' && content.body) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Featured'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Featured document' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden rounded-[2rem] bg-[#5a23af] text-white shadow-[0_28px_80px_rgba(86,35,160,0.24)] ${dc.motion.lift}`}>
      <div className="relative min-h-[460px] p-6 sm:p-8 lg:min-h-[520px]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover opacity-24 transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(181,186,255,0.24),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(47,10,103,0.92))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25" />
        <div className="relative z-10 flex h-full min-h-[400px] flex-col justify-end lg:min-h-[460px]">
          <span className="w-fit rounded-full border border-white/18 bg-white/12 px-4 py-2 text-[10px] font-black uppercase tracking-[0.26em]">{label}</span>
          <h3 className="mt-6 max-w-2xl text-4xl font-black leading-[0.94] tracking-[-0.07em] sm:text-5xl">{post.title}</h3>
          <p className="mt-5 max-w-xl text-sm leading-8 text-white/82 sm:text-base">{getEditableExcerpt(post, 180) || 'Open this featured file to preview the full document and supporting context.'}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/22 px-5 py-3 text-sm font-black">
            Explore document <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden rounded-[1.8rem] border ${pal.border} bg-white ${dc.motion.lift}`}>
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(17,19,31,0.72)_100%)]" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">#{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</p>
        <h3 className="mt-2 line-clamp-3 text-lg font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group block min-w-0 rounded-[1.7rem] border ${pal.border} bg-white p-5 ${dc.motion.lift}`}>
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-xs font-black text-white">{String(index + 1).padStart(2, '0')}</span>
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">
            <Clock3 className="h-3.5 w-3.5" />
            {getEditableCategory(post)}
          </p>
          <h3 className="mt-2 line-clamp-2 text-xl font-black leading-tight tracking-[-0.04em] text-[var(--slot4-page-text)]">{post.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 105)}</p>
        </div>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-5 overflow-hidden rounded-[2rem] border ${pal.border} bg-white p-4 ${dc.motion.lift} sm:grid-cols-[220px_minmax(0,1fr)]`}>
      <div className="relative aspect-[16/11] overflow-hidden rounded-[1.5rem] bg-[var(--slot4-media-bg)] sm:min-h-[190px] sm:aspect-auto">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 p-2 sm:py-4 sm:pr-5">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Read {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-3 line-clamp-3 text-2xl font-black leading-tight tracking-[-0.05em] text-[var(--slot4-page-text)] sm:text-3xl">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 180)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[var(--slot4-page-text)]">Open article <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export function DocumentMiniCard({ post, href, number }: { post: SitePost; href: string; number: number }) {
  return (
    <Link href={href} className={`group rounded-[1.7rem] border ${pal.border} bg-white p-5 ${dc.motion.lift}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[var(--slot4-lavender)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">Doc {String(number).padStart(2, '0')}</span>
        <FileText className="h-5 w-5 text-[var(--slot4-accent)]" />
      </div>
      <h3 className="mt-5 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{getEditableExcerpt(post, 120)}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-page-text)] opacity-70">
        Open <Download className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}
