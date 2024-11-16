'use client'

import { useEffect, useState } from 'react'
import { EventCard } from '@/components/EventCard'
import { useRouter } from 'next/navigation'

interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
  capacity: number
  _count: {
    registrations: number
  }
  registrations?: any[]
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const router = useRouter()

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      if (!res.ok) throw new Error('Failed to fetch events')
      const data = await res.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleRegistrationUpdate = () => {
    fetchEvents()
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold gradient-text">Available Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={{
              ...event,
              registrationCount: event._count?.registrations || 0
            }}
            onRegistrationUpdate={handleRegistrationUpdate}
          />
        ))}
      </div>
    </div>
  )
} 