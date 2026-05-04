import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Card } from '../src/components/ui/Card'

describe('Card', () => {
  it('renders children correctly', () => {
    const { container } = render(<Card>Test Content</Card>)
    expect(container.textContent).toBe('Test Content')
  })

  it('renders with info variant by default', () => {
    const { container } = render(<Card>Info Card</Card>)
    const div = container.querySelector('div')
    expect(div).toBeDefined()
  })

  it('renders with kpi variant', () => {
    const { container } = render(<Card variant="kpi">KPI Card</Card>)
    expect(container.textContent).toBe('KPI Card')
  })

  it('renders with chart variant', () => {
    const { container } = render(<Card variant="chart">Chart Card</Card>)
    expect(container.textContent).toBe('Chart Card')
  })

  it('applies custom styles', () => {
    const { container } = render(<Card style={{ backgroundColor: '#f0f0f0' }}>Styled</Card>)
    const div = container.querySelector('div')
    expect(div?.style.backgroundColor).toBe('rgb(240, 240, 240)')
  })

  it('applies base styles', () => {
    const { container } = render(<Card>Base Styles</Card>)
    const div = container.querySelector('div')
    expect(div?.style.borderRadius).toBe('12px')
    expect(div?.style.padding).toBe('20px')
  })
})