'use client'

interface LoadingSpinnerProps {
  fullPage?: boolean
  message?: string
}

export function LoadingSpinner({ fullPage = false, message }: LoadingSpinnerProps) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="w-8 h-8 border-4 border-brand-border border-t-brand-deepGreen rounded-full animate-spin"></div>
      {message && <span className="text-sm text-brand-inkSoft font-medium">{message}</span>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        {spinner}
      </div>
    )
  }

  return spinner
}