'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const titles: Record<string, { title: string; sub: string }> = {
  '/dashboard':       { title: 'Good morning, Emmanuel 👋',          sub: 'Monday, 23 June 2026 · 14 cards due today' },
  '/ai-tutor':        { title: 'KemiMed Tutor — Dr. KemiMed',        sub: 'Deep evaluation mode · Teaches & examines like a real lecturer' },
  '/flashcards':      { title: '🃏 KemiMed Flashcards',              sub: 'SM-2 spaced repetition · 14 cards due' },
  '/flashcards/study':{ title: '🃏 Flashcard Study',                 sub: 'SM-2 spaced repetition session' },
  '/quiz':            { title: '❓ Quiz & Tests',                    sub: 'KemiMed-generated MCQ, SAQ, OSCE' },
  '/board-exams':     { title: '🏆 Board Exam Preparation',          sub: 'USMLE · PLAB · Kenya · Nigeria · India · Canada · Australia · Germany' },
  '/generate':        { title: '⚡ Generate Hub',                    sub: 'Turn any topic into PDF, PPT, Video, Podcast, Mind Map, Report' },
  '/graphs':          { title: '📊 Graphs & Charts',                 sub: 'KemiMed-generated charts + image analysis' },
  '/flowcharts':      { title: '🔀 Flow Diagrams',                   sub: 'Clinical pathways · Drug mechanisms · Diagnostic algorithms' },
  '/mindmap':         { title: '🕸️ Mind Maps',                       sub: 'KemiMed-generated visual concept maps' },
  '/research':        { title: '🔬 Research Hub',                    sub: 'PubMed · WHO · Cochrane · FDA · PharmGKB' },
  '/articles':        { title: '📰 Articles & Blogs',                sub: 'Read, write, and publish health science content' },
  '/reports':         { title: '📋 Reports',                         sub: 'Case reports · Literature reviews · Essays · Newsletters' },
  '/video':           { title: '🎬 Video Lessons',                   sub: 'KemiMed-narrated video lectures' },
  '/podcast':         { title: '🎙️ Podcast Studio',                  sub: 'Generate audio lectures on any topic' },
  '/voice-tutor':     { title: '🔊 Voice Tutor',                     sub: 'Speak & learn — English · Swahili · French' },
  '/cases':           { title: '🏥 Clinical Cases',                  sub: 'OSCE-style KemiMed case presentations' },
  '/topics':          { title: '📚 Topic Library',                   sub: 'All health science topics with mastery tracking' },
  '/ai-notes':        { title: '📝 KemiMed Notes',                   sub: 'Rich editor with inline KemiMed commands' },
  '/ai-summary':      { title: '✨ KemiMed Summary',                 sub: 'Upload anything — get a structured summary' },
  '/exam-planner':    { title: '🎯 Exam Planner',                    sub: 'KemiMed-generated day-by-day revision plan' },
  '/progress':        { title: '📈 Progress & Analytics',            sub: 'Mastery tracking · Streaks · Reminders' },
  '/collaborate':     { title: '👥 Study Rooms',                     sub: 'Study with classmates in real time' },
  '/settings':        { title: '⚙️ Settings',                        sub: 'Profile · KemiMed preferences · Notifications' },
}

export default function Topbar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const pathname = usePathname()
  const info = titles[pathname] ?? { title: 'KemiMed™', sub: 'Kemirix Health Platform' }

  return (
    <header style={{
      height: 56,
      background: '#FFFFFF',
      borderBottom: '1px solid #DDE3ED',
      boxShadow: '0 1px 4px rgba(11,92,143,0.05)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px 0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      flexShrink: 0,
      gap: 8,
    }}>
      {/* Hamburger — desktop only (hidden on mobile via CSS) */}
      <button
        className="km-hamburger"
        onClick={onMenuToggle}
        aria-label="Toggle menu"
        style={{ flexShrink: 0 }}
      >
        ☰
      </button>

      {/* Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 700, color: '#0D1B2E',
          lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {info.title}
        </div>
        {/* Subtitle hidden on mobile via CSS class */}
        <div
          className="km-topbar-sub"
          style={{
            fontSize: 11, color: '#5A6882', marginTop: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          {info.sub}
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        {/* Search — mobile-only icon (desktop has sidebar search) */}
        <Link
          href="/search"
          className="km-mob-search"
          aria-label="Search"
          style={{
            display: 'none', // shown via CSS on mobile
            width: 34, height: 34, borderRadius: 10,
            background: '#F7F9FC', border: '1px solid #DDE3ED',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 16, textDecoration: 'none',
          }}
        >
          🔍
        </Link>

        {/* User avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg,#0B5C8F,#0CA89E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
        }}>E</div>
      </div>
    </header>
  )
}
