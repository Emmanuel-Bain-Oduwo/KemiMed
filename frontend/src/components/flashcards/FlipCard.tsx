'use client'
import { useState } from 'react'

export function FlipCard({ front, back }: { front: string; back: string }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      style={{ perspective: '1000px', cursor: 'pointer', height: '220px' }}
    >
      <div style={{
        position: 'relative', width: '100%', height: '100%',
        transition: 'transform 0.5s',
        transformStyle: 'preserve-3d',
        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }}>
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #0B5C8F, #0B7A8A)',
          borderRadius: 14, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '24px', textAlign: 'center', color: 'white',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', opacity: 0.6, marginBottom: 12, fontFamily: 'var(--font-ibm-mono),monospace' }}>
            CLINICAL QUESTION
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.45 }}>{front}</div>
          <div style={{ fontSize: 11, opacity: 0.55, marginTop: 18 }}>Tap to reveal ↓</div>
        </div>
        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #0CA89E, #059669)',
          borderRadius: 14, display: 'flex', flexDirection: 'column',
          alignItems: 'flex-start', justifyContent: 'center',
          padding: '24px', textAlign: 'left', color: 'white',
          transform: 'rotateY(180deg)',
        }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '1px', opacity: 0.6, marginBottom: 10, fontFamily: 'var(--font-ibm-mono),monospace' }}>
            ANSWER + CLINICAL PEARL
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.65 }}>{back}</div>
        </div>
      </div>
    </div>
  )
}