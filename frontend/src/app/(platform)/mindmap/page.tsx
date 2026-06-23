'use client'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const branches = [
  {
    color: '#0B5C8F', icon: '💊', label: 'Drug Classes',
    items: ['Vitamin K Antagonists (Warfarin)', 'DOACs (Apixaban/Rivaroxaban)', 'Heparins (UFH/LMWH)'],
  },
  {
    color: '#0CA89E', icon: '🎯', label: 'Indications',
    items: ['Atrial Fibrillation', 'DVT / Pulmonary Embolism', 'Mechanical Heart Valves'],
  },
  {
    color: '#DC2626', icon: '⚠️', label: 'Complications',
    items: ['Bleeding', 'HIT (Heparin-Induced)', 'Warfarin skin necrosis'],
  },
  {
    color: '#7C3AED', icon: '🔬', label: 'Monitoring',
    items: ['INR (warfarin, target 2–3)', 'aPTT (UFH)', 'Anti-Xa (LMWH)'],
  },
]

export default function MindmapPage() {
  return (
    <motion.div {...pageAnim} className="km-page" style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', marginBottom:20 }}>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <input placeholder="Enter topic for mind map..." style={{ flex:1, border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 12px', fontSize:13, outline:'none' }} />
          <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Generate</button>
        </div>
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          {['PNG','Make Flashcards'].map(b=>(
            <button key={b} style={{ padding:'6px 14px', border:'1px solid #DDE3ED', borderRadius:7, fontSize:12, cursor:'pointer' }}>{b}</button>
          ))}
        </div>
      </div>

      <div style={{ background:'#FFFFFF', borderRadius:12, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)', padding:32 }}>
        {/* Center node */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:32 }}>
          <div style={{
            background:'linear-gradient(135deg,#0B5C8F,#0CA89E)',
            color:'white', padding:'14px 32px', borderRadius:999,
            fontSize:16, fontWeight:800, fontFamily:'var(--font-fraunces),serif',
          }}>
            Anticoagulation
          </div>
        </div>

        {/* 2×2 grid of branches */}
        <div className="km-grid-2">
          {branches.map(b => (
            <div key={b.label} style={{
              border:`2px solid ${b.color}20`,
              borderRadius:12, padding:16,
              background:`${b.color}06`,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <span style={{ fontSize:20 }}>{b.icon}</span>
                <span style={{ fontSize:14, fontWeight:700, color:b.color }}>{b.label}</span>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {b.items.map(item => (
                  <div key={item} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:b.color, flexShrink:0 }} />
                    <span style={{ fontSize:13, color:'#0D1B2E' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}