'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { en } from '@/translations/en'
import { es } from '@/translations/es'

const translations = { en, es } as const

type Language = keyof typeof translations
type TranslationType = typeof en

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Check local storage on mount
    const savedLanguage = localStorage.getItem('language') as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
      document.documentElement.lang = savedLanguage
    }
    setMounted(true)
  }, [])

  const handleLanguageChange = (newLanguage: Language) => {
    if (translations[newLanguage]) {
      setLanguage(newLanguage)
      localStorage.setItem('language', newLanguage)
      document.documentElement.lang = newLanguage
      // Force a page reload to update all translations
      window.location.reload()
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`)
        return key
      }
    }
    
    return value
  }

  // Prevent hydration issues
  if (!mounted) {
    return null
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 