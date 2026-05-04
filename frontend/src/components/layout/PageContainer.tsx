import React from 'react'

interface PageContainerProps {
  children: React.ReactNode
  title?: string
}

export function PageContainer({ children, title }: PageContainerProps) {
  return (
    <div style={{
      marginLeft: '240px',
      paddingTop: '64px',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
    }}>
      <div style={{ padding: '24px' }}>
        {title && <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px' }}>{title}</h1>}
        {children}
      </div>
    </div>
  )
}