import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const basePath =
  process.env.VITE_BASE_PATH && process.env.VITE_BASE_PATH.trim() !== ''
    ? process.env.VITE_BASE_PATH
    : '/'

export default defineConfig({
  base: basePath,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/domain/**/*.ts', 'src/features/**/*.ts', 'src/lib/**/*.ts'],
    },
  },
})
