import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://kemimed.kemirix.com/sitemap.xml',
    host: 'https://kemimed.kemirix.com',
  }
}
