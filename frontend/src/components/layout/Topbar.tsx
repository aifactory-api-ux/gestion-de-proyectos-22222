import React from 'react'
import { User } from '../../types/models'
import { Avatar } from '../ui/Avatar'
import { Button } from '../ui/Button'

interface TopbarProps {
  user: User
  onLogout: () => void
  onSearch: (query: string) => void
}

export function Topbar({ user, onLogout, onSearch }: TopbarProps) {
  return (
    <div style={{
      height: '64px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'fixed',
      top: 0,
      left: '240px',
      right: 0,
      zIndex: 100,
    }}>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        style={{
          padding: '8px 16px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          width: '300px',
          fontSize: '14px',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{ fontSize: '14px', color: '#64748b' }}>{user.full_name}</span>
        <Avatar user={user} />
        <Button variant="secondary" onClick={onLogout}>Logout</Button>
      </div>
    </div>
  )
}