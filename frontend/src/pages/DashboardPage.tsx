import React, { useEffect, useState } from 'react'
import { Sidebar } from '../components/layout/Sidebar'
import { Topbar } from '../components/layout/Topbar'
import { PageContainer } from '../components/layout/PageContainer'
import { KpiCard } from '../components/kpi/KpiCard'
import { Card } from '../components/ui/Card'
import { PlanVsExecutionChart } from '../components/charts/PlanVsExecutionChart'
import { ProjectTable } from '../components/projects/ProjectTable'
import { ChatPanel } from '../components/chat/ChatPanel'
import { ChatFloatingButton } from '../components/chat/ChatFloatingButton'
import { useAuth } from '../hooks/useAuth'
import { useProjects } from '../hooks/useProjects'
import { useKpis } from '../hooks/useKpis'
import { useChat } from '../hooks/useChat'
import { useNotifications } from '../hooks/useNotifications'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const { projects, loading: projectsLoading, selectProject, fetchTrend, deleteProject } = useProjects()
  const { kpis, loading: kpisLoading } = useKpis()
  const { messages, loading: chatLoading, sendMessage, isAiTyping, chatOpen, openChat, closeChat } = useChat()
  const { unreadCount } = useNotifications()
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    if (page === 'notifications') {
      window.location.href = '/notifications'
    }
  }

  const handleSearch = (query: string) => {
    console.log('Search:', query)
  }

  if (!user) return null

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
      <Topbar user={user} onLogout={logout} onSearch={handleSearch} />
      <PageContainer title="Dashboard">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '24px' }}>
          <KpiCard
            label="Total Budget"
            value={kpis?.total_budget || 0}
            color="#2563eb"
            icon="💰"
          />
          <KpiCard
            label="Total Executed"
            value={kpis?.total_executed || 0}
            trend={kpis && kpis.total_executed > kpis.total_budget ? 'down' : 'up'}
            color="#10b981"
            icon="📊"
          />
          <KpiCard
            label="Deviation"
            value={kpis?.total_deviation || 0}
            trend={kpis && kpis.total_deviation > 0 ? 'up' : 'down'}
            color="#f59e0b"
            icon="📈"
          />
          <KpiCard
            label="Forecast"
            value={kpis?.total_forecast || 0}
            color="#8b5cf6"
            icon="🔮"
          />
        </div>

        <Card variant="chart" style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Plan vs Execution</h3>
          <PlanVsExecutionChart data={[]} />
        </Card>

        <Card>
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Projects</h3>
          <ProjectTable
            projects={projects}
            onSelect={(id) => {
              const project = projects.find(p => p.id === id)
              if (project) {
                selectProject(project)
                fetchTrend(id)
              }
            }}
            onEdit={(id) => console.log('Edit project:', id)}
            onDelete={deleteProject}
            loading={projectsLoading}
          />
        </Card>

        {chatOpen && (
          <ChatPanel
            messages={messages}
            onSend={sendMessage}
            loading={chatLoading}
            isAiTyping={isAiTyping}
            onClose={closeChat}
          />
        )}
        {!chatOpen && <ChatFloatingButton onClick={openChat} unreadCount={unreadCount} />}
      </PageContainer>
    </div>
  )
}