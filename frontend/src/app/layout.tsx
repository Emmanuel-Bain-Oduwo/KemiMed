import type { Metadata } from 'next'
import { Inter, IBM_Plex_Mono, Fraunces } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-mono',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://kemimed.kemirix.com'),
  title: {
    default: 'KemiMed™ — Health Platform by Kemirix',
    template: '%s | KemiMed™',
  },
  description: 'KemiMed by Kemirix — the intelligent health sciences learning platform for university students. AI tutoring, flashcards, quizzes, board exam prep and more.',
  keywords: ['medical education', 'health sciences', 'AI tutor', 'flashcards', 'board exams', 'medical students', 'KemiMed', 'Kemirix'],
  authors: [{ name: 'Kemirix', url: 'https://www.kemirix.com' }],
  creator: 'Kemirix',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kemimed.kemirix.com',
    siteName: 'KemiMed™',
    title: 'KemiMed™ — Health Platform by Kemirix',
    description: 'The intelligent health sciences learning platform for university students. AI tutoring, flashcards, quizzes, board exam prep and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KemiMed™ — Health Platform by Kemirix',
    description: 'The intelligent health sciences learning platform for university students.',
    creator: '@kemirix',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://kemimed.kemirix.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmMono.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}