'use client'

const heatData = [
  [0,1,2,3,1,0],
  [2,3,4,2,3,1],
  [1,2,3,4,2,3],
  [3,4,3,2,1,2],
  [2,1,3,4,3,0],
]

const cellColors = ['#EEF2F7','#BAD3E8','#7BADC7','#3A7CA5','#0B5C8F']

export default function StudyHeatmap() {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat']

  return (
    <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, boxShadow:'0 2px 12px rgba(11,92,143,0.08)', border:'1px solid #DDE3ED' }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#0D1B2E', marginBottom:14 }}>
        Study Activity — June 2026
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        {heatData.map((row, ri) => (
          <div key={ri} style={{ display:'flex', gap:4 }}>
            {row.map((val, ci) => (
              <div key={ci} title={`${val * 30} min`} style={{
                width:32, height:32, borderRadius:6,
                background: cellColors[val],
                cursor:'pointer',
                transition:'transform 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget.style.transform='scale(1.15)')}
                onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}
              />
            ))}
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:4, marginTop:12, alignItems:'center' }}>
        <span style={{ fontSize:10, color:'#97A3B6' }}>Less</span>
        {cellColors.map((c,i) => (
          <div key={i} style={{ width:14, height:14, borderRadius:3, background:c, border:'1px solid #DDE3ED' }} />
        ))}
        <span style={{ fontSize:10, color:'#97A3B6' }}>More</span>
        <div style={{ marginLeft:'auto', fontSize:10, color:'#5A6882' }}>
          {days.join(' · ')}
        </div>
      </div>
    </div>
  )
}