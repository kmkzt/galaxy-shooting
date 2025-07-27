import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    react({
      // Use classic JSX runtime for compatibility with React 16
      jsxRuntime: 'classic'
    })
  ],
  resolve: {
    alias: {
      // Set up path alias for cleaner imports
      '@': resolve(__dirname, './src')
    }
  },
  // Include 3D model and asset files as static assets
  assetsInclude: [
    '**/*.drc', // Draco compressed 3D models
    '**/*.obj', // Wavefront OBJ 3D models
    '**/*.mtl', // Material files for OBJ models
    '**/*.3ds', // 3D Studio files
    '**/*.abc', // Alembic files
    '**/*.fbx', // Autodesk FBX files
    '**/*.x3d', // X3D files
    '**/*.zip', // Archive files
    '**/*.meta' // Metadata files
  ],
  server: {
    // Automatically open browser on dev server start
    open: true,
    port: 3000
  },
  optimizeDeps: {
    // Pre-bundle these dependencies for better dev performance
    include: ['three', 'react-three-fiber']
  }
})
