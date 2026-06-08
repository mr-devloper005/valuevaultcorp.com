import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Curated document library',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: '',
    primaryLinks: [
      { label: 'Documents', href: '/pdf' },
      { label: 'Resources', href: '/article' },
      { label: 'Profiles', href: '/profile' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Open library', href: '/pdf' },
      secondary: { label: 'Get in touch', href: '/contact' },
    },
  },
  footer: {
    tagline: 'Documents, references, and polished discovery.',
    description: 'A clean place to browse PDFs, supporting resources, and related public content with a calmer premium interface.',
    columns: [
      {
        title: 'Explore',
        links: [
          { label: 'PDF Library', href: '/pdf' },
          { label: 'Articles', href: '/article' },
          { label: 'Profiles', href: '/profile' },
          { label: 'Bookmarks', href: '/sbm' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'Built for refined browsing and dependable document discovery.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
