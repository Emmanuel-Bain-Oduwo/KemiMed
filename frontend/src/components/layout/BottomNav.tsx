'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type GroupKey = 'learn' | 'create' | 'explore' | 'me'

interface SheetItem { icon: string; label: string; href: string; badge?: string; badgeColor?: string }
interface SheetGroup { title: string; color: string; items: SheetItem[] }

const sheetGroups: Record<GroupKey, SheetGroup> = {
  learn: {
    title: 'Learn & Practice',
    color: '#0B5C8F',
    items: [
      { icon: '🧑‍🏫', label: 'Tutor',       href: '/ai-tutor',    badge: 'LIVE',  badgeColor: '#DC2626' },
      { icon: '📚', label: 'Topics',          href: '/topics' },
      { icon: '🃏', label: 'Flashcards',      href: '/flashcards',  badge: 'SM-2',  badgeColor: '#0CA89E' },
      { icon: '❓', label: 'Quiz',            href: '/quiz' },
      { icon: '🏆', label: 'Board Exams',     href: '/board-exams' },
      { icon: '🔊', label: 'Voice Tutor',     href: '/voice-tutor' },
      { icon: '🏥', label: 'Cases',           href: '/cases' },
      { icon: '🎬', label: 'Video',           href: '/video' },
      { icon: '🎙️', label: 'Podcast',         href: '/podcast' },
    ],
  },
  create: {
    title: 'Create & Generate',
    color: '#7C3AED',
    items: [
      { icon: '📝', label: 'Notes',           href: '/ai-notes' },
      { icon: '✨', label: 'Summary',          href: '/ai-summary' },
      { icon: '🕸️', label: 'Mind Maps',       href: '/mindmap' },
      { icon: '⚡', label: 'Generate Hub',    href: '/generate',    badge: 'NEW',   badgeColor: '#7C3AED' },
      { icon: '🔀', label: 'Flowcharts',      href: '/flowcharts' },
      { icon: '📋', label: 'Reports',         href: '/reports' },
      { icon: '📊', label: 'Graphs',          href: '/graphs' },
    ],
  },
  explore: {
    title: 'Research & Analysis',
    color: '#0CA89E',
    items: [
      { icon: '🔬', label: 'Research Hub',    href: '/research' },
      { icon: '📰', label: 'Articles',        href: '/articles' },
    ],
  },
  me: {
    title: 'My KemiMed',
    color: '#C78B0A',
    items: [
      { icon: '📈', label: 'Progress',        href: '/progress' },
      { icon: '🎯', label: 'Exam Planner',    href: '/exam-planner' },
      { icon: '👥', label: 'Study Rooms',     href: '/collaborate' },
      { icon: '⚙️', label: 'Settings',        href: '/settings' },
    ],
  },
}

const groupHrefs = new Set(
  (Object.values(sheetGroups) as SheetGroup[]).flatMap(g => g.items.map(i => i.href))
)

