import { useDemoData } from '../lib/demoDataStore'

export default function ThemeSwitcher() {
  const {
    state: { profile },
    toggleSkin,
  } = useDemoData()

  const skin = profile.skin ?? 'classic'
  const isUltimate = skin === 'ultimate-budget'

  return (
    <div
      className={`flex items-center gap-2 rounded-full border px-3 py-2 shadow-sm transition-colors ${
        isUltimate ? 'border-[#d9cbb8] bg-[#fdf8f0]' : 'border-slate-200 bg-white/80'
      }`}
    >
      <button
        type="button"
        onClick={toggleSkin}
        aria-label={`Switch to ${isUltimate ? 'classic WalletHabit' : 'Ultimate Budget'} skin`}
        className={`flex h-5 w-5 items-center justify-center rounded-full p-0 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isUltimate
            ? 'text-[#5c7751] hover:text-[#4f6745] focus-visible:outline-[#5c7751]'
            : 'text-brand hover:text-brand-dark focus-visible:outline-brand'
        }`}
      >
        <span
          aria-hidden
          className={`block h-2.5 w-2.5 rounded-full transition-colors ${
            isUltimate ? 'bg-[#5c7751]' : 'bg-brand'
          }`}
        />
      </button>
      <button
        type="button"
        onClick={toggleSkin}
        aria-label={`Switch to ${isUltimate ? 'classic WalletHabit' : 'Ultimate Budget'} skin`}
        className={`flex h-5 w-5 items-center justify-center rounded-full p-0 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isUltimate
            ? 'text-[#5c7751] hover:text-[#4f6745] focus-visible:outline-[#5c7751]'
            : 'text-brand hover:text-brand-dark focus-visible:outline-brand'
        }`}
      >
        <span
          aria-hidden
          className={`block h-2.5 w-2.5 rounded-full transition-colors ${
            isUltimate ? 'bg-[#5c7751]' : 'bg-brand'
          }`}
        />
      </button>
    </div>
  )
}
