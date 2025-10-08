import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Note: Codex-only workflow. Vite runs in GitHub Actions (pages.yml).
export default defineConfig({
  plugins: [react()],
})

