export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short'
  }).format(new Date(date))
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
} 