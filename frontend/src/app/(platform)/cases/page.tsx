'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

export default function CasesPage() {
  const [answer, setAnswer] = useState('')

  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:820, margin:'0 auto' }}>
      <div style={{ background:'#FFFFFF', borderRadius:12, padding:28, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
        <div style={{ display:'flex', gap:8, marginBottom:18, alignItems:'center' }}>
          <span style={{ background:'rgba(220,38,38,0.1)', color:'#DC2626', padding:'4px 12px', borderRadius:999, fontSize:11, fontWeight:700, fontFamily:'var(--font-ibm-mono),monospace' }}>
            OSCE CLINICAL CASE
          </span>
          <span style={{ background:'rgba(11,92,143,0.1)', color:'#0B5C8F', padding:'4px 12px', borderRadius:999, fontSize:11, fontWeight:600 }}>
            Pharmacy / Medicine
          </span>
        </div>

        <div style={{ background:'#EEF2F7', borderRadius:10, padding:20, marginBottom:20, fontSize:13, lineHeight:1.75, color:'#0D1B2E' }}>
          <div style={{ fontWeight:700, color:'#DC2626', marginBottom:8, fontSize:12, fontFamily:'var(--font-ibm-mono),monospace' }}>PATIENT PRESENTATION</div>
          <strong>Patient:</strong> 72-year-old male, referred by GP to anticoagulation clinic.<br />
          <strong>PC:</strong> Unusual bruising and gum bleeding × 3 days.<br />
          <strong>PMHx:</strong> Atrial fibrillation (warfarin 5mg/day, INR usually 2.4), Type 2 diabetes, hypertension.<br />
          <strong>DHx:</strong> Metformin 500mg BD · Amlodipine 5mg OD · Warfarin 5mg OD · Fluconazole 150mg OD × 7 days (started 6 days ago by GP for oral candidiasis).<br />
          <strong>Social:</strong> Retired teacher. No alcohol. Good compliance.<br />
          <br />
          <strong>Examination:</strong> Extensive ecchymoses bilateral forearms. HR 88 bpm irregular. BP 134/82 mmHg. Gingival oozing noted.<br />
          <br />
          <strong>Investigations:</strong> INR 7.4 (target 2–3) · Hb 11.2 g/dL · Renal function normal · LFTs normal.
        </div>

        <div style={{ fontSize:13, fontWeight:700, color:'#0D1B2E', marginBottom:8 }}>
          Your assessment and management plan
        </div>
        <textarea
          value={answer}
          onChange={e=>setAnswer(e.target.value)}
          rows={7}
          placeholder={`Expected components:
1. Identify the drug-drug interaction (mechanism)
2. Immediate management of supratherapeutic anticoagulation
3. Warfarin counselling and monitoring plan
4. Future prescribing considerations`}
          style={{
            width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:14,
            fontSize:13, fontFamily:'inherit', lineHeight:1.7, resize:'vertical',
            outline:'none', boxSizing:'border-box',
          }}
        />

        <div style={{ display:'flex', gap:8, marginTop:14 }}>
          <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'10px 22px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 }}>
            Submit → Get KemiMed Feedback
          </button>
          <button style={{ background:'transparent', border:'1px solid #DDE3ED', color:'#0D1B2E', padding:'10px 18px', borderRadius:8, cursor:'pointer', fontSize:13 }}>
            🎙️ Speak answer
          </button>
        </div>
      </div>
    </motion.div>
  )
}