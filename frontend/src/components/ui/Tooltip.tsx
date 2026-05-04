import React, { useState } from 'react'

interface TooltipProps {
  title: string
  children: React.ReactNode
}

export function Tooltip({ title, children }: TooltipProps) {
  const [show, setShow] = useState(false)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}
         onMouseEnter={() => setShow(true)}
         onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#1e293b',
          color: '#fff',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 100,
        }}>
          {title}
        </div>
      )}
    </div>
  )
}