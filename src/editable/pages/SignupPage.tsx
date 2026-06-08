import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-text)] px-4 py-14 text-white sm:px-6 lg:px-8">
        <section className="mx-auto grid min-h-[calc(100vh-16rem)] max-w-[var(--editable-container)] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-/60">{pagesContent.auth.signup.badge}</p>
            <h1 className="mt-5 max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.08em] sm:text-6xl">{pagesContent.auth.signup.title}</h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-/72">{pagesContent.auth.signup.description}</p>
          </div>
          <div className="rounded-[2.2rem] border border-white/10 bg-/8 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur sm:p-8">
            <h2 className="text-3xl font-black tracking-[-0.06em]">{pagesContent.auth.signup.formTitle}</h2>
            <EditableLocalSignupForm />
            <p className="mt-5 text-sm text-white/65">Already have an account? <Link href="/login" className="font-black text-white underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
