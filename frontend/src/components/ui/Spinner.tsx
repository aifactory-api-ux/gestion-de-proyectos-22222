import React from 'react'

interface SpinnerProps {
  size?: number
}

export function Spinner({ size = 24 }: SpinnerProps) {
  return (
    <div style={{
      width: size,
      height: size,
      border: '3px solid #f1f5f9',
      borderTopColor: '#2563eb',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
  )
}