'use client'
import '@/lib/chartSetup'
import { motion } from 'framer-motion'
import { Line, Bar } from 'react-chartjs-2'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const lineData = {
  labels: ['0h','2h','4h','6h','8h','12h','16h','20h','24h'],
  datasets: [
    { label:'Drug A', data:[0,8.2,12.4,11.1,9.3,6.8,4.2,2.1,0.8], borderColor:'#0B5C8F', backgroundColor:'rgba(11,92,143,0.08)', tension:0.4, fill:true },
    { label:'Drug B', data:[0,5.1,9.8,14.2,13.1,10.4,7.6,4.8,2.2], borderColor:'#C78B0A', backgroundColor:'rgba(199,139,10,0.08)', tension:0.4, fill:true },
  ],
}

const lineOpts = {
  responsive:true,
  plugins:{ legend:{ position:'top' as const } },
  scales:{ y:{ title:{ display:true, text:'Plasma Conc. (mg/L)' } }, x:{ title:{ display:true, text:'Time (hours)' } } },
}

const barData = {
  labels:['GI','Cardio','Neuro','Hepatic','Renal','Haem'],
  datasets:[{
    label:'Adverse Events (%)',
    data:[24,18,12,8,6,14],
    backgroundColor:['#0B5C8F','#0CA89E','#7C3AED','#C78B0A','#16A34A','#DC2626'],
  }],
}

const barOpts = {
  indexAxis:'y' as const,
  responsive:true,
  plugins:{ legend:{ display:false } },
  scales:{ x:{ max:30, title:{ display:true, text:'Incidence (%)' } } },
}

export default function GraphsPage() {
  return (
    <motion.div {...pageAnim} className="km-page" style={{ maxWidth:1100, margin:'0 auto' }}>

      <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', marginBottom:20 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
          <input placeholder="Describe the chart you want..." style={{ flex:1, border:'1px solid #DDE3ED', borderRadius:8, padding:'8px 12px', fontSize:13, outline:'none', minWidth:200 }} />
          {['Line','Bar','Radar','Scatter','Pie'].map(t=>(
            <button key={t} style={{ padding:'6px 12px', border:'1px solid #DDE3ED', borderRadius:999, fontSize:12, cursor:'pointer', background:'#EEF2F7' }}>{t}</button>
          ))}
          <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer' }}>Generate</button>
        </div>
      </div>

      <div className="km-grid-2">
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>Plasma Concentration vs Time</div>
          <Line data={lineData} options={lineOpts} />
          <div style={{ background:'rgba(22,163,74,0.06)', border:'1px solid #16A34A', borderRadius:8, padding:12, marginTop:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#16A34A', marginBottom:4 }}>AI Analysis</div>
            <div style={{ fontSize:12, color:'#0D1B2E', lineHeight:1.6 }}>
              Drug B shows a delayed Tmax (8h vs 4h for Drug A) suggesting slower absorption, potentially due to extended-release formulation. Drug A's higher initial peak may increase adverse effect risk. Monitor patients closely in first 4 hours.
            </div>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:12 }}>
            <button style={{ padding:'6px 14px', border:'1px solid #DDE3ED', borderRadius:7, fontSize:12, cursor:'pointer' }}>PNG</button>
            <button style={{ padding:'6px 14px', border:'1px solid #DDE3ED', borderRadius:7, fontSize:12, cursor:'pointer' }}>SVG</button>
          </div>
        </div>

        <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:14 }}>Adverse Events by System</div>
          <Bar data={barData} options={barOpts} />
          <button style={{ padding:'6px 14px', border:'1px solid #DDE3ED', borderRadius:7, fontSize:12, cursor:'pointer', marginTop:14 }}>Export PNG</button>
        </div>
      </div>

      {/* AI Image Analysis */}
      <div className="km-grid-2" style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', marginTop:20 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>AI Image Analysis</div>
          <div style={{
            border:'2px dashed #DDE3ED', borderRadius:10, padding:32, textAlign:'center',
            cursor:'pointer', color:'#97A3B6',
          }}>
            <div style={{ fontSize:32, marginBottom:8 }}>🖼️</div>
            <div style={{ fontSize:13 }}>Drop an ECG, X-ray, or graph here</div>
            <div style={{ fontSize:11, marginTop:4 }}>PNG · JPG · PDF accepted</div>
          </div>
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Analysis Result</div>
          <div style={{ background:'#EEF2F7', borderRadius:8, padding:14, fontSize:12, lineHeight:1.7, color:'#0D1B2E' }}>
            <strong>Findings:</strong> Graph shows a biphasic elimination curve consistent with a two-compartment pharmacokinetic model.<br /><br />
            <strong>Key parameters:</strong> Distribution half-life ≈ 1.2h · Elimination half-life ≈ 8.4h · Apparent Vd ≈ 42 L/kg<br /><br />
            <strong>Clinical implication:</strong> Extended dosing interval recommended. Consider TDM for narrow therapeutic index drugs.
          </div>
        </div>
      </div>
    </motion.div>
  )
}