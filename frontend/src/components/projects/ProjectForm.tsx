import React, { useState } from 'react'
import { ProjectCreate, ProjectUpdate } from '../../types/models'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'

interface ProjectFormProps {
  initialValues?: ProjectCreate | ProjectUpdate
  onSubmit: (data: ProjectCreate | ProjectUpdate) => void
  loading: boolean
}

export function ProjectForm({ initialValues, onSubmit, loading }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectCreate>({
    name: (initialValues as ProjectCreate)?.name || '',
    description: (initialValues as ProjectCreate)?.description || '',
    start_date: (initialValues as ProjectCreate)?.start_date || '',
    end_date: (initialValues as ProjectCreate)?.end_date || '',
    budget: (initialValues as ProjectCreate)?.budget || 0,
    manager_id: (initialValues as ProjectCreate)?.manager_id || 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#64748b' }}>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#64748b' }}>Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#64748b' }}>Start Date</label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#64748b' }}>End Date</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#64748b' }}>Budget</label>
        <input
          type="number"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) })}
          style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
        />
      </div>
      <Button type="submit" loading={loading}>Save Project</Button>
    </form>
  )
}