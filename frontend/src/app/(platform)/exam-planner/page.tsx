'use client'
import { motion } from 'framer-motion'
import ProgressBar from '@/components/shared/ProgressBar'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const schedule = [
  { day:'TODAY', border:'#DC2626', dayColor:'#DC2626', task:'CYP450 Drug Metabolism — 2h KemiMed Tutor + 20 MCQs' },
  { day:'TUE 24 Jun', border:'#DDE3ED', dayColor:'#5A6882', task:'DDI Anaesthetics — 18 cards + 1 clinical case' },
  { day:'WED 25 Jun', border:'#DDE3ED', dayColor:'#5A6882', task:'Pharmacogenomics — KemiMed Tutor session + mind map' },
  { day:'THU 26 Jun', border:'#DDE3ED', dayColor:'#5A6882', task:'Past papers — 30 MCQ timed mock' },
]

const readiness = [
  { label:'Pharmacokinetics', val:88, color:'#16A34A' },
  { label:'DDI', val:62, color:'#C78B0A' },
  { label:'⚠️ CYP Metabolism', val:38, color:'#DC2626' },
  { label:'Pharmacogenomics', val:55, color:'#C78B0A' },
]

export default function ExamPlannerPage() {
  return (
    <motion.div {...pageAnim} className="km-page" style={{ maxWidth:1000, margin:'0 auto' }}>

      {/* Active exam */}
      <div style={{
        background:'linear-gradient(135deg,rgba(11,92,143,0.06),rgba(12,168,158,0.06))',
        border:'2px solid #0CA89E', borderRadius:12, padding:'18px 24px',
        display:'flex', alignItems:'center', gap:16, marginBottom:24,
      }}>
        <span style={{ fontSize:28 }}>🎯</span>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:700, color:'#0D1B2E' }}>Clinical Pharmacology — End of Year</div>
          <div style={{ fontSize:12, color:'#5A6882', marginTop:2 }}>Parul University · 15 July 2026</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:22, fontWeight:800, color:'#DC2626', fontFamily:'var(--font-fraunces),serif' }}>23</div>
          <div style={{ fontSize:11, color:'#5A6882' }}>days</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:22, fontWeight:800, color:'#C78B0A', fontFamily:'var(--font-fraunces),serif' }}>74%</div>
          <div style={{ fontSize:11, color:'#5A6882' }}>ready</div>
        </div>
        <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'8px 18px', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:13 }}>View plan</button>
      </div>

      <div className="km-grid-2">
        {/* Study plan */}
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>KemiMed Study Plan</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {schedule.map((s,i) => (
              <div key={i} style={{ borderLeft:`3px solid ${s.border}`, paddingLeft:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:s.dayColor, marginBottom:2 }}>{s.day}</div>
                <div style={{ fontSize:13, color:'#0D1B2E', lineHeight:1.5 }}>{s.task}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic readiness */}
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Topic Readiness</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {readiness.map(r => (
              <div key={r.label}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                  <span style={{ fontWeight:500, color:'#0D1B2E' }}>{r.label}</span>
                  <span style={{ fontWeight:700, color:r.color }}>{r.val}%</span>
                </div>
                <ProgressBar value={r.val} color={r.color} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}