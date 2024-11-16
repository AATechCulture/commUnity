'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSession } from 'next-auth/react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

export function AIChat() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useLocalStorage<Message[]>('ai-chat-history', [])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasGreetedRef = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Send welcome message when chat is opened
  useEffect(() => {
    if (isOpen && !hasGreetedRef.current && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Hi ${session?.user?.name || 'there'}, I am Unity and I am here to help U find ways to connect with your commUnity! How can I assist you today?`,
        role: 'assistant',
        timestamp: Date.now(),
      }
      setMessages([welcomeMessage])
      hasGreetedRef.current = true
    }
  }, [isOpen, session?.user?.name, setMessages, messages.length])

  // Reset greeting flag when chat is closed
  useEffect(() => {
    if (!isOpen) {
      hasGreetedRef.current = false
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      role: 'user',
      timestamp: Date.now(),
    }

    // Add user message to chat
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/events/search/ai?' + new URLSearchParams({
        q: message.trim()
      }))
      
      if (!response.ok) throw new Error('Failed to get response')
      
      const events = await response.json()
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: events.length > 0 
          ? `I found ${events.length} events that might interest you:\n\n${events.map((event: any) => 
              `• ${event.title} - ${new Date(event.date).toLocaleDateString()}\n`
            ).join('')}`
          : "I couldn't find any events matching your query. Try being more specific or changing your search terms.",
        role: 'assistant',
        timestamp: Date.now(),
      }

      // Preserve both user and bot messages
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: Date.now(),
      }
      // Preserve both user and error messages
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEndChat = () => {
    setMessages([])
    setIsOpen(false)
    hasGreetedRef.current = false
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="w-12 h-12 rounded-full bg-purple-600 text-white shadow-lg flex items-center justify-center hover:bg-purple-500 transition-colors duration-300"
          >
            <ChatBubbleLeftIcon className="h-6 w-6" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0, x: 100 }}
            animate={{ 
              scale: 1,
              opacity: 1,
              height: '500px',
              x: 0
            }}
            exit={{ scale: 0, opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
            className="w-[350px] bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-purple-600 text-white">
              <h3 className="font-semibold">Unity</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEndChat}
                  className="p-1 hover:bg-purple-500 rounded"
                  title="End Chat"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-purple-500 rounded"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about events..."
                  className="flex-1 rounded-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 