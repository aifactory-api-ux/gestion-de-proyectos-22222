import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendPoint } from '../../types/models'

interface PlanVsExecutionChartProps {
  data: TrendPoint[]
}

export function PlanVsExecutionChart({ data }: PlanVsExecutionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
        <YAxis stroke="#64748b" fontSize={12} />
        <Tooltip
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
        />
        <Legend />
        <Line type="monotone" dataKey="planned" stroke="#2563eb" strokeWidth={2} name="Planned" />
        <Line type="monotone" dataKey="executed" stroke="#10b981" strokeWidth={2} name="Executed" />
      </LineChart>
    </ResponsiveContainer>
  )
}