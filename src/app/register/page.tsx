'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function RegisterChoicePage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-bold tracking-tight gradient-text mb-6">
          Choose Registration Type
        </h2>
        
        <div className="space-y-4">
          <Link href="/register/participant" className="block">
            <Button variant="primary" className="w-full">
              Register as Participant
            </Button>
          </Link>
          
          <Link href="/register/organization" className="block">
            <Button variant="secondary" className="w-full">
              Register as Organization
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-purple-600 hover:text-purple-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 