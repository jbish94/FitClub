import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: { '@': '/src' }
  },
  build: { target: 'esnext', outDir: 'build' },
  server: { port: 3000, open: true },
})

    open: true,
  },
});
