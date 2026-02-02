import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  envDir: './', // Explicitly tells Vite to look in the root for .env files
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
})