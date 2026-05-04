import React from 'react'

interface ChatFloatingButtonProps {
  onClick: () => void
  unreadCount: number
}

export function ChatFloatingButton({ onClick, unreadCount }: ChatFloatingButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        backgroundColor: '#2563eb',
        color: '#fff',
        border: 'none',
        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
        cursor: 'pointer',
        fontSize: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
      }}
    >
      💬
      {unreadCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-4px',
          right: '-4px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#ef4444',
          fontSize: '11px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  )
}