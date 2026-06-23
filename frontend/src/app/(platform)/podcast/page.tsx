'use client'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const episodes = [
  { icon:'🎙️', title:'DDI in Anaesthesia — Full Lecture', duration:'28 min', progress:65 },
  { icon:'🔬', title:'CYP450: The Pharmacist\'s Guide', duration:'19 min', progress:20 },
]

export default function PodcastPage() {
  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:1000, margin:'0 auto' }}>

      <div style={{
        background:'linear-gradient(135deg,#4C1D95,#7C3AED)',
        borderRadius:12, padding:32, color:'white', marginBottom:24, position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-30, right:-30, width:150, height:150, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div style={{ fontFamily:'var(--font-fraunces),serif', fontSize:24, fontWeight:800, marginBottom:8, position:'relative' }}>
          🎙️ KemiMed Podcast Studio
        </div>
        <div style={{ opacity:0.8, marginBottom:20, fontSize:14, position:'relative' }}>
          Generate KemiMed audio lectures on any health science topic
        </div>
        <div style={{ display:'flex', gap:8, position:'relative' }}>
          <input placeholder="Topic for podcast episode..." style={{ flex:1, border:'none', borderRadius:8, padding:'10px 14px', fontSize:13, background:'rgba(255,255,255,0.2)', color:'white', outline:'none' }} />
          <select style={{ padding:'8px 12px', border:'none', borderRadius:8, fontSize:13, background:'rgba(255,255,255,0.2)', color:'white' }}>
            {['10 min','20 min','30 min','45 min'].map(o=><option key={o}>{o}</option>)}
          </select>
          <button style={{ background:'white', color:'#7C3AED', border:'none', padding:'10px 20px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:13 }}>Generate</button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Episodes</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {episodes.map(e => (
              <div key={e.title} style={{ background:'#EEF2F7', borderRadius:10, padding:14 }}>
                <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
                  <span style={{ fontSize:24 }}>{e.icon}</span>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#0D1B2E' }}>{e.title}</div>
                    <div style={{ fontSize:11, color:'#5A6882', marginTop:2 }}>{e.duration}</div>
                  </div>
                </div>
                <div style={{ height:4, background:'#DDE3ED', borderRadius:999, overflow:'hidden', marginBottom:10 }}>
                  <div style={{ height:'100%', width:`${e.progress}%`, background:'#7C3AED', borderRadius:999 }} />
                </div>
                <button style={{ background:'#7C3AED', color:'white', border:'none', padding:'6px 16px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>▶ Play</button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Settings</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div>
              <div style={{ fontSize:12, color:'#5A6882', marginBottom:6 }}>KemiMed Voice</div>
              <select style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 10px', fontSize:13 }}>
                {['Dr. KemiMed — Male','Dr. Amara — Female','Prof. Chen — Academic'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:12, color:'#5A6882', marginBottom:6 }}>Format</div>
              <select style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 10px', fontSize:13 }}>
                {['Lecture','Conversational 2-hosts','Q&A'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize:12, color:'#5A6882', marginBottom:6 }}>Language</div>
              <select style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 10px', fontSize:13 }}>
                {['English','Swahili','French','Arabic'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            {[['Auto-transcript', true],['Quiz at end', true],['Convert to flashcards', false]].map(([label, on]) => (
              <div key={String(label)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:13 }}>{String(label)}</span>
                <div style={{ width:40, height:22, borderRadius:999, background: on?'#0CA89E':'#DDE3ED', cursor:'pointer', position:'relative' }}>
                  <div style={{ position:'absolute', top:2, left: on?18:2, width:18, height:18, borderRadius:'50%', background:'white', transition:'left 0.2s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}