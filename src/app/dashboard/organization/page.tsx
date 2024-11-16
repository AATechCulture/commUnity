'use client'

import { useEffect, useState } from 'react'
import { EventCard } from '@/components/EventCard'
import { EventFilters, type FilterOptions } from '@/components/EventFilters'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

interface Event {
  id: string
  title: string
  description: string
  date: Date
  location: string
  capacity: number
  duration: number
  registrations: any[]
  _count: {
    registrations: number
  }
}

export default function OrganizationDashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events/organization')
      if (!res.ok) throw new Error('Failed to fetch events')
      const data = await res.json()
      setEvents(data)
      setFilteredEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  // Helper function to categorize events
  const categorizeEvents = (events: Event[]) => {
    const now = new Date()
    
    return {
      currentEvents: events.filter(event => {
        const eventDate = new Date(event.date)
        const eventEnd = new Date(eventDate.getTime() + (event.duration * 60000)) // Convert minutes to milliseconds
        return eventDate <= now && eventEnd >= now
      }),
      upcomingEvents: events.filter(event => {
        const eventDate = new Date(event.date)
        return eventDate > now
      }),
      pastEvents: events.filter(event => {
        const eventDate = new Date(event.date)
        const eventEnd = new Date(eventDate.getTime() + (event.duration * 60000))
        return eventEnd < now
      })
    }
  }

  const handleFilterChange = (filters: FilterOptions) => {
    let filtered = [...events]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm)
      )
    }

    // Sort
    filtered.sort((a, b) => {
      const order = filters.sortOrder === 'asc' ? 1 : -1
      switch (filters.sortBy) {
        case 'date':
          return (new Date(a.date).getTime() - new Date(b.date).getTime()) * order
        case 'registrations':
          return (a._count.registrations - b._count.registrations) * order
        case 'capacity':
          return (a.capacity - b.capacity) * order
        default:
          return 0
      }
    })

    setFilteredEvents(filtered)
  }

  const { currentEvents, upcomingEvents, pastEvents } = categorizeEvents(filteredEvents)
  const totalRegistrations = filteredEvents.reduce((acc, event) => acc + event._count.registrations, 0)

  const renderEventSection = (title: string, events: Event[]) => (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}/manage`}>
              <EventCard
                event={event}
                footer={
                  <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {event._count.registrations} registrations
                  </div>
                }
              />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No events in this category</p>
      )}
    </section>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold gradient-text">Organization Dashboard</h1>
        <Link href="/events/create">
          <Button>Create New Event</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-purple-600">{filteredEvents.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Total Registrations</h3>
          <p className="text-3xl font-bold text-purple-600">{totalRegistrations}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
          <p className="text-3xl font-bold text-purple-600">{upcomingEvents.length}</p>
        </div>
      </div>

      <EventFilters onFilterChange={handleFilterChange} />

      <div className="space-y-10">
        {renderEventSection("Current Events", currentEvents)}
        {renderEventSection("Upcoming Events", upcomingEvents)}
        {renderEventSection("Past Events", pastEvents)}
      </div>
    </div>
  )
} 