import { Message } from '../../types'
import './ChatMessage.css'
import ChatMessage from './ChatMessage'

interface UserMessageProps {
    message: Message
}

export default function UserMessage({ message }: UserMessageProps) {

    return (
        <ChatMessage message={message} avatar={{ type: 'string', value: 'You' }} actions={<div className="message-actions"></div>} />
    )
}