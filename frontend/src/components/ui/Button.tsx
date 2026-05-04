import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'tertiary' | 'icon'
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  loading = false,
  icon,
  type = 'button'
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: variant === 'icon' ? '8px' : '10px 16px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s',
  }

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: { backgroundColor: '#2563eb', color: '#ffffff' },
    secondary: { backgroundColor: '#f1f5f9', color: '#1e293b' },
    tertiary: { backgroundColor: 'transparent', color: '#2563eb' },
    icon: { backgroundColor: 'transparent', color: '#64748b' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...baseStyles, ...variantStyles[variant] }}
    >
      {loading ? <span>...</span> : icon}
      {children}
    </button>
  )
}