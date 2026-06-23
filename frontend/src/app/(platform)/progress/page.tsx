'use client'
import '@/lib/chartSetup'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import StatCard from '@/components/shared/StatCard'
import ProgressBar from '@/components/shared/ProgressBar'
import MedBadge from '@/components/shared/MedBadge'

const pageAnim = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } }

const lineData = {
  labels:['Week 1','Week 2','Week 3','Week 4','This week'],
  datasets:[
    { label:'Hours studied', data:[3.5,4.2,3.8,5.1,2.4], borderColor:'#0B5C8F', backgroundColor:'rgba(11,92,143,0.08)', tension:0.4, fill:true },
    { label:'Target', data:[5,5,5,5,5], borderColor:'#0CA89E', borderDash:[5,5], tension:0, fill:false },
  ],
}

const lineOpts = {
  responsive:true,
  plugins:{ legend:{ position:'top' as const } },
  scales:{ y:{ title:{ display:true, text:'Hours' } } },
}

const gaps = [
  { label:'⚠️ CYP Metabolism',   val:38, color:'#DC2626', badge:'Critical'  as const },
  { label:'DDI Anaesthetics',     val:62, color:'#C78B0A', badge:'Improving' as const },
  { label:'Pharmacokinetics',     val:88, color:'#16A34A', badge:'Strong'    as const },
  { label:'Pharmacogenomics',     val:55, color:'#C78B0A', badge:'Growing'   as const },
]

const reminders = [
  { bg:'rgba(220,38,38,0.06)', border:'#DC2626', text:'14 cards overdue — DDI last reviewed 5 days ago', btn:'Review', btnColor:'#DC2626' },
  { bg:'rgba(199,139,10,0.06)', border:'#C78B0A', text:'Exam in 23 days — at 74%, target 90%', btn:'Plan', btnColor:'#C78B0A' },
  { bg:'rgba(22,163,74,0.06)',  border:'#16A34A', text:'23-day streak! Keep going 🔥', btn:'Continue', btnColor:'#16A34A' },
]

const badgeMap: Record<string,string> = { Critical:'rose', Improving:'gold', Strong:'green', Growing:'gold' }

export default function ProgressPage() {
  return (
    <motion.div {...pageAnim} style={{ padding:'20px 28px', maxWidth:1100, margin:'0 auto' }}>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 }}>
        <StatCard value="847"  label="Cards mastered"  trend="↑ 42 this week"  trendUp />
        <StatCard value="74%"  label="Overall mastery" trend="↑ 8% this month" trendUp />
        <StatCard value="23 🔥" label="Day streak"      trend="Personal best!"  trendUp />
        <StatCard value="18h"  label="Study time"      trend="↓ 2h below goal" trendUp={false} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:20 }}>
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Weekly Study Hours</div>
          <Line data={lineData} options={lineOpts} />
        </div>
        <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Knowledge Gap Map</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {gaps.map(g => (
              <div key={g.label}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                  <span style={{ fontSize:13, fontWeight:500, color:'#0D1B2E' }}>{g.label}</span>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <span style={{ fontSize:12, fontWeight:700, color:g.color }}>{g.val}%</span>
                    <MedBadge variant={badgeMap[g.badge] as 'rose'|'gold'|'green'}>{g.badge}</MedBadge>
                  </div>
                </div>
                <ProgressBar value={g.val} color={g.color} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, border:'1px solid #DDE3ED', boxShadow:'0 2px 12px rgba(11,92,143,0.08)' }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>Smart Reminders</div>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {reminders.map(r => (
              <div key={r.text} style={{ background:r.bg, border:`1px solid ${r.border}30`, borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ flex:1, fontSize:13, color:'#0D1B2E' }}>{r.text}</span>
                <button style={{ background:r.btnColor, color:'white', border:'none', padding:'6px 14px', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer' }}>{r.btn}</button>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, marginBottom:12 }}>Set Reminder</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <select style={{ border:'1px solid #DDE3ED', borderRadius:8, padding:'7px 10px', fontSize:12 }}>
                {['Review reminder','Exam alert','Daily goal'].map(o=><option key={o}>{o}</option>)}
              </select>
              <input type="time" style={{ border:'1px solid #DDE3ED', borderRadius:8, padding:'7px 10px', fontSize:12 }} />
              <select style={{ border:'1px solid #DDE3ED', borderRadius:8, padding:'7px 10px', fontSize:12 }}>
                {['App notification','Email','SMS'].map(o=><option key={o}>{o}</option>)}
              </select>
              <button style={{ background:'#0B5C8F', color:'white', border:'none', padding:'9px 0', borderRadius:8, fontWeight:600, cursor:'pointer' }}>Set Reminder</button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}