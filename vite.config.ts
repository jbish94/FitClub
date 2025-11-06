import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Strip versions like "pkg@1.2.3" -> "pkg"
      { find: /^(@radix-ui\/[a-z-]+)@\d+\.\d+\.\d+$/, replacement: '$1' },
      { find: /^lucide-react@\d+\.\d+\.\d+$/, replacement: 'lucide-react' },
      { find: /^react-hook-form@\d+\.\d+\.\d+$/, replacement: 'react-hook-form' },
      { find: /^class-variance-authority@\d+\.\d+\.\d+$/, replacement: 'class-variance-authority' },
      { find: /^sonner@\d+\.\d+\.\d+$/, replacement: 'sonner' },
      { find: /^embla-carousel-react@\d+\.\d+\.\d+$/, replacement: 'embla-carousel-react' },
      { find: /^react-day-picker@\d+\.\d+\.\d+$/, replacement: 'react-day-picker' },
      { find: /^react-resizable-panels@\d+\.\d+\.\d+$/, replacement: 'react-resizable-panels' },
      { find: /^next-themes@\d+\.\d+\.\d+$/, replacement: 'next-themes' },
      { find: /^input-otp@\d+\.\d+\.\d+$/, replacement: 'input-otp' },
      { find: /^cmdk@\d+\.\d+\.\d+$/, replacement: 'cmdk' },
      { find: /^recharts@\d+\.\d+\.\d+$/, replacement: 'recharts' },
      { find: /^vaul@\d+\.\d+\.\d+$/, replacement: 'vaul' },
    ],
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
})
