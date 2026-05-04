import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc',
    }}>
      <Card style={{ textAlign: 'center', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '72px', fontWeight: 700, color: '#2563eb', marginBottom: '16px' }}>404</h1>
        <h2 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '8px' }}>Page Not Found</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </Card>
    </div>
  )
}