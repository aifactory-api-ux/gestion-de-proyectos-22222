import { describe, it, expect } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Table } from '../src/components/ui/Table'

describe('Table', () => {
  const mockColumns = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
  ]

  const mockData = [
    { name: 'Project A', status: 'Active' },
    { name: 'Project B', status: 'Inactive' },
  ]

  it('renders loading state', () => {
    const { container } = render(<Table columns={[]} data={[]} loading={true} />)
    expect(container.textContent).toContain('Loading...')
  })

  it('renders table headers', () => {
    const { container } = render(<Table columns={mockColumns} data={mockData} loading={false} />)
    expect(container.querySelector('th')).toBeDefined()
    expect(container.textContent).toContain('Name')
    expect(container.textContent).toContain('Status')
  })

  it('renders table rows', () => {
    const { container } = render(<Table columns={mockColumns} data={mockData} loading={false} />)
    const rows = container.querySelectorAll('tr')
    expect(rows.length).toBeGreaterThan(1)
  })

  it('calls onRowClick when row is clicked', () => {
    let clickedRow: any = null
    const { container } = render(
      <Table
        columns={mockColumns}
        data={mockData}
        loading={false}
        onRowClick={(row) => { clickedRow = row }}
      />
    )
    const firstRow = container.querySelector('tbody tr')
    if (firstRow) fireEvent.click(firstRow)
    expect(clickedRow).not.toBeNull()
  })

  it('renders empty data', () => {
    const { container } = render(<Table columns={mockColumns} data={[]} loading={false} />)
    const rows = container.querySelectorAll('tbody tr')
    expect(rows.length).toBe(0)
  })

  it('applies cursor pointer when onRowClick provided', () => {
    const { container } = render(
      <Table columns={mockColumns} data={mockData} loading={false} onRowClick={() => {}} />
    )
    const firstRow = container.querySelector('tbody tr')
    expect(firstRow?.style.cursor).toBe('pointer')
  })

  it('does not apply cursor pointer when onRowClick not provided', () => {
    const { container } = render(
      <Table columns={mockColumns} data={mockData} loading={false} />
    )
    const firstRow = container.querySelector('tbody tr')
    expect(firstRow?.style.cursor).toBe('default')
  })
})