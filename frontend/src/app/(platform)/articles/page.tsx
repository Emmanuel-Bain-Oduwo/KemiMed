'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const readArticles = [
  { gradient:'linear-gradient(135deg,#0B5C8F,#0CA89E)', category:'PHARMACOLOGY · 5 MIN READ', title:'Why CYP2D6 polymorphisms matter for codeine dosing in African patients', tags:['PGx','Africa','High Yield'] },
  { gradient:'linear-gradient(135deg,#7C3AED,#a78bfa)', category:'ANAESTHESIA · 8 MIN READ', title:'The anaesthesiologist\'s guide to managing patients on anticoagulants', tags:['Anaesthesia','High Risk'] },
  { gradient:'linear-gradient(135deg,#C78B0A,#fbbf24)', category:'EXAM PREP · 10 MIN READ', title:'USMLE Step 1: The 30 drug interactions you must know cold', tags:['USMLE','Must Know'] },
]

export default function ArticlesPage() {
  const [tab, setTab] = useState(0)
  const tabs = ['Read', 'Write / Blog', 'KemiMed Generate']

  return (
    <motion.div {...pageAnim} className="km-page" style={{ maxWidth:1000, margin:'0 auto' }}>
      <div style={{ display:'flex', gap:4, background:'#FFFFFF', borderRadius:10, padding:4, border:'1px solid #DDE3ED', marginBottom:20, width:'fit-content' }}>
        {tabs.map((t,i) => (
          <button key={t} onClick={() => setTab(i)} style={{
            padding:'7px 18px', borderRadius:7, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
            background: tab===i ? '#0B5C8F' : 'transparent', color: tab===i ? 'white' : '#5A6882',
          }}>{t}</button>
        ))}
      </div>

      {tab === 0 && (
        <div className="km-grid-3">
          {readArticles.map(a => (
            <div key={a.title} style={{ background:'#FFFFFF', borderRadius:12, border:'1px solid #DDE3ED', overflow:'hidden', boxShadow:'0 2px 12px rgba(11,92,143,0.08)', cursor:'pointer' }}>
              <div style={{ background:a.gradient, padding:'20px 16px 24px' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.7)', letterSpacing:'0.8px' }}>{a.category}</div>
              </div>
              <div style={{ padding:16 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#0D1B2E', lineHeight:1.5, marginBottom:10 }}>{a.title}</div>
                <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                  {a.tags.map(t => (
                    <span key={t} style={{ background:'rgba(11,92,143,0.08)', color:'#0B5C8F', padding:'3px 9px', borderRadius:999, fontSize:11, fontWeight:600 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 1 && (
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED' }}>
          <input placeholder="Article title..." style={{ width:'100%', border:'none', borderBottom:'2px solid #DDE3ED', padding:'8px 0', fontSize:20, fontFamily:'var(--font-fraunces),serif', fontWeight:700, outline:'none', marginBottom:16, boxSizing:'border-box' }} />
          <div style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap' }}>
            {['B','I','U','H1','H2','• List','1. Num','Table','Image'].map(t=>(
              <button key={t} style={{ padding:'4px 10px', border:'1px solid #DDE3ED', borderRadius:6, fontSize:12, fontWeight:700, cursor:'pointer', background:'#EEF2F7' }}>{t}</button>
            ))}
          </div>
          <textarea
            rows={12}
            placeholder="Start writing your article..."
            style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:16, fontSize:14, lineHeight:1.85, fontFamily:'inherit', resize:'vertical', outline:'none', boxSizing:'border-box' }}
          />
          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            <button style={{ padding:'8px 18px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13, cursor:'pointer' }}>Save draft</button>
            <button style={{ padding:'8px 18px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13, cursor:'pointer' }}>Export PDF</button>
            <button style={{ marginLeft:'auto', background:'#0B5C8F', color:'white', border:'none', padding:'8px 22px', borderRadius:8, fontWeight:600, cursor:'pointer', fontSize:13 }}>Publish</button>
          </div>
        </div>
      )}

      {tab === 2 && (
        <div style={{ maxWidth:520, margin:'0 auto', background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED' }}>
          <div style={{ fontSize:15, fontWeight:700, marginBottom:16 }}>KemiMed Article Generator</div>
          <input placeholder="Topic..." style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 12px', fontSize:13, marginBottom:10, boxSizing:'border-box', outline:'none' }} />
          <div className="km-grid-2" style={{ marginBottom:16 }}>
            <select style={{ padding:'8px 10px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13 }}>
              {['Blog post','Literature review','Case report','Editorial'].map(o=><option key={o}>{o}</option>)}
            </select>
            <select style={{ padding:'8px 10px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13 }}>
              {['500 words','1000 words','2000 words'].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <button style={{ width:'100%', background:'#0B5C8F', color:'white', border:'none', padding:'12px 0', borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:14 }}>⚡ Generate Article</button>
        </div>
      )}
    </motion.div>
  )
}