'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import HeroCard from '@/components/shared/HeroCard'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const formats = [
  { icon:'📄', label:'PDF Notes',      sub:'Formatted study doc' },
  { icon:'📊', label:'PowerPoint',     sub:'Slide deck' },
  { icon:'🕸️', label:'Mind Map',       sub:'Visual concept map' },
  { icon:'📋', label:'Report',         sub:'Academic report' },
  { icon:'✍️', label:'Blog Article',   sub:'Publish & share' },
  { icon:'🎬', label:'Video Lesson',   sub:'KemiMed-narrated video' },
  { icon:'🎙️', label:'Podcast',        sub:'Audio lecture MP3' },
  { icon:'📈', label:'Graph/Chart',    sub:'Data visualisation' },
  { icon:'🔀', label:'Flow Diagram',   sub:'Clinical pathway' },
  { icon:'🃏', label:'Flashcard Deck', sub:'SM-2 ready cards' },
]

export default function GeneratePage() {
  const [active, setActive] = useState(0)
  const [topic, setTopic] = useState('')

  return (
    <motion.div {...pageAnim} className="km-page" style={{ maxWidth:1000, margin:'0 auto' }}>
      <HeroCard style={{ marginBottom:24 }}>
        <div style={{ fontSize:22, fontFamily:'var(--font-fraunces),serif', fontWeight:800, marginBottom:14 }}>
          What do you want to create?
        </div>
        <textarea
          value={topic}
          onChange={e=>setTopic(e.target.value)}
          rows={3}
          placeholder="Enter a topic, paste lecture notes, or describe what you want to generate..."
          style={{
            width:'100%', borderRadius:8, border:'none', padding:'12px 14px',
            fontSize:14, background:'rgba(255,255,255,0.2)', color:'white',
            outline:'none', resize:'none', fontFamily:'inherit', boxSizing:'border-box',
          }}
        />
        <div style={{ display:'flex', gap:8, marginTop:10 }}>
          {['📎 Upload file','🔗 Paste URL','🎙️ Voice input'].map(b=>(
            <button key={b} style={{
              background:'rgba(255,255,255,0.15)', color:'white', border:'1px solid rgba(255,255,255,0.3)',
              padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer',
            }}>{b}</button>
          ))}
        </div>
      </HeroCard>

      <div style={{ fontSize:14, fontWeight:700, color:'#0D1B2E', marginBottom:14 }}>Choose output format</div>
      <div className="km-grid-5" style={{ marginBottom:24 }}>
        {formats.map((f,i) => (
          <motion.div key={f.label} whileHover={{ y:-2 }} transition={{ duration:0.15 }}>
            <div onClick={()=>setActive(i)} style={{
              background:'#FFFFFF', border:`1.5px solid ${active===i?'#0B5C8F':'#DDE3ED'}`,
              borderRadius:10, padding:'16px 12px', textAlign:'center', cursor:'pointer',
              boxShadow: active===i ? '0 4px 16px rgba(11,92,143,0.15)' : 'none',
              transition:'all 0.15s',
            }}>
              <div style={{ fontSize:28, marginBottom:6 }}>{f.icon}</div>
              <div style={{ fontSize:12, fontWeight:700, color: active===i?'#0B5C8F':'#0D1B2E' }}>{f.label}</div>
              <div style={{ fontSize:11, color:'#5A6882', marginTop:2 }}>{f.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Options panel */}
      {active === 0 && (
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>📄 PDF Generator</div>
          <div className="km-grid-2">
            <div>
              <input placeholder="Document title..." style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 12px', fontSize:13, outline:'none', boxSizing:'border-box', marginBottom:12 }} />
              {['Introduction','Key concepts','Clinical applications','Summary','References'].map(s=>(
                <label key={s} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, marginBottom:8, cursor:'pointer' }}>
                  <input type="checkbox" defaultChecked style={{ accentColor:'#0CA89E' }} /> {s}
                </label>
              ))}
            </div>
            <div>
              <select style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 12px', fontSize:13, marginBottom:12, boxSizing:'border-box' }}>
                {['Academic','Clinical','Student notes','OSCE ready'].map(o=><option key={o}>{o}</option>)}
              </select>
              <div style={{ background:'#EEF2F7', borderRadius:8, padding:16, height:120, display:'flex', alignItems:'center', justifyContent:'center', color:'#97A3B6', fontSize:13 }}>
                📄 PDF Preview
              </div>
              <button style={{ width:'100%', marginTop:12, background:'#0B5C8F', color:'white', border:'none', padding:'11px 0', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:14 }}>
                ⬇ Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {active !== 0 && (
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED', textAlign:'center' }}>
          <div style={{ fontSize:36, marginBottom:12 }}>{formats[active].icon}</div>
          <div style={{ fontSize:15, fontWeight:700, color:'#0D1B2E', marginBottom:6 }}>{formats[active].label} Generator</div>
          <div style={{ fontSize:13, color:'#5A6882', marginBottom:20 }}>{formats[active].sub}</div>
          <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'11px 28px', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:14 }}>
            ⚡ Generate {formats[active].label}
          </button>
        </div>
      )}
    </motion.div>
  )
}