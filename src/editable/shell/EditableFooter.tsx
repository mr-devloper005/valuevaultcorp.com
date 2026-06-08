'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { CSSProperties } from 'react'
import { ArrowUpRight, ChevronRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const footerVars = {
    '--editable-footer-bg': '#0d5dab',
    '--editable-footer-text': '#f6fbff',
  } as CSSProperties
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer style={footerVars} className="mt-20 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 rounded-[2.4rem] border border-white/12 bg-white/6 p-8 backdrop-blur lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-4">
              <span className="overflow-hidden rounded-2xl">
                <Image src="/favico.png" alt={`${SITE_CONFIG.name} logo`} width={184} height={184} className="h-20 w-auto" />
              </span>
              <span>
                <span className="block text-2xl font-black tracking-[-0.05em] text-white">{SITE_CONFIG.name.replace('.com', '')}</span>
                <span className="block text-xs font-bold uppercase tracking-[0.24em] text-white/60">{globalContent.footer.tagline}</span>
              </span>
            </Link>
            <h2 className="mt-4 max-w-sm text-4xl font-black leading-[1] tracking-[-0.06em]">Made for documents. Designed for clean public discovery.</h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-white/74">{globalContent.footer.description}</p>
            <Link href="/pdf"  className="mt-7 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-white">
              Explore library <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <FooterColumn title="Sections" links={taskLinks.map((task) => ({ label: task.label, href: task.route }))} />
          
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.24em] text-white/58">Account</h3>
            <div className="mt-5 grid gap-3">
              <Link href="/about" className="inline-flex items-center gap-2 text-sm font-semibold text-white/82 hover:text-white">
                About <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-white/82 hover:text-white">
                Contact <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              {session ? (
                <>
                  <Link href="/create" className="inline-flex items-center gap-2 text-sm font-semibold text-white/82 hover:text-white">
                    Create <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <button type="button" onClick={logout} className="text-left text-sm font-semibold text-white/82 hover:text-white">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-semibold text-white/82 hover:text-white">Sign In</Link>
                  <Link href="/signup" className="text-sm font-semibold text-white/82 hover:text-white">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs font-semibold tracking-[0.12em] text-white/66">
        {'©'} {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<{ label: string; href: string }> }) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-[0.24em] text-white/58">{title}</h3>
      <div className="mt-5 grid gap-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="inline-flex items-center gap-2 text-sm font-semibold text-white/82 hover:text-white">
            {link.label}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        ))}
      </div>
    </div>
  )
}
