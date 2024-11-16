'use client'

import { useState } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'
import { Button } from './ui/Button'
import toast from 'react-hot-toast'

interface FeedbackFormProps {
  eventId: string
  onSuccess?: () => void
}

export function FeedbackForm({ eventId, onSuccess }: FeedbackFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/feedback', {
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
        throw new Error('Failed to submit feedback')
      }

      toast.success('Feedback submitted successfully!')
      onSuccess?.()
    } catch (error) {
      toast.error('Failed to submit feedback')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="text-yellow-400 hover:scale-110 transition-transform"
            >
              {star <= rating ? (
                <StarIcon className="h-8 w-8" />
              ) : (
                <StarOutlineIcon className="h-8 w-8" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800"
          rows={4}
          placeholder="Share your experience..."
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        disabled={rating === 0 || isSubmitting}
      >
        Submit Feedback
      </Button>
    </form>
  )
} 