export default function BottomNav() {
  const pathname = usePathname()
  const [openSheet, setOpenSheet] = useState<GroupKey | null>(null)

  useEffect(() => { setOpenSheet(null) }, [pathname])

  const activeGroup = (Object.entries(sheetGroups) as [GroupKey, SheetGroup][]).find(
    ([, g]) => g.items.some(i => i.href === pathname)
  )?.[0] ?? null

  const tabs = [
    { icon: '🏠', label: 'Home',    href: '/dashboard', group: null as GroupKey | null },
    { icon: '📚', label: 'Learn',   href: null,         group: 'learn'   as GroupKey },
    { icon: '✨', label: 'Create',  href: null,         group: 'create'  as GroupKey },
    { icon: '🔬', label: 'Explore', href: null,         group: 'explore' as GroupKey },
    { icon: '👤', label: 'Me',      href: null,         group: 'me'      as GroupKey },
  ]

  const sheet = openSheet ? sheetGroups[openSheet] : null

  return (
    <>
      {/* Overlay */}
      {openSheet && (
        <div
          onClick={() => setOpenSheet(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(7,21,37,0.55)',
            zIndex: 90,
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
          }}
        />
      )}

      {/* Feature sheet */}
      {sheet && openSheet && (
        <div
          key={openSheet}
          style={{
            position: 'fixed', bottom: 60, left: 0, right: 0,
            background: '#FFFFFF',
            borderRadius: '22px 22px 0 0',
            zIndex: 100,
            boxShadow: '0 -8px 40px rgba(11,92,143,0.18)',
            maxHeight: '72vh', overflowY: 'auto',
            animation: 'km-sheet-up 0.22s cubic-bezier(0.32,0.72,0,1)',
          }}
        >
          {/* Handle */}
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
            <div style={{ width: 40, height: 4, borderRadius: 2, background: '#DDE3ED' }} />
          </div>

          {/* Title */}
          <div style={{ padding: '12px 20px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 5, height: 22, borderRadius: 3, background: sheet.color, flexShrink: 0 }} />
            <span style={{
              fontSize: 17, fontWeight: 800, color: '#0D1B2E',
              fontFamily: 'var(--font-fraunces),serif',
            }}>
              {sheet.title}
            </span>
          </div>

          {/* Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 10,
            padding: '0 14px 20px',
          }}>
            {sheet.items.map(item => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    padding: '16px 6px 12px',
                    borderRadius: 16,
                    textDecoration: 'none',
                    background: isActive ? `${sheet.color}12` : '#F7F9FC',
                    border: `1.5px solid ${isActive ? sheet.color + '50' : 'transparent'}`,
                    position: 'relative', gap: 7,
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {item.badge && (
                    <span style={{
                      position: 'absolute', top: 7, right: 7,
                      fontSize: 8, fontWeight: 700, letterSpacing: '0.3px',
                      background: `${item.badgeColor}22`, color: item.badgeColor,
                      padding: '1px 5px', borderRadius: 4,
                      fontFamily: 'var(--font-ibm-mono),monospace',
                    }}>
                      {item.badge}
                    </span>
                  )}
                  <span style={{ fontSize: 28, lineHeight: 1 }}>{item.icon}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, textAlign: 'center', lineHeight: 1.3,
                    color: isActive ? sheet.color : '#5A6882',
                  }}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom bar */}
      <nav className="km-bottom-nav" aria-label="Main navigation">
        {tabs.map(tab => {
          const isActive = tab.href
            ? pathname === tab.href
            : (tab.group === activeGroup || openSheet === tab.group)

          const baseStyle: React.CSSProperties = {
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 3, flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '6px 4px 4px', borderRadius: 12, textDecoration: 'none',
            WebkitTapHighlightColor: 'transparent',
            transition: 'transform 0.15s ease',
          }

          const content = (
            <>
              <span style={{
                fontSize: 22, lineHeight: 1,
                transform: isActive ? 'scale(1.18)' : 'scale(1)',
                transition: 'transform 0.15s ease',
                display: 'block',
              }}>
                {tab.icon}
              </span>
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#0B5C8F' : '#97A3B6',
                letterSpacing: isActive ? '-0.1px' : '0',
                transition: 'color 0.15s ease',
              }}>
                {tab.label}
              </span>
              {isActive && (
                <span style={{
                  width: 16, height: 2, borderRadius: 1,
                  background: '#0B5C8F', marginTop: 1,
                }} />
              )}
            </>
          )

          if (tab.href) {
            return (
              <Link key={tab.label} href={tab.href} style={baseStyle}>
                {content}
              </Link>
            )
          }

          return (
            <button
              key={tab.label}
              style={baseStyle}
              onClick={() => setOpenSheet(prev => prev === tab.group ? null : tab.group!)}
              aria-label={tab.label}
            >
              {content}
            </button>
          )
        })}
      </nav>
    </>
  )
}
