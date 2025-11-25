import { useState, useEffect } from 'react'
import { Message } from '../../types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import LoadingDots from '../loading-dots/LoadingDots'
import jeffProfile from '../../assets/jeff_profile.svg'
import './ChatMessage.css'

interface ChatMessageProps {
  message: Message
  onRegenerate?: () => void
  onCopy?: () => void
  onShare?: () => void
}

export default function ChatMessage({ message, onRegenerate, onCopy, onShare }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const [displayedContent, setDisplayedContent] = useState('')

  useEffect(() => {
    // Only apply typewriter effect to new assistant messages with animate flag
    if (!isUser && !message.isLoading && message.animate) {
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
  }, [message.content, message.isLoading, message.animate, isUser])

  return (
    <div
      className={`message ${isUser ? 'message-user' : 'message-assistant'} ${message.isError ? 'message-error' : ''}`}
    >
      <div className={`message-avatar ${isUser ? 'avatar-user' : 'avatar-assistant'}`}>
        {isUser ? (
          'You'
        ) : (
          <img src={jeffProfile} alt="AI Assistant" className="avatar-image" />
        )}
      </div>
      <div className="message-content-wrapper">
        <div className="message-content">
          {message.isLoading ? (
            <LoadingDots />
          ) : isUser ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayedContent}
            </ReactMarkdown>
          )}
          <div className="message-timestamp">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
        {!isUser && !message.isLoading && (
          <div className="message-actions">
            <button
              className="action-button"
              onClick={onRegenerate}
              title="Regenerate response"
            >
              ⟳
            </button>
            <button
              className="action-button"
              onClick={onCopy}
              title="Copy to clipboard"
            >
              📋
            </button>
            <button
              className="action-button"
              onClick={onShare}
              title="Share message"
            >
              ↗
            </button>
          </div>
        )}
      </div>
    </div>
  )
}