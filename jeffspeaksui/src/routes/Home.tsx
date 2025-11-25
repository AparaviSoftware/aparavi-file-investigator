import { useRef, useEffect } from "react";

import { useApi, ApiContextType } from "../contexts/ApiContext";
import ChatMessage from "../components/chat-message/AiMessage";
import ChatInput from "../components/chat-input/ChatInput";
import AiMessage from "../components/chat-message/AiMessage";
import UserMessage from "../components/chat-message/UserMessage";

const Home = () => {
    const { messages, isLoading, sendMessage }: ApiContextType = useApi()

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
                        message.role === 'user' ? (
                            <UserMessage key={message.id} message={message} />
                        ) : (
                            <AiMessage key={message.id} message={message} />
                        )
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