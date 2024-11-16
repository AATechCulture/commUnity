'use client'

import { usePathname } from 'next/navigation'
import { AIChat } from './AIChat'

const EXCLUDED_PATHS = [
  '/',           // Landing page
  '/login',      // Login page
  '/register',   // Sign up page
  '/signup'      // Alternative signup route if you have one
]

export function ChatbotWrapper() {
  const pathname = usePathname()
  
  // Don't render the chat on excluded paths
  if (EXCLUDED_PATHS.includes(pathname)) {
    return null
  }

  return <AIChat />
} 