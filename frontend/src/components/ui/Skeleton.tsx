import React from 'react'

interface SkeletonProps {
  width?: number | string
  height?: number | string
}

export function Skeleton({ width = '100%', height = '20px' }: SkeletonProps) {
  return (
    <div style={{
      width,
      height,
      backgroundColor: '#f1f5f9',
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  )
}