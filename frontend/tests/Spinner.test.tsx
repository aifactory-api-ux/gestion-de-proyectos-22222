import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Spinner } from '../src/components/ui/Spinner'

describe('Spinner', () => {
  it('renders with default size', () => {
    const { container } = render(<Spinner />)
    const div = container.querySelector('div')
    expect(div?.style.width).toBe('24px')
    expect(div?.style.height).toBe('24px')
  })

  it('renders with custom size', () => {
    const { container } = render(<Spinner size={48} />)
    const div = container.querySelector('div')
    expect(div?.style.width).toBe('48px')
    expect(div?.style.height).toBe('48px')
  })

  it('renders with small size', () => {
    const { container } = render(<Spinner size={16} />)
    const div = container.querySelector('div')
    expect(div?.style.width).toBe('16px')
  })

  it('renders with large size', () => {
    const { container } = render(<Spinner size={64} />)
    const div = container.querySelector('div')
    expect(div?.style.width).toBe('64px')
  })

  it('applies spinner styles', () => {
    const { container } = render(<Spinner />)
    const div = container.querySelector('div')
    expect(div?.style.border).toBe('3px solid #f1f5f9')
    expect(div?.style.borderTopColor).toBe('#2563eb')
    expect(div?.style.borderRadius).toBe('50%')
    expect(div?.style.animation).toContain('spin')
  })
})