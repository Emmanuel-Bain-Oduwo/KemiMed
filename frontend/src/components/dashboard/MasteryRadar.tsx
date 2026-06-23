'use client'
import '@/lib/chartSetup'
import { Radar } from 'react-chartjs-2'

const data = {
  labels: ['DDI', 'PK', 'PD', 'PGx', 'Antimicrobials', 'Cardio'],
  datasets: [{
    label: 'Mastery',
    data: [42, 88, 76, 55, 61, 70],
    backgroundColor: 'rgba(12,168,158,0.15)',
    borderColor: '#0CA89E',
    borderWidth: 2,
    pointBackgroundColor: '#0CA89E',
    pointRadius: 4,
  }],
}

const options = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    r: {
      min: 0, max: 100,
      ticks: { display: false },
      grid: { color: 'rgba(0,0,0,0.06)' },
      pointLabels: { font: { size: 11 }, color: '#5A6882' },
    },
  },
}

export default function MasteryRadar() {
  return (
    <div style={{ background:'#FFFFFF', borderRadius:12, padding:20, boxShadow:'0 2px 12px rgba(11,92,143,0.08)', border:'1px solid #DDE3ED' }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#0D1B2E', marginBottom:14 }}>
        Topic Mastery
      </div>
      <Radar data={data} options={options} />
    </div>
  )
}