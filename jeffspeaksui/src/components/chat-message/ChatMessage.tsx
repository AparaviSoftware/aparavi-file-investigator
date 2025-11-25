import { Message } from '../../types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './ChatMessage.css'

interface ChatMessageProps {
    message: Message
    avatar: {
        type: 'string' | 'image',
        value: string;
    }
    actions: React.ReactNode;
}

export default function ChatMessage({ message, avatar, actions }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div
            className={`message ${isUser ? 'message-user' : 'message-assistant'} ${message.isError ? 'message-error' : ''}`}
        >
            {!isUser && (
                <div className={`message-avatar ${isUser ? 'avatar-user' : 'avatar-assistant'}`}>
                    {avatar.type === 'string' && avatar.value}
                    {avatar.type === 'image' && <img src={avatar.value} alt="Avatar" className="avatar-image" />}
                </div>
            )}
            <div className="message-content-wrapper">
                <div className="message-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                    <div className="message-timestamp">
                        {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>
                {actions}
            </div>
            {isUser && (
                <div className={`message-avatar ${isUser ? 'avatar-user' : 'avatar-assistant'}`}>
                    {avatar.type === 'string' && avatar.value}
                    {avatar.type === 'image' && <img src={avatar.value} alt="Avatar" className="avatar-image" />}
                </div>
            )}
        </div>
    )
}