import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ProjectStatusBadge } from '../src/components/projects/ProjectStatusBadge'
import { Project } from '../src/types/models'

describe('ProjectStatusBadge', () => {
  it('renders on_track status correctly', () => {
    const { container } = render(<ProjectStatusBadge status="on_track" />)
    expect(container.textContent).toBe('On Track')
    const span = container.querySelector('span')
    expect(span?.style.backgroundColor).toBe('rgb(220, 252, 231)')
    expect(span?.style.color).toBe('rgb(22, 101, 52)')
  })

  it('renders at_risk status correctly', () => {
    const { container } = render(<ProjectStatusBadge status="at_risk" />)
    expect(container.textContent).toBe('At Risk')
    const span = container.querySelector('span')
    expect(span?.style.backgroundColor).toBe('rgb(254, 249, 195)')
    expect(span?.style.color).toBe('rgb(133, 77, 14)')
  })

  it('renders delayed status correctly', () => {
    const { container } = render(<ProjectStatusBadge status="delayed" />)
    expect(container.textContent).toBe('Delayed')
    const span = container.querySelector('span')
    expect(span?.style.backgroundColor).toBe('rgb(254, 226, 226)')
    expect(span?.style.color).toBe('rgb(153, 27, 27)')
  })

  it('renders completed status correctly', () => {
    const { container } = render(<ProjectStatusBadge status="completed" />)
    expect(container.textContent).toBe('Completed')
    const span = container.querySelector('span')
    expect(span?.style.backgroundColor).toBe('rgb(219, 234, 254)')
    expect(span?.style.color).toBe('rgb(30, 64, 175)')
  })

  it('applies common styles', () => {
    const { container } = render(<ProjectStatusBadge status="on_track" />)
    const span = container.querySelector('span')
    expect(span?.style.padding).toBe('4px 8px')
    expect(span?.style.borderRadius).toBe('12px')
    expect(span?.style.fontSize).toBe('12px')
    expect(span?.style.fontWeight).toBe(500)
  })
})