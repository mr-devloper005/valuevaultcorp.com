import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { getEditableCategory, getEditableExcerpt, getEditablePostImage } from '@/editable/cards/PostCards'
import { CopyUrlButton } from '@/editable/components/CopyUrlButton'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  const fallback = getEditablePostImage(post)
  return [...new Set([fallback, ...media, ...images, ...singleImages].filter(Boolean))].slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => getEditableExcerpt(post, 240)
const categoryOf = (post: SitePost, fallback: string) => getEditableCategory(post) || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as never)
  const detailVars = {
    '--detail-bg': preset.colors.background,
    '--detail-text': '#12172b',
    '--detail-surface': '#ffffff',
    '--detail-accent': '#9fa1ff',
  } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-sm font-black shadow-sm">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function HeroHeader({ task, post, badge }: { task: TaskKey; post: SitePost; badge: string }) {
  const image = getImages(post)[0]
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <div className="overflow-hidden rounded-[2.4rem] border border-[var(--editable-border)] bg-white shadow-[0_24px_80px_rgba(17,34,84,0.08)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-8 lg:p-10">
            <BackLink task={task} />
            <p className="mt-8 text-xs font-black uppercase tracking-[0.28em] text-[#2b67b5]">{badge}</p>
            <h1 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.08em] sm:text-5xl lg:text-7xl">{post.title}</h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--slot4-muted-text)]">{summaryText(post) || 'Open this page for the full details and supporting content.'}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-[var(--editable-border)] bg-[#f7f9ff] px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">{categoryOf(post, badge)}</span>
              {post.publishedAt ? <span className="rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">{new Date(post.publishedAt).toLocaleDateString()}</span> : null}
            </div>
          </div>
          <div className="relative min-h-[280px] bg-[var(--slot4-lavender)]">
            <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <>
      <HeroHeader task="article" post={post} badge="Article detail" />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-12">
        <article className="min-w-0 rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_24px_80px_rgba(17,34,84,0.08)] sm:p-8 lg:p-10">
          <BodyContent post={post} />
          <ImageStrip images={getImages(post).slice(1)} label="Supporting visuals" />
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <RelatedPanel task="article" post={post} related={related} />
      </section>
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <>
      <HeroHeader task="listing" post={post} badge="Business listing" />
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <article className="rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_24px_80px_rgba(17,34,84,0.08)] sm:p-8 lg:p-10">
            <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
            <BodyContent post={post} />
            <ImageStrip images={getImages(post).slice(1)} label="Showcase" />
          </article>
          <aside className="space-y-5">
            {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
            <ContactAction website={website} phone={phone} email={email} />
            <RelatedPanel task="listing" post={post} related={related} compact />
          </aside>
        </div>
      </section>
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <HeroHeader task="classified" post={post} badge="Classified detail" />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-7 px-4 py-8 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-12">
        <aside className="rounded-[2.4rem] border border-[var(--editable-border)] bg-[var(--slot4-page-text)] p-7 text-white shadow-xl lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-white/55">Classified facts</p>
          <div className="mt-8 grid gap-3">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {phone ? <a href={`tel:${phone}`} className="rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--slot4-page-text)]">Call now</a> : null}
            {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/25 px-5 py-3 text-sm font-black">Email</a> : null}
          </div>
        </aside>
        <article className="rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-6 shadow-[0_24px_80px_rgba(17,34,84,0.08)] sm:p-8 lg:p-10">
          <ImageStrip images={getImages(post)} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="classified" post={post} related={related} />
        </article>
      </section>
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <>
      <HeroHeader task="image" post={post} badge="Image story" />
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-7 lg:sticky lg:top-24 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-white"><Camera className="h-4 w-4" /> Visual feature</div>
            <BodyContent post={post} compact />
          </aside>
          <div className="columns-1 gap-5 space-y-5 md:columns-2">
            {(images.length ? images : [getEditablePostImage(post)]).map((image, index) => (
              <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm">
                <img src={image} alt="" className="w-full object-cover" />
                {index === 0 ? <figcaption className="p-5 text-sm font-bold text-[var(--slot4-soft-muted-text)]">Featured visual from this image post.</figcaption> : null}
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-10"><RelatedPanel task="image" post={post} related={related} /></div>
      </section>
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <HeroHeader task="sbm" post={post} badge="Saved reference" />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-12">
        <article className="rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-7 shadow-[0_24px_80px_rgba(17,34,84,0.08)] sm:p-10">
          {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-3 text-sm font-black text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" post={post} related={related} />
      </section>
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const images = getImages(post)
  const leadImage = images[0]
  const body = getBody(post)
  const bodyParagraphs = body.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean)
  const highlights = bodyParagraphs.slice(0, 3)
  const insights = [
    ['Format', 'PDF resource'],
    ['Category', categoryOf(post, 'Document')],
    ['Source', SITE_CONFIG.name],
  ]

  return (
    <>
      <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="overflow-hidden rounded-[2.7rem] border border-[var(--editable-border)] bg-[linear-gradient(135deg,#071a37_0%,#0d5dab_48%,#dff2ff_100%)] text-white shadow-[0_30px_120px_rgba(7,26,55,0.24)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 sm:p-8 lg:p-12">
              <BackLink task="pdf" />
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/88">
                <FileText className="h-4 w-4" />
                PDF resource
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.94] tracking-[-0.08em] text-white sm:text-5xl lg:text-7xl">
                {post.title}
              </h1>
              
              <div className="mt-8 flex flex-wrap gap-3">
                {fileUrl ? (
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#071a37] transition hover:-translate-y-0.5">
                    Open PDF <Download className="h-4 w-4" />
                  </Link>
                ) : null}
                <CopyUrlButton className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/16" label="Share page" />
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {insights.map(([label, value]) => (
                  <div key={label} className="rounded-[1.6rem] border border-white/12 bg-white/8 p-4 backdrop-blur">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/58">{label}</p>
                    <p className="mt-2 text-sm font-bold leading-6 text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden border-t border-white/10 bg-[#dff2ff] lg:min-h-full lg:border-l lg:border-t-0">
              {leadImage ? <img src={leadImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-85" /> : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,26,55,0.04),rgba(7,26,55,0.22)_42%,rgba(7,26,55,0.76)_100%)]" />
              <div className="relative flex h-full flex-col justify-end p-6 sm:p-8 lg:p-10">
                
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-12">
        <article className="min-w-0 space-y-8">
          
          
          {fileUrl ? (
            <div className="overflow-hidden rounded-[2.4rem] border border-[var(--editable-border)] bg-white shadow-[0_24px_80px_rgba(17,34,84,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--editable-border)] bg-[linear-gradient(180deg,#fbfdff_0%,#f2f7ff_100%)] p-5">
                <div>
                  <p className="text-sm font-black tracking-[-0.02em] text-[var(--slot4-page-text)]">Live document preview</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-soft-muted-text)]">Read before you open</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <CopyUrlButton className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-xs font-black text-[var(--slot4-page-text)]" label="Copy link" />
                  <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-xs font-black text-white">
                    Download <Download className="h-4 w-4" />
                  </Link>
                </div>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full bg-white" />
            </div>
          ) : (
            <div className="rounded-[2.4rem] border border-dashed border-[var(--editable-border)] bg-[#f7f9ff] p-8 text-center">
              <p className="text-sm font-bold text-[var(--slot4-soft-muted-text)]">No direct preview file was provided for this document.</p>
            </div>
          )}
        </article>

        <aside className="space-y-5">
          <div className="rounded-[2rem] border border-[var(--editable-border)] bg-[#071a37] p-6 text-white shadow-[0_20px_60px_rgba(7,26,55,0.2)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-white/55">Document actions</p>
            <div className="mt-5 grid gap-3">
              {fileUrl ? (
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[#071a37]">
                  Open PDF <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
              <CopyUrlButton className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white" label="Share this page" />
            </div>
          </div>

          

          {/* <RelatedPanel task="pdf" post={post} related={related} /> */}
        </aside>
      </section>
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <>
      <HeroHeader task="profile" post={post} badge="Profile detail" />
      <section className="mx-auto grid max-w-[var(--editable-container)] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:px-8 lg:py-12">
        <aside className="rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-8 text-center shadow-[0_24px_80px_rgba(17,34,84,0.08)] lg:sticky lg:top-24 lg:self-start">
          <div className="mx-auto flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-[var(--slot4-lavender)] ring-1 ring-[var(--editable-border)]">
            <img src={images[0]} alt="" className="h-full w-full object-cover" />
          </div>
          <h1 className="mt-6 text-4xl font-black leading-[0.98] tracking-[-0.07em]">{post.title}</h1>
          {role ? <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[#2b67b5]">{role}</p> : null}
          <ContactAction website={website} email={email} />
        </aside>
        <article className="rounded-[2.4rem] border border-[var(--editable-border)] bg-white p-7 shadow-sm sm:p-10">
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Profile gallery" />
          <RelatedPanel task="profile" post={post} related={related} />
        </article>
      </section>
    </>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-[var(--slot4-page-text)]/82`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[var(--editable-border)] bg-[#f7f9ff] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[var(--slot4-page-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#2b67b5]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-[var(--editable-border)]" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="rounded-[2rem] border border-[var(--editable-border)] bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-sm font-black text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] opacity-60">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {!compact ? (
        <div className="rounded-[2rem] border border-[var(--editable-border)] bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">About this post</p>
          <div className="mt-4 grid gap-3 text-sm font-bold text-[var(--slot4-page-text)]/75">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[2rem] border border-[var(--editable-border)] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-black tracking-[-0.04em]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[var(--slot4-soft-muted-text)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-2xl border border-[var(--editable-border)] bg-[#f7f9ff] p-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[var(--slot4-lavender)]"><FileText className="h-6 w-6 opacity-45" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--slot4-soft-muted-text)]">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-[var(--editable-border)] bg-[#f7f9ff] p-5">
      <div className="flex items-center gap-2 text-lg font-black"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-[var(--editable-border)] bg-white p-4">
            <p className="text-sm font-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--slot4-page-text)]/75">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-[var(--slot4-soft-muted-text)]">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
