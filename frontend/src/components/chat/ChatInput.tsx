import React, { useState } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  loading: boolean
}

export function ChatInput({ onSend, loading }: ChatInputProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSend(message.trim())
      setMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={loading}
        style={{
          flex: 1,
          padding: '12px 16px',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          fontSize: '14px',
          outline: 'none',
        }}
      />
      <button
        type="submit"
        disabled={loading || !message.trim()}
        style={{
          padding: '12px 20px',
          borderRadius: '24px',
          border: 'none',
          backgroundColor: '#2563eb',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 500,
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        Send
      </button>
    </form>
  )
}