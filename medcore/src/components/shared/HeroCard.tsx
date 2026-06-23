interface HeroCardProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function HeroCard({ children, style }: HeroCardProps) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0B5C8F 0%, #0B7A8A 50%, #0CA89E 100%)',
      borderRadius: 12,
      padding: '32px',
      color: 'white',
      overflow: 'hidden',
      position: 'relative',
      ...style,
    }}>
      {/* Decorative circles */}
      <div style={{
        position: 'absolute', top: -40, right: -40,
        width: 200, height: 200, borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
      }} />
      <div style={{
        position: 'absolute', bottom: -60, right: 80,
        width: 160, height: 160, borderRadius: '50%',
        background: 'rgba(255,255,255,0.04)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  )
}