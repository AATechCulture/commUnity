'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { EventCard } from './EventCard'
import { useLanguage } from './LanguageProvider'

interface SearchResult {
  id: string
  title: string
  description: string
  date: Date
  location: string
  category: string
  capacity: number
  _count: {
    registrations: number
  }
  organization: {
    name: string
  }
  score?: number
  reason?: string
}

export function AIEventSearch() {
  const { t } = useLanguage()
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
      const res = await fetch(`/api/events/search/ai?query=${encodeURIComponent(searchQuery)}`)
      if (!res.ok) throw new Error('Search failed')
      const data = await res.json()
      
      // Sort results by score if available
      const sortedResults = data.sort((a: SearchResult, b: SearchResult) => 
        (b.score || 0) - (a.score || 0)
      )
      
      setResults(sortedResults)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

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
          placeholder={t('search.placeholder')}
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 dark:text-white placeholder-gray-500 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {query.trim() && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-[80vh] overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <p className="mt-2">{t('search.searching')}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="p-4 space-y-4">
              {results.map((event) => (
                <div key={event.id} className="space-y-2">
                  <EventCard
                    event={event}
                    showRegisterButton={true}
                  />
                  {event.reason && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic pl-4 border-l-2 border-purple-600">
                      {event.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              {t('search.noResults')}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 