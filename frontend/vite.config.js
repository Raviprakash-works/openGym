import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backend = process.env.API_TARGET || 'http://127.0.0.1:3000'
const media = process.env.MEDIA_TARGET || 'http://127.0.0.1:8888'

function stampServiceWorker() {
  return {
    name: 'stamp-sw',
    closeBundle() {
      const swPath = path.resolve(__dirname, 'dist/sw.js')
      if (fs.existsSync(swPath)) {
        let content = fs.readFileSync(swPath, 'utf8')
        const buildHash = Date.now().toString(36)
        content = content.replace(/__BUILD_HASH__/g, buildHash)
        fs.writeFileSync(swPath, content)
        console.log(`[stamp-sw] Injected build hash: ${buildHash} into dist/sw.js`)
      }
    }
  }
}

export default defineConfig({
  plugins: [react(), stampServiceWorker()],
  base: '/openGym/',
  server: {
    proxy: {
      '/api': { target: backend, changeOrigin: true },
      '/img': { target: media, changeOrigin: true },
      '/gif': { target: media, changeOrigin: true }
    }
  },
  build: { chunkSizeWarningLimit: 1500 }
})
