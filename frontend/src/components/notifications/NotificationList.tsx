import React from 'react'
import { Notification } from '../../types/models'
import { Button } from '../ui/Button'
import dayjs from 'dayjs'

interface NotificationListProps {
  notifications: Notification[]
  filters: { type?: Notification['type']; read?: boolean }
  onFilterChange: (filters: any) => void
  onSelect: (id: number) => void
  onMarkAsRead: (id: number) => void
  onDelete: (id: number) => void
  loading: boolean
}

export function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
  onSelect,
  loading,
}: NotificationListProps) {
  if (loading) {
    return <div>Loading notifications...</div>
  }

  if (notifications.length === 0) {
    return <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>No notifications</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {notifications.map(notification => (
        <div
          key={notification.id}
          onClick={() => onSelect(notification.id)}
          style={{
            padding: '16px',
            backgroundColor: notification.read ? '#fff' : '#f0f9ff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>{notification.title}</h4>
              <p style={{ fontSize: '14px', color: '#64748b' }}>{notification.message}</p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
                {dayjs(notification.created_at).format('DD/MM/YYYY HH:mm')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {!notification.read && (
                <Button variant="secondary" onClick={() => { onMarkAsRead(notification.id); }}>
                  Mark Read
                </Button>
              )}
              <Button variant="tertiary" onClick={() => { onDelete(notification.id); }}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}