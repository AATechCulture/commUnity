'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import Link from 'next/link'

const INTEREST_OPTIONS = [
  'Volunteering',
  'Technology',
  'Education',
  'Environment',
  'Healthcare',
  'Arts & Culture',
  'Sports',
  'Business',
  'Social',
  'Other'
]

export default function ParticipantRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [customInterest, setCustomInterest] = useState('')
  const [showCustomInput, setShowCustomInput] = useState(false)

  const toggleInterest = (interest: string) => {
    if (interest === 'Other') {
      setShowCustomInput(!showCustomInput)
      // Remove any previous custom interests when toggling "Other" off
      if (showCustomInput) {
        setSelectedInterests(prev => prev.filter(i => INTEREST_OPTIONS.includes(i)))
        setCustomInterest('')
      }
    } else {
      setSelectedInterests(prev => 
        prev.includes(interest)
          ? prev.filter(i => i !== interest)
          : [...prev, interest]
      )
    }
  }

  const handleCustomInterestSubmit = () => {
    if (customInterest.trim()) {
      setSelectedInterests(prev => [...prev, customInterest.trim()])
      setCustomInterest('')
    }
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      interests: selectedInterests,
    }
    
    try {
      const res = await fetch('/api/register/participant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Failed to register')
      }

      toast.success('Account created successfully!')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold tracking-tight gradient-text">
          Register as Participant
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={onSubmit} className="space-y-6">
            <Input
              label="Name"
              name="name"
              type="text"
              required
              autoComplete="name"
            />
            <Input
              label="Email address"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interests (select at least one)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-2 text-sm rounded-full transition-colors duration-200 ${
                      interest === 'Other' && showCustomInput || selectedInterests.includes(interest)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              {showCustomInput && (
                <div className="mt-2 flex gap-2">
                  <Input
                    type="text"
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    placeholder="Enter your interest"
                    className="flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleCustomInterestSubmit()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleCustomInterestSubmit}
                    disabled={!customInterest.trim()}
                    className="whitespace-nowrap"
                  >
                    Add Interest
                  </Button>
                </div>
              )}

              {/* Display all selected interests */}
              {selectedInterests.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedInterests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => setSelectedInterests(prev => prev.filter(i => i !== interest))}
                        className="ml-2 text-purple-600 hover:text-purple-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {selectedInterests.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  Please select at least one interest
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
              disabled={selectedInterests.length === 0}
            >
              Sign up
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 