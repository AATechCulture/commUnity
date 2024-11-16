'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'
import { NotificationBell } from './NotificationBell'
import { AccessibilityMenu } from './AccessibilityMenu'
import { useLanguage } from './LanguageProvider'

export default function Navbar() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t } = useLanguage()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
            >
              {t('nav.home')}
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {session ? (
              <>
                <div className="flex items-center px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                  <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    100 Points
                  </span>
                </div>

                <Link 
                  href="/dashboard"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {t('nav.dashboard')}
                </Link>
                <Link 
                  href="/events"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {t('nav.events')}
                </Link>
                <NotificationBell />
                <AccessibilityMenu />
                <button
                  onClick={handleSignOut}
                  className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <AccessibilityMenu />
                <Link 
                  href="/register"
                  className="text-purple-600 hover:text-purple-500 transition-colors"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {session ? (
              <>
                <div className="flex items-center px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-md mb-2">
                  <StarIcon className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    100 Points
                  </span>
                </div>

                <Link
                  href="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  {t('nav.dashboard')}
                </Link>
                <Link 
                  href="/events"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  {t('nav.events')}
                </Link>
                <NotificationBell />
                <div className="px-3 py-2">
                  <AccessibilityMenu />
                </div>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  {t('nav.login')}
                </Link>
                <div className="px-3 py-2">
                  <AccessibilityMenu />
                </div>
                <Link 
                  href="/register"
                  className="block px-3 py-2 text-base font-medium text-purple-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
} 