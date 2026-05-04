import React, { useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'
import { PageContainer } from '../components/layout/PageContainer'
import { Card } from '../components/ui/Card'
import { NotificationList } from '../components/notifications/NotificationList'
import { NotificationFilters } from '../components/notifications/NotificationFilters'
import { NotificationDetail } from '../components/notifications/NotificationDetail'
import { useAuth } from '../hooks/useAuth'
import { useNotifications } from '../hooks/useNotifications'
import { Notification } from '../types/models'

export default function NotificationsPage() {
  const { user, logout } = useAuth()
  const { notifications, loading, filters, setFilters, markAsRead, deleteNotification, unreadCount } = useNotifications()
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [currentPage, setCurrentPage] = useState('notifications')

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    if (page === 'dashboard') {
      window.location.href = '/dashboard'
    }
  }

  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  if (!user) return null

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <Topbar user={user} onLogout={logout} onSearch={handleSearch} />
      <PageContainer title={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}>
        <Card>
          <NotificationFilters filters={filters} onChange={setFilters} />
          <NotificationList
            notifications={notifications}
            filters={filters}
            onFilterChange={setFilters}
            onSelect={(id) => {
              const notification = notifications.find(n => n.id === id)
              if (notification) setSelectedNotification(notification)
            }}
            onMarkAsRead={markAsRead}
            onDelete={deleteNotification}
            loading={loading}
          />
        </Card>
        {selectedNotification && (
          <NotificationDetail
            notification={selectedNotification}
            onClose={() => setSelectedNotification(null)}
          />
        )}
      </PageContainer>
    </div>
  )
}