import { useState, useRef, useEffect } from 'react'
import { useDemoData } from '../lib/demoDataStore'

type Language = {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
]

export default function LanguageSwitcher() {
  const {
    state: { profile },
  } = useDemoData()

  const skin = profile.skin ?? 'classic'
  const isUltimate = skin === 'ultimate-budget'

  // Extract current language from localeId (e.g., 'en-GB' -> 'en')
  const currentLanguageCode = profile.localeId.split('-')[0]
  const currentLanguage = languages.find((lang) => lang.code === currentLanguageCode) || languages[0]

  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleLanguageSelect = (lang: Language) => {
    // TODO: Implement actual language switching logic
    console.log(`Language selected: ${lang.name} (${lang.code})`)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Current language: ${currentLanguage.name}. Click to change language.`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`flex items-center gap-2 rounded-full border px-3 py-2 shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isUltimate
            ? 'border-[#d9cbb8] bg-[#fdf8f0] hover:bg-[#f3e7d4] focus-visible:outline-[#5c7751]'
            : 'border-slate-200 bg-white/80 hover:bg-white focus-visible:outline-brand'
        }`}
      >
        <span className="text-lg leading-none" aria-hidden="true">
          {currentLanguage.flag}
        </span>
        <span
          className={`text-xs font-semibold transition-transform ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
          aria-hidden="true"
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 top-full z-30 mt-2 w-48 rounded-2xl border shadow-lg transition-colors ${
            isUltimate
              ? 'border-[#e0d1bd] bg-[#fef9f3]'
              : 'border-slate-200 bg-white'
          }`}
          role="menu"
          aria-label="Select language"
        >
          <div className="flex flex-col p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                onClick={() => handleLanguageSelect(lang)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium transition-colors ${
                  lang.code === currentLanguageCode
                    ? isUltimate
                      ? 'bg-[#efe2cc] text-[#3f2a1e]'
                      : 'bg-brand/10 text-brand'
                    : isUltimate
                    ? 'text-[#5b4a39] hover:bg-[#f3e7d4]'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg leading-none">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
