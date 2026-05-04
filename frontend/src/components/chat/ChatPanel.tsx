import React from 'react'
import { ChatMessage } from '../../types/models'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'

interface ChatPanelProps {
  messages: ChatMessage[]
  onSend: (message: string) => void
  loading: boolean
  isAiTyping: boolean
  onClose: () => void
}

export function ChatPanel({ messages, onSend, loading, isAiTyping, onClose }: ChatPanelProps) {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '380px',
      height: '520px',
      backgroundColor: '#fff',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
    }}>
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>AI Assistant</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {messages.map(msg => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isAiTyping && (
          <div style={{ padding: '12px', color: '#64748b', fontSize: '14px' }}>AI is typing...</div>
        )}
      </div>
      <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0' }}>
        <ChatInput onSend={onSend} loading={loading} />
      </div>
    </div>
  )
}