import { useState, useRef, useEffect } from 'react'
import './App.css'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import About from './components/About'
import { useApi, ApiContextType } from './contexts/ApiContext'
import useResponseActions from './hooks/useResponseActions'

function App() {
  const { messages, isLoading }: ApiContextType = useApi()
  const { handleRegenerate, handleCopy, handleShare } = useResponseActions()

  const [showAbout, setShowAbout] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  if (showAbout) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>jeffspeaks.ai</h1>
          <button className="back-button" onClick={() => setShowAbout(false)}>
            ← Back to Chat
          </button>
        </header>
        <About />
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>jeffspeaks.ai</h1>
        <div className="header-bottom">
          <p className="subtitle">Using AI to sort through the gross world of Jeffrey Epstein 🤮</p>
          <div className="header-buttons">
            <button className="header-button" onClick={() => setShowAbout(true)}>
              About
            </button>
            <button className="header-button" onClick={() => window.open('#', '_blank')}>
              Buy us coffee
            </button>
          </div>
        </div>
      </header>

      <main className="chat-container" ref={chatContainerRef}>
        <div className="messages">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onRegenerate={message.role === 'assistant' ? () => handleRegenerate(message.id) : undefined}
              onCopy={message.role === 'assistant' ? () => handleCopy(message.content) : undefined}
              onShare={message.role === 'assistant' ? () => handleShare(message.content) : undefined}
            />
          ))}
          {isLoading && (
            <ChatMessage
              message={{
                id: 'loading',
                role: 'assistant',
                content: '',
                timestamp: new Date(),
                isLoading: true
              }}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  )
}

export default App