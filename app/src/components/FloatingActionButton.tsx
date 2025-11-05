import { useState, useRef, useEffect } from 'react'
import { useDemoData } from '../lib/demoDataStore'

type ActionOption = {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
}

export default function FloatingActionButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const {
    state: { profile },
  } = useDemoData()
  
  const skin = profile.skin ?? 'classic'
  const isUltimate = skin === 'ultimate-budget'

  const options: ActionOption[] = [
    {
      id: 'import-files',
      label: 'Import Excel or CSV (bank files), and let the AI start auditing and doing the accounting',
      icon: (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      ),
      onClick: () => {
        // TODO: Implement file import functionality with proper modal/dialog
        console.log('Import Excel/CSV clicked - functionality to be implemented')
        setIsExpanded(false)
      },
    },
  ]

  useEffect(() => {
    if (!isExpanded) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsExpanded(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isExpanded])

  const buttonBaseColor = isUltimate
    ? 'bg-[#5c7751] hover:bg-[#4f6745]'
    : 'bg-primary hover:bg-primary-dark'
  
  const buttonTextColor = 'text-white'
  
  const optionBgColor = isUltimate
    ? 'bg-[#fef9f3] border-[#e0d1bd] hover:bg-[#f3e7d4]'
    : 'bg-white border-sand-darker/50 hover:bg-sand/30'
  
  const optionTextColor = isUltimate ? 'text-[#3f2a1e]' : 'text-navy'

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 left-6 z-40 flex flex-col-reverse items-start gap-3"
    >
      {/* Options menu */}
      <div
        className={`flex flex-col-reverse gap-2 transition-all duration-300 ease-out ${
          isExpanded
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        {options.map((option, index) => (
          <button
            key={option.id}
            onClick={option.onClick}
            className={`group flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lg transition-all duration-200 ${optionBgColor} ${optionTextColor} max-w-xs sm:max-w-md`}
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : '0ms',
            }}
          >
            <div className="flex-shrink-0 mt-0.5">{option.icon}</div>
            <span className="text-left text-sm font-medium leading-snug">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Main FAB button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={isExpanded ? 'Close action menu' : 'Open action menu'}
        aria-expanded={isExpanded}
        className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${buttonBaseColor} ${buttonTextColor} ${
          isHovered ? 'scale-110 shadow-xl' : 'scale-100'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-6 w-6 transition-transform duration-200 ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  )
}
