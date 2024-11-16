'use client'

import { useState } from 'react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface EventFiltersProps {
  onFilterChange: (filters: FilterOptions) => void
  showRegistrationFilter?: boolean
}

export interface FilterOptions {
  search: string
  dateRange: 'all' | 'upcoming' | 'past'
  sortBy: 'date' | 'registrations' | 'capacity'
  sortOrder: 'asc' | 'desc'
  registrationStatus?: 'all' | 'pending' | 'confirmed' | 'cancelled'
}

export function EventFilters({ onFilterChange, showRegistrationFilter = false }: EventFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateRange: 'all',
    sortBy: 'date',
    sortOrder: 'desc',
    registrationStatus: 'all'
  })

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => handleFilterChange({ search: e.target.value })}
          className="max-w-xs"
        />
        <Button
          variant="secondary"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          {isExpanded ? (
            <>
              Less filters <ChevronUpIcon className="h-4 w-4" />
            </>
          ) : (
            <>
              More filters <ChevronDownIcon className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange({ dateRange: e.target.value as FilterOptions['dateRange'] })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="all">All Events</option>
              <option value="upcoming">Upcoming Events</option>
              <option value="past">Past Events</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as FilterOptions['sortBy'] })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="date">Date</option>
              <option value="registrations">Registrations</option>
              <option value="capacity">Capacity</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sort Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange({ sortOrder: e.target.value as FilterOptions['sortOrder'] })}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          {showRegistrationFilter && (
            <div>
              <label className="block text-sm font-medium mb-1">Registration Status</label>
              <select
                value={filters.registrationStatus}
                onChange={(e) => handleFilterChange({ registrationStatus: e.target.value as FilterOptions['registrationStatus'] })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 