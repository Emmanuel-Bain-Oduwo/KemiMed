'use client'
import { motion } from 'framer-motion'
import { FlipCard } from '@/components/flashcards/FlipCard'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

export default function FlashcardsStudyPage() {
  return (
    <motion.div {...pageAnim} style={{ padding:'28px 32px', maxWidth:600, margin:'0 auto' }}>
      <div style={{ textAlign:'center', marginBottom:20 }}>
        <span style={{ background:'rgba(11,92,143,0.1)', color:'#0B5C8F', padding:'4px 14px', borderRadius:999, fontSize:12, fontWeight:600 }}>
          DDI Anaesthetics · Card 3 of 18
        </span>
      </div>
      <FlipCard
        front="A patient on warfarin 5mg/day is started on fluconazole. What is the PRIMARY pharmacokinetic interaction and what INR change do you expect?"
        back={`Fluconazole inhibits CYP2C9, the primary enzyme metabolising warfarin's S-enantiomer.

Result: ↓ warfarin clearance → ↑ plasma levels → ↑ INR (can rise from 2.4 to >6.0).

💎 Pearl: Monitor INR within 3–5 days of any azole addition. Reduce warfarin dose by 25–50%.`}
      />
      <div style={{ display:'flex', gap:8, marginTop:16 }}>
        {[
          { label:'✗ Again', color:'#DC2626', bg:'rgba(220,38,38,0.08)', border:'#DC2626' },
          { label:'~ Hard',  color:'#C78B0A', bg:'rgba(199,139,10,0.08)', border:'#C78B0A' },
          { label:'✓ Good',  color:'#FFFFFF', bg:'#0CA89E', border:'#0CA89E' },
          { label:'★ Easy',  color:'#16A34A', bg:'rgba(22,163,74,0.08)', border:'#16A34A' },
        ].map(b => (
          <button key={b.label} style={{ flex:1, padding:'11px 0', borderRadius:8, fontSize:14, fontWeight:700, border:`1.5px solid ${b.border}`, background:b.bg, color:b.color, cursor:'pointer' }}>{b.label}</button>
        ))}
      </div>
      <div style={{ textAlign:'center', fontSize:11, color:'#97A3B6', marginTop:10 }}>
        Again→1min · Hard→6min · Good→tomorrow · Easy→4 days
      </div>
    </motion.div>
  )
}