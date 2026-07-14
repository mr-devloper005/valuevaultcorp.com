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
    heading: 'Useful resources, organized for everyday value.',
    description: 'Explore practical documents, trusted references, and helpful public resources in one clear, easy-to-browse library.',
    cta: { label: 'Browse resources', href: '/pdf' },
    columns: [
      {
        title: 'Resources',
        links: [
          { label: 'Document Library', href: '/pdf' },
          { label: 'Articles', href: '/article' },
          { label: 'Profiles', href: '/profile' },
        ],
      },
      {
        title: 'Information',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Search', href: '/search' },
        ],
      },
    ],
    bottomNote: 'All rights reserved.',
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
