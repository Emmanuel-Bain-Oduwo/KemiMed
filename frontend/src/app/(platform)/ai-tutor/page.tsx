'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const sel = (label: string, opts: string[]) => (
  <select style={{
    padding: '6px 10px', border: '1px solid #DDE3ED', borderRadius: 8,
    fontSize: 12, color: '#0D1B2E', background: '#FFFFFF', cursor: 'pointer',
  }}>
    {opts.map(o => <option key={o}>{o}</option>)}
  </select>
)

const messages = [
  { role: 'ai', text: 'Welcome. I am KemiMed — your KemiMed tutor and examiner. I do not just teach; I evaluate your understanding at exam level. Tell me what you want to master, and I will guide you from basics through to clinical application. What topic shall we tackle today?' },
  { role: 'user', text: 'Teach me drug-drug interactions in anaesthesia. Finals in 3 weeks.' },
  { role: 'ai', text: `**Drug Interactions in Anaesthesia — Stage 1: Core Mechanisms**

**1. Pharmacokinetic Interactions**
• CYP450 inhibition/induction altering drug metabolism
• Protein binding displacement
• Altered hepatic blood flow changing first-pass clearance

**2. Pharmacodynamic Interactions**
• Additive: Two opioids → additive CNS depression
• Synergistic: Propofol + fentanyl → profound hypnosis (give ↓ doses)
• Antagonistic: Neostigmine reverses NDMR-induced paralysis

💎 **Clinical Pearl:** The propofol–fentanyl combination is synergistic. Reduce propofol induction dose by 30% when used with fentanyl premedication.

---
**Evaluation question:** A 55-year-old receives midazolam 2mg IV premedication. 20 minutes later, propofol induction is given. Which pharmacodynamic interaction explains why the propofol dose should be reduced?` },
]

const chips = ['🎯 Evaluate me now', '🏥 Clinical case', '❓ Make MCQs', '🕸️ Mind map this', '📝 Exam angle', '→ Stage 2']

export default function AiTutorPage() {
  const [input, setInput] = useState('')

  return (
    <motion.div {...pageAnim} style={{ padding: '20px 28px', maxWidth: 900, margin: '0 auto' }}>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {sel('Mode', ['Pharmacy Mode', 'Medicine Mode', 'Nursing Mode', 'MLS Mode', 'Exam Mode'])}
          {sel('Style', ['📚 Teach me', '❓ Evaluate me deeply', '🏥 Clinical case', '🎯 Exam drill'])}
        </div>
        <button style={{
          background: '#0CA89E', color: 'white', border: 'none',
          padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          🔊 Voice On
        </button>
      </div>

      {/* Hero + chat card */}
      <div style={{
        background: 'linear-gradient(135deg,#0B5C8F,#0B7A8A,#0CA89E)',
        borderRadius: '12px 12px 0 0', padding: '20px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0,
          }}>🧑‍🏫</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>Dr. KemiMed — Your KemiMed Tutor</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
              Deep evaluation mode · Teaches & examines like a real lecturer
            </div>
          </div>
          <span style={{ background:'rgba(12,168,158,0.3)', color:'#fff', padding:'3px 10px', borderRadius:999, fontSize:11, fontWeight:700 }}>LIVE</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        background: '#FFFFFF', borderRadius: '0 0 12px 12px',
        border: '1px solid #DDE3ED', borderTop: 'none',
        boxShadow: '0 2px 12px rgba(11,92,143,0.08)',
      }}>
        <div style={{ maxHeight: 420, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: m.role === 'ai' ? 'linear-gradient(135deg,#0B5C8F,#0CA89E)' : 'linear-gradient(135deg,#7C3AED,#a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>
                {m.role === 'ai' ? '🧑‍🏫' : 'E'}
              </div>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: 12, fontSize: 13, lineHeight: 1.65,
                background: m.role === 'ai' ? '#FFFFFF' : '#0B5C8F',
                border: m.role === 'ai' ? '1px solid #DDE3ED' : 'none',
                color: m.role === 'ai' ? '#0D1B2E' : '#FFFFFF',
                whiteSpace: 'pre-wrap',
              }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ borderTop: '1px solid #DDE3ED', padding: 16, display: 'flex', gap: 8 }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={2}
            placeholder="Ask KemiMed anything..."
            style={{
              flex: 1, resize: 'none', border: '1px solid #DDE3ED', borderRadius: 8,
              padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none',
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button style={{ background:'#0B5C8F', color:'#fff', border:'none', padding:'8px 16px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>Send</button>
            <button style={{ background:'transparent', color:'#5A6882', border:'1px solid #DDE3ED', padding:'8px 12px', borderRadius:8, fontSize:12, cursor:'pointer' }}>🎙️</button>
          </div>
        </div>

        {/* Chips */}
        <div style={{ padding: '0 16px 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {chips.map(c => (
            <button key={c} style={{
              background:'#EEF2F7', border:'1px solid #DDE3ED', color:'#0D1B2E',
              padding:'5px 12px', borderRadius:999, fontSize:12, cursor:'pointer', fontWeight:500,
            }}>{c}</button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}