'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function OrganizationRegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      organizationName: formData.get('organizationName'),
      website: formData.get('website'),
      description: formData.get('description'),
    }
    
    try {
      const res = await fetch('/api/register/organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      toast.success('Organization account created successfully!')
      router.push('/login')
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
          Register as Organization
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
              label="Contact Person Name"
              name="name"
              type="text"
              required
            />
            <Input
              label="Email address"
              name="email"
              type="email"
              required
            />
            <Input
              label="Password"
              name="password"
              type="password"
              required
            />
            <Input
              label="Organization Name"
              name="organizationName"
              type="text"
              required
            />
            <Input
              label="Website"
              name="website"
              type="url"
              placeholder="https://"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Tell us about your organization"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Register Organization
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
} 