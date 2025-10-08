export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-xl w-full rounded-2xl shadow-md border border-slate-200 p-8">
        <h1 className="text-3xl font-bold mb-2">
          Wallet<span className="text-brand">Habit</span>
        </h1>
        <p className="text-slate-600 mb-6">
          Cloud-native personal finance, built entirely via Codex + GitHub.
        </p>
        <ul className="space-y-2 text-slate-700">
          <li>✅ CI/CD via GitHub Actions</li>
          <li>✅ Vite + Tailwind (React/TS)</li>
          <li>✅ GitHub Pages deployment</li>
          <li>🔜 Supabase auth & profile</li>
          <li>🔜 Stripe checkout</li>
        </ul>
      </div>
    </div>
  )
}

