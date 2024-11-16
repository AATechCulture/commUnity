'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { useLanguage } from './LanguageProvider'

export function AccessibilityMenu() {
  const { t } = useLanguage()

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
        <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
        <span>{t('accessibility.title')}</span>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-2 py-2">
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${
                    active ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  } rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <div className="flex items-center justify-between">
                    <span>{t('accessibility.theme')}</span>
                    <ThemeToggle />
                  </div>
                </div>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <div
                  className={`${
                    active ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                  } rounded-md px-3 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <div className="flex items-center justify-between">
                    <span>{t('accessibility.language')}</span>
                    <LanguageToggle />
                  </div>
                </div>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 