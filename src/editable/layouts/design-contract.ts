import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f7f9ff',
  '--slot4-page-text': '#12172b',
  '--slot4-panel-bg': '#ffffff',
  '--slot4-surface-bg': '#ffffff',
  '--slot4-muted-text': '#55607c',
  '--slot4-soft-muted-text': '#78819a',
  '--slot4-accent': '#9fa1ff',
  '--slot4-accent-fill': '#9fa1ff',
  '--slot4-accent-soft': '#b5baff',
  '--slot4-sky-soft': '#aee2ff',
  '--slot4-mint-soft': '#d9f9df',
  '--slot4-dark-bg': '#10131f',
  '--slot4-dark-text': '#f8fbff',
  '--slot4-media-bg': '#e8ecff',
  '--slot4-cream': '#f9fbff',
  '--slot4-warm': '#f3f6ff',
  '--slot4-lavender': '#eef0ff',
  '--slot4-gray': '#eef3fb',
  '--slot4-blue-band': '#165da8',
  '--slot4-body-gradient': 'radial-gradient(circle at top, rgba(181,186,255,0.28), transparent 34%), linear-gradient(180deg, #fbfcff 0%, #f4f7ff 52%, #eef3fb 100%)',
  '--editable-page-bg': '#f7f9ff',
  '--editable-page-text': '#12172b',
  '--editable-border': 'rgba(18, 23, 43, 0.1)',
  '--editable-container': '1440px',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  skyBg: 'bg-[var(--slot4-sky-soft)]',
  mintBg: 'bg-[var(--slot4-mint-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  blueBandBg: 'bg-[var(--slot4-blue-band)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/12',
  shadow: 'shadow-[0_24px_70px_rgba(27,39,94,0.08)]',
  shadowStrong: 'shadow-[0_32px_90px_rgba(27,39,94,0.14)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(12,17,34,0.02),rgba(12,17,34,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-14 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[180px] shrink-0 snap-start sm:w-[220px]',
  },
  type: {
    eyebrow: 'text-[11px] font-black uppercase tracking-[0.28em]',
    heroTitle: 'text-4xl font-black leading-[0.95] tracking-[-0.07em] sm:text-5xl lg:text-7xl',
    sectionTitle: 'text-3xl font-black leading-[1] tracking-[-0.06em] sm:text-4xl lg:text-5xl',
    body: 'text-base leading-8',
  },
  surface: {
    card: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg} ${editablePalette.shadow}`,
    soft: `rounded-[2rem] border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `rounded-[2rem] ${editablePalette.darkBg} ${editablePalette.darkText} ${editablePalette.shadowStrong}`,
  },
  button: {
    primary: 'inline-flex items-center justify-center rounded-sm bg-[#ff2b2b] px-8 py-3.5 text-sm font-black uppercase tracking-[0.06em] text-white transition hover:-translate-y-0.5 hover:shadow-lg',
    secondary: `inline-flex items-center justify-center rounded-sm border ${editablePalette.border} ${editablePalette.surfaceBg} px-8 py-3.5 text-sm font-black text-[var(--slot4-page-text)] transition hover:bg-black/[0.03]`,
    accent: 'inline-flex items-center justify-center rounded-full bg-[var(--slot4-page-text)] px-7 py-3 text-sm font-black text-white transition hover:-translate-y-0.5',
  },
  media: {
    frame: `relative overflow-hidden rounded-[1.5rem] ${editablePalette.mediaBg}`,
    ratio: 'aspect-[16/11]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(27,39,94,0.16)]',
    fade: 'transition duration-300 hover:opacity-85',
  },
} as const

export const aiLayoutRules = [
  'Keep all editable visual work inside src/editable/**.',
  'Preserve route exports and existing data props while changing the presentation completely.',
  'Prefer multiple card silhouettes across archives and home sections.',
  'Keep fallbacks for missing summaries, categories, images, and files.',
  'Make the pdf surface feel like a polished document library first.',
] as const
