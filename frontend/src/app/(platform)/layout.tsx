'use client'
import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#EEF2F7' }}>
      {sidebarOpen && (
        <div className="km-mob-overlay" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minWidth: 0 }}>
        <Topbar onMenuToggle={() => setSidebarOpen(v => !v)} />
        <main style={{ flex: 1, overflowY: 'auto', background: '#EEF2F7' }}>
          {children}
        </main>
      </div>
    </div>
  )
}