import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Premium PDFs, resources, and public knowledge pages',
      description: 'Browse PDFs, reference pages, profiles, and supporting posts through a polished premium discovery experience.',
      openGraphTitle: 'Premium PDFs, resources, and public knowledge pages',
      openGraphDescription: 'A refined interface for discovering documents, references, and supporting public content.',
      keywords: ['pdf library', 'document archive', 'resource discovery', 'public files'],
    },
    hero: {
      badge: '',
      title: ['Your library of useful files,', 'arranged with clarity and intent.'],
      description: 'Browse PDFs, supporting resources, and public pages through a cleaner editorial system built for quick scanning and confident reading.',
      primaryCta: { label: 'Open PDF library', href: '/pdf' },
      secondaryCta: { label: 'Search the archive', href: '/search' },
      searchPlaceholder: 'Search documents, topics, categories, and titles',
      focusLabel: 'Focus',
      featureCardBadge: 'featured resource',
      featureCardTitle: 'A polished archive for documents that deserve better presentation.',
      featureCardDescription: 'The homepage now leads with elegant browsing, clear sections, and visible document pathways.',
    },
    intro: {
      badge: 'Why it works',
      title: 'A calmer way to explore files, references, and public knowledge.',
      paragraphs: [
        'The experience is built for clean scanning first, with strong hierarchy for featured documents and supporting pages.',
        'Instead of treating every post the same, the layout gives documents, profiles, image-led posts, and references their own visual rhythm.',
        'That means visitors can move quickly from homepage discovery to archive browsing to detail reading without friction.',
      ],
      sideBadge: 'Highlights',
      sidePoints: [
        'Search-first browsing for public files and related posts.',
        'Multiple card styles for featured, compact, list, and image-led content.',
        'Document-forward layouts that keep downloads and previews easy to reach.',
        'Responsive premium UI with lighter motion and stronger spacing discipline.',
      ],
      primaryLink: { label: 'Browse PDFs', href: '/pdf' },
      secondaryLink: { label: 'See profiles', href: '/profile' },
    },
    cta: {
      badge: 'Ready to explore',
      title: 'Open a cleaner archive experience for documents and supporting content.',
      description: 'Move from featured files to filtered archives, profiles, bookmarks, and long-form pages through one consistent visual system.',
      primaryCta: { label: 'Open the library', href: '/pdf' },
      secondaryCta: { label: 'Contact', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'About',
    title: 'A better public-facing surface for useful content.',
    description: `${slot4BrandConfig.siteName} presents documents, resources, profiles, and related pages through a more refined browsing experience.`,
    paragraphs: [
      'The platform is designed to make file discovery feel intentional instead of cluttered, with stronger visual hierarchy and calmer reading spaces.',
      'From homepage highlights to archive filters and detail pages, each part of the interface is shaped to help visitors move faster with more confidence.',
    ],
    values: [
      {
        title: 'Clear hierarchy',
        description: 'Featured files, supporting pages, and smaller content blocks each get an appropriate visual weight.',
      },
      {
        title: 'Document-first utility',
        description: 'PDFs and resource pages are easy to preview, scan, and revisit without losing context.',
      },
      {
        title: 'Premium simplicity',
        description: 'The layout stays polished and expressive without becoming heavy or difficult to use.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Reach the team behind the archive experience.',
    description: 'Share a question, a publishing request, or a support note and we will route it to the right place.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search documents, topics, categories, and content across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find documents, profiles, visuals, and reference pages faster.',
      description: 'Search across all active sections with a cleaner result layout and stronger content cues.',
      placeholder: 'Search by title, category, keyword, or topic',
    },
    resultsTitle: 'Results across the archive',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Sign in to enter the publishing workspace.',
      description: 'Use your account to create a draft, prepare a public page, and organize its supporting details.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Prepare new content for every active section.',
      description: 'Draft a title, summary, file link, image, and supporting body content through one calmer interface.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Sign in to continue managing and exploring.',
      description: 'Access your publishing workspace, saved details, and creation tools through the member sign-in flow.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then sign in.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'New account',
      title: 'Create an account for publishing and archive access.',
      description: 'Set up your account to draft new content, save access details, and move through the workspace faster.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Sign in',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
