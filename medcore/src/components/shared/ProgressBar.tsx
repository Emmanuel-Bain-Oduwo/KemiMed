interface ProgressBarProps {
  value: number
  color?: string
}

export default function ProgressBar({ value, color }: ProgressBarProps) {
  const autoColor = color ?? (value >= 75 ? '#16A34A' : value >= 40 ? '#C78B0A' : '#DC2626')

  return (
    <div style={{ background: '#DDE3ED', borderRadius: 999, height: 8, overflow: 'hidden' }}>
      <div style={{
        height: '100%',
        width: `${Math.min(100, Math.max(0, value))}%`,
        background: autoColor,
        borderRadius: 999,
        transition: 'width 0.4s ease',
      }} />
    </div>
  )
}