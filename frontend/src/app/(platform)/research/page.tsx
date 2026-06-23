'use client'
import { motion } from 'framer-motion'
import MedBadge from '@/components/shared/MedBadge'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const articles = [
  {
    journal:'PLOS ONE · 2024 · PMID: 38234871',
    title:'CYP2C9 and VKORC1 genetic variants predict warfarin dose requirements in East African patients',
    authors:'Kamau M, Oduwo E, Hassan AB, et al. (2024)',
    badges:[['RCT','blue'],['n=847','teal'],['Open Access','green']] as const,
    meta:'IF: 3.7 · 42 citations',
    actions:[['📄 Full text','#0B5C8F'],['✨ KemiMed Summary','#0CA89E'],['🃏 Flashcards','#7C3AED']],
  },
  {
    journal:'NEJM · 2023',
    title:'Direct oral anticoagulants versus warfarin in patients with AF and chronic kidney disease',
    authors:'Robertson K, Chen L, et al. (2023)',
    badges:[['RCT','blue'],['n=2,400','teal']] as const,
    meta:'IF: 96.2 · 187 citations',
    actions:[['📄 Abstract','#0B5C8F'],['✨ KemiMed Summary','#0CA89E']],
  },
  {
    journal:'WHO · 2023 · Guideline',
    title:'WHO guidelines on anticoagulation therapy in resource-limited settings',
    authors:'World Health Organization (2023)',
    badges:[['Guideline','gold'],['Open Access','green']] as const,
    meta:'WHO technical report',
    actions:[['📥 Download','#0B5C8F'],['✨ KemiMed Summary','#0CA89E']],
  },
]

export default function ResearchPage() {
  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:900, margin:'0 auto' }}>

      <div style={{ background:'#FFFFFF', borderRadius:12, padding:24, border:'1px solid #DDE3ED', marginBottom:20 }}>
        <div style={{ fontSize:20, fontFamily:'var(--font-fraunces),serif', fontWeight:700, color:'#0D1B2E', marginBottom:14 }}>
          Do your research.
        </div>
        <div style={{ display:'flex', gap:8, marginBottom:12 }}>
          <input placeholder="Search PubMed, WHO, Cochrane, FDA..." style={{ flex:1, border:'1px solid #DDE3ED', borderRadius:8, padding:'10px 14px', fontSize:13, outline:'none' }} />
          <select style={{ padding:'8px 12px', border:'1px solid #DDE3ED', borderRadius:8, fontSize:13 }}>
            {['All sources','PubMed','WHO','Cochrane','FDA','PharmGKB'].map(o=><option key={o}>{o}</option>)}
          </select>
          <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'10px 20px', borderRadius:8, fontWeight:600, cursor:'pointer' }}>Search</button>
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['Meta-analysis only','Last 5 years','African populations','Open access only'].map(f=>(
            <button key={f} style={{ padding:'5px 12px', border:'1px solid #DDE3ED', borderRadius:999, fontSize:12, cursor:'pointer', background:'#EEF2F7' }}>{f}</button>
          ))}
        </div>
      </div>

      <div style={{ fontSize:13, color:'#5A6882', marginBottom:12 }}>12 results · Ranked by relevance</div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {articles.map((a) => (
          <div key={a.title} style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
            <div style={{ fontSize:11, color:'#5A6882', marginBottom:6, fontFamily:'var(--font-ibm-mono),monospace' }}>{a.journal}</div>
            <div style={{ fontSize:14, fontWeight:700, color:'#0D1B2E', marginBottom:6, lineHeight:1.5 }}>{a.title}</div>
            <div style={{ fontSize:12, color:'#5A6882', marginBottom:10 }}>{a.authors}</div>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center', marginBottom:12 }}>
              {a.badges.map(([b, v]) => <MedBadge key={b} variant={v}>{b}</MedBadge>)}
              <span style={{ fontSize:11, color:'#97A3B6', marginLeft:4 }}>{a.meta}</span>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {a.actions.map(([label, color]) => (
                <button key={label} style={{
                  background:`${color}15`, color, border:`1px solid ${color}40`,
                  padding:'6px 14px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer',
                }}>{label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}