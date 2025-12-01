import { ApiContextType, useApi } from "../contexts/ApiContext"
import { Message } from "../types"

export const useResponseActions = () => {
    const { messages, setMessages, sendMessage, setIsLoading }: ApiContextType = useApi()

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

    return {
        handleRegenerate,
        handleCopy,
        handleShare
    }
}

export default useResponseActions;