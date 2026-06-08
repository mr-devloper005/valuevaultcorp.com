import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { buildPageMetadata } from '@/lib/seo'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/about',
    title: `About ${SITE_CONFIG.name}`,
    description: pagesContent.about.description,
  })
}

export default function AboutPage() {
  const enabledTasks = SITE_CONFIG.tasks.filter((task) => task.enabled)

  return (
    <EditableSiteShell>
      <main className="px-4 py-14 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-[var(--editable-container)]">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="overflow-hidden rounded-[2.6rem] border border-[var(--editable-border)] bg-white shadow-[0_24px_80px_rgba(17,34,84,0.08)]">
              <div className="border-b border-[var(--editable-border)] bg-[linear-gradient(135deg,#f7fbff_0%,#eef6ff_46%,#ffffff_100%)] p-8 lg:p-12">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2b67b5]">{pagesContent.about.badge}</p>
                <h1 className="mt-5 max-w-3xl text-5xl font-black tracking-[-0.08em] text-[var(--slot4-page-text)] sm:text-6xl">
                  About {SITE_CONFIG.name}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-9 text-[var(--slot4-muted-text)]">
                 Our mission is to simplify document discovery and sharing by providing a user-friendly space where individuals, professionals, and organizations can upload, explore, and access high-quality PDF resources. We are committed to delivering a seamless experience that helps users save time, learn more, and stay productive.
                </p>
              </div>

              <div className="grid gap-10 p-8 lg:p-12">
                <div className="space-y-5 text-base leading-8 text-[var(--slot4-page-text)]/78">
                  <p>
                    This website is designed around clarity first. Instead of burying important files inside cluttered pages, it gives every document a cleaner path from discovery to preview to deeper reading.
                  </p>
                  <p>
                    The experience is structured so visitors can move naturally between the homepage, search, section archives, and detail pages without losing context. That makes the site feel more dependable whether someone is browsing casually or looking for something specific.
                  </p>
                  <p>
                    From the navigation to the footer to the archive layouts, the goal is the same throughout: present useful public content in a way that feels organized, polished, and easy to trust.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {pagesContent.about.values.map((value) => (
                    <div key={value.title} className="rounded-[1.8rem] border border-[var(--editable-border)] bg-[#f7fbff] p-5">
                      <h2 className="text-xl font-black tracking-[-0.04em] text-[var(--slot4-page-text)]">{value.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{value.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <aside className="space-y-4">
              <div className="rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#2b67b5]">What you can browse</p>
                <div className="mt-5 grid gap-3">
                  {enabledTasks.map((task) => (
                    <Link
                      key={task.key}
                      href={task.route}
                      className="flex items-start justify-between gap-3 rounded-[1.4rem] border border-[var(--editable-border)] bg-[#f9fbff] px-4 py-4 transition hover:-translate-y-0.5 hover:bg-white"
                    >
                      <div>
                        <p className="text-sm font-black text-[var(--slot4-page-text)]">{task.label}</p>
                        <p className="mt-1 text-sm leading-6 text-[var(--slot4-soft-muted-text)]">{task.description}</p>
                      </div>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#2b67b5]" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] bg-[#0d5dab] p-6 text-white shadow-[0_20px_60px_rgba(13,93,171,0.24)]">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/70">Why it matters</p>
                <div className="mt-4 grid gap-3">
                  <p className="text-2xl font-black leading-tight tracking-[-0.04em]">
                    Useful content becomes more valuable when it is easy to find, easy to scan, and easy to return to.
                  </p>
                  <div className="grid gap-3 pt-2">
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8df0c8]" />
                      <p className="text-sm leading-7 text-white/82">Cleaner browsing for PDFs, resources, and related public pages.</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8df0c8]" />
                      <p className="text-sm leading-7 text-white/82">A more consistent visual system across archives, detail pages, and search.</p>
                    </div>
                    <div className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8df0c8]" />
                      <p className="text-sm leading-7 text-white/82">{globalContent.footer.bottomNote}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[var(--editable-border)] bg-[#ffd400] p-6 text-black">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-black/65">Next step</p>
                <p className="mt-3 text-2xl font-black leading-tight tracking-[-0.04em]">Start with the library, then move into the sections most relevant to you.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/pdf" className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-black text-white">
                    Open library <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-black/15 px-5 py-3 text-sm font-black text-black">
                    Contact
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
