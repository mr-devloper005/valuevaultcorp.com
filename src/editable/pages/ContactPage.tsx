'use client'

import { Bookmark, FileText, Mail, Phone, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function ContactPage() {
  const lanes = [
    { icon: FileText, title: 'Document questions', body: 'Ask about file pages, archive organization, or supporting content details.' },
    { icon: Bookmark, title: 'Resource suggestions', body: 'Share useful additions, corrections, or category ideas for the public archive.' },
    { icon: Sparkles, title: 'Publishing support', body: 'Reach out if you need help preparing a cleaner page, summary, or public-facing document entry.' },
    { icon: Phone, title: 'General assistance', body: 'Use the contact form for support notes, workflow issues, or browsing questions.' },
  ]

  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#2b67b5]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.08em] sm:text-6xl">{pagesContent.contact.title}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.contact.description}</p>
            <div className="mt-8 grid gap-4">
              {lanes.map((lane) => (
                <div key={lane.title} className="rounded-[1.8rem] border border-[var(--editable-border)] bg-white p-5 shadow-sm">
                  <lane.icon className="h-5 w-5 text-[#2b67b5]" />
                  <h2 className="mt-3 text-xl font-black">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--slot4-soft-muted-text)]">{lane.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[1.8rem] bg-[#ffd400] p-5">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.24em] text-black/65">
                <Mail className="h-4 w-4" />
                Response flow
              </div>
              <p className="mt-3 text-lg font-black leading-8 text-black">Messages are routed through the existing contact workflow, while the interface now gives the page a clearer premium feel.</p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[var(--editable-border)] bg-white p-7 shadow-[0_24px_80px_rgba(17,34,84,0.08)]">
            <h2 className="text-2xl font-black tracking-[-0.04em]">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
