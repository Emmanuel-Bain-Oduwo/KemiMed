'use client'
import { motion } from 'framer-motion'
import HeroCard from '@/components/shared/HeroCard'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const boards = [
  { flag:'🇺🇸', name:'USMLE',       sub:'Step 1 · 2 · 3' },
  { flag:'🇬🇧', name:'PLAB',        sub:'Part 1 · Part 2' },
  { flag:'🇰🇪', name:'Kenya KMPDB', sub:'Pharmacy Board' },
  { flag:'🇳🇬', name:'Nigeria MDCN',sub:'Final MBBS' },
  { flag:'🇮🇳', name:'NExT India',  sub:'NExT · FMGE' },
  { flag:'🇨🇦', name:'MCCQE',       sub:'Part 1 · Part 2' },
  { flag:'🇦🇺', name:'AMC',         sub:'CAT · Clinical' },
  { flag:'🇿🇦', name:'HPCSA',       sub:'South Africa' },
  { flag:'🇩🇪', name:'Approbation', sub:'Germany' },
  { flag:'➕',  name:'Request',     sub:'Your board' },
]

export default function BoardExamsPage() {
  return (
    <motion.div {...pageAnim} className="km-page" style={{ maxWidth:1000, margin:'0 auto' }}>

      <HeroCard style={{ marginBottom:24 }}>
        <div style={{ fontSize:24, fontFamily:'var(--font-fraunces),serif', fontWeight:800, marginBottom:8 }}>
          Every major board exam. One platform.
        </div>
        <div style={{ opacity:0.8, fontSize:14 }}>
          USMLE · PLAB · Kenya · Nigeria · India · Canada · Australia · South Africa · Germany
        </div>
      </HeroCard>

      <div style={{ fontSize:14, fontWeight:700, color:'#0D1B2E', marginBottom:14 }}>Select your board exam</div>
      <div className="km-grid-5" style={{ marginBottom:24 }}>
        {boards.map(b => (
          <motion.div key={b.name} whileHover={{ y:-2, boxShadow:'0 6px 24px rgba(11,92,143,0.14)' }} transition={{ duration:0.15 }}>
            <div style={{
              background:'#FFFFFF', border:'1.5px solid #DDE3ED', borderRadius:12,
              padding:'18px 12px', textAlign:'center', cursor:'pointer',
              transition:'border-color 0.15s',
            }}
              onMouseEnter={e=>(e.currentTarget.style.borderColor='#0B5C8F')}
              onMouseLeave={e=>(e.currentTarget.style.borderColor='#DDE3ED')}
            >
              <div style={{ fontSize:28, marginBottom:8 }}>{b.flag}</div>
              <div style={{ fontSize:13, fontWeight:700, color:'#0D1B2E' }}>{b.name}</div>
              <div style={{ fontSize:11, color:'#5A6882', marginTop:2 }}>{b.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Active prep */}
      <div style={{ background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          <span style={{ fontSize:20 }}>🇺🇸</span>
          <span style={{ fontSize:15, fontWeight:700, color:'#0D1B2E' }}>USMLE Step 1 — Active Prep</span>
        </div>
        <div className="km-grid-4" style={{ marginBottom:20 }}>
          {[
            { val:'68%',   label:'Readiness',       color:'#0CA89E' },
            { val:'1,240', label:'Questions done',   color:'#0B5C8F' },
            { val:'224',   label:'Predicted score',  color:'#16A34A' },
            { val:'Pharm', label:'Weakest area',     color:'#DC2626' },
          ].map(s=>(
            <div key={s.label} style={{ textAlign:'center' }}>
              <div style={{ fontSize:28, fontFamily:'var(--font-fraunces),serif', fontWeight:900, color:s.color }}>{s.val}</div>
              <div style={{ fontSize:12, color:'#5A6882', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'10px 20px', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:13 }}>🎯 Start Adaptive Mock</button>
          <button style={{ background:'transparent', border:'1px solid #DDE3ED', color:'#0D1B2E', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:13 }}>📋 Syllabus</button>
          <button style={{ background:'transparent', border:'1px solid #DDE3ED', color:'#0D1B2E', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:13 }}>📊 Score trend</button>
        </div>
      </div>
    </motion.div>
  )
}