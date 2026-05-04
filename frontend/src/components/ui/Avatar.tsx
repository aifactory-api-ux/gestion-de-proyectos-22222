import React from 'react'
import { User } from '../../types/models'

interface AvatarProps {
  user: User
}

export function Avatar({ user }: AvatarProps) {
  const initials = user.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#2563eb',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
    }}>
      {initials}
    </div>
  )
}