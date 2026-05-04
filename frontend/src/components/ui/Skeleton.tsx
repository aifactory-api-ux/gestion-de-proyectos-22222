import React from 'react'

interface SkeletonProps {
  width?: number | string
  height?: number | string
}

export function Skeleton({ width = '100%', height = '20px' }: SkeletonProps) {
  const w = typeof width === 'number' ? `${width}px` : width
  const h = typeof height === 'number' ? `${height}px` : height
  return (
    <div style={{
      width: w,
      height: h,
      backgroundColor: '#f1f5f9',
      borderRadius: '4px',
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  )
}