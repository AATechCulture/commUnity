'use client'

import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { GlobeAltIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useLanguage } from './LanguageProvider'

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
] as const

type LanguageCode = typeof languages[number]['code']

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="flex items-center gap-2 px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
        <GlobeAltIcon className="h-5 w-5" />
        <span>{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
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
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
          <div className="py-1">
            {languages.map((lang) => (
              <Menu.Item key={lang.code}>
                {({ active }) => (
                  <button
                    onClick={() => setLanguage(lang.code)}
                    className={`
                      ${active ? 'bg-purple-50 dark:bg-purple-900/20' : ''}
                      ${language === lang.code ? 'text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'}
                      group flex w-full items-center justify-between px-4 py-2 text-sm
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                    {language === lang.code && (
                      <CheckIcon className="h-4 w-4" />
                    )}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
} 