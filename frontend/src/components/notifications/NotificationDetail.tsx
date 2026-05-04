import React from 'react'
import { Notification } from '../../types/models'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import dayjs from 'dayjs'

interface NotificationDetailProps {
  notification: Notification
  onClose: () => void
}

export function NotificationDetail({ notification, onClose }: NotificationDetailProps) {
  return (
    <Modal open={true} onClose={onClose} title={notification.title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Type</p>
          <p style={{ fontSize: '14px', fontWeight: 500 }}>{notification.type.replace('_', ' ')}</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Message</p>
          <p style={{ fontSize: '14px' }}>{notification.message}</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Created</p>
          <p style={{ fontSize: '14px' }}>{dayjs(notification.created_at).format('DD/MM/YYYY HH:mm')}</p>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Status</p>
          <p style={{ fontSize: '14px' }}>{notification.read ? 'Read' : 'Unread'}</p>
        </div>
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  )
}