type BadgeVariant = 'teal' | 'blue' | 'purple' | 'gold' | 'rose' | 'green'

interface MedBadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  teal:   { background: 'rgba(12,168,158,0.15)',  color: '#0CA89E' },
  blue:   { background: 'rgba(11,92,143,0.12)',   color: '#0B5C8F' },
  purple: { background: 'rgba(124,58,237,0.15)',  color: '#7C3AED' },
  gold:   { background: 'rgba(199,139,10,0.15)',  color: '#C78B0A' },
  rose:   { background: 'rgba(220,38,38,0.12)',   color: '#DC2626' },
  green:  { background: 'rgba(22,163,74,0.12)',   color: '#16A34A' },
}

export default function MedBadge({ children, variant = 'blue' }: MedBadgeProps) {
  return (
    <span style={{
      ...variantStyles[variant],
      fontFamily: 'var(--font-ibm-mono),monospace',
      fontSize: 10,
      fontWeight: 700,
      padding: '3px 9px',
      borderRadius: 999,
      display: 'inline-block',
      letterSpacing: '0.3px',
    }}>
      {children}
    </span>
  )
}