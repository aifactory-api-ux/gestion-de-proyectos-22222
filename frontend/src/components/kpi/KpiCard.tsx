import React from 'react'
import { Card } from '../ui/Card'

interface KpiCardProps {
  label: string
  value: number
  trend?: 'up' | 'down' | 'neutral'
  color: string
  icon: React.ReactNode
}

export function KpiCard({ label, value, trend, color, icon }: KpiCardProps) {
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#64748b'

  return (
    <Card variant="kpi">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>{label}</p>
          <p style={{ fontSize: '28px', fontWeight: 700, color: '#1e293b' }}>
            {value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </p>
          {trend && (
            <p style={{ fontSize: '12px', color: trendColor, marginTop: '4px' }}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} Trend
            </p>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${color}15`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
        }}>
          {icon}
        </div>
      </div>
    </Card>
  )
}