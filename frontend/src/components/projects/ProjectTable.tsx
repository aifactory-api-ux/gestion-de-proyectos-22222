import React from 'react'
import { Project } from '../../types/models'
import { Table } from '../ui/Table'
import { ProjectStatusBadge } from './ProjectStatusBadge'
import { Button } from '../ui/Button'

interface ProjectTableProps {
  projects: Project[]
  onSelect: (id: number) => void
  onEdit: (id: number) => void
  onDelete: (id: number) => void
  loading: boolean
}

export function ProjectTable({ projects, onSelect, onEdit, onDelete, loading }: ProjectTableProps) {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'budget', label: 'Budget' },
    { key: 'executed', label: 'Executed' },
    { key: 'actions', label: 'Actions' },
  ]

  const data = projects.map(project => ({
    name: project.name,
    status: <ProjectStatusBadge status={project.status} />,
    budget: `${project.budget.toLocaleString()} €`,
    executed: `${project.executed.toLocaleString()} €`,
    actions: (
      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="secondary" onClick={() => onEdit(project.id)}>Edit</Button>
        <Button variant="tertiary" onClick={() => onDelete(project.id)}>Delete</Button>
      </div>
    ),
    id: project.id,
  }))

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      onRowClick={(row) => onSelect(row.id)}
    />
  )
}