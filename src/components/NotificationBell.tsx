'use client'

import { useState, useEffect } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  eventId: string
  eventTitle: string
  eventDate: Date
  type: 'day_before' | 'hour_before'
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const checkEventReminders = async () => {
      try {
        const res = await fetch('/api/notifications')
        if (!res.ok) throw new Error('Failed to fetch notifications')
        
        const data = await res.json()
        setNotifications(data)
        
        // Show toast for new notifications
        data.forEach((notification: Notification) => {
          const timeLeft = notification.type === 'day_before' ? '1 day' : '1 hour'
          toast.custom((t) => (
            <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {notification.eventTitle}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Starts in {timeLeft}
                </p>
              </div>
            </div>
          ), {
            duration: 5000,
            position: 'bottom-right',
          })
        })

        setHasUnread(data.length > 0)
      } catch (error) {
        console.error('Failed to fetch notifications:', error)
      }
    }

    // Check initially
    checkEventReminders()

    // Check every minute
    const interval = setInterval(checkEventReminders, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
      >
        <BellIcon className="h-6 w-6" />
        {hasUnread && (
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <a
                  key={notification.id}
                  href={`/events/${notification.eventId}`}
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsOpen(false)}
                >
                  <p className="font-medium">{notification.eventTitle}</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    Starts {formatDistanceToNow(new Date(notification.eventDate))}
                  </p>
                </a>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                No new notifications
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 