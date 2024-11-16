'use client'

import { useEffect, useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { FaceSmileIcon, FaceFrownIcon, MinusCircleIcon } from '@heroicons/react/24/outline'
import { formatDate } from '@/lib/utils'

interface Keyword {
  word: string
  count: number
  sentiment: {
    positive: number
    neutral: number
    negative: number
  }
  averageSentiment: number
}

interface EventAnalysis {
  id: string
  title: string
  date: string
  totalReviews: number
  averageRating: number
  totalRegistrations: number
  sentiments: {
    positive: number
    neutral: number
    negative: number
  }
  commentSentiment: number
  keywords: Keyword[]
}

interface AnalysisData {
  events: EventAnalysis[]
}

export function OrganizationSentimentAnalysis() {
  const [analysis, setAnalysis] = useState<AnalysisData>({ events: [] })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalysis()
  }, [])

  const fetchAnalysis = async () => {
    try {
      const res = await fetch('/api/events/organization/sentiment')
      if (!res.ok) throw new Error('Failed to fetch analysis')
      const data = await res.json()
      setAnalysis(data)
    } catch (error) {
      console.error('Error fetching analysis:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.2) return 'text-green-600 dark:text-green-400'
    if (sentiment < -0.2) return 'text-red-600 dark:text-red-400'
    return 'text-yellow-600 dark:text-yellow-400'
  }

  const getSentimentEmoji = (sentiment: number) => {
    if (sentiment > 0.2) return '😊'
    if (sentiment < -0.2) return '😞'
    return '😐'
  }

  if (isLoading) return <div className="animate-pulse">Loading analysis...</div>
  if (!analysis.events.length) return <div>No past events to analyze</div>

  const totalReviews = analysis.events.reduce((acc, event) => acc + event.totalReviews, 0)
  const overallSentiment = analysis.events.reduce((acc, event) => ({
    positive: acc.positive + event.sentiments.positive,
    neutral: acc.neutral + event.sentiments.neutral,
    negative: acc.negative + event.sentiments.negative
  }), { positive: 0, neutral: 0, negative: 0 })

  return (
    <div className="space-y-6">
      {/* Overall Sentiment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <FaceSmileIcon className="h-5 w-5 text-green-500" />
            <h3 className="font-medium text-green-700">Positive Reviews</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {totalReviews > 0 ? ((overallSentiment.positive / totalReviews) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm text-green-600">{overallSentiment.positive} reviews</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <MinusCircleIcon className="h-5 w-5 text-yellow-500" />
            <h3 className="font-medium text-yellow-700">Neutral Reviews</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {totalReviews > 0 ? ((overallSentiment.neutral / totalReviews) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm text-yellow-600">{overallSentiment.neutral} reviews</p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <FaceFrownIcon className="h-5 w-5 text-red-500" />
            <h3 className="font-medium text-red-700">Negative Reviews</h3>
          </div>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {totalReviews > 0 ? ((overallSentiment.negative / totalReviews) * 100).toFixed(1) : 0}%
          </p>
          <p className="text-sm text-red-600">{overallSentiment.negative} reviews</p>
        </div>
      </div>

      {/* Individual Event Analysis */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Past Events Analysis</h3>
        <div className="space-y-4">
          {analysis.events.map(event => (
            <div key={event.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <div className="mt-2 flex items-center space-x-4">
                  <div className="flex items-center">
                    <StarIcon className="h-5 w-5 text-yellow-400 mr-1" />
                    <span>{event.averageRating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {event.totalReviews} reviews
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(new Date(event.date))}
                  </span>
                </div>

                {/* Sentiment Distribution */}
                <div className="mt-2 flex space-x-4 text-sm">
                  <span className="text-green-600">
                    {event.sentiments.positive} positive
                  </span>
                  <span className="text-yellow-600">
                    {event.sentiments.neutral} neutral
                  </span>
                  <span className="text-red-600">
                    {event.sentiments.negative} negative
                  </span>
                </div>

                {/* Comment Sentiment Score */}
                <div className="mt-2 text-sm">
                  <span className="text-gray-500">Overall Comment Sentiment: </span>
                  <span className={getSentimentColor(event.commentSentiment)}>
                    {getSentimentEmoji(event.commentSentiment)} 
                    {event.commentSentiment > 0 ? 'Positive' : 
                     event.commentSentiment < 0 ? 'Negative' : 'Neutral'}
                  </span>
                </div>

                {/* Event Keywords with Sentiment Context */}
                {event.keywords.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">
                      Common Feedback Themes
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {event.keywords.map((keyword) => (
                        <div 
                          key={keyword.word}
                          className={`
                            inline-flex items-center
                            bg-gray-50 dark:bg-gray-900/20 
                            rounded-lg px-3 py-1
                          `}
                        >
                          <span className={`text-sm ${getSentimentColor(keyword.averageSentiment)}`}>
                            {keyword.word}({keyword.count})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 