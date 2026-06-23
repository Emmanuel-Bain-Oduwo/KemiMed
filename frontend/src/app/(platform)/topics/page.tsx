'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import ProgressBar from '@/components/shared/ProgressBar'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const allTopics = [
  { icon:'💊', name:'Drug Interactions',  cat:'Pharmacy', badge:'⚠️ Weak',  badgeColor:'#DC2626', progress:42, progressColor:'#DC2626', due:14 },
  { icon:'🧬', name:'Pharmacokinetics',   cat:'Pharmacy', badge:'Strong',   badgeColor:'#16A34A', progress:88, progressColor:'#16A34A', due:2  },
  { icon:'🔬', name:'Pharmacogenomics',   cat:'Pharmacy', badge:'Growing',  badgeColor:'#C78B0A', progress:55, progressColor:'#C78B0A', due:8  },
  { icon:'🫀', name:'Cardiovascular',     cat:'Medicine', badge:'Good',     badgeColor:'#0CA89E', progress:70, progressColor:'#0CA89E', due:4  },
  { icon:'🦠', name:'Antimicrobials',     cat:'Medicine', badge:'Good',     badgeColor:'#0CA89E', progress:61, progressColor:'#0CA89E', due:6  },
  { icon:'🔩', name:'Pharmacodynamics',   cat:'Pharmacy', badge:'Growing',  badgeColor:'#C78B0A', progress:50, progressColor:'#C78B0A', due:10 },
]

const tabs = ['All', '💊 Pharmacy', '🩺 Medicine', '🧬 Health Sciences']

export default function TopicsPage() {
  const [tab, setTab] = useState(0)

  const filtered = tab === 0 ? allTopics
    : tab === 1 ? allTopics.filter(t=>t.cat==='Pharmacy')
    : tab === 2 ? allTopics.filter(t=>t.cat==='Medicine')
    : allTopics

  return (
    <motion.div {...pageAnim} className="km-page" style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ display:'flex', gap:4, background:'#FFFFFF', borderRadius:10, padding:4, border:'1px solid #DDE3ED', marginBottom:20, width:'fit-content' }}>
        {tabs.map((t,i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding:'7px 16px', borderRadius:7, border:'none', cursor:'pointer', fontSize:12, fontWeight:600,
            background: tab===i ? '#0B5C8F' : 'transparent', color: tab===i ? 'white' : '#5A6882',
          }}>{t}</button>
        ))}
      </div>

      <div className="km-grid-3">
        {filtered.map(t => (
          <motion.div key={t.name} whileHover={{ y:-2 }} transition={{ duration:0.15 }}>
            <div style={{ background:'#FFFFFF', borderRadius:12, padding:18, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)', cursor:'pointer' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <span style={{ fontSize:28 }}>{t.icon}</span>
                <span style={{ fontSize:11, fontWeight:700, color:t.badgeColor, background:`${t.badgeColor}15`, padding:'3px 9px', borderRadius:999 }}>{t.badge}</span>
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:'#0D1B2E', marginBottom:8 }}>{t.name}</div>
              <ProgressBar value={t.progress} color={t.progressColor} />
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:12 }}>
                <span style={{ color:'#5A6882' }}>{t.progress}% mastery</span>
                <span style={{ color:t.progressColor, fontWeight:600 }}>{t.due} due</span>
              </div>
            </div>
          </motion.div>
        ))}
        <div style={{ border:'2px dashed #DDE3ED', borderRadius:12, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, cursor:'pointer', gap:6 }}>
          <span style={{ fontSize:28 }}>➕</span>
          <span style={{ fontSize:13, fontWeight:600, color:'#5A6882' }}>Add topic</span>
        </div>
      </div>
    </motion.div>
  )
}