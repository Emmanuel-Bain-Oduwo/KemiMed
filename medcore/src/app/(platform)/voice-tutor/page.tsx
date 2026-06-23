'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const transcript = [
  { time:'0:12', who:'You', text:'Explain how propofol works.' },
  { time:'0:18', who:'KemiMed', text:'Propofol potentiates GABA-A receptors, enhancing chloride influx and causing hyperpolarisation of the neuronal membrane. At clinical doses it produces sedation and, at higher doses, general anaesthesia.' },
  { time:'1:05', who:'You', text:'What about the duration of action?' },
  { time:'1:11', who:'KemiMed', text:'Propofol has a context-sensitive half-time. For short infusions (<30 min) recovery is rapid (5–10 min). For prolonged infusions (>3h), the half-time can exceed 30 min due to redistribution from peripheral compartments.' },
]

export default function VoiceTutorPage() {
  const [listening, setListening] = useState(false)

  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:680, margin:'0 auto' }}>
      <div style={{
        background:'linear-gradient(135deg,#071525,#0B5C8F)',
        borderRadius:12, padding:48, textAlign:'center', color:'white', marginBottom:20,
      }}>
        <div style={{ fontSize:52, marginBottom:16 }}>🎙️</div>
        <div style={{ fontFamily:'var(--font-fraunces),serif', fontSize:28, fontWeight:800, marginBottom:8 }}>Speak & Learn</div>
        <div style={{ opacity:0.7, marginBottom:32, fontSize:14 }}>English · Swahili · French · KemiMed responds in real time</div>
        <motion.button
          onClick={() => setListening(!listening)}
          animate={listening ? { scale:[1,1.08,1] } : {}}
          transition={{ repeat:Infinity, duration:1 }}
          style={{
            width:80, height:80, borderRadius:'50%', border:'none', cursor:'pointer', fontSize:28,
            background: listening ? '#DC2626' : '#0CA89E',
            boxShadow: listening ? '0 0 0 8px rgba(220,38,38,0.25)' : '0 0 0 8px rgba(12,168,158,0.25)',
            display:'inline-flex', alignItems:'center', justifyContent:'center', transition:'background 0.2s',
          }}
        >
          {listening ? '⏹️' : '🎤'}
        </motion.button>
        <div style={{ marginTop:16, fontSize:13, opacity:0.6 }}>
          {listening ? 'Listening... speak now' : 'Tap mic to start session'}
        </div>
      </div>

      <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Session Transcript</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {transcript.map((t,i) => (
            <div key={i} style={{ display:'flex', gap:10 }}>
              <div style={{ width:36, fontSize:11, color:'#97A3B6', paddingTop:3, flexShrink:0 }}>{t.time}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, fontWeight:700, color: t.who==='You'?'#7C3AED':'#0CA89E', marginBottom:2 }}>{t.who}</div>
                <div style={{ fontSize:13, color:'#0D1B2E', lineHeight:1.6 }}>{t.text}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:16, borderTop:'1px solid #EEF2F7', paddingTop:14 }}>
          <button style={{ padding:'7px 16px', border:'1px solid #DDE3ED', borderRadius:7, fontSize:12, cursor:'pointer' }}>💾 Save</button>
          <button style={{ padding:'7px 16px', border:'1px solid #DDE3ED', borderRadius:7, fontSize:12, cursor:'pointer' }}>🃏 Flashcards</button>
          <button style={{ padding:'7px 16px', border:'1px solid #DDE3ED', borderRadius:7, fontSize:12, cursor:'pointer' }}>📄 Export Notes</button>
        </div>
      </div>
    </motion.div>
  )
}