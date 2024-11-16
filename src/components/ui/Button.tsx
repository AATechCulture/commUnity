import { styles } from '@/lib/styles'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  isLoading?: boolean
}

export function Button({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}: ButtonProps) {
  const variants = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
    danger: 'rounded-full bg-red-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-red-500 transition-all duration-300'
  }

  return (
    <button 
      className={`${variants[variant]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="loading-spinner" />
      ) : children}
    </button>
  )
} 