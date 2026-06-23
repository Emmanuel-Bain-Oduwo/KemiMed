'use client'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const toggles = [
  { label:'Deep evaluation mode',        on:true },
  { label:'Clinical safety warnings',    on:true },
  { label:'Auto-generate flashcards',    on:false },
  { label:'Include mnemonics',           on:true },
]

export default function SettingsPage() {
  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:900, margin:'0 auto' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        {/* Profile */}
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:20 }}>Profile</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontSize:12, color:'#5A6882', display:'block', marginBottom:5 }}>Full Name</label>
              <input defaultValue="Emmanuel Bain" style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'9px 12px', fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
            <div>
              <label style={{ fontSize:12, color:'#5A6882', display:'block', marginBottom:5 }}>Discipline</label>
              <select style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'9px 12px', fontSize:13, boxSizing:'border-box' }}>
                {['Pharmacy','Medicine','Nursing','MLS','Physiotherapy','Dentistry','Nutrition','Public Health'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:'#5A6882', display:'block', marginBottom:5 }}>Study Year</label>
              <select style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'9px 12px', fontSize:13, boxSizing:'border-box' }}>
                {['Year 1','Year 2','Year 3','Year 4','Year 5','Postgraduate'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:'#5A6882', display:'block', marginBottom:5 }}>University</label>
              <input defaultValue="Parul University" style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'9px 12px', fontSize:13, outline:'none', boxSizing:'border-box' }} />
            </div>
            <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'11px 0', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:14 }}>
              Save Changes
            </button>
          </div>
        </div>

        {/* AI Preferences */}
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:20 }}>AI Preferences</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ fontSize:12, color:'#5A6882', display:'block', marginBottom:5 }}>Default Tutor Mode</label>
              <select style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'9px 12px', fontSize:13, boxSizing:'border-box' }}>
                {['📚 Teach me','❓ Evaluate me deeply','🏥 Clinical case','🎯 Exam drill'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:12, color:'#5A6882', display:'block', marginBottom:5 }}>Response Language</label>
              <select style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'9px 12px', fontSize:13, boxSizing:'border-box' }}>
                {['English','Swahili','French','Arabic'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{ borderTop:'1px solid #EEF2F7', paddingTop:14 }}>
              {toggles.map(t => (
                <div key={t.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <span style={{ fontSize:13, color:'#0D1B2E' }}>{t.label}</span>
                  <div style={{ width:44, height:24, borderRadius:999, background:t.on?'#0CA89E':'#DDE3ED', cursor:'pointer', position:'relative', flexShrink:0 }}>
                    <div style={{ position:'absolute', top:3, left:t.on?22:3, width:18, height:18, borderRadius:'50%', background:'white', transition:'left 0.2s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}