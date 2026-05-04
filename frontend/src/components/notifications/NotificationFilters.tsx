import React from 'react'
import { Notification } from '../../types/models'
import { Dropdown } from '../ui/Dropdown'

interface NotificationFiltersProps {
  filters: { type?: Notification['type']; read?: boolean }
  onChange: (filters: any) => void
}

export function NotificationFilters({ filters, onChange }: NotificationFiltersProps) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
      <Dropdown
        options={[
          { value: '', label: 'All Types' },
          { value: 'budget_deviation', label: 'Budget Deviation' },
          { value: 'milestone', label: 'Milestone' },
          { value: 'forecast_change', label: 'Forecast Change' },
          { value: 'ai_message', label: 'AI Message' },
        ]}
        value={filters.type || ''}
        onChange={(value) => onChange({ ...filters, type: value || undefined })}
        placeholder="Filter by type"
      />
      <Dropdown
        options={[
          { value: '', label: 'All' },
          { value: 'true', label: 'Read' },
          { value: 'false', label: 'Unread' },
        ]}
        value={filters.read?.toString() || ''}
        onChange={(value) => onChange({ ...filters, read: value === '' ? undefined : value === 'true' })}
        placeholder="Filter by read status"
      />
    </div>
  )
}