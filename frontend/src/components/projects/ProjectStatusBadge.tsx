import React from 'react'
import { Project } from '../../types/models'

interface ProjectStatusBadgeProps {
  status: Project['status']
}

export function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const colors: Record<Project['status'], { bg: string; text: string }> = {
    on_track: { bg: '#dcfce7', text: '#166534' },
    at_risk: { bg: '#fef9c3', text: '#854d0e' },
    delayed: { bg: '#fee2e2', text: '#991b1b' },
    completed: { bg: '#dbeafe', text: '#1e40af' },
  }

  const labels: Record<Project['status'], string> = {
    on_track: 'On Track',
    at_risk: 'At Risk',
    delayed: 'Delayed',
    completed: 'Completed',
  }

  const { bg, text } = colors[status]

  return (
    <span style={{
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 500,
      backgroundColor: bg,
      color: text,
    }}>
      {labels[status]}
    </span>
  )
}