'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ChevronDown, Globe, LogIn, Menu, Search, UserPlus, X, PlusCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const preset = getVisualPreset(visualSystem.recommendedPreset as never)
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const navVars = {
    '--editable-nav-bg': '#ffffff',
    '--editable-nav-text': '#141823',
    '--editable-nav-active': preset.colors.accent,
    '--editable-nav-active-text': '#141823',
    '--editable-cta-bg': '#ffffff',
    '--editable-cta-text': '#e11d2e',
    '--editable-search-bg': '#ffffff',
    '--editable-border': 'rgba(20,24,35,0.1)',
    '--editable-container': '1440px',
  } as CSSProperties
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled).slice(0, 5).map((task) => ({ label: task.label, href: task.route })),
    []
  )

  return (
    <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-border)] bg-[var(--editable-nav-bg)]/96 text-[var(--editable-nav-text)] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[78px] w-full max-w-[var(--editable-container)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <span className="overflow-hidden rounded-xl">
            <Image src="/favico.png" alt={`${SITE_CONFIG.name} logo`} width={184} height={184} className="h-12 w-auto transition group-hover:scale-[1.02]" priority />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-black uppercase tracking-[0.2em] text-black">{SITE_CONFIG.name.replace('.com', '')}</span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.32em] text-black/45">{globalContent.nav.tagline}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition ${active ? 'text-black' : 'text-black/86 hover:bg-black/[0.04]'}`}
              >
                {item.label}
                
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
          <Link href="/search" className="hidden rounded-full p-2 text-black/80 transition hover:bg-black/[0.04] md:inline-flex" aria-label="Search">
            <Search className="h-5 w-5" />
          </Link>
            

          {session ? (
            <>
              <Link href="/create" className="hidden items-center gap-2 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-semibold sm:inline-flex">
                <PlusCircle className="h-4 w-4" />
                Create
              </Link>
              <button type="button" onClick={logout} className="hidden px-3 py-2 text-sm font-semibold text-[#e11d2e] sm:inline-flex">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden px-3 py-2 text-sm font-semibold text-[#e11d2e] sm:inline-flex">
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
              <Link href="/signup" className="hidden rounded-sm border border-[#ff4b4b] px-4 py-2 text-sm font-semibold text-[#e11d2e] transition hover:bg-[#fff4f4] sm:inline-flex">
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Link>
            </>
          )}

          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-[var(--editable-border)] p-2 lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-white px-4 py-4 lg:hidden">
          <form action="/search" className="mb-4 flex rounded-2xl border border-[var(--editable-border)] bg-[#f7f9ff] px-3 py-3">
            <Search className="mt-0.5 h-4 w-4 opacity-55" />
            <input name="q" type="search" placeholder="Search documents and posts" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
          </form>
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'About', href: '/about' }, { label: 'Contact', href: '/contact' }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-semibold">
                {item.label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="rounded-2xl border border-[var(--editable-border)] bg-[#f7f9ff] px-4 py-3 text-sm font-semibold">
                  Create
                </Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-left text-sm font-semibold text-[#e11d2e]">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-[var(--editable-border)] bg-white px-4 py-3 text-sm font-semibold">
                  Sign In
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-2xl border border-[var(--editable-border)] bg-[#fff4f4] px-4 py-3 text-sm font-semibold text-[#e11d2e]">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
