'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { EventCard } from './EventCard'

interface SearchResult {
  id: string
  title: string
  description: string
  date: Date
  location: string
  capacity: number
  _count: {
    registrations: number
  }
  organization: {
    name: string
  }
}

export function AIEventSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const debouncedQuery = useDebounce(query, 500)

  const searchEvents = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const res = await fetch(`/api/events/search/ai?q=${encodeURIComponent(searchQuery)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Use debounced value for search
  useEffect(() => {
    searchEvents(debouncedQuery)
  }, [debouncedQuery])

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events using natural language (e.g., 'tech events next weekend in New York')"
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {/* Search Results */}
      {query.trim() && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <div className="p-4 grid gap-4">
              {results.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  showRegisterButton={false}
                />
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No events found
            </div>
          )}
        </div>
      )}
    </div>
  )
} 