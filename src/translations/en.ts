export const en = {
  nav: {
    home: 'commUnity',
    dashboard: 'Dashboard',
    events: 'Events',
    login: 'Login',
    signup: 'Sign Up',
    logout: 'Logout'
  },
  accessibility: {
    title: 'Accessibility',
    theme: 'Theme',
    language: 'Language'
  },
  search: {
    placeholder: 'Search events using natural language (e.g., "tech events next weekend in New York")',
    searching: 'Searching events...',
    noResults: 'No events found matching your search',
    loading: 'Loading results...',
    results: 'I found {count} event(s) that might interest you',
    error: 'I apologize, but I encountered an error while searching. Please try again.'
  },
  chat: {
    title: 'Unity',
    placeholder: 'Ask about events...',
    send: 'Send',
    welcome: 'Hi {name}, I am Unity and I am here to help U find ways to connect with your commUnity! How can I assist you today?',
    error: 'I apologize, but I encountered an error. Could you please try asking your question again?',
    clearHistory: 'Clear chat history',
    close: 'Close chat',
    startListening: 'Start voice input',
    stopListening: 'Stop voice input',
    speak: 'Read message aloud',
    stopSpeaking: 'Stop reading',
    voiceNotSupported: 'Voice input is not supported in your browser',
    foundEvents: "Based on your interest in '{query}', I found {count} relevant events:",
    noEventsFound: "I couldn't find any events at the moment. Please try again later or check the events page for updates.",
    noRelevantEvents: "I couldn't find any events matching your specific interests. You might want to try broadening your search or check our events page for all available events.",
    moreEvents: "\nThere are {count} more events that might interest you.",
    viewAllEvents: "You can view all events and more details at /events",
  },
  events: {
    register: 'Register',
    registered: 'Registered',
    capacity: '{count} spots left',
    date: 'Date',
    location: 'Location',
    category: 'Category',
    organizer: 'Organizer',
    reason: 'Why this event matches'
  },
  theme: {
    toggleLight: 'Switch to light theme',
    toggleDark: 'Switch to dark theme'
  }
}

export type Translation = typeof en 