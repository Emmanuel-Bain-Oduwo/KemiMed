'use client'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const videos = [
  { emoji:'💊', title:'Drug Interactions in Anaesthesia', sub:'KemiMed-generated · Pharmacology · 847 views', duration:'18:32' },
  { emoji:'🧬', title:'CYP450 Enzymes: Complete Guide', sub:'KemiMed-generated · Pharmacogenomics · 1.2k views', duration:'24:15' },
]

export default function VideoPage() {
  return (
    <motion.div {...pageAnim} className="km-page" style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', marginBottom:24 }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Generate Video Lesson</div>
        <div style={{ display:'flex', gap:8, marginBottom:10 }}>
          <input placeholder="Topic for video lesson..." style={{ flex:1, border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 12px', fontSize:13, outline:'none' }} />
          <select style={{ padding:'8px 10px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13 }}>
            {['5 min','10 min','20 min','30 min'].map(o=><option key={o}>{o}</option>)}
          </select>
          <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'8px 18px', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:13 }}>Generate</button>
        </div>
        <div style={{ fontSize:11, color:'#97A3B6' }}>
          KemiMed-narrated using Dr. KemiMed voice · Includes slides, animations, and clinical examples
        </div>
      </div>

      <div className="km-grid-3">
        {videos.map(v => (
          <div key={v.title} style={{ background:'#FFFFFF', borderRadius:12, border:'1px solid #DDE3ED', overflow:'hidden', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
            <div style={{
              background:'linear-gradient(135deg,#071525,#0B5C8F)',
              height:140, display:'flex', alignItems:'center', justifyContent:'center',
              position:'relative', fontSize:48,
            }}>
              {v.emoji}
              <div style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,0.7)', color:'white', fontSize:11, fontWeight:600, padding:'3px 7px', borderRadius:5 }}>{v.duration}</div>
            </div>
            <div style={{ padding:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#0D1B2E', marginBottom:4 }}>{v.title}</div>
              <div style={{ fontSize:11, color:'#5A6882', marginBottom:12 }}>{v.sub}</div>
              <div style={{ display:'flex', gap:8 }}>
                <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'6px 14px', borderRadius:7, fontSize:12, cursor:'pointer', fontWeight:600 }}>▶ Watch</button>
                <button style={{ padding:'6px 14px', border:'1px solid #DDE3ED', borderRadius:7, fontSize:12, cursor:'pointer' }}>📝 Notes</button>
              </div>
            </div>
          </div>
        ))}
        <div style={{ border:'2px dashed #DDE3ED', borderRadius:12, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, cursor:'pointer', gap:8 }}>
          <span style={{ fontSize:32 }}>➕</span>
          <span style={{ fontSize:13, fontWeight:600, color:'#5A6882' }}>Generate new video</span>
        </div>
      </div>
    </motion.div>
  )
}