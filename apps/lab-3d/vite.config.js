import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Distinct port from apps/main (5173) and eventually apps/lab-term (5176).
  server: { port: 5175 },
})
