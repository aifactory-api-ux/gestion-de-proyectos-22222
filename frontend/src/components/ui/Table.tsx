import React from 'react'

interface TableProps {
  columns: { key: string; label: string }[]
  data: any[]
  loading: boolean
  onRowClick?: (row: any) => void
}

export function Table({ columns, data, loading, onRowClick }: TableProps) {
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} style={{ textAlign: 'left', padding: '12px', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontWeight: 500 }}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr
            key={idx}
            onClick={() => onRowClick?.(row)}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {columns.map(col => (
              <td key={col.key} style={{ padding: '12px', borderBottom: '1px solid #f1f5f9' }}>
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}