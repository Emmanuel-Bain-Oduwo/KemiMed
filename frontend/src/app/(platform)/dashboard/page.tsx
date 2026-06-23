'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import StatCard from '@/components/shared/StatCard'
import StudyHeatmap from '@/components/dashboard/StudyHeatmap'
import MasteryRadar from '@/components/dashboard/MasteryRadar'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const card = {
  background: '#FFFFFF',
  borderRadius: 12,
  boxShadow: '0 2px 12px rgba(11,92,143,0.08)',
  border: '1px solid #DDE3ED',
  padding: 20,
}

const dueItems = [
  { icon: '💊', title: 'Drug Interactions — Anaesthetics', sub: '14 cards due · SM-2 review', btn: 'Start', color: '#0CA89E', href: '/flashcards/study' },
  { icon: '🧬', title: 'Pharmacogenomics CYP450', sub: '8 cards · KemiMed Tutor session', btn: 'Tutor', color: '#0B5C8F', href: '/ai-tutor' },
  { icon: '❓', title: 'Clinical Pharmacology Quiz', sub: '20 MCQs · 25 min', btn: 'Quiz', color: '#7C3AED', href: '/quiz' },
]

const quickItems = [
  { icon: '📄', label: 'PDF Notes',  href: '/generate' },
  { icon: '📊', label: 'Make PPT',   href: '/generate' },
  { icon: '🕸️', label: 'Mind Map',   href: '/mindmap' },
  { icon: '🔬', label: 'Research',   href: '/research' },
  { icon: '🎙️', label: 'Podcast',    href: '/podcast' },
  { icon: '🏆', label: 'Board Prep', href: '/board-exams' },
  { icon: '📈', label: 'Charts',     href: '/graphs' },
  { icon: '🔀', label: 'Flowchart',  href: '/flowcharts' },
  { icon: '🎬', label: 'Video',      href: '/video' },
]

export default function DashboardPage() {
  return (
    <motion.div {...pageAnim} style={{ padding: '28px 32px', maxWidth: 1200, margin: '0 auto' }}>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 20 }}>
        <StatCard value="847"  label="Cards mastered"   trend="↑ 42 this week"      trendUp />
        <StatCard value="23"   label="Day streak 🔥"     trend="Personal best!"       trendUp />
        <StatCard value="74%"  label="Overall mastery"  trend="↑ 8% this month"     trendUp />
        <StatCard value="18h"  label="Study time, June" trend="↓ 2h below goal"     trendUp={false} />
      </div>

      {/* Heatmap + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
        <StudyHeatmap />
        <MasteryRadar />
      </div>

      {/* Due Today + Quick Launch */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Due Today */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2E', marginBottom: 14 }}>
            Due Today
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dueItems.map((item) => (
              <div key={item.href + item.title} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: '#EEF2F7', borderRadius: 8, padding: '10px 12px',
              }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0D1B2E' }}>{item.title}</div>
                  <div style={{ fontSize: 11, color: '#5A6882', marginTop: 2 }}>{item.sub}</div>
                </div>
                <Link href={item.href} style={{
                  background: item.color, color: 'white',
                  padding: '5px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                  textDecoration: 'none', flexShrink: 0, whiteSpace: 'nowrap',
                }}>
                  {item.btn}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch */}
        <div style={card}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2E', marginBottom: 14 }}>
            ⚡ Quick Launch
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {quickItems.map((item) => (
              <motion.div key={item.href + item.label} whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                <Link href={item.href} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', padding: '14px 8px', borderRadius: 10,
                  background: '#F7F9FC', border: '1px solid #DDE3ED',
                  textDecoration: 'none', gap: 6, cursor: 'pointer',
                }}>
                  <span style={{ fontSize: 24 }}>{item.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0D1B2E', textAlign: 'center', lineHeight: 1.3 }}>
                    {item.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}