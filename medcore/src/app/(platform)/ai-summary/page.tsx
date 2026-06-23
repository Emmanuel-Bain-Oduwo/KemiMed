'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const formats = [
  { icon:'📋', label:'Bullet summary' },
  { icon:'📊', label:'Comparison table' },
  { icon:'🎯', label:'MCQ-ready format' },
  { icon:'📖', label:'Full study guide' },
  { icon:'🕸️', label:'Mind map text' },
  { icon:'🔀', label:'SOAP note format' },
]

export default function AiSummaryPage() {
  const [selected, setSelected] = useState(0)

  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:900, margin:'0 auto' }}>
      <div style={{ background:'#FFFFFF', borderRadius:12, padding:28, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)', marginBottom:20 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'#0D1B2E', marginBottom:6 }}>
          Upload anything → get a structured summary
        </div>
        <div style={{ fontSize:13, color:'#5A6882', marginBottom:20 }}>
          PDFs, Word docs, PowerPoints, images, audio, video, URLs — all accepted
        </div>
        <div style={{
          border:'2px dashed #DDE3ED', borderRadius:12, padding:'48px 32px',
          textAlign:'center', cursor:'pointer', transition:'border-color 0.15s',
        }}
          onMouseEnter={e=>(e.currentTarget.style.borderColor='#0B5C8F')}
          onMouseLeave={e=>(e.currentTarget.style.borderColor='#DDE3ED')}
        >
          <div style={{ fontSize:40, marginBottom:12 }}>📁</div>
          <div style={{ fontSize:14, fontWeight:600, color:'#0D1B2E', marginBottom:4 }}>Drop files here or click to upload</div>
          <div style={{ fontSize:12, color:'#97A3B6' }}>PDF · DOCX · PPTX · MP3 · MP4 · Images</div>
          <button style={{ marginTop:16, background:'#0B5C8F', color:'white', border:'none', padding:'9px 24px', borderRadius:8, fontWeight:600, cursor:'pointer' }}>
            Choose File
          </button>
        </div>
      </div>

      <div style={{ fontSize:14, fontWeight:700, color:'#0D1B2E', marginBottom:14 }}>Choose output format</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
        {formats.map((f,i) => (
          <motion.div key={f.label} whileHover={{ y:-2 }} transition={{ duration:0.15 }}>
            <div onClick={()=>setSelected(i)} style={{
              background:'#FFFFFF', border:`1.5px solid ${selected===i?'#0B5C8F':'#DDE3ED'}`,
              borderRadius:10, padding:'18px 16px', textAlign:'center', cursor:'pointer',
              boxShadow: selected===i?'0 4px 16px rgba(11,92,143,0.12)':'none',
            }}>
              <div style={{ fontSize:28, marginBottom:8 }}>{f.icon}</div>
              <div style={{ fontSize:13, fontWeight:700, color:selected===i?'#0B5C8F':'#0D1B2E' }}>{f.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <button style={{ marginTop:20, width:'100%', background:'#0B5C8F', color:'white', border:'none', padding:'13px 0', borderRadius:10, fontSize:15, fontWeight:700, cursor:'pointer' }}>
        ✨ Generate {formats[selected].label}
      </button>
    </motion.div>
  )
}