import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site: https://ankknaiii.github.io/sedona/
const base = process.env.GITHUB_PAGES === 'true' ? '/sedona/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
