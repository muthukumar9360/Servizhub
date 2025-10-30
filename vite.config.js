import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",  // 👈 forces Vite to use localhost
    port: 3000          // 👈 custom port
  }
})
