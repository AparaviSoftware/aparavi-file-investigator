import { useRef, useEffect } from "react";

import { useApi, ApiContextType } from "../contexts/ApiContext";
import useResponseActions from "../hooks/useResponseActions";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";

const Home = () => {
    const { messages, isLoading, sendMessage }: ApiContextType = useApi()
    const { handleRegenerate, handleCopy, handleShare } = useResponseActions();

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <>
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
                onSendMessage={sendMessage}
                disabled={isLoading}
            />
        </>
    )
}

export default Home;