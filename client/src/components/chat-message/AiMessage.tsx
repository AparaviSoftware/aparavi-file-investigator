import { useState, useEffect } from 'react'
import { Message } from '../../types'
import jeffProfile from '../../assets/jeff_profile.svg'
import './ChatMessage.css'
import useResponseActions from '../../hooks/useResponseActions'
import ChatMessage from './ChatMessage'

interface AiMessageProps {
  message: Message
}

export default function AiMessage({ message }: AiMessageProps) {
  const { handleRegenerate, handleCopy, handleShare } = useResponseActions()
  const [displayedContent, setDisplayedContent] = useState('')

  useEffect(() => {
    // Only apply typewriter effect to new assistant messages with animate flag
    if (!message.isLoading && message.animate) {
      setDisplayedContent('')

      // Split content into words while preserving spaces and newlines
      const words = message.content.split(/(\s+)/)
      let currentWordIndex = 0
      const typingSpeed = 50 // milliseconds per word

      const interval = setInterval(() => {
        if (currentWordIndex < words.length) {
          setDisplayedContent(words.slice(0, currentWordIndex + 1).join(''))
          currentWordIndex++
        } else {
          clearInterval(interval)
        }
      }, typingSpeed)

      return () => clearInterval(interval)
    } else {
      // For user messages or non-animated messages, show immediately
      setDisplayedContent(message.content)
    }
  }, [message.content, message.isLoading, message.animate])

  return (
    <ChatMessage
      message={{
        ...message,
        content: displayedContent
      }}
      avatar={{
        type: 'image',
        value: jeffProfile
      }}
      actions={
        <div className="message-actions">
          <button
            className="action-button"
            onClick={() => handleRegenerate(message.id)}
            title="Regenerate response"
          >
            ⟳
          </button>
          <button
            className="action-button"
            onClick={() => handleCopy(message.content)}
            title="Copy to clipboard"
          >
            📋
          </button>
          <button
            className="action-button"
            onClick={() => handleShare(message.content)}
            title="Share message"
          >
            ↗
          </button>
        </div>
      }
    />
  )
}