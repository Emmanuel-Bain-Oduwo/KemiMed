'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

type NavBadge = { label: string; variant: 'teal' | 'purple' | 'gold' | 'red' } | { dot: true }

interface NavItem {
  icon: string
  label: string
  href: string
  badge?: NavBadge
}

interface NavGroup {
  category: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    category: 'CORE',
    items: [
      { icon: '🏠', label: 'Dashboard',     href: '/dashboard' },
      { icon: '🧑‍🏫', label: 'KemiMed Tutor',  href: '/ai-tutor',    badge: { label: 'LIVE', variant: 'red' } },
      { icon: '📚', label: 'Topic Library',  href: '/topics' },
    ],
  },
  {
    category: 'CREATE & GENERATE',
    items: [
      { icon: '🃏', label: 'KemiMed Flashcards', href: '/flashcards',  badge: { label: 'SM-2', variant: 'teal' } },
      { icon: '📝', label: 'KemiMed Notes',      href: '/ai-notes' },
      { icon: '✨', label: 'KemiMed Summary',    href: '/ai-summary' },
      { icon: '🕸️', label: 'Mind Maps',      href: '/mindmap' },
      { icon: '⚡', label: 'Generate Hub',   href: '/generate',    badge: { label: 'NEW', variant: 'purple' } },
    ],
  },
  {
    category: 'LEARN & PRACTICE',
    items: [
      { icon: '❓', label: 'Quiz & Tests',   href: '/quiz' },
      { icon: '🏆', label: 'Board Exams',    href: '/board-exams', badge: { label: '🌍', variant: 'gold' } },
      { icon: '🎬', label: 'Video Lessons',  href: '/video' },
      { icon: '🎙️', label: 'Podcast Studio', href: '/podcast' },
      { icon: '🔊', label: 'Voice Tutor',    href: '/voice-tutor' },
      { icon: '🏥', label: 'Clinical Cases', href: '/cases' },
    ],
  },
  {
    category: 'RESEARCH & ANALYSIS',
    items: [
      { icon: '🔬', label: 'Research Hub',   href: '/research' },
      { icon: '📰', label: 'Articles & Blogs',href: '/articles' },
      { icon: '📊', label: 'Graphs & Charts', href: '/graphs' },
      { icon: '🔀', label: 'Flow Diagrams',  href: '/flowcharts' },
      { icon: '📋', label: 'Reports',         href: '/reports' },
    ],
  },
  {
    category: 'PLAN & TRACK',
    items: [
      { icon: '🎯', label: 'Exam Planner',   href: '/exam-planner' },
      { icon: '📈', label: 'Progress',        href: '/progress',    badge: { dot: true } },
      { icon: '👥', label: 'Study Rooms',    href: '/collaborate' },
      { icon: '⚙️', label: 'Settings',        href: '/settings' },
    ],
  },
]

const badgeStyles: Record<string, React.CSSProperties> = {
  teal:   { background: 'rgba(12,168,158,0.25)',  color: '#0CA89E' },
  purple: { background: 'rgba(124,58,237,0.25)',  color: '#a78bfa' },
  gold:   { background: 'rgba(199,139,10,0.25)',  color: '#fbbf24' },
  red:    { background: 'rgba(220,38,38,0.3)',    color: '#fca5a5' },
}

function NavBadgeEl({ badge }: { badge: NavBadge }) {
  if ('dot' in badge) {
    return (
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />
    )
  }
  return (
    <span style={{
      ...badgeStyles[badge.variant],
      fontFamily: 'var(--font-ibm-mono), monospace',
      fontSize: 9,
      fontWeight: 700,
      padding: '2px 7px',
      borderRadius: 999,
      letterSpacing: '0.5px',
      flexShrink: 0,
    }}>
      {badge.label}
    </span>
  )
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: 248,
      minWidth: 248,
      height: '100vh',
      background: '#071525',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 18px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 34, height: 34,
            background: 'linear-gradient(135deg,#0B5C8F,#0CA89E)',
            borderRadius: 9,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>🏥</div>
          <div>
            <div style={{ fontFamily: 'var(--font-fraunces),serif', fontSize: 20, fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
              KemiMed<span style={{ color: '#0CA89E' }}>™</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-ibm-mono),monospace',
              fontSize: 9, letterSpacing: '1.2px', color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase', marginTop: 2,
            }}>
              KEMIRIX HEALTH PLATFORM · v2.0
            </div>
          </div>
        </div>
        {/* Search */}
        <Link href="/search" style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(255,255,255,0.06)', borderRadius: 8,
          padding: '7px 10px', textDecoration: 'none',
        }}>
          <span style={{ fontSize: 12 }}>🔍</span>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Search everything...</span>
        </Link>
      </div>

      {/* Nav groups */}
      <div style={{ flex: 1, padding: '4px 0' }}>
        {navGroups.map((group) => (
          <div key={group.category}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '1.2px',
              color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase',
              padding: '14px 18px 4px',
            }}>
              {group.category}
            </div>
            {group.items.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: '9px 14px', margin: '1px 8px',
                    borderRadius: 9, textDecoration: 'none',
                    ...(isActive ? {
                      background: 'linear-gradient(to right, rgba(12,168,158,0.22), transparent)',
                      borderLeft: '2.5px solid #0CA89E',
                    } : {}),
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.07)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                    }
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0, ...(isActive ? { filter: 'none' } : {}) }}>
                    {item.icon}
                  </span>
                  <span style={{
                    fontSize: 13, fontWeight: 500, flex: 1,
                    color: isActive ? 'white' : 'rgba(255,255,255,0.45)',
                  }}>
                    {item.label}
                  </span>
                  {item.badge && <NavBadgeEl badge={item.badge} />}
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div style={{
        padding: '14px 18px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', gap: 10,
        marginTop: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#0B5C8F,#0CA89E)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: 13, fontWeight: 700,
          }}>E</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Emmanuel Bain</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>B.Pharm · Year 3</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: 8 }}>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.15)', letterSpacing: '0.5px', marginBottom: 3, fontFamily: 'var(--font-ibm-mono),monospace', textTransform: 'uppercase' }}>Kemirix · KemiMed™</div>
          <a href="mailto:Kemi.med@kemirix.com" style={{ fontSize: 10, color: 'rgba(12,168,158,0.6)', textDecoration: 'none', fontFamily: 'var(--font-ibm-mono),monospace' }}>
            Kemi.med@kemirix.com
          </a>
        </div>
      </div>
    </aside>
  )
}