'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutline } from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import toast from 'react-hot-toast'

interface EventReviewFormProps {
  eventId: string
  onReviewSubmitted?: () => void
}

export function EventReviewForm({ eventId, onReviewSubmitted }: EventReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hoverRating, setHoverRating] = useState(0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/events/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          rating,
          comment,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to submit review')
      }

      toast.success('Review submitted successfully!')
      setRating(0)
      setComment('')
      onReviewSubmitted?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="text-yellow-400 hover:scale-110 transition-transform"
            >
              {star <= (hoverRating || rating) ? (
                <StarIcon className="h-8 w-8" />
              ) : (
                <StarOutline className="h-8 w-8" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label 
          htmlFor="comment" 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
          placeholder="Share your experience..."
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={rating === 0 || isSubmitting}
        className="w-full"
      >
        Submit Review
      </Button>
    </form>
  )
} 