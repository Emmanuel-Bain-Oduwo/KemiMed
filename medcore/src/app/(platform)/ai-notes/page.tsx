'use client'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const sampleNote = `Drug-Drug Interactions in Anaesthesia

1. WARFARIN + AZOLES (e.g. Fluconazole)
   Mechanism: Fluconazole inhibits CYP2C9 → reduced warfarin metabolism → ↑ plasma warfarin → ↑ INR
   Clinical significance: MAJOR
   Management: Monitor INR daily; reduce warfarin dose by 25–50%

2. PROPOFOL + FENTANYL (Synergistic)
   Mechanism: Additive CNS and respiratory depression via independent pathways
   Clinical significance: MODERATE — beneficial synergism used clinically
   Management: Reduce propofol induction dose by 30% when fentanyl premedication given

3. ROCURONIUM + AMINOGLYCOSIDES
   Mechanism: Aminoglycosides enhance NMJ blockade (pre-synaptic + post-synaptic effects)
   Clinical significance: HIGH in ICU patients on aminoglycosides
   Management: Use lower rocuronium doses; monitor TOF ratio; have sugammadex ready`

export default function AiNotesPage() {
  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:900, margin:'0 auto' }}>
      <div style={{ background:'#FFFFFF', borderRadius:12, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)', overflow:'hidden' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #DDE3ED' }}>
          <input placeholder="Note title..." style={{ width:'100%', border:'none', fontSize:20, fontFamily:'var(--font-fraunces),serif', fontWeight:700, outline:'none', color:'#0D1B2E', boxSizing:'border-box' }} />
        </div>
        <div style={{ padding:'10px 20px', borderBottom:'1px solid #EEF2F7', display:'flex', gap:4, flexWrap:'wrap' }}>
          {['B','I','U','H1','H2','• List','1. Num','Quote','Table','Image'].map(t=>(
            <button key={t} style={{ padding:'4px 10px', border:'1px solid #DDE3ED', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer', background:'#EEF2F7' }}>{t}</button>
          ))}
        </div>
        <div style={{ padding:'0 20px 20px' }}>
          <textarea
            defaultValue={sampleNote}
            rows={16}
            style={{
              width:'100%', border:'none', fontSize:14, lineHeight:1.85,
              fontFamily:'inherit', resize:'none', outline:'none', paddingTop:16,
              color:'#0D1B2E', boxSizing:'border-box',
            }}
          />
        </div>
        <div style={{ padding:'14px 20px', borderTop:'1px solid #EEF2F7', display:'flex', gap:8, flexWrap:'wrap' }}>
          {[
            ['✨ Expand','#7C3AED'],['📋 Simplify','#0CA89E'],['🃏 Make cards','#0B5C8F'],
            ['🌐 Translate','#C78B0A'],['📄 Export PDF','#5A6882'],['📊 Export PPT','#5A6882'],
          ].map(([label,color])=>(
            <button key={String(label)} style={{
              background:`${color}15`, color:String(color), border:`1px solid ${color}30`,
              padding:'7px 14px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer',
            }}>{String(label)}</button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}