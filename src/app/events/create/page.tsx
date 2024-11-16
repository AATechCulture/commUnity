'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'

export default function CreateEventPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: new Date(formData.get('date') as string).toISOString(),
      location: formData.get('location') as string,
      capacity: parseInt(formData.get('capacity') as string),
      price: parseFloat(formData.get('price') as string) || 0,
      category: formData.get('category') as string,
    }

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to create event')
      }

      toast.success('Event created successfully!')
      router.push('/dashboard/organization')
      router.refresh()
    } catch (error) {
      console.error('Event creation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create event')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 gradient-text">Create New Event</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="Event Title"
            name="title"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <Input
            label="Date and Time"
            name="date"
            type="datetime-local"
            required
          />
          <Input
            label="Location"
            name="location"
            required
          />
          <Input
            label="Capacity"
            name="capacity"
            type="number"
            min="1"
            required
          />
          <Input
            label="Price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
          />
          <Input
            label="Category"
            name="category"
            placeholder="e.g., Conference, Workshop, Meetup"
          />
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full"
          >
            Create Event
          </Button>
        </form>
      </div>
    </div>
  )
} 