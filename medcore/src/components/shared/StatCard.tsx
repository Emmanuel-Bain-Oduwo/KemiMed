interface StatCardProps {
  value: string
  label: string
  trend?: string
  trendUp?: boolean
}

export default function StatCard({ value, label, trend, trendUp }: StatCardProps) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 12,
      boxShadow: '0 2px 12px rgba(11,92,143,0.08)',
      border: '1px solid #DDE3ED',
      padding: '18px 20px',
    }}>
      <div style={{
        fontFamily: 'var(--font-fraunces),serif',
        fontSize: 36,
        fontWeight: 900,
        color: '#0B5C8F',
        lineHeight: 1,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: '#5A6882', marginTop: 4 }}>
        {label}
      </div>
      {trend && (
        <div style={{
          fontSize: 10,
          fontWeight: 600,
          marginTop: 6,
          color: trendUp ? '#16A34A' : '#DC2626',
        }}>
          {trend}
        </div>
      )}
    </div>
  )
}