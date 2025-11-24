import { useState, useRef, useEffect } from 'react'
import './App.css'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import About from './components/About'
import { Message } from './types'
import { sendMessage } from './services/api'
import backgroundImage from './assets/background.png'

function App() {
  const [showAbout, setShowAbout] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hey, it\'s Jeff, ask me anything;)',
      timestamp: new Date()
    },
    {
      id: '1',
      role: 'user',
      content: 'Hey, it\'s Jeff, ask me anything;)',
      timestamp: new Date()
    },
    {
      id: '3',
      role: 'assistant',
      content: 'Hey, it\'s Jeff, ask me anything;)',
      timestamp: new Date()
    },
    {
      id: '4',
      role: 'user',
      content: 'Hey, it\'s Jeff, ask me anything;)',
      timestamp: new Date()
    },
    {
      id: '5',
      role: 'assistant',
      content: 'Hey, it\'s Jeff, ask me anything;)',
      timestamp: new Date()
    },
    {
      id: '6',
      role: 'user',
      content: 'Hey, it\'s Jeff, ask me anything;)',
      timestamp: new Date()
    },
    {
      id: '7',
      role: 'assistant',
      content: 'Hey, it\'s Jeff, ask me anything;)',
      timestamp: new Date()
    },
    {
      id: '8',
      role: 'user',
      content: 'Hey, it\'s Jeff, ask me anything;)',
      timestamp: new Date()
    },
    {
      id: '9',
      role: 'assistant',
      content: 'Hey, it\'s Jeff, ask me anything;)',
      timestamp: new Date()
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Apply background to body
    document.body.style.backgroundImage = `url(${backgroundImage})`
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundPosition = 'center'
    document.body.style.backgroundAttachment = 'fixed'
    document.body.style.backgroundRepeat = 'no-repeat'
  }, [])

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call API
      const response = await sendMessage(content)

      // Add assistant response with animate flag
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.result,
        timestamp: new Date(),
        animate: true  // Enable typewriter effect for new messages
      }
      setMessages(prev => [...prev, assistantMessage])

      // Remove animate flag after animation completes
      const words = response.result.split(/(\s+)/)
      const animationDuration = words.length * 50 + 100 // Match typing speed + buffer

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, animate: false }
              : msg
          )
        )
      }, animationDuration)
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegenerate = async (messageId: string) => {
    // Find the user message that preceded this assistant message
    const messageIndex = messages.findIndex(msg => msg.id === messageId)
    if (messageIndex <= 0) return

    const userMessage = messages[messageIndex - 1]
    if (userMessage.role !== 'user') return

    // Remove the assistant message and any subsequent messages
    setMessages(prev => prev.slice(0, messageIndex))
    setIsLoading(true)

    try {
      // Call API again with the same user message
      const response = await sendMessage(userMessage.content)

      // Add new assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.result,
        timestamp: new Date(),
        animate: true
      }
      setMessages(prev => [...prev, assistantMessage])

      // Remove animate flag after animation completes
      const words = response.result.split(/(\s+)/)
      const animationDuration = words.length * 50 + 100

      setTimeout(() => {
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, animate: false }
              : msg
          )
        )
      }, animationDuration)
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const handleShare = (content: string) => {
    // For now, just copy to clipboard as a simple share mechanism
    // You could implement more sophisticated sharing later
    handleCopy(content)
  }

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