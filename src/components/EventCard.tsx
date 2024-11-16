import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline'
import { RegisterEventButton } from './RegisterEventButton'

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: Date
    location: string
    capacity: number
    registrationCount?: number
    _count?: {
      registrations: number
    }
  }
  isRegistered?: boolean
  showRegisterButton?: boolean
  footer?: React.ReactNode
  onRegistrationUpdate?: () => void
}

export function EventCard({ 
  event, 
  isRegistered = false,
  showRegisterButton = true,
  footer,
  onRegistrationUpdate 
}: EventCardProps) {
  const registrationCount = event.registrationCount || event._count?.registrations || 0
  const isFull = registrationCount >= event.capacity

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {event.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {event.description}
        </p>
        <div className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center">
            <UserGroupIcon className="h-5 w-5 mr-2" />
            <span>
              {registrationCount} / {event.capacity} registered
            </span>
          </div>
        </div>
        {footer ? (
          footer
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Link
              href={`/events/${event.id}`}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-300"
            >
              View Details
            </Link>
            {showRegisterButton && (
              <RegisterEventButton
                eventId={event.id}
                isRegistered={isRegistered}
                isFull={isFull}
                onSuccess={onRegistrationUpdate}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
} 