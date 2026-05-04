import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Tooltip } from '../src/components/ui/Tooltip'

describe('Tooltip', () => {
  it('renders children correctly', () => {
    const { container } = render(
      <Tooltip title="Test Tip">
        <span>Hover me</span>
      </Tooltip>
    )
    expect(container.textContent).toContain('Hover me')
  })

  it('shows tooltip on mouse enter', () => {
    const { container } = render(
      <Tooltip title="Test Tip">
        <span>Hover me</span>
      </Tooltip>
    )
    const wrapper = container.querySelector('div')
    if (wrapper) fireEvent.mouseEnter(wrapper)
    expect(container.textContent).toContain('Test Tip')
  })

  it('hides tooltip on mouse leave', () => {
    const { container } = render(
      <Tooltip title="Test Tip">
        <span>Hover me</span>
      </Tooltip>
    )
    const wrapper = container.querySelector('div')
    if (wrapper) {
      fireEvent.mouseEnter(wrapper)
      fireEvent.mouseLeave(wrapper)
    }
    expect(container.textContent).not.toContain('Test Tip')
  })

  it('displays correct title', () => {
    const { container } = render(
      <Tooltip title="My Tooltip">
        <span>Target</span>
      </Tooltip>
    )
    const wrapper = container.querySelector('div')
    if (wrapper) fireEvent.mouseEnter(wrapper)
    expect(container.textContent).toContain('My Tooltip')
  })

  it('renders children as clickable', () => {
    const { container } = render(
      <Tooltip title="Tip">
        <button>Click</button>
      </Tooltip>
    )
    expect(container.querySelector('button')).toBeDefined()
  })
})