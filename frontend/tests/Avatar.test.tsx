import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from '../src/components/ui/Avatar'
import { User } from '../src/types/models'

describe('Avatar', () => {
  const mockUser: User = {
    id: 1,
    email: 'john.doe@example.com',
    full_name: 'John Doe',
    role: 'manager',
    is_active: true
  }

  it('renders user initials from full name', () => {
    const { container } = render(<Avatar user={mockUser} />)
    const initials = container.querySelector('div')
    expect(initials?.textContent).toBe('JD')
  })

  it('handles single name', () => {
    const singleNameUser = { ...mockUser, full_name: 'John' }
    const { container } = render(<Avatar user={singleNameUser} />)
    const initials = container.querySelector('div')
    expect(initials?.textContent).toBe('J')
  })

  it('handles three word name', () => {
    const threeWordUser = { ...mockUser, full_name: 'John Michael Doe' }
    const { container } = render(<Avatar user={threeWordUser} />)
    const initials = container.querySelector('div')
    expect(initials?.textContent).toBe('JM')
  })

  it('handles lowercase names', () => {
    const lowercaseUser = { ...mockUser, full_name: 'john doe' }
    const { container } = render(<Avatar user={lowercaseUser} />)
    const initials = container.querySelector('div')
    expect(initials?.textContent).toBe('JD')
  })

  it('renders with correct styles', () => {
    const { container } = render(<Avatar user={mockUser} />)
    const div = container.querySelector('div')
    expect(div?.style.width).toBe('40px')
    expect(div?.style.height).toBe('40px')
    expect(div?.style.borderRadius).toBe('50%')
    expect(div?.style.backgroundColor).toBe('rgb(37, 99, 235)')
    expect(div?.style.color).toBe('rgb(255, 255, 255)')
    expect(div?.style.display).toBe('flex')
    expect(div?.style.fontSize).toBe('14px')
    expect(div?.style.fontWeight).toBe(600)
  })

  it('handles middle name correctly', () => {
    const middleNameUser = { ...mockUser, full_name: 'John Michael Doe' }
    const { container } = render(<Avatar user={middleNameUser} />)
    const initials = container.querySelector('div')
    expect(initials?.textContent).toBe('JM')
  })

  it('handles empty full name', () => {
    const emptyUser = { ...mockUser, full_name: '' }
    const { container } = render(<Avatar user={emptyUser} />)
    const initials = container.querySelector('div')
    expect(initials?.textContent).toBe('')
  })

  it('truncates to max 2 characters', () => {
    const longNameUser = { ...mockUser, full_name: 'John Michael Doe Smith' }
    const { container } = render(<Avatar user={longNameUser} />)
    const initials = container.querySelector('div')
    expect(initials?.textContent?.length).toBeLessThanOrEqual(2)
  })
})