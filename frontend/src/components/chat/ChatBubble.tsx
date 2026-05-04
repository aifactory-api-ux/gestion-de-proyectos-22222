import React from 'react'
import { ChatMessage } from '../../types/models'
import dayjs from 'dayjs'

interface ChatBubbleProps {
  message: ChatMessage
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'user'

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
    }}>
      <div style={{
        maxWidth: '75%',
        padding: '12px 16px',
        borderRadius: '16px',
        backgroundColor: isUser ? '#2563eb' : '#f1f5f9',
        color: isUser ? '#fff' : '#1e293b',
        fontSize: '14px',
      }}>
        <p>{message.message}</p>
        <p style={{
          fontSize: '10px',
          marginTop: '4px',
          opacity: 0.7,
        }}>
          {dayjs(message.timestamp).format('HH:mm')}
        </p>
      </div>
    </div>
  )
}