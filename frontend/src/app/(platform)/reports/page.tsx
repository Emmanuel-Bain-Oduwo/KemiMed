'use client'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const types = [
  { icon:'📋', label:'Case Report',       sub:'Academic clinical case document' },
  { icon:'🔬', label:'Literature Review', sub:'KemiMed-assisted systematic review' },
  { icon:'📊', label:'Data Analysis',     sub:'Upload data → charts + insights' },
  { icon:'📑', label:'Essay/Assignment',  sub:'Academic writing with references' },
  { icon:'📰', label:'Newsletter',        sub:'Curated health science digest' },
  { icon:'✍️', label:'Blog Post',         sub:'Publish & share' },
]

const recent = [
  { icon:'📋', title:'Case Report: Warfarin-Fluconazole Interaction', meta:'Draft · 1,200 words', actions:['Edit','Export PDF'] },
  { icon:'✍️', title:'Blog: Why East Africa needs a clinical KemiMed platform', meta:'Published · 124 views', actions:['Edit','View'] },
]

export default function ReportsPage() {
  return (
    <motion.div {...pageAnim} className="km-page" style={{ maxWidth:900, margin:'0 auto' }}>
      <div className="km-grid-3" style={{ marginBottom:24 }}>
        {types.map(t => (
          <motion.div key={t.label} whileHover={{ y:-2 }} transition={{ duration:0.15 }}>
            <div style={{
              background:'#FFFFFF', border:'1.5px solid #DDE3ED', borderRadius:12,
              padding:20, cursor:'pointer', transition:'border-color 0.15s',
            }}
              onMouseEnter={e=>(e.currentTarget.style.borderColor='#0B5C8F')}
              onMouseLeave={e=>(e.currentTarget.style.borderColor='#DDE3ED')}
            >
              <div style={{ fontSize:28, marginBottom:10 }}>{t.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#0D1B2E', marginBottom:4 }}>{t.label}</div>
              <div style={{ fontSize:12, color:'#5A6882' }}>{t.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Recent Reports</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {recent.map(r => (
            <div key={r.title} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 14px', background:'#EEF2F7', borderRadius:10 }}>
              <span style={{ fontSize:24 }}>{r.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#0D1B2E' }}>{r.title}</div>
                <div style={{ fontSize:11, color:'#5A6882', marginTop:2 }}>{r.meta}</div>
              </div>
              {r.actions.map(a => (
                <button key={a} style={{ padding:'6px 14px', border:'1px solid #DDE3ED', borderRadius:7, fontSize:12, cursor:'pointer', background:'#FFFFFF' }}>{a}</button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}