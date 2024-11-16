'use client'

import { useState, useEffect, useRef } from 'react'
import { ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { TrashIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useSession } from 'next-auth/react'
import { useLanguage } from './LanguageProvider'
import { MicrophoneIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

interface SearchResult {
  id: string
  title: string
  description: string
  date: Date
  location: string
  category: string
  organization: {
    name: string
  }
  _count: {
    registrations: number
  }
  score?: number
  reason?: string
}

export function AIChat() {
  const { t, language } = useLanguage()
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useLocalStorage<Message[]>('ai-chat-history', [])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const hasGreetedRef = useRef(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && !hasGreetedRef.current && messages.length === 0) {
      const userName = session?.user?.name || 'there'
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: t('chat.welcome').replace('{name}', userName),
        role: 'assistant',
        timestamp: Date.now(),
      }
      setMessages([welcomeMessage])
      hasGreetedRef.current = true
    }
  }, [isOpen, session?.user?.name, setMessages, messages.length, t])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = language === 'es' ? 'es-ES' : 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('')

        setMessage(transcript)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        // Auto-submit if there's a message
        if (message.trim()) {
          handleSubmit(new Event('submit') as any)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, message])

  const toggleListening = () => {
    if (!recognitionRef.current) {
      console.error(t('chat.voiceNotSupported'))
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      setMessage('') // Clear previous message
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const speakMessage = (text: string) => {
    if (!('speechSynthesis' in window)) {
      console.error(t('chat.voiceNotSupported'))
      return
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language === 'es' ? 'es-ES' : 'en-US'
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    speechSynthesisRef.current = utterance
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  // Add function to check if message is about events
  const isEventQuery = (text: string): boolean => {
    const eventKeywords = [
      'event', 'events', 'happening', 'activities', 'activity',
      'evento', 'eventos', 'actividad', 'actividades',
      'what\'s on', 'what is on', 'what\'s happening',
      'show me', 'find', 'search', 'looking for', 'can i attend',
      'interested in', 'want to', 'would like to', 'available'
    ]
    return eventKeywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  const searchEvents = async (query: string): Promise<SearchResult[]> => {
    try {
      const response = await fetch(`/api/events/search/ai?query=${encodeURIComponent(query)}`)
      if (!response.ok) throw new Error('Search failed')
      const events = await response.json()
      return events
    } catch (error) {
      console.error('Event search error:', error)
      return []
    }
  }

  const formatEventResponse = (events: SearchResult[], query: string) => {
    if (events.length === 0) {
      return t('chat.noEventsFound')
    }

    const relevantEvents = events.filter(event => event.score && event.score > 0.3)
    if (relevantEvents.length === 0) {
      return t('chat.noRelevantEvents')
    }

    let response = t('chat.foundEvents', { query, count: relevantEvents.length }) + '\n\n'
    
    relevantEvents.slice(0, 3).forEach((event, index) => {
      const date = new Date(event.date).toLocaleDateString()
      response += `${index + 1}. **${event.title}**\n`
      response += `📅 ${date}\n`
      response += `📍 ${event.location}\n`
      response += `👥 ${event.organization.name}\n`
      if (event.reason) {
        response += `ℹ️ ${event.reason}\n`
      }
      response += '\n'
    })

    if (relevantEvents.length > 3) {
      response += t('chat.moreEvents', { count: relevantEvents.length - 3 })
    }

    response += '\n' + t('chat.viewAllEvents')
    return response
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message.trim(),
      role: 'user',
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)

    try {
      if (isEventQuery(userMessage.content)) {
        // Handle event-related queries
        const events = await searchEvents(userMessage.content)
        const botResponse = formatEventResponse(events, userMessage.content)
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          role: 'assistant',
          timestamp: Date.now(),
        }

        setMessages(prev => [...prev, botMessage])
      } else {
        // Handle regular chat queries
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.content,
            history: messages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          }),
          credentials: 'include',
        })
        
        if (!response.ok) {
          throw new Error('Failed to get response')
        }
        
        const { message: botResponse } = await response.json()
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          role: 'assistant',
          timestamp: Date.now(),
        }

        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: t('chat.error'),
        role: 'assistant',
        timestamp: Date.now(),
      }
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
    <div className="fixed bottom-4 right-4 z-50">
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
              <h3 className="font-semibold">{t('chat.title')}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleEndChat}
                  className="p-1 hover:bg-purple-500 rounded transition-colors"
                  title={t('chat.clearHistory')}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-purple-500 rounded transition-colors"
                  title={t('chat.close')}
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
                        ? 'bg-purple-600 text-white ml-auto'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mr-auto'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => isSpeaking ? stopSpeaking() : speakMessage(msg.content)}
                          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                          title={isSpeaking ? t('chat.stopSpeaking') : t('chat.speak')}
                        >
                          {isSpeaking ? (
                            <SpeakerXMarkIcon className="h-4 w-4" />
                          ) : (
                            <SpeakerWaveIcon className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
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
                  placeholder={t('chat.placeholder')}
                  className="flex-1 rounded-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:text-white text-sm"
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  title={isListening ? t('chat.stopListening') : t('chat.startListening')}
                >
                  <MicrophoneIcon className={`h-5 w-5 ${isListening ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`} />
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
                >
                  {t('chat.send')}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 