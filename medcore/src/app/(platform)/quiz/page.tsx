'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }
const tabs = ['Active Quiz', 'Generate', 'History']

const options = [
  { letter:'A', text:'Fluconazole induces CYP2C9, increasing warfarin clearance', correct:false },
  { letter:'B', text:'Fluconazole inhibits CYP2C9, reducing warfarin clearance', correct:true },
  { letter:'C', text:'Fluconazole displaces warfarin from plasma protein binding sites', correct:false },
  { letter:'D', text:'Fluconazole reduces vitamin K production by gut flora', correct:false },
  { letter:'E', text:'Fluconazole directly activates VKORC1 enzyme', correct:false },
]

export default function QuizPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [selected, setSelected] = useState<number|null>(null)

  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:820, margin:'0 auto' }}>

      <div style={{ display:'flex', gap:4, background:'#FFFFFF', borderRadius:10, padding:4, border:'1px solid #DDE3ED', marginBottom:20, width:'fit-content' }}>
        {tabs.map((t,i) => (
          <button key={t} onClick={() => setActiveTab(i)} style={{
            padding:'7px 18px', borderRadius:7, border:'none', cursor:'pointer', fontSize:13, fontWeight:600,
            background: activeTab===i ? '#0B5C8F' : 'transparent',
            color: activeTab===i ? 'white' : '#5A6882',
          }}>{t}</button>
        ))}
      </div>

      {activeTab === 0 && (
        <div>
          {/* Progress header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
            <span style={{ background:'rgba(11,92,143,0.1)', color:'#0B5C8F', padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:600 }}>
              Clinical Pharmacology · MCQ · Exam Level
            </span>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <span style={{ fontSize:13, fontWeight:700, color:'#0D1B2E' }}>Q 3 / 20</span>
              <span style={{ background:'rgba(220,38,38,0.1)', color:'#DC2626', padding:'4px 12px', borderRadius:999, fontSize:12, fontWeight:700 }}>⏱ 14:32</span>
            </div>
          </div>
          <div style={{ height:8, background:'#DDE3ED', borderRadius:999, marginBottom:20, overflow:'hidden' }}>
            <div style={{ height:'100%', width:'15%', background:'linear-gradient(90deg,#0B5C8F,#0CA89E)', borderRadius:999 }} />
          </div>

          {/* Question */}
          <div style={{ background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)', marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#5A6882', letterSpacing:'1px', marginBottom:10, fontFamily:'var(--font-ibm-mono),monospace' }}>
              SINGLE BEST ANSWER
            </div>
            <div style={{ fontSize:15, fontWeight:600, color:'#0D1B2E', lineHeight:1.6 }}>
              A 68-year-old man with AF on warfarin 5mg/day (INR 2.4) is started on fluconazole for oral candidiasis. Five days later his INR is 6.8 with gum bleeding. What is the PRIMARY pharmacokinetic mechanism?
            </div>
          </div>

          {/* Options */}
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
            {options.map((o,i) => {
              const isSelected = selected === i
              const showResult = selected !== null
              const isCorrect = o.correct
              let bg = '#FFFFFF', border = '#DDE3ED', color = '#0D1B2E'
              if (showResult && isCorrect) { bg='rgba(22,163,74,0.08)'; border='#16A34A'; color='#16A34A' }
              else if (showResult && isSelected && !isCorrect) { bg='rgba(220,38,38,0.08)'; border='#DC2626'; color='#DC2626' }

              return (
                <button key={o.letter} onClick={() => selected===null && setSelected(i)} style={{
                  display:'flex', alignItems:'center', gap:12, width:'100%', textAlign:'left',
                  padding:'12px 16px', borderRadius:10, border:`1.5px solid ${border}`,
                  background:bg, cursor:selected===null?'pointer':'default', transition:'all 0.2s',
                }}>
                  <div style={{
                    width:28, height:28, borderRadius:'50%', flexShrink:0,
                    background: showResult&&isCorrect ? '#16A34A' : showResult&&isSelected ? '#DC2626' : '#EEF2F7',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:12, fontWeight:700, color: (showResult&&(isCorrect||isSelected)) ? 'white' : '#5A6882',
                  }}>{o.letter}</div>
                  <span style={{ fontSize:13, fontWeight:500, color }}>{o.text}</span>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {selected !== null && (
              <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} style={{
                background:'rgba(22,163,74,0.06)', border:'1.5px solid #16A34A',
                borderRadius:10, padding:16, marginBottom:16,
              }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#16A34A', marginBottom:8 }}>✓ Correct — B</div>
                <div style={{ fontSize:13, color:'#0D1B2E', lineHeight:1.65 }}>
                  Fluconazole is a potent inhibitor of CYP2C9, the principal enzyme responsible for metabolising the S-enantiomer of warfarin (which has 3–5× greater anticoagulant potency than the R-enantiomer). Inhibition reduces warfarin clearance, causing accumulation and supratherapeutic anticoagulation.<br /><br />
                  <strong>Management:</strong> Withhold warfarin, give vitamin K 5–10mg IV (or oral), and consider prothrombin complex concentrate if bleeding is severe. Recheck INR in 12–24h.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <button style={{ padding:'10px 20px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13, cursor:'pointer', background:'#FFFFFF', color:'#0D1B2E' }}>← Previous</button>
            <button style={{ padding:'10px 20px', background:'#0B5C8F', color:'white', border:'none', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Next Question →</button>
          </div>
        </div>
      )}

      {activeTab === 1 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED' }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Generate New Quiz</div>
            <input placeholder="Topic..." style={{ width:'100%', border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 12px', fontSize:13, marginBottom:10, boxSizing:'border-box', outline:'none' }} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
              <select style={{ padding:'8px 10px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13 }}>
                {['10 Qs','20 Qs','30 Qs'].map(o=><option key={o}>{o}</option>)}
              </select>
              <select style={{ padding:'8px 10px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13 }}>
                {['MCQ','SAQ','OSCE','Mixed'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <button style={{ width:'100%', background:'#0B5C8F', color:'white', border:'none', padding:'11px 0', borderRadius:8, fontWeight:600, cursor:'pointer' }}>⚡ Generate Quiz</button>
          </div>
          <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED' }}>
            <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Recent Quizzes</div>
            {['Clinical Pharmacology · 80% · 20 Qs','Pharmacokinetics · 65% · 15 Qs','Drug Interactions · 55% · 25 Qs'].map(q=>(
              <div key={q} style={{ padding:'10px 0', borderBottom:'1px solid #EEF2F7', fontSize:12, color:'#0D1B2E' }}>{q}</div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED', textAlign:'center', color:'#5A6882' }}>
          No quiz history yet. Take your first quiz!
        </div>
      )}
    </motion.div>
  )
}