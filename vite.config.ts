import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  assetsInclude: [
    '**/*.drc',
    '**/*.obj',
    '**/*.mtl',
    '**/*.3ds',
    '**/*.abc',
    '**/*.fbx',
    '**/*.x3d',
    '**/*.zip',
    '**/*.meta'
  ],
  server: {
    open: true,
    port: 3000
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber']
  }
})
