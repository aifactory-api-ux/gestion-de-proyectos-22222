import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Modal } from '../src/components/ui/Modal'

describe('Modal', () => {
  it('does not render when open is false', () => {
    const { container } = render(<Modal open={false} onClose={() => {}}>Content</Modal>)
    expect(container.firstChild).toBeNull()
  })

  it('renders children when open is true', () => {
    const { container } = render(<Modal open={true} onClose={() => {}}>Modal Content</Modal>)
    expect(container.textContent).toContain('Modal Content')
  })

  it('renders title when provided', () => {
    const { container } = render(<Modal open={true} onClose={() => {}} title="Test Title">Content</Modal>)
    expect(container.textContent).toContain('Test Title')
  })

  it('does not render title when not provided', () => {
    const { container } = render(<Modal open={true} onClose={() => {}}>Content Only</Modal>)
    expect(container.textContent).toBe('Content Only')
  })

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<Modal open={true} onClose={onClose}>Content</Modal>)
    const overlay = container.querySelector('div')
    if (overlay) fireEvent.click(overlay)
    expect(onClose).toHaveBeenCalled()
  })

  it('does not call onClose when modal content is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<Modal open={true} onClose={onClose}>Content</Modal>)
    const content = container.querySelector('div > div')
    if (content) fireEvent.click(content)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes on Escape key', () => {
    const onClose = vi.fn()
    render(<Modal open={true} onClose={onClose}>Content</Modal>)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
})