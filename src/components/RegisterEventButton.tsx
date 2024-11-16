'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface RegisterEventButtonProps {
  eventId: string
  isRegistered?: boolean
  isFull?: boolean
  className?: string
  onSuccess?: () => void
}

export function RegisterEventButton({ 
  eventId, 
  isRegistered = false, 
  isFull = false,
  className = '',
  onSuccess
}: RegisterEventButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register for event')
      }

      toast.success('Successfully registered for event!')
      router.refresh()
      onSuccess?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register')
    } finally {
      setIsLoading(false)
    }
  }

  if (isRegistered) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full cursor-not-allowed ${className}`}
      >
        Registered
      </button>
    )
  }

  if (isFull) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-800 rounded-full cursor-not-allowed ${className}`}
      >
        Event Full
      </button>
    )
  }

  return (
    <button
      onClick={handleRegister}
      disabled={isLoading}
      className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-full hover:bg-purple-500 transition-colors duration-300 ${
        isLoading ? 'opacity-75 cursor-not-allowed' : ''
      } ${className}`}
    >
      {isLoading ? 'Registering...' : 'Register'}
    </button>
  )
} 