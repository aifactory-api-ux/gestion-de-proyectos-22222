import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { Dropdown } from '../src/components/ui/Dropdown'

describe('Dropdown', () => {
  const mockOptions = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ]

  it('renders options correctly', () => {
    const { container } = render(<Dropdown options={mockOptions} value="opt1" onChange={() => {}} />)
    const select = container.querySelector('select')
    expect(select?.options.length).toBe(3)
    expect(select?.value).toBe('opt1')
  })

  it('shows placeholder when provided', () => {
    const { container } = render(
      <Dropdown options={mockOptions} value="" onChange={() => {}} placeholder="Select..." />
    )
    const select = container.querySelector('select')
    expect(select?.options[0].textContent).toBe('Select...')
    expect(select?.value).toBe('')
  })

  it('calls onChange when option is selected', () => {
    const onChange = vi.fn()
    const { container } = render(<Dropdown options={mockOptions} value="" onChange={onChange} />)
    const select = container.querySelector('select')
    if (select) fireEvent.change(select, { target: { value: 'opt2' } })
    expect(onChange).toHaveBeenCalledWith('opt2')
  })

  it('renders all option labels', () => {
    const { container } = render(<Dropdown options={mockOptions} value="" onChange={() => {}} />)
    expect(container.textContent).toContain('Option 1')
    expect(container.textContent).toContain('Option 2')
    expect(container.textContent).toContain('Option 3')
  })

  it('handles empty options array', () => {
    const { container } = render(<Dropdown options={[]} value="" onChange={() => {}} />)
    const select = container.querySelector('select')
    expect(select?.options.length).toBe(0)
  })

  it('applies dropdown styles', () => {
    const { container } = render(<Dropdown options={mockOptions} value="" onChange={() => {}} />)
    const select = container.querySelector('select')
    expect(select?.style.padding).toBe('8px 12px')
    expect(select?.style.borderRadius).toBe('8px')
    expect(select?.style.fontSize).toBe('14px')
  })
})