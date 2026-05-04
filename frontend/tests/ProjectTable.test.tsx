import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ProjectTable } from '../src/components/projects/ProjectTable'
import { Project } from '../src/types/models'

describe('ProjectTable', () => {
  const mockProjects: Project[] = [
    {
      id: 1,
      name: 'Project Alpha',
      description: 'First project',
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      budget: 100000,
      executed: 50000,
      forecast: 95000,
      status: 'on_track',
      manager_id: 1,
    },
    {
      id: 2,
      name: 'Project Beta',
      description: 'Second project',
      start_date: '2024-02-01',
      end_date: '2024-11-30',
      budget: 200000,
      executed: 180000,
      forecast: 210000,
      status: 'at_risk',
      manager_id: 2,
    },
  ]

  it('renders table with projects', () => {
    const { container } = render(
      <ProjectTable
        projects={mockProjects}
        onSelect={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        loading={false}
      />
    )
    expect(container.textContent).toContain('Project Alpha')
    expect(container.textContent).toContain('Project Beta')
  })

  it('renders loading state', () => {
    const { container } = render(
      <ProjectTable
        projects={[]}
        onSelect={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        loading={true}
      />
    )
    expect(container.textContent).toContain('Loading...')
  })

  it('renders Edit and Delete buttons', () => {
    const { container } = render(
      <ProjectTable
        projects={mockProjects}
        onSelect={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        loading={false}
      />
    )
    expect(container.textContent).toContain('Edit')
    expect(container.textContent).toContain('Delete')
  })

  it('calls onSelect when row is clicked', () => {
    const onSelect = vi.fn()
    const { container } = render(
      <ProjectTable
        projects={mockProjects}
        onSelect={onSelect}
        onEdit={() => {}}
        onDelete={() => {}}
        loading={false}
      />
    )
    const firstRow = container.querySelector('tbody tr')
    if (firstRow) firstRow.click()
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('calls onEdit with project id', () => {
    const onEdit = vi.fn()
    const { container } = render(
      <ProjectTable
        projects={mockProjects}
        onSelect={() => {}}
        onEdit={onEdit}
        onDelete={() => {}}
        loading={false}
      />
    )
    const editBtn = container.querySelectorAll('button')[0]
    editBtn.click()
    expect(onEdit).toHaveBeenCalledWith(1)
  })

  it('calls onDelete with project id', () => {
    const onDelete = vi.fn()
    const { container } = render(
      <ProjectTable
        projects={mockProjects}
        onSelect={() => {}}
        onEdit={() => {}}
        onDelete={onDelete}
        loading={false}
      />
    )
    const deleteBtn = container.querySelectorAll('button')[1]
    deleteBtn.click()
    expect(onDelete).toHaveBeenCalledWith(1)
  })

  it('renders budget and executed values', () => {
    const { container } = render(
      <ProjectTable
        projects={mockProjects}
        onSelect={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        loading={false}
      />
    )
    expect(container.textContent).toContain('100,000 €')
    expect(container.textContent).toContain('50,000 €')
  })

  it('renders table columns', () => {
    const { container } = render(
      <ProjectTable
        projects={mockProjects}
        onSelect={() => {}}
        onEdit={() => {}}
        onDelete={() => {}}
        loading={false}
      />
    )
    expect(container.textContent).toContain('Name')
    expect(container.textContent).toContain('Status')
    expect(container.textContent).toContain('Budget')
    expect(container.textContent).toContain('Executed')
    expect(container.textContent).toContain('Actions')
  })
})