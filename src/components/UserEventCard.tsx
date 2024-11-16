import { formatDate } from '@/lib/utils'
import { CalendarIcon, MapPinIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface UserEventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: Date
    location: string
    capacity: number
  }
  status: string
}

export function UserEventCard({ event, status }: UserEventCardProps) {
  const statusColors = {
    pending: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
    confirmed: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    cancelled: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  }[status] || 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {event.title}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>{event.location}</span>
          </div>
          {status === 'confirmed' && (
            <div className="flex items-center text-green-600">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span>You're all set!</span>
            </div>
          )}
          {status === 'pending' && (
            <div className="flex items-center text-yellow-600">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span>Awaiting confirmation</span>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Link
            href={`/events/${event.id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-300"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
} 