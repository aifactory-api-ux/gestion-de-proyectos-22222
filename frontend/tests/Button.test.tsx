import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '../src/components/ui/Button'

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeDefined()
  })

  it('applies primary variant styles by default', () => {
    const { container } = render(<Button>Primary</Button>)
    const button = container.querySelector('button')
    expect(button?.style.backgroundColor).toBe('rgb(37, 99, 235)')
  })

  it('applies secondary variant styles', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    const button = container.querySelector('button')
    expect(button?.style.backgroundColor).toBe('rgb(241, 245, 249)')
  })

  it('applies tertiary variant styles', () => {
    const { container } = render(<Button variant="tertiary">Tertiary</Button>)
    const button = container.querySelector('button')
    expect(button?.style.backgroundColor).toBe('transparent')
  })

  it('applies icon variant styles', () => {
    const { container } = render(<Button variant="icon">Icon</Button>)
    const button = container.querySelector('button')
    expect(button?.style.backgroundColor).toBe('transparent')
    expect(button?.style.padding).toBe('8px')
  })

  it('calls onClick when clicked', () => {
    let clicked = false
    const { container } = render(
      <Button onClick={() => { clicked = true }}>Click</Button>
    )
    const button = container.querySelector('button')!
    fireEvent.click(button)
    expect(clicked).toBe(true)
  })

  it('does not call onClick when disabled', () => {
    let clicked = false
    const { container } = render(
      <Button disabled onClick={() => { clicked = true }}>Disabled</Button>
    )
    const button = container.querySelector('button')!
    fireEvent.click(button)
    expect(clicked).toBe(false)
  })

  it('shows loading state', () => {
    const { container } = render(<Button loading>Loading</Button>)
    const button = container.querySelector('button')
    expect(button?.textContent).toContain('...')
  })

  it('renders with icon', () => {
    const { container } = render(
      <Button icon={<span data-testid="icon">X</span>}>With Icon</Button>
    )
    expect(screen.getByTestId('icon')).toBeDefined()
  })

  it('applies correct cursor when disabled', () => {
    const { container } = render(<Button disabled>Disabled</Button>)
    const button = container.querySelector('button')
    expect(button?.style.cursor).toBe('not-allowed')
  })

  it('applies correct cursor when loading', () => {
    const { container } = render(<Button loading>Loading</Button>)
    const button = container.querySelector('button')
    expect(button?.style.cursor).toBe('not-allowed')
  })

  it('applies correct type attribute', () => {
    const { container } = render(<Button type="submit">Submit</Button>)
    const button = container.querySelector('button')
    expect(button?.type).toBe('submit')
  })

  it('applies correct type attribute for reset', () => {
    const { container } = render(<Button type="reset">Reset</Button>)
    const button = container.querySelector('button')
    expect(button?.type).toBe('reset')
  })
})