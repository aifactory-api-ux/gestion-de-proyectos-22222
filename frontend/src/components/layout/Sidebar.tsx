import React from 'react'

interface SidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
  ]

  return (
    <div style={{
      width: '240px',
      height: '100vh',
      backgroundColor: '#1e293b',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid #334155' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700 }}>GP 22222</h1>
      </div>
      <nav style={{ flex: 1, padding: '16px' }}>
        {menuItems.map(item => (
          <div
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: currentPage === item.id ? '#2563eb' : 'transparent',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'background-color 0.2s',
            }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  )
}