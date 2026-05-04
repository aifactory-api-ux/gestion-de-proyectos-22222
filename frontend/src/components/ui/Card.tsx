import React from 'react'

interface CardProps {
  children: React.ReactNode
  variant?: 'info' | 'kpi' | 'chart'
  style?: React.CSSProperties
}

export function Card({ children, variant = 'info', style }: CardProps) {
  const baseStyles: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
    ...style,
  }

  return <div style={baseStyles}>{children}</div>
}