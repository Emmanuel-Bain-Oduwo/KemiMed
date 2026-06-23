'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FlipCard } from '@/components/flashcards/FlipCard'
import ProgressBar from '@/components/shared/ProgressBar'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }
const tabs = ['Study Now', 'My Decks', 'KemiMed Generate', 'Analytics']

const decks = [
  { icon:'💊', title:'DDI — Anaesthetics', count:18, progress:62, color:'#0CA89E', due:7 },
  { icon:'🧬', title:'Pharmacogenomics',    count:34, progress:38, color:'#7C3AED', due:14 },
  { icon:'💉', title:'Pharmacokinetics',    count:28, progress:88, color:'#16A34A', due:2 },
]

export default function FlashcardsPage() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <motion.div {...pageAnim} className="km-page" style={{ maxWidth:900, margin:'0 auto' }}>

      {/* Tab bar */}
      <div style={{ display:'flex', gap:4, background:'#FFFFFF', borderRadius:10, padding:4, border:'1px solid #DDE3ED', marginBottom:20, width:'fit-content' }}>
        {tabs.map((t,i) => (
          <button key={t} onClick={() => setActiveTab(i)} style={{
            padding:'7px 18px', borderRadius:7, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
            background: activeTab===i ? '#0B5C8F' : 'transparent',
            color: activeTab===i ? 'white' : '#5A6882',
            transition:'all 0.15s',
          }}>{t}</button>
        ))}
      </div>

      {/* Study Now */}
      {activeTab === 0 && (
        <div style={{ maxWidth:520, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <span style={{
              background:'rgba(11,92,143,0.1)', color:'#0B5C8F',
              padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:600,
            }}>DDI Anaesthetics · Card 3 of 18</span>
          </div>
          <FlipCard
            front="A patient on warfarin 5mg/day is started on fluconazole. What is the PRIMARY pharmacokinetic interaction and what INR change do you expect?"
            back={`Fluconazole inhibits CYP2C9, the primary enzyme metabolising warfarin's S-enantiomer (more potent).

Result: ↓ warfarin clearance → ↑ plasma levels → ↑ INR (can rise from 2.4 to >6).

💎 Pearl: Monitor INR within 3–5 days of any azole addition. Reduce warfarin dose by 25–50%.`}
          />
          <div style={{ display:'flex', gap:8, marginTop:16 }}>
            {[
              { label:'✗ Again', color:'#DC2626', bg:'rgba(220,38,38,0.08)', border:'#DC2626' },
              { label:'~ Hard',  color:'#C78B0A', bg:'rgba(199,139,10,0.08)', border:'#C78B0A' },
              { label:'✓ Good',  color:'#FFFFFF', bg:'#0CA89E', border:'#0CA89E' },
              { label:'★ Easy',  color:'#16A34A', bg:'rgba(22,163,74,0.08)', border:'#16A34A' },
            ].map(b => (
              <button key={b.label} style={{
                flex:1, padding:'10px 0', borderRadius:8, fontSize:13, fontWeight:700,
                border:`1.5px solid ${b.border}`, background:b.bg, color:b.color, cursor:'pointer',
              }}>{b.label}</button>
            ))}
          </div>
          <div style={{ textAlign:'center', fontSize:11, color:'#97A3B6', marginTop:10 }}>
            Again→1min · Hard→6min · Good→tomorrow · Easy→4 days
          </div>
        </div>
      )}

      {/* My Decks */}
      {activeTab === 1 && (
        <div className="km-grid-3">
          {decks.map(d => (
            <div key={d.title} style={{ background:'#FFFFFF', borderRadius:12, padding:18, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
              <div style={{ fontSize:28, marginBottom:10 }}>{d.icon}</div>
              <div style={{ fontSize:14, fontWeight:700, color:'#0D1B2E', marginBottom:4 }}>{d.title}</div>
              <div style={{ fontSize:12, color:'#5A6882', marginBottom:10 }}>{d.count} cards</div>
              <ProgressBar value={d.progress} color={d.color} />
              <div style={{ marginTop:8, fontSize:12, fontWeight:600, color:d.color }}>{d.due} due today</div>
            </div>
          ))}
          <div style={{
            border:'2px dashed #DDE3ED', borderRadius:12, display:'flex',
            flexDirection:'column', alignItems:'center', justifyContent:'center',
            padding:24, cursor:'pointer', gap:6,
          }}>
            <span style={{ fontSize:28 }}>➕</span>
            <span style={{ fontSize:13, fontWeight:600, color:'#5A6882' }}>Create new deck</span>
          </div>
        </div>
      )}

      {/* AI Generate */}
      {activeTab === 2 && (
        <div style={{ maxWidth:520, margin:'0 auto', background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:15, fontWeight:700, color:'#0D1B2E', marginBottom:16 }}>Generate Flashcard Deck</div>
          <textarea placeholder="Topic or paste lecture notes..." rows={4} style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'10px 12px', fontSize:13, fontFamily:'inherit', resize:'vertical', outline:'none', boxSizing:'border-box' }} />
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <select style={{ flex:1, padding:'8px 10px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13 }}>
              {['10 cards','20 cards','30 cards','50 cards'].map(o=><option key={o}>{o}</option>)}
            </select>
            <select style={{ flex:1, padding:'8px 10px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13 }}>
              {['Mixed','Basic','Intermediate','Exam Level'].map(o=><option key={o}>{o}</option>)}
            </select>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'14px 0' }}>
            {['Include clinical pearls','Include mnemonics','Include image cards'].map(l=>(
              <label key={l} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:'#0D1B2E', cursor:'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor:'#0CA89E' }} /> {l}
              </label>
            ))}
          </div>
          <button style={{ width:'100%', background:'#0B5C8F', color:'white', border:'none', padding:'12px 0', borderRadius:8, fontSize:14, fontWeight:700, cursor:'pointer' }}>
            ⚡ Generate Deck
          </button>
        </div>
      )}

      {/* Analytics */}
      {activeTab === 3 && (
        <div className="km-grid-2">
          <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED' }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Weekly Cards Reviewed</div>
            <div style={{ display:'flex', gap:6, alignItems:'flex-end', height:80 }}>
              {[40,65,50,80,35,90,55].map((h,i)=>(
                <div key={i} style={{ flex:1, background:'#0B5C8F', borderRadius:'4px 4px 0 0', height:`${h}%`, opacity:0.8+i*0.02 }} />
              ))}
            </div>
            <div style={{ display:'flex', gap:6, marginTop:4 }}>
              {['M','T','W','T','F','S','S'].map((d,i)=>(
                <div key={i} style={{ flex:1, textAlign:'center', fontSize:10, color:'#97A3B6' }}>{d}</div>
              ))}
            </div>
          </div>
          <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED' }}>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Mastery by Topic</div>
            {[
              { label:'Pharmacokinetics', val:88, color:'#16A34A' },
              { label:'DDI', val:62, color:'#0CA89E' },
              { label:'Pharmacogenomics', val:38, color:'#DC2626' },
            ].map(t=>(
              <div key={t.label} style={{ marginBottom:12 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                  <span style={{ color:'#0D1B2E', fontWeight:500 }}>{t.label}</span>
                  <span style={{ color:t.color, fontWeight:700 }}>{t.val}%</span>
                </div>
                <ProgressBar value={t.val} color={t.color} />
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}