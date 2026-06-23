'use client'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const box = (label: string, color: string, width = 200): React.CSSProperties => ({
  border: `2px solid ${color}`, borderRadius: 10, padding: '10px 16px',
  textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#0D1B2E',
  background: '#FFFFFF', width, margin: '0 auto',
})

const diamond = (label: string, color: string): React.CSSProperties => ({
  border: `2px solid ${color}`, padding: '12px 20px',
  fontSize: 13, fontWeight: 600, color: '#0D1B2E',
  background: '#FFFFFF', transform: 'rotate(0deg)',
  textAlign: 'center', borderRadius: 8, margin: '0 auto', width: 240,
})

const arrow = { textAlign: 'center' as const, fontSize: 18, color: '#97A3B6', lineHeight: '20px', margin: '4px 0' }

export default function FlowchartsPage() {
  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:900, margin:'0 auto' }}>

      <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', marginBottom:20 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <input placeholder="Describe the clinical pathway or algorithm..." style={{ flex:1, border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 12px', fontSize:13, outline:'none', minWidth:200 }} />
          <select style={{ padding:'8px 10px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:12 }}>
            {['Clinical Algorithm','Diagnostic','Treatment','Drug Mechanism','Metabolic'].map(o=><option key={o}>{o}</option>)}
          </select>
          <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Generate</button>
        </div>
      </div>

      <div style={{ background:'#FFFFFF', borderRadius:12, padding:28, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'#0D1B2E' }}>AF Anticoagulation Management</div>
          <div style={{ display:'flex', gap:8 }}>
            {['PNG','PDF','→ Flashcards'].map(b=>(
              <button key={b} style={{ padding:'6px 14px', border:'1px solid #DDE3ED', borderRadius:7, fontSize:12, cursor:'pointer', background:b==='→ Flashcards'?'#0B5C8F':'#FFFFFF', color:b==='→ Flashcards'?'white':'#0D1B2E' }}>{b}</button>
            ))}
          </div>
        </div>

        {/* Flowchart */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:0 }}>
          <div style={box('Patient with AF diagnosed', '#16A34A')}>
            Patient with AF diagnosed
          </div>
          <div style={arrow}>↓</div>

          <div style={diamond('Calculate CHA₂DS₂-VASc Score', '#C78B0A')}>
            Calculate CHA₂DS₂-VASc Score
          </div>

          <div style={{ display:'flex', gap:60, marginTop:4 }}>
            <div style={{ textAlign:'center', color:'#97A3B6', fontSize:11 }}>Score 0–1 ↙</div>
            <div style={{ textAlign:'center', color:'#97A3B6', fontSize:11 }}>↘ Score ≥2</div>
          </div>

          <div style={{ display:'flex', gap:40, marginTop:8 }}>
            <div>
              <div style={{ ...box('No anticoagulation', '#16A34A', 170), background:'rgba(22,163,74,0.06)' }}>
                No anticoagulation
              </div>
              <div style={{ fontSize:11, color:'#5A6882', textAlign:'center', marginTop:6 }}>Low risk</div>
            </div>
            <div>
              <div style={{ ...box('Anticoagulate', '#0B5C8F', 170), background:'rgba(11,92,143,0.06)' }}>
                Anticoagulate
              </div>
              <div style={arrow}>↓</div>
              <div style={diamond('Assess renal + HAS-BLED', '#C78B0A')}>
                Assess renal + HAS-BLED
              </div>
              <div style={{ display:'flex', gap:20, marginTop:8 }}>
                <div>
                  <div style={{ fontSize:11, color:'#97A3B6', textAlign:'center', marginBottom:4 }}>CrCl&gt;30 ↙</div>
                  <div style={{ ...box('DOAC preferred', '#0B5C8F', 130), background:'rgba(11,92,143,0.06)' }}>
                    DOAC preferred
                  </div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:'#97A3B6', textAlign:'center', marginBottom:4 }}>↘ Valvular AF</div>
                  <div style={{ ...box('Warfarin', '#0B5C8F', 130), background:'rgba(11,92,143,0.06)' }}>
                    Warfarin (INR 2–3)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}