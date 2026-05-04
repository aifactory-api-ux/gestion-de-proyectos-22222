import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Skeleton } from '../src/components/ui/Skeleton'

describe('Skeleton', () => {
  it('renders with default dimensions', () => {
    const { container } = render(<Skeleton />)
    const div = container.querySelector('div')
    expect(div?.style.width).toBe('100%')
    expect(div?.style.height).toBe('20px')
  })

  it('renders with custom width', () => {
    const { container } = render(<Skeleton width={200} />)
    const div = container.querySelector('div')
    expect(div?.style.width).toBe('200px')
  })

  it('renders with custom height', () => {
    const { container } = render(<Skeleton height={50} />)
    const div = container.querySelector('div')
    expect(div?.style.height).toBe('50px')
  })

  it('renders with numeric width', () => {
    const { container } = render(<Skeleton width={100} />)
    const div = container.querySelector('div')
    expect(div?.style.width).toBe('100px')
  })

  it('renders with numeric height', () => {
    const { container } = render(<Skeleton height={30} />)
    const div = container.querySelector('div')
    expect(div?.style.height).toBe('30px')
  })

  it('applies skeleton styles', () => {
    const { container } = render(<Skeleton />)
    const div = container.querySelector('div')
    expect(div?.style.backgroundColor).toBe('rgb(241, 245, 249)')
    expect(div?.style.borderRadius).toBe('4px')
    expect(div?.style.animation).toContain('pulse')
  })
})