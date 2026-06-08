import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Editorial resources',
    headline: 'Articles presented with a more premium reading rhythm.',
    description: 'Use this archive for explainers, long-form posts, and resource-led stories with stronger hierarchy and better spacing.',
    filterLabel: 'Filter article topics',
    secondaryNote: 'Reading pages work best when the eye can breathe between headline, summary, and body.',
    chips: ['Reading space', 'Feature stories', 'Topic-led browsing'],
  },
  classified: {
    eyebrow: 'Quick notices',
    headline: 'Time-sensitive posts that remain easy to scan.',
    description: 'Classified content keeps strong action cues, concise summaries, and quick access to the main details.',
    filterLabel: 'Filter notices',
    secondaryNote: 'These posts should feel practical and immediate, with details visible early.',
    chips: ['Fast scan', 'Action ready', 'Compact details'],
  },
  sbm: {
    eyebrow: 'Reference shelf',
    headline: 'Saved links and resources curated like a premium list.',
    description: 'Bookmarks appear as cleaner reference cards, with more room for context and easier side-by-side scanning.',
    filterLabel: 'Filter saved resources',
    secondaryNote: 'Reference surfaces need order, not noise.',
    chips: ['Curated links', 'Reference cards', 'Useful picks'],
  },
  profile: {
    eyebrow: 'Profile index',
    headline: 'Profiles with stronger identity and calmer supporting detail.',
    description: 'People and brand pages should feel trustworthy, visual, and easy to understand at a glance.',
    filterLabel: 'Filter profiles',
    secondaryNote: 'Identity pages benefit from balance between portrait, role, and summary.',
    chips: ['Identity first', 'Visual trust', 'Quick recognition'],
  },
  pdf: {
    eyebrow: 'Document library',
    headline: 'PDFs arranged like a refined public archive.',
    description: 'This section is designed for guides, reports, files, and shared documents that deserve strong browsing cues and easy preview paths.',
    filterLabel: 'Filter document type',
    secondaryNote: 'Document pages work best when file intent and next action are obvious.',
    chips: ['Guides', 'Reports', 'Download-ready'],
  },
  listing: {
    eyebrow: 'Directory browse',
    headline: 'Listings displayed with trust cues and cleaner comparison.',
    description: 'Business and service entries are easier to compare through stronger metadata cards and more readable layouts.',
    filterLabel: 'Filter listing category',
    secondaryNote: 'Directory pages should help people compare quickly before they commit attention.',
    chips: ['Directory', 'Trust cues', 'Compare faster'],
  },
  image: {
    eyebrow: 'Visual collection',
    headline: 'Image-led posts with more atmosphere and better pacing.',
    description: 'Visual posts use larger media treatments, varied card silhouettes, and lighter supporting copy.',
    filterLabel: 'Filter visuals',
    secondaryNote: 'Image-heavy pages should let the visuals do the lead work.',
    chips: ['Image first', 'Gallery pace', 'Visual discovery'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
