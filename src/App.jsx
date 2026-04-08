import { useState, useEffect } from 'react'

// ── Import your artifacts here ──
// Each artifact should be a .jsx file in src/apps/ with a default export
import Ecosystem from './apps/Ecosystem.jsx'
import AdeptIQ from './apps/AdeptIQ.jsx'
// import NewApp from './apps/NewApp.jsx'  ← add new artifacts here

const APPS = [
  { id: 'ecosystem', name: 'Ecosystem Map', icon: '🗺️', desc: 'Application architecture, layers, domains, infrastructure, and product notes', component: Ecosystem },
  { id: 'adeptiq', name: 'AdeptIQ Prototype', icon: '🎓', desc: 'Interactive onboarding — Technical Operations Lead', component: AdeptIQ },
  // { id: 'newapp', name: 'New App', icon: '✨', desc: 'Description', component: NewApp },
]

/**
 * CastleAgentIQ intranet shell and app launcher.
 */
export default function App() {
  const [active, setActive] = useState(null)

  // Hash-based routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1)
      if (hash && APPS.find(a => a.id === hash)) {
        setActive(hash)
      } else {
        setActive(null)
      }
    }
    handleHash()
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  const navigate = (id) => {
    window.location.hash = id || ''
    setActive(id)
  }

  const ActiveComponent = active ? APPS.find(a => a.id === active)?.component : null

  // ── If an app is active, render it full-screen ──
  if (ActiveComponent) {
    const activeApp = APPS.find(a => a.id === active)
    return (
      <div style={{ minHeight: '100vh', background: '#0a0f1e' }}>
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            backdropFilter: 'blur(10px)',
            background: 'rgba(10,15,30,0.88)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '10px 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
          }}
        >
          <button
            onClick={() => navigate(null)}
            style={{
              padding: '8px 14px',
              borderRadius: 10,
              background: 'rgba(15,23,41,0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            ← Back to Intranet
          </button>
          <div style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>
            {activeApp?.name}
          </div>
        </div>
        <ActiveComponent />
      </div>
    )
  }

  // ── Dashboard / Home ──
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      <div style={{ maxWidth: 980, margin: '0 auto', padding: '56px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', color: '#2e75b6', marginBottom: 6 }}>
            CASTLE HORIZON GROUP
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', marginBottom: 8 }}>
            CastleAgentIQ Intranet
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.6 }}>
            Prototypes, tools, and reference applications. Click any card to launch.
          </p>
        </div>

        {/* App cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {APPS.map(app => (
            <button key={app.id} onClick={() => navigate(app.id)}
              aria-label={`Open ${app.name}`}
              style={{ textAlign: 'left', width: '100%', padding: '24px 28px', borderRadius: 16, cursor: 'pointer',
                background: 'rgba(255,255,255,0.02)',
                border: '1.5px solid rgba(255,255,255,0.06)',
                transition: 'all 0.2s ease', appearance: 'none' }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(46,117,182,0.4)'
                e.currentTarget.style.background = 'rgba(46,117,182,0.05)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = 'rgba(46,117,182,0.5)'
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(46,117,182,0.2)'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.boxShadow = 'none'
              }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{app.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{app.name}</div>
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5 }}>{app.desc}</div>
              <div style={{ marginTop: 14, fontSize: 12, color: '#2e75b6', fontWeight: 600 }}>
                Launch →
              </div>
            </button>
          ))}

          {/* Placeholder for future apps */}
          <div style={{ padding: '24px 28px', borderRadius: 16,
            background: 'rgba(255,255,255,0.01)',
            border: '1.5px dashed rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 160 }}>
            <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.3 }}>+</div>
            <div style={{ fontSize: 13, color: '#475569', textAlign: 'center' }}>
              New artifacts are added by dropping<br />a .jsx file in src/apps/ and<br />registering it in App.jsx
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: 12, color: '#475569' }}>
          CastleAgentIQ Intranet • Hosted on Cloudflare Pages • Protected by Cloudflare Access
        </div>
      </div>
    </div>
  )
}
