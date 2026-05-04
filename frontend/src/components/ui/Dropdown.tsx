import React from 'react'

interface DropdownProps {
  options: { value: any; label: string }[]
  value: any
  onChange: (value: any) => void
  placeholder?: string
}

export function Dropdown({ options, value, onChange, placeholder }: DropdownProps) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#fff',
        fontSize: '14px',
        cursor: 'pointer',
      }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}