'use client'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

export default function CollaboratePage() {
  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:900, margin:'0 auto' }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>

        {/* Active room */}
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:24, border:'2px solid #0CA89E', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div style={{ fontSize:16, fontWeight:700, color:'#0D1B2E' }}>DDI Study Room 🟢</div>
            <span style={{ background:'rgba(22,163,74,0.12)', color:'#16A34A', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700 }}>LIVE · 2 members</span>
          </div>

          <div style={{ display:'flex', gap:8, marginBottom:16 }}>
            {['E','S'].map((l,i) => (
              <div key={i} style={{
                width:40, height:40, borderRadius:'50%', flexShrink:0,
                background:`linear-gradient(135deg,${i===0?'#0B5C8F,#0CA89E':'#7C3AED,#a78bfa'})`,
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'white', fontWeight:700, fontSize:14,
              }}>{l}</div>
            ))}
            <div style={{ fontSize:13, color:'#5A6882', display:'flex', alignItems:'center' }}>Emmanuel · Siham</div>
          </div>

          <div style={{ background:'#EEF2F7', borderRadius:8, padding:12, marginBottom:14, fontSize:13 }}>
            <span style={{ color:'#5A6882' }}>Deck: </span><span style={{ color:'#0D1B2E', fontWeight:600 }}>DDI Anaesthetics · 18 cards</span>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16, fontSize:13 }}>
            <div><span style={{ color:'#5A6882' }}>Emmanuel: </span><span style={{ fontWeight:700, color:'#0CA89E' }}>62%</span></div>
            <div><span style={{ color:'#5A6882' }}>Siham: </span><span style={{ fontWeight:700, color:'#16A34A' }}>71%</span></div>
          </div>

          <button style={{ width:'100%', background:'#0CA89E', color:'white', border:'none', padding:'12px 0', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:14 }}>
            Join Room →
          </button>
        </div>

        {/* Create room */}
        <div style={{
          border:'2px dashed #DDE3ED', borderRadius:12, display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center', padding:40, cursor:'pointer',
          gap:10, transition:'border-color 0.15s',
        }}
          onMouseEnter={e=>(e.currentTarget.style.borderColor='#0CA89E')}
          onMouseLeave={e=>(e.currentTarget.style.borderColor='#DDE3ED')}
        >
          <div style={{ fontSize:40 }}>➕</div>
          <div style={{ fontSize:16, fontWeight:700, color:'#0D1B2E' }}>Create Study Room</div>
          <div style={{ fontSize:13, color:'#5A6882', textAlign:'center' }}>Share a deck with classmates and study together in real time</div>
        </div>
      </div>
    </motion.div>
  )
}